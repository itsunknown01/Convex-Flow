import { db } from "@workspace/database";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../api/context.js";
import {
  createWorkflow,
  runWorkflow,
  updateExecutionStatus,
  getExecution,
} from "../api/controllers/workflow-controller.js";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Mock Reponse object
const mockRes = () => {
  const res: any = {};
  res.statusCode = 200;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body: any) => {
    res.body = body;
    return res;
  };
  return res;
};

async function verifyOrchestrator() {
  console.log("Starting Workflow Orchestrator Verification...");

  // 1. Setup Data
  const tenantA = await db.tenant.create({ data: { name: "Orch Tenant A" } });
  const userA = await db.user.create({
    data: {
      email: `orch-userA-${Date.now()}@example.com`,
      passwordHash: "hash",
      tenants: {
        create: { tenantId: tenantA.id, role: "ADMIN" },
      },
    },
  });

  const reqContext = {
    user: { id: userA.id, email: userA.email },
    tenantId: tenantA.id,
    body: {},
    params: {},
  } as unknown as AuthenticatedRequest;

  // 2. Test: Create Workflow Definition
  console.log("\n[Test] Create Workflow Definition");
  reqContext.body = {
    title: "Test Workflow",
    description: "A simple linear workflow",
    definition: { steps: [{ id: "step1", type: "log" }] },
  };

  let res = mockRes();
  await createWorkflow(reqContext, res);

  if (res.statusCode === 201 && res.body.id) {
    console.log("  SUCCESS: Workflow Definition created.");
  } else {
    console.error("  FAILURE: Could not create workflow.");
    console.error("  Status:", res.statusCode);
    // console.error("  Body:", JSON.stringify(res.body, null, 2)); // Reduced verbosity
    process.exit(1);
  }
  const workflowId = res.body.id;

  // 3. Test: Run Workflow (Create Execution)
  console.log("\n[Test] Run Workflow (Start Execution)");
  reqContext.body = {
    workflowDefinitionId: workflowId,
    input: { foo: "bar" },
  };

  res = mockRes();
  await runWorkflow(reqContext, res);

  if (res.statusCode === 201 && res.body.status === "CREATED") {
    console.log("  SUCCESS: Workflow Execution started (CREATED).");
  } else {
    console.error("  FAILURE: Could not start workflow.");
    console.error("  Status:", res.statusCode);
    // console.error("  Body:", JSON.stringify(res.body, null, 2));
    process.exit(1);
  }
  const executionId = res.body.id;

  // 4. Test: Valid State Transition (CREATED -> RUNNING)
  console.log("\n[Test] Valid State Transition (CREATED -> RUNNING)");
  reqContext.params = { id: executionId };
  reqContext.body = { status: "RUNNING" };

  res = mockRes();
  await updateExecutionStatus(reqContext, res);

  if (res.statusCode === 200 && res.body.status === "RUNNING") {
    console.log("  SUCCESS: Transitioned to RUNNING.");
  } else {
    console.error(
      `  FAILURE: Could not transition to RUNNING. Code: ${res.statusCode}`,
      res.body,
    );
    process.exit(1);
  }

  // 5. Test: Invalid State Transition (RUNNING -> CREATED [Illegal])
  console.log("\n[Test] Invalid State Transition (RUNNING -> CREATED)");
  reqContext.body = { status: "CREATED" }; // Backward transition not in map

  res = mockRes();
  await updateExecutionStatus(reqContext, res);

  if (res.statusCode === 400) {
    console.log("  SUCCESS: Invalid transition blocked correctly.");
  } else {
    console.error(
      `  FAILURE: Invalid transition ALLOWED (Code: ${res.statusCode}).`,
    );
    process.exit(1);
  }

  console.log("\nVERIFICATION COMPLETE: Orchestrator Core is functional.");
  process.exit(0);
}

verifyOrchestrator().catch((e) => {
  console.error(e);
  process.exit(1);
});
