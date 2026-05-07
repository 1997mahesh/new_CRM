import { Router } from 'express';
import { CRMController } from './crm.controller.js';

const router = Router();
const controller = new CRMController();

router.get('/customers', controller.getCustomers);

export default router;
