import { db } from "@workspace/database";
import { connection } from "../infra/queue/queue-factory.js";
import { LedgerService } from "../infra/ledger/ledger-service.js";
import crypto from "crypto";

async function verifyLedger() {
  console.log("Starting Phase 6 Verification: Audit Ledger...");

  // 1. Setup Tenant
  const tenant = await db.tenant.create({
    data: { name: "Ledger Verify Tenant" },
  });
  const ledger = LedgerService.getInstance();

  console.log(`  Created Tenant: ${tenant.id}`);

  // 2. Append Entries
  console.log("\n[Test] Appending Sequential Entries");

  const entry1Data = { action: "login", user: "alice" };
  await ledger.append(tenant.id, "AUTH_EVENT", entry1Data);

  const entry2Data = { action: "view_doc", docId: "123" };
  await ledger.append(tenant.id, "ACCESS_EVENT", entry2Data);

  const entry3Data = { action: "logout", user: "alice" };
  await ledger.append(tenant.id, "AUTH_EVENT", entry3Data);

  // 3. Verify Chain Integrity
  console.log("\n[Test] Verifying Hash Chain");

  const entries = await db.ledgerEntry.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
  });

  if (entries.length !== 3) {
    console.error(`  FAILURE: Expected 3 entries, found ${entries.length}`);
    process.exit(1);
  }

  // Verify Entry 1 (Genesis)
  if (entries[0]!.previousHash !== "Genesis") {
    console.error("  FAILURE: Entry 1 previousHash should be 'Genesis'");
    process.exit(1);
  }

  // Verify Entry 2 matches Entry 1
  // Hash = SHA256(previousHash + tenantId + eventType + JSON.stringify(data))
  // Note: JSON.stringify ordering is tricky, but our service uses standard stringify.
  // In a real system, we'd use a canonical JSON serializer. Using the same runtime here should match.

  // Re-calculate Entry 2's hash manually
  const payload2 = `${entries[0]!.hash}|${tenant.id}|${entries[1]!.eventType}|${entries[1]!.data}`;
  const expectedHash2 = crypto
    .createHash("sha256")
    .update(payload2)
    .digest("hex");

  if (entries[1]!.hash === expectedHash2) {
    console.log("  SUCCESS: Entry 2 hash matches computed hash from Entry 1.");
  } else {
    console.error("  FAILURE: Entry 2 hash mismatch.");
    console.error("    Stored:", entries[1]!.hash);
    console.error("    Computed:", expectedHash2);
    process.exit(1);
  }

  // Verify Entry 3 chaining
  if (entries[2]!.previousHash === entries[1]!.hash) {
    console.log("  SUCCESS: Entry 3 previousHash points to Entry 2.");
  } else {
    console.error("  FAILURE: Broken chain between Entry 2 and 3.");
    process.exit(1);
  }

  console.log("\nVERIFICATION COMPLETE: Ledger is tamper-evident.");

  await connection.quit();
  process.exit(0);
}

verifyLedger().catch(async (e) => {
  console.error(e);
  await connection.quit();
  process.exit(1);
});
