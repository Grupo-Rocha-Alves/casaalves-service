import { Router } from "express";
import { getLogs, exportLogsToCSV } from "../controller/logController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/getAllLogs", authMiddleware(3), getLogs);
router.get("/exportLogs", authMiddleware(3), exportLogsToCSV);

export default router;
