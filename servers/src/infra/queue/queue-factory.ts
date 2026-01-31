import { Queue } from "bullmq";
import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

export const WORKFLOW_QUEUE_NAME = "workflow-queue";

let workflowQueue: Queue | null = null;

export const getWorkflowQueue = (): Queue => {
  if (!workflowQueue) {
    workflowQueue = new Queue(WORKFLOW_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for inspection
      },
    });
  }
  return workflowQueue;
};
