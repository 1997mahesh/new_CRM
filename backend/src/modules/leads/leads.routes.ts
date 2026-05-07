import { Router } from 'express';
import { LeadsController } from './leads.controller.js';

const router = Router();
const controller = new LeadsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/stage', controller.updateStage);
router.delete('/:id', controller.delete);

export default router;
