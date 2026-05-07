import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../../validators/auth.validator.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);
router.post('/logout', authMiddleware, controller.logout);
router.post('/register', validate(registerSchema), controller.register);
router.get('/me', authMiddleware, controller.getMe);

export default router;
