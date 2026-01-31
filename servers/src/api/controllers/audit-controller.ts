import { Request, Response } from "express";
import { LedgerService } from "../../infra/ledger/ledger-service.js";

export const listLogs = async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers["x-tenant-id"] as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID required" });
    }

    const ledger = LedgerService.getInstance();
    const logs = await ledger.list(tenantId, limit, offset);

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
