import { db } from "@workspace/database";
import { getWorkflowQueue } from "../../infra/queue/queue-factory.js";

export class ApprovalService {
  private static instance: ApprovalService;

  private constructor() {}

  public static getInstance(): ApprovalService {
    if (!ApprovalService.instance) {
      ApprovalService.instance = new ApprovalService();
    }
    return ApprovalService.instance;
  }

  async getRequests(tenantId: string) {
    return db.approvalRequest.findMany({
      where: { tenantId },
      include: { execution: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async decide(id: string, status: "APPROVED" | "REJECTED") {
    const approval = await db.approvalRequest.findUnique({
      where: { id },
    });

    if (!approval) throw new Error("Approval not found");

    // Update status
    await db.approvalRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "APPROVED") {
      // Resume workflow
      await db.workflowExecution.update({
        where: { id: approval.executionId },
        data: { status: "RUNNING" },
      });

      const context = approval.context as any;
      const stepId = context.stepId;
      const output = context.output;

      const execution = await db.workflowExecution.findUnique({
        where: { id: approval.executionId },
        include: { workflowDefinition: true },
      });

      if (execution) {
        const definition = execution.workflowDefinition.definition as any;
        const steps = definition.steps || [];
        const currentIndex = steps.findIndex((s: any) => s.id === stepId);
        const nextStep = steps[currentIndex + 1];

        if (nextStep) {
          const queue = getWorkflowQueue();
          await queue.add("run-step", {
            executionId: approval.executionId,
            tenantId: approval.tenantId,
            action: "RUN_STEP",
            stepId: nextStep.id,
            stepDefinition: nextStep,
            input: output,
          });
        } else {
          await db.workflowExecution.update({
            where: { id: approval.executionId },
            data: { status: "COMPLETED", output },
          });
        }
      }
    } else {
      await db.workflowExecution.update({
        where: { id: approval.executionId },
        data: { status: "FAILED" },
      });
    }

    return { message: `Approval ${status}` };
  }
}
