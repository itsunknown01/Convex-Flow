import express from "express";
import workflowRoutes from "./routes/workflow-routes";

const app = express();

app.use("/workflows", workflowRoutes);

app.listen(8000, () => console.log("Server running on port 8000"));
