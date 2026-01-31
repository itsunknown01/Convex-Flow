export type ExecutionStatus =
  | "CREATED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "AWAITING_APPROVAL";

export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  definition: any;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  tenantId: string;
  workflowDefinitionId: string;
  status: ExecutionStatus;
  input?: any;
  output?: any;
  currentStepId?: string;
  state?: any;
  createdAt: string;
  updatedAt: string;
  workflowDefinition?: WorkflowDefinition;
}

export interface Job {
  id: string;
  executionId: string;
  stepId: string;
  type: string;
  input?: any;
  output?: any;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface LedgerEntry {
  id: string;
  tenantId: string;
  previousHash: string;
  hash: string;
  eventType: string;
  data: string;
  createdAt: string;
}
