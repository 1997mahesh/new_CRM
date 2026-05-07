import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';

const router = Router();
const controller = new DashboardController();

router.get('/stats', controller.getStats);

export default router;
