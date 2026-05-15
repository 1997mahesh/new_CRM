import { Router } from 'express';
import { TicketsController } from './tickets.controller.js';

const router = Router();
const controller = new TicketsController();

router.get('/', controller.getAll);
router.get('/stats', controller.getDashboardStats);
router.post('/seed', controller.seed);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', controller.updateStatus);
router.patch('/:id/priority', controller.updatePriority);
router.patch('/:id/assign', controller.updateAssignee);
router.post('/:id/reopen', controller.reopen);
router.post('/:id/notes', controller.addNote);
router.post('/:id/messages', controller.sendMessage);
router.post('/:id/duplicate', controller.duplicate);
router.delete('/:id', controller.delete);

export default router;
