import { Router } from 'express';
import { ContactsController } from './contacts.controller.js';

const router = Router();
const controller = new ContactsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
