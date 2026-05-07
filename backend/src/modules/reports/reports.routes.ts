import { Router } from 'express';
import * as reportsController from './reports.controller.js';

const router = Router();

router.get('/sales', reportsController.getSalesReport);
router.get('/purchase', reportsController.getPurchaseReport);
router.get('/stock', reportsController.getStockReport);
router.get('/finance', reportsController.getFinanceReport);

export default router;
