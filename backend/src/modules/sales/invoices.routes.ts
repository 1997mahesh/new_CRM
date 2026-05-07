import { Router } from 'express';
import { InvoicesController } from './invoices.controller.js';

const router = Router();
const controller = new InvoicesController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
