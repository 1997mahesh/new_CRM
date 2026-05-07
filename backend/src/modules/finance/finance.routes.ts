import { Router } from 'express';
import { FinanceDashboardController } from './finance.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new FinanceDashboardController();

router.use(authMiddleware);

router.get('/stats', controller.getStats);

export default router;
