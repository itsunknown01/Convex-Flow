import { db } from "@workspace/database";
import crypto from "crypto";

export class LedgerService {
  private static instance: LedgerService;

  private constructor() {}

  public static getInstance(): LedgerService {
    if (!LedgerService.instance) {
      LedgerService.instance = new LedgerService();
    }
    return LedgerService.instance;
  }

  /**
   * Appends a new entry to the immutable ledger.
   * Calculates SHA-256 hash based on previous entry's hash + current data.
   */
  public async append(
    tenantId: string,
    eventType: string,
    data: any,
  ): Promise<void> {
    try {
      // 1. Fetch the last entry for this tenant to get previousHash
      const lastEntry = await db.ledgerEntry.findFirst({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });

      const previousHash = lastEntry ? lastEntry.hash : "Genesis"; // Genesis block for new tenant

      // 2. Compute new Hash
      const dataString = JSON.stringify(data);
      const payload = `${previousHash}|${tenantId}|${eventType}|${dataString}`;
      const hash = crypto.createHash("sha256").update(payload).digest("hex");

      // 3. Write to Database
      await db.ledgerEntry.create({
        data: {
          tenantId,
          previousHash,
          hash,
          eventType,
          data: dataString,
        },
      });

      console.log(`[Ledger] Appended entry for ${tenantId} [${eventType}]`);
    } catch (error) {
      console.error("[Ledger] Failed to append entry:", error);
      // In a real system, we might want to throw or queue for retry, but we don't want to crash the main flow here for MVP?
      // Actually, per PRD, this is critical.
      throw error;
    }
  }

  public async list(tenantId: string, limit = 50, offset = 0) {
    return db.ledgerEntry.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }
}
