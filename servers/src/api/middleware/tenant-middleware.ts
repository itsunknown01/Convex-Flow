import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../context.js";
import { db } from "@workspace/database";

export const tenantMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const tenantId = req.headers["x-tenant-id"] as string;

  if (!tenantId) {
    res.status(400).json({ error: "Missing x-tenant-id header" });
    return;
  }

  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const membership = await db.membership.findUnique({
      where: {
        userId_tenantId: {
          userId: req.user.id,
          tenantId: tenantId,
        },
      },
    });

    if (!membership) {
      res.status(403).json({ error: "User does not belong to this tenant" });
      return;
    }

    req.tenantId = tenantId;
    next();
  } catch (error) {
    console.error("Tenant verification failed:", error);
    res
      .status(500)
      .json({ error: "Internal server error during tenant verification" });
    return;
  }
};
