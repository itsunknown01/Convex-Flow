import "dotenv/config";
process.env.DATABASE_URL =
  "postgresql://neondb_owner:npg_T1IAec0aFKzV@ep-misty-queen-ahg3r47u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
import { PrismaClient } from "../../../packages/database/src/generated-client/index.js";
const db = new PrismaClient();
import bcrypt from "bcrypt";
import crypto from "crypto";

async function main() {
  console.log("🌱 Starting custom user seed...");

  const email = "aryamangohain@gmail.com";
  const password = "bootu123";
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. User
  const user = await db.user.upsert({
    where: { email },
    update: { passwordHash: hashedPassword },
    create: { email, passwordHash: hashedPassword },
  });
  console.log(`✅ User seeded: ${user.email}`);

  // 2. Tenant
  const tenantName = "Aryaman Workspace";
  let tenant = await db.tenant.findFirst({ where: { name: tenantName } });
  if (!tenant) {
    tenant = await db.tenant.create({ data: { name: tenantName } });
  }
  console.log(`✅ Tenant seeded: ${tenant.name}`);

  // 3. Membership
  await db.membership.upsert({
    where: {
      userId_tenantId: { userId: user.id, tenantId: tenant.id },
    },
    update: { role: "ADMIN" },
    create: { userId: user.id, tenantId: tenant.id, role: "ADMIN" },
  });
  console.log(`✅ Membership seeded`);

  // 4. Workflow Definition
  let workflow = await db.workflowDefinition.findFirst({
    where: { tenantId: tenant.id, title: "Custom User Flow" },
  });
  if (!workflow) {
    workflow = await db.workflowDefinition.create({
      data: {
        tenantId: tenant.id,
        title: "Custom User Flow",
        description: "A workflow for the newly created user",
        definition: {
          steps: [
            {
              id: "step-1",
              type: "HTTP",
              method: "GET",
              url: "https://api.github.com/users/aryaman",
            },
          ],
        },
      },
    });
  }
  console.log(`✅ Workflow Definition seeded`);

  // 5. Workflow Execution
  const execution = await db.workflowExecution.create({
    data: {
      workflowDefinitionId: workflow.id,
      tenantId: tenant.id,
      status: "COMPLETED",
      input: { starter: "aryaman" },
      output: { result: "success" },
    },
  });
  console.log(`✅ Workflow Execution seeded`);

  // 6. Job
  await db.job.create({
    data: {
      executionId: execution.id,
      stepId: "step-1",
      type: "HTTP",
      status: "COMPLETED",
      output: { statusCode: 200 },
    },
  });
  console.log(`✅ Job seeded`);

  // 7. Policy
  await db.policy.create({
    data: {
      tenantId: tenant.id,
      triggerType: "TASK_FAILURE",
      threshold: null,
      action: "NOTIFY",
    },
  });
  console.log(`✅ Policy seeded`);

  // 8. Approval Request
  await db.approvalRequest.create({
    data: {
      tenantId: tenant.id,
      executionId: execution.id,
      status: "PENDING",
      type: "MANAGER_APPROVAL",
      reason: "Custom test approval",
      context: { requester: user.email },
    },
  });
  console.log(`✅ Approval Request seeded`);

  // 9. Ledger Entry
  const generateHash = (data: string, previousHash: string) => {
    return crypto
      .createHash("sha256")
      .update(previousHash + data)
      .digest("hex");
  };
  const previousHash =
    "0000000000000000000000000000000000000000000000000000000000000000";
  const ledgerData = JSON.stringify({
    userId: user.id,
    action: "USER_CREATED",
  });
  const hash = generateHash(ledgerData, previousHash);

  await db.ledgerEntry.create({
    data: {
      tenantId: tenant.id,
      eventType: "USER_CREATED",
      data: ledgerData,
      previousHash,
      hash,
    },
  });
  console.log(`✅ Ledger Entry seeded`);

  // 10. AI Request Log
  await db.aiRequestLog.create({
    data: {
      tenantId: tenant.id,
      model: "gpt-4",
      prompt: "Custom query for new user",
      response: { answer: "Hello, Aryaman!" },
      tokensUsed: 10,
      latencyMs: 150,
      statusCode: 200,
    },
  });
  console.log(`✅ AI Request Log seeded`);

  console.log("\n🎉 Custom user seeding completed successfully!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
