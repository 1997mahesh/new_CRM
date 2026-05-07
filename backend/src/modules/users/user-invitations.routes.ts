import { Router } from 'express';
import { UserInvitationsController } from './user-invitations.controller.js';

const router = Router();
const controller = new UserInvitationsController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

export default router;
