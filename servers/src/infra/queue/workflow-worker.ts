import { Worker, Job } from "bullmq";
import { connection, WORKFLOW_QUEUE_NAME } from "./queue-factory.js";
import { db } from "@workspace/database";
import {
  executeHttpStep,
  HttpStepDefinition,
} from "../executors/http-executor.js";
import {
  executeTransformStep,
  TransformStepDefinition,
} from "../executors/transform-executor.js";
import { LedgerService } from "../ledger/ledger-service.js";
import { AiGateway } from "../ai/ai-gateway.js";
import { PolicyEngine } from "../policy/policy-engine.js";

export interface AiStepDefinition {
  type: "AI";
  model: string;
  prompt: string;
}

export interface WorkflowJobData {
  executionId: string;
  tenantId: string;
  stepId?: string; // If missing, implies "Start Workflow" -> determine first step
  stepDefinition?:
    | HttpStepDefinition
    | TransformStepDefinition
    | AiStepDefinition; // Passed for simplicity in this phase
  input?: any;
  action: "START_WORKFLOW" | "RUN_STEP";
}

export const createWorkflowWorker = () => {
  const worker = new Worker<WorkflowJobData>(
    WORKFLOW_QUEUE_NAME,
    async (job: Job<WorkflowJobData>) => {
      const { executionId, tenantId, action, stepId, stepDefinition, input } =
        job.data;
      console.log(
        `[Worker] Processing Job ${job.id}: ${action} for ${executionId}`,
      );

      try {
        if (action === "START_WORKFLOW") {
          // For Phase 4, we assume the controller enqueues the first step or we just log started.
          // In a real flow, we'd lookup the definition and find the entry point.
          // Here, we just mark execution as RUNNING if not already.
          await db.workflowExecution.update({
            where: { id: executionId },
            data: { status: "RUNNING" },
          });
          console.log(`[Worker] Execution ${executionId} marked RUNNING`);
          return { status: "STARTED" };
        }

        if (action === "RUN_STEP" && stepId && stepDefinition) {
          // 1. Create Job Record (Immutable Input Snapshot)
          const jobRecord = await db.job.create({
            data: {
              executionId,
              stepId,
              type: stepDefinition.type,
              input: input ?? {},
              status: "PENDING",
              startedAt: new Date(),
            },
          });

          console.log(`[Worker] Job ${jobRecord.id} Created (PENDING)`);

          // 2. Execute Deterministically
          let output: any = null;
          try {
            if (stepDefinition.type === "HTTP") {
              output = await executeHttpStep(
                stepDefinition as HttpStepDefinition,
              );
            } else if (stepDefinition.type === "TRANSFORM") {
              output = await executeTransformStep(
                stepDefinition as TransformStepDefinition,
                input,
              );
            } else if (stepDefinition.type === "AI") {
              const aiResult = await AiGateway.getInstance().generate({
                tenantId,
                model: stepDefinition.model,
                prompt: stepDefinition.prompt,
              });
              output = aiResult;

              // 2.b Policy Guardrail for AI Confidence
              const policyResult = await PolicyEngine.getInstance().evaluate(
                tenantId,
                {
                  triggerType: "AI_CONFIDENCE",
                  value: aiResult.confidence,
                },
              );

              if (policyResult.action === "APPROVE") {
                console.log(
                  `[Worker] Policy Triggered: AI Confidence Low (${aiResult.confidence}). Creating Approval Request.`,
                );

                await db.workflowExecution.update({
                  where: { id: executionId },
                  data: { status: "AWAITING_APPROVAL" },
                });

                await db.approvalRequest.create({
                  data: {
                    tenantId,
                    executionId,
                    type: "AI_CONFIDENCE_CHECK",
                    status: "PENDING",
                    reason: `Low AI Confidence: ${aiResult.confidence}`,
                    context: {
                      stepId,
                      output: aiResult,
                    },
                  },
                });

                return { status: "AWAITING_APPROVAL" }; // STOP FURTHER EXECUTION
              }
            } else {
              throw new Error(
                `Unknown step type: ${(stepDefinition as any).type}`,
              );
            }

            // 3. Store Success (Immutable Output Snapshot)
            await db.job.update({
              where: { id: jobRecord.id },
              data: {
                status: "COMPLETED",
                output: output ?? {},
                completedAt: new Date(),
              },
            });

            await LedgerService.getInstance().append(
              tenantId,
              "TASK_COMPLETED",
              {
                jobId: jobRecord.id,
                stepId,
                status: "COMPLETED",
                output: output ?? {},
              },
            );

            console.log(`[Worker] Job ${jobRecord.id} COMPLETED`);

            // 4. Autonomous Chaining: Find and Enqueue Next Step
            const execution = await db.workflowExecution.findUnique({
              where: { id: executionId },
              include: { workflowDefinition: true },
            });

            if (!execution)
              throw new Error("Execution not found during chaining");

            const definition = execution.workflowDefinition.definition as any;
            const steps = definition.steps || [];
            const currentIndex = steps.findIndex((s: any) => s.id === stepId);
            const nextStep = steps[currentIndex + 1];

            if (nextStep) {
              console.log(`[Worker] Enqueuing Next Step: ${nextStep.id}`);
              const { getWorkflowQueue } = await import("./queue-factory.js");
              const queue = getWorkflowQueue();

              await queue.add("run-step", {
                executionId,
                tenantId,
                action: "RUN_STEP",
                stepId: nextStep.id,
                stepDefinition: nextStep,
                input: output, // Pass current output as next input
              });
            } else {
              console.log(
                `[Worker] Workflow ${executionId} COMPLETED (No more steps)`,
              );
              await db.workflowExecution.update({
                where: { id: executionId },
                data: { status: "COMPLETED", output },
              });
            }

            return { status: "COMPLETED", jobId: jobRecord.id };
          } catch (execError: any) {
            // 4. Store Failure
            console.error(`[Worker] Execution Failed: ${execError.message}`);
            await db.job.update({
              where: { id: jobRecord.id },
              data: {
                status: "FAILED",
                output: { error: execError.message }, // Store error as output
                completedAt: new Date(),
              },
            });

            await LedgerService.getInstance().append(tenantId, "TASK_FAILED", {
              jobId: jobRecord.id,
              stepId,
              status: "FAILED",
              error: execError.message,
            });

            throw execError; // Retry logic handled by BullMQ
          }
        }
      } catch (err: any) {
        console.error(`[Worker] Critical Failure in Job ${job.id}:`, err);
        throw err;
      }
    },
    {
      connection,
      concurrency: 50,
      limiter: {
        max: 1000,
        duration: 1000,
      },
      // Ensure we use the ESM compatible worker file if processor path is used (not used here, passing function directly)
    },
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed!`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
};
