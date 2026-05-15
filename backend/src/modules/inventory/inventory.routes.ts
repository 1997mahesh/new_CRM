import { Router } from 'express';
import { InventoryController } from './inventory.controller.js';

const router = Router();
const controller = new InventoryController();

router.get('/', controller.list);
router.get('/dashboard', controller.dashboard);
router.get('/warehouses', controller.warehouses);
router.get('/categories', controller.categories);
router.post('/categories', controller.createCategory);
router.put('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);
router.post('/adjust-stock', controller.adjustStock);
router.get('/movements', controller.movementHistory);
router.get('/products', controller.list);
router.get('/products/:id', controller.get);
router.post('/products', controller.create);
router.put('/products/:id', controller.update);
router.delete('/products/:id', controller.delete);
router.post('/products/:id/adjust', controller.adjustStock);

export default router;
