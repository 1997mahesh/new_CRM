import { Router } from 'express';
import { QuotationsController } from './quotations.controller.js';

const router = Router();
const controller = new QuotationsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/duplicate', controller.duplicate);
router.post('/:id/convert-to-order', controller.convertToOrder);

export default router;
