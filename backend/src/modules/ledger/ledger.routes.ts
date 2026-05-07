import { Router } from 'express';
import { LedgerController } from './ledger.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new LedgerController();

router.use(authMiddleware);

router.get('/', controller.getAll);
router.post('/', controller.createEntry);

export default router;
