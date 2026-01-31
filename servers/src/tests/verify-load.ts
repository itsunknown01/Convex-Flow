import { db } from "@workspace/database";
import { connection } from "../infra/queue/queue-factory.js";
import { createWorkflowWorker } from "../infra/queue/workflow-worker.js";
import { Queue } from "bullmq";

async function verifyLoad() {
  console.log("Starting Phase 8 Verification: Scale & Load Hardening...");

  // 1. Setup Tenant
  const tenant = await db.tenant.create({ data: { name: "Load Test Tenant" } });

  // 2. Setup Workflow
  const workflow = await db.workflowDefinition.create({
    data: {
      tenantId: tenant.id,
      title: "Load Test Workflow",
      definition: { steps: [] },
    },
  });

  const execution = await db.workflowExecution.create({
    data: {
      tenantId: tenant.id,
      workflowDefinitionId: workflow.id,
      status: "RUNNING",
    },
  });

  console.log(`  Created Tenant: ${tenant.id} and Execution: ${execution.id}`);

  // 3. Setup Worker
  const worker = createWorkflowWorker();

  // 4. Enqueue 200 Concurrent Jobs
  const queue = new Queue("workflow-queue", { connection });
  console.log("\n[Test] Enqueuing 200 Parallel Transform Jobs...");

  const jobs = [];
  for (let i = 0; i < 200; i++) {
    jobs.push(
      queue.add("run-step", {
        executionId: execution.id,
        tenantId: tenant.id,
        action: "RUN_STEP",
        stepId: `step-${i}`,
        stepDefinition: {
          type: "TRANSFORM",
          expression: `{"index": ${i}, "status": "processed"}`,
        },
        input: { data: "test" },
      }),
    );
  }

  const startTime = Date.now();
  await Promise.all(jobs);
  console.log(`  Enqueued 200 jobs in ${Date.now() - startTime}ms`);

  // 5. Poll for completion
  console.log("  Waiting for jobs to process (Concurrency check)...");

  let completed = 0;
  const maxWait = 15000; // 15 seconds
  const pollStart = Date.now();

  while (Date.now() - pollStart < maxWait) {
    completed = await db.job.count({
      where: { executionId: execution.id, status: "COMPLETED" },
    });

    if (completed >= 200) break;
    process.stdout.write(`\r  Progress: ${completed}/200`);
    await new Promise((r) => setTimeout(r, 500));
  }
  process.stdout.write("\n");

  const totalTime = Date.now() - pollStart;

  if (completed >= 200) {
    console.log(
      `  SUCCESS: Processed 200 jobs in ${totalTime}ms (~${Math.round(200 / (totalTime / 1000))} jobs/sec)`,
    );
  } else {
    console.error(
      `  FAILURE: Only ${completed}/200 jobs completed within ${maxWait}ms`,
    );
    process.exit(1);
  }

  console.log(
    "\nVERIFICATION COMPLETE: System handled concurrency successfully.",
  );

  await worker.close();
  await connection.quit();
  process.exit(0);
}

verifyLoad().catch(async (e) => {
  console.error(e);
  await connection.quit();
  process.exit(1);
});
