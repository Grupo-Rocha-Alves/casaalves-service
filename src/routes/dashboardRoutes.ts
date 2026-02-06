import { Router } from 'express';
import { getDashboard } from '../controller/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/getDashboard', authMiddleware(1), getDashboard);

export default router;
