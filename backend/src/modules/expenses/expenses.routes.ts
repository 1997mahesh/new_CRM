import { Router } from 'express';
import { ExpenseController } from './expenses.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new ExpenseController();

router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/approve', controller.approve);
router.post('/:id/reject', controller.reject);

export default router;
