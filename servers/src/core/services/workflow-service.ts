import { db } from "@workspace/database";
import { CacheService } from "../../infra/cache/cache-service.js"; // Note: will fix imports later
import { getWorkflowQueue } from "../../infra/queue/queue-factory.js";

export class WorkflowService {
  private static instance: WorkflowService;

  private constructor() {}

  public static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService();
    }
    return WorkflowService.instance;
  }

  async createDefinition(tenantId: string, data: any) {
    return db.workflowDefinition.create({
      data: {
        tenantId,
        ...data,
        version: 1,
      },
    });
  }

  async startExecution(
    tenantId: string,
    workflowDefinitionId: string,
    input: any,
  ) {
    // 1. Verify availability and ownership (using Cache)
    const workflowDef = await CacheService.getInstance().wrap(
      `wf_def:${workflowDefinitionId}`,
      300,
      () =>
        db.workflowDefinition.findUnique({
          where: { id: workflowDefinitionId },
        }),
    );

    if (!(workflowDef as any) || (workflowDef as any).tenantId !== tenantId) {
      throw new Error("Workflow definition not found");
    }

    // 2. Create Execution
    const execution = await db.workflowExecution.create({
      data: {
        tenantId,
        workflowDefinitionId,
        status: "CREATED",
        input: input || {},
        state: {},
      },
    });

    // 3. Enqueue Job
    const queue = getWorkflowQueue();
    await queue.add("start-workflow", {
      executionId: execution.id,
      tenantId,
      action: "START_WORKFLOW",
    });

    return execution;
  }

  async getExecution(tenantId: string, id: string) {
    const execution = await db.workflowExecution.findUnique({ where: { id } });
    if (!execution || execution.tenantId !== tenantId)
      throw new Error("Execution not found");
    return execution;
  }
  async updateExecutionStatus(tenantId: string, id: string, status: any) {
    const execution = await this.getExecution(tenantId, id);

    // Basic state machine validation
    if (execution.status === status) return execution;

    const allowedTransitions: Record<string, string[]> = {
      CREATED: ["RUNNING", "FAILED"],
      RUNNING: ["PAUSED", "COMPLETED", "FAILED", "AWAITING_APPROVAL"],
      PAUSED: ["RUNNING", "FAILED"],
      AWAITING_APPROVAL: ["RUNNING", "FAILED"],
    };

    if (
      allowedTransitions[execution.status] &&
      !allowedTransitions[execution.status]!.includes(status)
    ) {
      throw new Error(
        `Invalid transition from ${execution.status} to ${status}`,
      );
    }

    return db.workflowExecution.update({
      where: { id },
      data: { status },
    });
  }
  async getDefinition(tenantId: string, id: string) {
    const definition = await db.workflowDefinition.findUnique({
      where: { id },
    });
    if (!definition || definition.tenantId !== tenantId) {
      throw new Error("Workflow definition not found");
    }
    return definition;
  }

  async listDefinitions(tenantId: string) {
    return db.workflowDefinition.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async listExecutions(tenantId: string) {
    return db.workflowExecution.findMany({
      where: { tenantId },
      include: {
        workflowDefinition: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
