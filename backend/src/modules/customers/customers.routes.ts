import { Router } from 'express';
import { CustomersController } from './customers.controller.js';

const router = Router();
const controller = new CustomersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
