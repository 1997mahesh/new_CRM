import { Router } from 'express';
import { UsersController } from './users.controller.js';

const router = Router();
const controller = new UsersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
