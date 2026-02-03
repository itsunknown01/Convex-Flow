import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./api/routes/auth-routes.js";
import workflowRoutes from "./api/routes/workflow-routes.js";
import auditRoutes from "./api/routes/audit-routes.js";
import { authMiddleware } from "./api/middleware/auth-middleware.js";
import { tenantMiddleware } from "./api/middleware/tenant-middleware.js";
import { db } from "@workspace/database";
import { connection } from "./infra/queue/queue-factory.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Public Routes
app.get("/health", async (req: express.Request, res: express.Response) => {
  try {
    // Check DB
    await db.$queryRaw`SELECT 1`;
    // Check Redis
    await connection.ping();

    res.json({
      status: "ok",
      db: "connected",
      redis: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      status: "error",
      message: error.message,
    });
  }
});

app.use("/auth", authRoutes);

// Protected Routes
app.use(authMiddleware);
app.use(tenantMiddleware);

app.use("/workflows", workflowRoutes);
app.use("/audit", auditRoutes);

app.listen(8000, () => console.log("Server running on port 8000"));
