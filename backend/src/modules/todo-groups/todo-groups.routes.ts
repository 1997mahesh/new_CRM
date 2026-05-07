import { Router } from 'express';
import { TodoGroupsController } from './todo-groups.controller';

const router = Router();
const controller = new TodoGroupsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
