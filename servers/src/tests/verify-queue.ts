import { db } from "@workspace/database";
import { getWorkflowQueue, connection } from "../infra/queue/queue-factory.js";
import { createWorkflowWorker } from "../infra/queue/workflow-worker.js";
import { runWorkflow } from "../api/controllers/workflow-controller.js";
import { AuthenticatedRequest } from "../api/context.js";
import { Response } from "express";

// Mock Reponse object
const mockRes = () => {
  const res: any = {};
  res.status = (code: number) => {
    res.statusCode = code;
    res.json = (body: any) => {
      res.body = body;
      return res;
    };
    return res;
  };
  return res;
};

async function verifyQueue() {
  console.log("Starting Queue Verification...");

  // 0. Check Redis Connection
  try {
    console.log("  Checking Redis connection...");
    await connection.ping();
    console.log("  Redis Connection: OK");
  } catch (e) {
    console.error("  FAILURE: Could not connect to Redis.", e);
    process.exit(1);
  }

  // 1. Setup Worker
  const worker = createWorkflowWorker();

  let jobCompleted = false;
  worker.on("completed", (job) => {
    if (job.name === "start-workflow") {
      console.log(`  Callback: Job ${job.id} completed.`);
      jobCompleted = true;
    }
  });

  console.log("  Worker started.");

  // 2. Setup Data
  const tenantA = await db.tenant.create({ data: { name: "Queue Tenant A" } });
  const workflowA = await db.workflowDefinition.create({
    data: {
      tenantId: tenantA.id,
      title: "Async Workflow",
      definition: { steps: [] },
    },
  });

  const reqContext = {
    user: { id: "test", email: "test" }, // Mock user
    tenantId: tenantA.id,
    body: { workflowDefinitionId: workflowA.id },
    params: {},
  } as unknown as AuthenticatedRequest;

  // 3. Trigger Workflow (should enqueue)
  console.log("\n[Test] Trigger Workflow");
  const res = mockRes();
  await runWorkflow(reqContext, res);

  if (res.statusCode === 201) {
    console.log("  SUCCESS: API returned 201 Created.");
  } else {
    console.error("  FAILURE: API failed.", res.body);
    process.exit(1);
  }
  const executionId = res.body.id;

  // 4. Verify Job Processing
  // We'll wait a bit for the worker to pick it up and process
  console.log("  Waiting for worker to process job...");

  await new Promise((r) => setTimeout(r, 2000)); // Wait 2s

  if (jobCompleted) {
    console.log("  SUCCESS: Job was processed (event received).");
  } else {
    console.error(
      "  FAILURE: Job completion event not received within timeout.",
    );
    // Check failed counts just in case
    const queue = getWorkflowQueue();
    const jobCounts = await queue.getJobCounts();
    if ((jobCounts.failed || 0) > 0) {
      console.error("  FAILURE: Job status indicates failure.", jobCounts);
    }
    process.exit(1);
  }

  // Cleanup
  await worker.close();
  // await queue.close(); // queue is singleton, closing might affect other tests if running in suite, but here is fine.
  await connection.quit();

  console.log("\nVERIFICATION COMPLETE: Async Infrastructure is working.");
  process.exit(0);
}

verifyQueue().catch(async (e) => {
  console.error(e);
  await connection.quit();
  process.exit(1);
});
