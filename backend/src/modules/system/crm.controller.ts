import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';

export class CRMController extends BaseController {
  getCustomers = this.handleRequest(async (req: Request) => {
    // For now, return mock customers as we don't have a dedicated model
    return [
      { id: 'cust-1', name: 'Global Trade Corp', email: 'contact@globaltrade.com' },
      { id: 'cust-2', name: 'TechFlow Solutions', email: 'billing@techflow.io' },
      { id: 'cust-3', name: 'Alpha Tech', email: 'hello@alphatech.com' },
      { id: 'cust-4', name: 'Infinite Soft', email: 'support@infinitesoft.com' },
      { id: 'cust-5', name: 'Zenith Design', email: 'info@zenith.design' },
    ];
  });
}
