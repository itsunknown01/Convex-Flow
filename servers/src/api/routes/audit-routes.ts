import { Router } from "express";
import * as AuditController from "../controllers/audit-controller.js";

const router: Router = Router();

router.get("/logs", AuditController.listLogs);

export default router;
