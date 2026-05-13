import { Router } from 'express';
import { OrdersController } from './orders.controller.js';

const router = Router();
const controller = new OrdersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/duplicate', controller.duplicate);
router.post('/:id/fulfill', controller.fulfill);

export default router;
