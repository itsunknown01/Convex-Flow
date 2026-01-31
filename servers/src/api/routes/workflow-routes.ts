import { Router } from "express";
import {
  createWorkflow,
  runWorkflow,
  getExecution,
  updateExecutionStatus,
  listDefinitions,
  getDefinition,
  listExecutions,
} from "../controllers/workflow-controller.js";

const router = Router();

// Definitions
router.get("/definitions", listDefinitions);
router.get("/definitions/:id", getDefinition);
router.post("/definitions", createWorkflow);

// Executions
router.get("/executions", listExecutions);
router.post("/executions", runWorkflow);
router.get("/executions/:id", getExecution);
router.patch("/executions/:id/status", updateExecutionStatus);

export default router;
