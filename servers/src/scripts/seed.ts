import { db } from "@workspace/database";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create User
  const email = "test@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.upsert({
    where: { email },
    update: { passwordHash: hashedPassword },
    create: {
      email,
      passwordHash: hashedPassword,
    },
  });

  console.log(`✅ User created/updated: ${user.email}`);

  // 2. Create Tenant
  const tenantName = "Demo Tenant";
  // We can't easy upsert tenant by name since it's not unique, so we findFirst or create
  let tenant = await db.tenant.findFirst({ where: { name: tenantName } });

  if (!tenant) {
    tenant = await db.tenant.create({
      data: { name: tenantName },
    });
    console.log(`✅ Tenant created: ${tenant.name}`);
  } else {
    console.log(`ℹ️ Tenant already exists: ${tenant.name}`);
  }

  // 3. Create Membership
  const membershipResponse = await db.membership.upsert({
    where: {
      userId_tenantId: {
        userId: user.id,
        tenantId: tenant.id,
      },
    },
    update: { role: "ADMIN" },
    create: {
      userId: user.id,
      tenantId: tenant.id,
      role: "ADMIN",
    },
  });

  console.log(`✅ Membership verified for user in tenant.`);

  // 4. Create Sample Workflow Definition
  const workflowTitle = "Onboarding Flow";
  let workflow = await db.workflowDefinition.findFirst({
    where: { tenantId: tenant.id, title: workflowTitle },
  });

  if (!workflow) {
    workflow = await db.workflowDefinition.create({
      data: {
        tenantId: tenant.id,
        title: workflowTitle,
        description: "A sample onboarding workflow for new employees.",
        definition: {
          steps: [
            {
              id: "step-1",
              type: "HTTP",
              url: "https://jsonplaceholder.typicode.com/todos/1",
              method: "GET",
            },
            {
              id: "step-2",
              type: "AI",
              model: "gpt-4",
              prompt: "Summarize the previous step's output.",
            },
          ],
        },
      },
    });
    console.log(`✅ Sample Workflow Definition created.`);
  } else {
    console.log(`ℹ️ Sample Workflow Definition already exists.`);
  }

  // 5. Create Sample Execution
  const runningExecutions = await db.workflowExecution.count({
    where: { workflowDefinitionId: workflow.id },
  });

  if (runningExecutions === 0) {
    await db.workflowExecution.create({
      data: {
        tenantId: tenant.id,
        workflowDefinitionId: workflow.id,
        status: "RUNNING",
        input: { employeeId: "12345" },
      },
    });
    console.log(`✅ Sample Running Execution created.`);
  }

  console.log("\n🎉 Seeding completed successfully!");
  console.log("------------------------------------------------");
  console.log(`User: ${email}`);
  console.log(`Password: ${password}`);
  console.log("------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // db.$disconnect() is usually handled by the framework but good practice in scripts
  });
