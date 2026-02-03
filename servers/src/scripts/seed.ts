import { db } from "@workspace/database";
import bcrypt from "bcrypt";
import crypto from "crypto";

async function main() {
  console.log("🌱 Starting comprehensive database seed...");

  // ========================================
  // 1. USERS
  // ========================================
  const users = [
    { email: "admin@convexflow.com", password: "admin123", role: "ADMIN" },
    { email: "manager@convexflow.com", password: "manager123", role: "ADMIN" },
    {
      email: "operator@convexflow.com",
      password: "operator123",
      role: "MEMBER",
    },
    { email: "test@example.com", password: "password123", role: "MEMBER" },
  ];

  const createdUsers = [];
  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await db.user.upsert({
      where: { email: u.email },
      update: { passwordHash: hashedPassword },
      create: { email: u.email, passwordHash: hashedPassword },
    });
    createdUsers.push({ ...user, role: u.role, plainPassword: u.password });
  }
  console.log(`✅ Users seeded: ${createdUsers.length}`);

  // ========================================
  // 2. TENANTS
  // ========================================
  const tenantNames = ["Acme Corp", "TechFlow Inc", "Global Automations"];
  const createdTenants = [];

  for (const name of tenantNames) {
    let tenant = await db.tenant.findFirst({ where: { name } });
    if (!tenant) {
      tenant = await db.tenant.create({ data: { name } });
    }
    createdTenants.push(tenant);
  }
  console.log(`✅ Tenants seeded: ${createdTenants.length}`);

  // ========================================
  // 3. MEMBERSHIPS (Link users to tenants)
  // ========================================
  // Admin to first tenant, manager to second, operator and test to first
  const memberships = [
    { user: createdUsers[0], tenant: createdTenants[0], role: "ADMIN" },
    { user: createdUsers[1], tenant: createdTenants[1], role: "ADMIN" },
    { user: createdUsers[2], tenant: createdTenants[0], role: "MEMBER" },
    { user: createdUsers[3], tenant: createdTenants[0], role: "MEMBER" },
  ];

  for (const m of memberships) {
    await db.membership.upsert({
      where: { userId_tenantId: { userId: m.user.id, tenantId: m.tenant.id } },
      update: { role: m.role },
      create: { userId: m.user.id, tenantId: m.tenant.id, role: m.role },
    });
  }
  console.log(`✅ Memberships seeded: ${memberships.length}`);

  // ========================================
  // 4. WORKFLOW DEFINITIONS
  // ========================================
  const workflowDefs = [
    {
      tenantId: createdTenants[0]!.id,
      title: "Employee Onboarding",
      description: "Automates new employee setup across HR, IT, and Finance.",
      definition: {
        steps: [
          {
            id: "step-1",
            type: "HTTP",
            method: "POST",
            url: "https://api.hr.example/create-profile",
          },
          {
            id: "step-2",
            type: "AI",
            model: "gpt-4",
            prompt: "Generate welcome email for {{employee.name}}",
          },
          {
            id: "step-3",
            type: "HTTP",
            method: "POST",
            url: "https://api.it.example/provision-equipment",
          },
        ],
      },
    },
    {
      tenantId: createdTenants[0]!.id,
      title: "Invoice Processing",
      description: "Extracts data from invoices and routes for approval.",
      definition: {
        steps: [
          {
            id: "step-1",
            type: "AI",
            model: "gpt-4",
            prompt: "Extract invoice details from attached PDF",
          },
          { id: "step-2", type: "APPROVAL", approvalRole: "MANAGER" },
          {
            id: "step-3",
            type: "HTTP",
            method: "POST",
            url: "https://api.finance.example/submit-payment",
          },
        ],
      },
    },
    {
      tenantId: createdTenants[1]!.id,
      title: "Customer Support Triage",
      description: "Classifies incoming support tickets using AI.",
      definition: {
        steps: [
          {
            id: "step-1",
            type: "AI",
            model: "gpt-4",
            prompt: "Classify the following support ticket: {{ticket.body}}",
          },
          {
            id: "step-2",
            type: "HTTP",
            method: "POST",
            url: "https://api.support.example/route-ticket",
          },
        ],
      },
    },
  ];

  const createdWorkflows = [];
  for (const wf of workflowDefs) {
    let existing = await db.workflowDefinition.findFirst({
      where: { tenantId: wf.tenantId, title: wf.title },
    });
    if (!existing) {
      existing = await db.workflowDefinition.create({ data: wf });
    }
    createdWorkflows.push(existing);
  }
  console.log(`✅ Workflow Definitions seeded: ${createdWorkflows.length}`);

  // ========================================
  // 5. WORKFLOW EXECUTIONS
  // ========================================
  const executions = [
    {
      workflowId: createdWorkflows[0]!.id,
      tenantId: createdTenants[0]!.id,
      status: "COMPLETED" as const,
      input: { employeeName: "John Doe" },
      output: { result: "success" },
    },
    {
      workflowId: createdWorkflows[0]!.id,
      tenantId: createdTenants[0]!.id,
      status: "RUNNING" as const,
      input: { employeeName: "Jane Smith" },
    },
    {
      workflowId: createdWorkflows[1]!.id,
      tenantId: createdTenants[0]!.id,
      status: "AWAITING_APPROVAL" as const,
      input: { invoiceId: "INV-2024-001" },
    },
    {
      workflowId: createdWorkflows[1]!.id,
      tenantId: createdTenants[0]!.id,
      status: "FAILED" as const,
      input: { invoiceId: "INV-2024-002" },
    },
    {
      workflowId: createdWorkflows[2]!.id,
      tenantId: createdTenants[1]!.id,
      status: "COMPLETED" as const,
      input: { ticketId: "TKT-78901" },
      output: { category: "billing" },
    },
  ];

  const createdExecutions = [];
  for (const exec of executions) {
    const created = await db.workflowExecution.create({
      data: {
        workflowDefinitionId: exec.workflowId,
        tenantId: exec.tenantId,
        status: exec.status,
        input: exec.input,
        output: exec.output,
      },
    });
    createdExecutions.push(created);
  }
  console.log(`✅ Workflow Executions seeded: ${createdExecutions.length}`);

  // ========================================
  // 6. JOBS
  // ========================================
  const jobs = [
    {
      executionId: createdExecutions[0]!.id,
      stepId: "step-1",
      type: "HTTP",
      status: "COMPLETED" as const,
      output: { statusCode: 200 },
    },
    {
      executionId: createdExecutions[0]!.id,
      stepId: "step-2",
      type: "AI",
      status: "COMPLETED" as const,
      output: { email: "Welcome aboard, John!" },
    },
    {
      executionId: createdExecutions[1]!.id,
      stepId: "step-1",
      type: "HTTP",
      status: "COMPLETED" as const,
      output: { statusCode: 201 },
    },
    {
      executionId: createdExecutions[1]!.id,
      stepId: "step-2",
      type: "AI",
      status: "RUNNING" as const,
    },
    {
      executionId: createdExecutions[2]!.id,
      stepId: "step-1",
      type: "AI",
      status: "COMPLETED" as const,
      output: { invoiceData: { amount: 1500 } },
    },
    {
      executionId: createdExecutions[2]!.id,
      stepId: "step-2",
      type: "APPROVAL",
      status: "PENDING" as const,
    },
    {
      executionId: createdExecutions[3]!.id,
      stepId: "step-1",
      type: "AI",
      status: "FAILED" as const,
      output: { error: "Failed to parse invoice" },
    },
  ];

  for (const job of jobs) {
    await db.job.create({ data: job });
  }
  console.log(`✅ Jobs seeded: ${jobs.length}`);

  // ========================================
  // 7. POLICIES
  // ========================================
  const policies = [
    {
      tenantId: createdTenants[0]!.id,
      triggerType: "AI_CONFIDENCE",
      threshold: 0.7,
      action: "BLOCK",
    },
    {
      tenantId: createdTenants[0]!.id,
      triggerType: "TASK_FAILURE",
      threshold: null,
      action: "NOTIFY",
    },
    {
      tenantId: createdTenants[1]!.id,
      triggerType: "AI_CONFIDENCE",
      threshold: 0.5,
      action: "APPROVE",
    },
  ];

  for (const policy of policies) {
    await db.policy.create({ data: policy });
  }
  console.log(`✅ Policies seeded: ${policies.length}`);

  // ========================================
  // 8. APPROVAL REQUESTS
  // ========================================
  const approvalRequests = [
    {
      tenantId: createdTenants[0]!.id,
      executionId: createdExecutions[2]!.id,
      status: "PENDING",
      type: "MANAGER_APPROVAL",
      reason: "Invoice amount exceeds $1000 threshold",
      context: { invoiceAmount: 1500, approver: "manager@convexflow.com" },
    },
    {
      tenantId: createdTenants[0]!.id,
      executionId: createdExecutions[3]!.id,
      status: "REJECTED",
      type: "AI_CONFIDENCE_CHECK",
      reason: "AI confidence score below threshold (0.45)",
      context: { confidenceScore: 0.45, threshold: 0.7 },
    },
  ];

  for (const ar of approvalRequests) {
    await db.approvalRequest.create({ data: ar });
  }
  console.log(`✅ Approval Requests seeded: ${approvalRequests.length}`);

  // ========================================
  // 9. LEDGER ENTRIES
  // ========================================
  const generateHash = (data: string, previousHash: string) => {
    return crypto
      .createHash("sha256")
      .update(previousHash + data)
      .digest("hex");
  };

  let previousHash =
    "0000000000000000000000000000000000000000000000000000000000000000";
  const ledgerEvents = [
    {
      tenantId: createdTenants[0]!.id,
      eventType: "WORKFLOW_CREATED",
      data: JSON.stringify({ workflowId: createdWorkflows[0]!.id }),
    },
    {
      tenantId: createdTenants[0]!.id,
      eventType: "EXECUTION_STARTED",
      data: JSON.stringify({ executionId: createdExecutions[0]!.id }),
    },
    {
      tenantId: createdTenants[0]!.id,
      eventType: "TASK_COMPLETED",
      data: JSON.stringify({ jobId: "step-1", output: "success" }),
    },
    {
      tenantId: createdTenants[0]!.id,
      eventType: "EXECUTION_COMPLETED",
      data: JSON.stringify({ executionId: createdExecutions[0]!.id }),
    },
    {
      tenantId: createdTenants[1]!.id,
      eventType: "WORKFLOW_CREATED",
      data: JSON.stringify({ workflowId: createdWorkflows[2]!.id }),
    },
  ];

  for (const entry of ledgerEvents) {
    const hash = generateHash(entry.data, previousHash);
    await db.ledgerEntry.create({
      data: {
        tenantId: entry.tenantId,
        eventType: entry.eventType,
        data: entry.data,
        previousHash,
        hash,
      },
    });
    previousHash = hash;
  }
  console.log(`✅ Ledger Entries seeded: ${ledgerEvents.length}`);

  // ========================================
  // 10. AI REQUEST LOGS
  // ========================================
  const aiLogs = [
    {
      tenantId: createdTenants[0]!.id,
      model: "gpt-4",
      prompt: "Generate welcome email for John Doe",
      response: {
        content:
          "Welcome aboard, John! We're excited to have you join our team.",
      },
      tokensUsed: 150,
      latencyMs: 850,
      statusCode: 200,
    },
    {
      tenantId: createdTenants[0]!.id,
      model: "gpt-4",
      prompt: "Extract invoice details from attached PDF",
      response: {
        invoiceNumber: "INV-2024-001",
        amount: 1500,
        vendor: "Acme Supplies",
      },
      tokensUsed: 320,
      latencyMs: 1200,
      statusCode: 200,
    },
    {
      tenantId: createdTenants[1]!.id,
      model: "gpt-4",
      prompt: "Classify the following support ticket: My payment failed",
      response: { category: "billing", priority: "high", confidence: 0.92 },
      tokensUsed: 95,
      latencyMs: 650,
      statusCode: 200,
    },
  ];

  for (const log of aiLogs) {
    await db.aiRequestLog.create({ data: log });
  }
  console.log(`✅ AI Request Logs seeded: ${aiLogs.length}`);

  // ========================================
  // SUMMARY
  // ========================================
  console.log("\n🎉 Comprehensive seeding completed successfully!\n");
  console.log("================================================");
  console.log("LOGIN CREDENTIALS:");
  console.log("================================================");
  for (const u of createdUsers) {
    console.log(`  ${u.email} / ${u.plainPassword} (${u.role})`);
  }
  console.log("================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
