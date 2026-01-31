import { db } from "@workspace/database";

export interface PolicyContext {
  triggerType: "AI_CONFIDENCE" | "TASK_FAILURE" | "SENSITIVE_URL";
  value: any;
}

export class PolicyEngine {
  private static instance: PolicyEngine;

  private constructor() {}

  public static getInstance(): PolicyEngine {
    if (!PolicyEngine.instance) {
      PolicyEngine.instance = new PolicyEngine();
    }
    return PolicyEngine.instance;
  }

  /**
   * Evaluates if an action should be gated by a policy.
   * Returns { action: 'APPROVE' } if manual approval is required.
   */
  public async evaluate(
    tenantId: string,
    context: PolicyContext,
  ): Promise<{ action: "PROCEED" | "APPROVE" | "BLOCK" }> {
    try {
      // 1. Fetch relevant policies for this tenant and trigger type
      const policies = await db.policy.findMany({
        where: {
          tenantId,
          triggerType: context.triggerType,
        },
      });

      if (policies.length === 0) return { action: "PROCEED" };

      // 2. Evaluate each policy
      for (const policy of policies) {
        if (context.triggerType === "AI_CONFIDENCE") {
          const confidence = context.value as number;
          if (policy.threshold !== null && confidence < policy.threshold) {
            return { action: policy.action as "APPROVE" | "BLOCK" };
          }
        }

        if (context.triggerType === "TASK_FAILURE") {
          // If any failure policy exists, we trigger the action (usually APPROVE or BLOCK)
          return { action: policy.action as "APPROVE" | "BLOCK" };
        }
      }

      return { action: "PROCEED" };
    } catch (error) {
      console.error("[PolicyEngine] Evaluation failed:", error);
      // Fail safe: If policy engine fails, we might want to block or proceed?
      // For MVP, we proceed but log the error.
      return { action: "PROCEED" };
    }
  }
}
