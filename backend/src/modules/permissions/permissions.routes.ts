import { Router } from 'express';
import { PermissionController } from './permissions.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new PermissionController();

router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;
