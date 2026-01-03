import { Router } from "express";
import { getLogs } from "../controller/logController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/getAllLogs", authMiddleware(3), getLogs);

export default router;
