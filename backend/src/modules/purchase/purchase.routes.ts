import { Router } from 'express';
import { PurchaseController } from './purchase.controller.js';
import { PurchaseOrderController } from './purchase-orders.controller.js';
import { BillsController } from './bills.controller.js';

const router = Router();
const controller = new PurchaseController();
const poController = new PurchaseOrderController();
const billsController = new BillsController();

// Dashboard
router.get('/dashboard-stats', controller.getDashboardStats);
router.get('/spend-analytics', controller.getSpendAnalytics);
router.get('/top-vendors', controller.getTopVendors);
router.get('/overdue-bills', controller.getOverdueBills);
router.get('/pending-pos', controller.getPendingPOs);

// Purchase Orders
router.get('/orders', poController.getAllPOs);
router.get('/orders/:id', poController.getPOById);
router.post('/orders', poController.createPO);
router.put('/orders/:id', poController.updatePO);
router.delete('/orders/:id', poController.deletePO);
router.post('/orders/:id/receive', poController.receivePO);
router.post('/orders/:id/create-bill', poController.createBillFromPO);

// Bills
router.get('/bills', billsController.list);
router.get('/bills/summary', billsController.getSummary);
router.get('/bills/:id', billsController.get);
router.post('/bills', billsController.create);
router.put('/bills/:id', billsController.update);
router.delete('/bills/:id', billsController.delete);
router.post('/bills/:id/payments', billsController.recordPayment);
router.post('/bills/:id/void', billsController.void);

export default router;
