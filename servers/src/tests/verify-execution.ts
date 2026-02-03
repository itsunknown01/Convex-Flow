import { db } from "@workspace/database";
import { getWorkflowQueue, connection } from "../infra/queue/queue-factory.js";
import { createWorkflowWorker } from "../infra/queue/workflow-worker.js";

async function verifyExecution() {
  console.log("Starting Phase 4 Verification: Deterministic Execution...");

  // 1. Setup
  const tenant = await db.tenant.create({
    data: { name: "Exec Verify Tenant" },
  });
  const workflow = await db.workflowDefinition.create({
    data: {
      tenantId: tenant.id,
      title: "Execution Workflow",
      definition: { steps: [] },
    },
  });
  const execution = await db.workflowExecution.create({
    data: {
      tenantId: tenant.id,
      workflowDefinitionId: workflow.id,
      status: "RUNNING",
      input: { foo: "bar" },
    },
  });

  const queue = getWorkflowQueue();
  const worker = createWorkflowWorker();

  let completedJobs = 0;
  worker.on("completed", () => {
    completedJobs++;
  });

  console.log("  Worker and Queue ready.");

  // 2. Test HTTP Step (Real external call)
  console.log("\n[Test] Enqueue HTTP Step");
  await queue.add("http-step", {
    action: "RUN_STEP",
    executionId: execution.id,
    tenantId: tenant.id,
    stepId: "step-1",
    stepDefinition: {
      type: "HTTP",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: "GET",
    },
    input: {},
  });

  // 3. Test Transform Step
  console.log("\n[Test] Enqueue Transform Step");
  await queue.add("transform-step", {
    action: "RUN_STEP",
    executionId: execution.id,
    tenantId: tenant.id,
    stepId: "step-2",
    stepDefinition: {
      type: "TRANSFORM",
      expression: "foo & ' ' & bar",
    },
    input: { foo: "Hello", bar: "World" },
  });

  // 4. Wait for processing
  console.log("  Waiting for jobs to process...");
  await new Promise((r) => setTimeout(r, 4000));

  // 5. Verify Database Records
  const jobs = await db.job.findMany({
    where: { executionId: execution.id },
    orderBy: { createdAt: "asc" },
  });

  console.log(`  Found ${jobs.length} Job records.`);

  if (jobs.length !== 2) {
    console.error("  FAILURE: Expected 2 job records.");
    process.exit(1);
  }

  // Verify HTTP Job
  const httpJob = jobs.find((j: any) => j.stepId === "step-1");
  if (
    httpJob?.status === "COMPLETED" &&
    (httpJob.output as any)?.data?.id === 1
  ) {
    console.log("  SUCCESS: HTTP Step executed and result stored.");
  } else {
    console.error("  FAILURE: HTTP Step failed or output mismatch.", httpJob);
    process.exit(1);
  }

  // Verify Transform Job
  const transformJob = jobs.find((j: any) => j.stepId === "step-2");
  if (
    transformJob?.status === "COMPLETED" &&
    transformJob.output === "Hello World"
  ) {
    console.log("  SUCCESS: Transform Step executed and result stored.");
  } else {
    console.error(
      "  FAILURE: Transform Step failed or output mismatch.",
      transformJob,
    );
    process.exit(1);
  }

  console.log("\nVERIFICATION COMPLETE: Deterministic Execution is working.");

  await worker.close();
  await connection.quit();
  process.exit(0);
}

verifyExecution().catch(async (e) => {
  console.error(e);
  await connection.quit();
  process.exit(1);
});
