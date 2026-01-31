import { Response } from "express";
import { AuthenticatedRequest } from "../context.js";
import { ApprovalService } from "../../core/services/approval-service.js";

export const getApprovalRequests = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const approvals = await ApprovalService.getInstance().getRequests(
      req.tenantId!,
    );
    res.json(approvals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const decideApproval = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await ApprovalService.getInstance().decide(
      id!,
      status as "APPROVED" | "REJECTED",
    );
    res.json(result);
  } catch (error: any) {
    res
      .status(error.message.includes("not found") ? 404 : 500)
      .json({ error: error.message });
  }
};
