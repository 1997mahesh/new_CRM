import { Router } from 'express';
import { DepartmentsController } from './departments.controller.js';

const router = Router();
const controller = new DepartmentsController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
