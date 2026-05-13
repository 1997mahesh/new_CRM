import { Router } from 'express';
import { PaymentsController } from './payments.controller.js';

const router = Router();
const controller = new PaymentsController();

router.get('/', controller.getAll);
router.get('/stats', controller.getStats);
router.get('/export', controller.export);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/:id/refund', controller.refund);
router.delete('/:id', controller.delete);

export default router;
