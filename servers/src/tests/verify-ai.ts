import { db } from "@workspace/database";
import { connection } from "../infra/queue/queue-factory.js";
import { AiGateway } from "../infra/ai/ai-gateway.js";

async function verifyAiLayer() {
  console.log("Starting Phase 5 Verification: AI Reasoning Layer...");

  // 1. Setup Tenant
  const tenant = await db.tenant.create({ data: { name: "AI Verify Tenant" } });
  const gateway = AiGateway.getInstance();

  console.log(`  Created Tenant: ${tenant.id}`);

  // 2. Test Single Valid Call
  console.log("\n[Test] Single AI Generation Call");
  try {
    const result = await gateway.generate({
      tenantId: tenant.id,
      model: "mock-gpt-4",
      prompt: "Explain quantum physics",
    });

    if (result.confidence > 0 && result.explanation) {
      console.log("  SUCCESS: Received structured output.");
    } else {
      console.error("  FAILURE: Invalid structure.", result);
      process.exit(1);
    }
  } catch (error: any) {
    console.error("  FAILURE: Gateway threw error.", error);
    process.exit(1);
  }

  // 3. Verify Audit Log
  console.log("\n[Test] Verify Audit Log");
  const logs = await db.aiRequestLog.findMany({
    where: { tenantId: tenant.id },
  });

  if (logs.length > 0 && logs[0]!.prompt === "Explain quantum physics") {
    console.log(`  SUCCESS: Log found (ID: ${logs[0]!.id})`);
  } else {
    console.error("  FAILURE: No audit log found.");
    process.exit(1);
  }

  // 4. Test Rate Limiting
  console.log("\n[Test] Rate Limiting (Burst 105 calls)");
  const rateTenant = await db.tenant.create({
    data: { name: "Rate Limit Tenant" },
  });

  let blocked = false;
  for (let i = 0; i < 105; i++) {
    try {
      await gateway.generate({
        tenantId: rateTenant.id,
        model: "mock-gpt-4",
        prompt: "spam",
      });
    } catch (error: any) {
      if (error.message.includes("Rate limit exceeded")) {
        blocked = true;
        console.log(`  SUCCESS: Request ${i + 1} blocked by rate limiter.`);
        break;
      }
    }
  }

  if (!blocked) {
    console.error("  FAILURE: Rate limit did not trigger.");
    process.exit(1);
  }

  console.log("\nVERIFICATION COMPLETE: AI Layer is working.");

  await connection.quit();
  process.exit(0);
}

verifyAiLayer().catch(async (e) => {
  console.error(e);
  await connection.quit();
  process.exit(1);
});
