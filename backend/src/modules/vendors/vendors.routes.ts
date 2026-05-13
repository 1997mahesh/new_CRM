import { Router } from 'express';
import { VendorsController } from './vendors.controller.js';

const router = Router();
const controller = new VendorsController();

router.get('/', controller.list);
router.post('/', controller.create);
router.post('/import', controller.import);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.patch('/:id/archive', controller.archive);

export default router;
