import { createWorkflowWorker } from "./workflow-worker.js";
import { connection } from "./queue-factory.js";

console.log("Starting Workflow Worker...");

const worker = createWorkflowWorker();

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down worker...");
  await worker.close();
  await connection.quit();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
