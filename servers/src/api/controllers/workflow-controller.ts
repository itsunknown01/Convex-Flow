import { Response } from "express";
import { AuthenticatedRequest } from "../context.js";
import { WorkflowService } from "../../core/services/workflow-service.js";

export const createWorkflow = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { title, description, definition } = req.body;
  const tenantId = req.tenantId!;

  try {
    const workflow = await WorkflowService.getInstance().createDefinition(
      tenantId,
      {
        title,
        description,
        definition,
      },
    );
    res.status(201).json(workflow);
  } catch (error: any) {
    console.error("Error creating workflow:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create workflow" });
  }
};

export const runWorkflow = async (req: AuthenticatedRequest, res: Response) => {
  const { workflowDefinitionId, input } = req.body;
  const tenantId = req.tenantId!;

  try {
    const execution = await WorkflowService.getInstance().startExecution(
      tenantId,
      workflowDefinitionId,
      input,
    );
    res.status(201).json(execution);
  } catch (error: any) {
    console.error("Error starting workflow:", error);
    res
      .status(error.message.includes("not found") ? 404 : 500)
      .json({ error: error.message });
  }
};

export const getExecution = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  try {
    const execution = await WorkflowService.getInstance().getExecution(
      tenantId,
      id as string,
    );
    res.json(execution);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateExecutionStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;
  const { status } = req.body;
  const tenantId = req.tenantId!;

  try {
    // This could also move to service, keeping here for now as it's simple state logic
    // but a truly SOLID approach would move validation to a domain service.
    const result = await WorkflowService.getInstance().updateExecutionStatus(
      tenantId,
      id as string,
      status,
    );
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const listDefinitions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const tenantId = req.tenantId!;
  try {
    const definitions =
      await WorkflowService.getInstance().listDefinitions(tenantId);
    res.json(definitions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDefinition = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;
  try {
    const definition = await WorkflowService.getInstance().getDefinition(
      tenantId,
      id as string,
    );
    res.json(definition);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const listExecutions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const tenantId = req.tenantId!;
  try {
    const executions =
      await WorkflowService.getInstance().listExecutions(tenantId);
    res.json(executions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
