import { Router } from 'express';
import { TodosController } from './todos.controller';

const router = Router();
const controller = new TodosController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
