import { Router } from 'express';
import { sendResponse, HttpStatus } from '../utils/response.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  return sendResponse(res, HttpStatus.OK, 'System is healthy');
});

// Import module routes
import authRoutes from '../modules/auth/auth.routes.js';
import roleRoutes from '../modules/roles/roles.routes.js';
import permissionRoutes from '../modules/permissions/permissions.routes.js';
import categoryRoutes from '../modules/categories/categories.routes.js';
import expenseRoutes from '../modules/expenses/expenses.routes.js';
import ledgerRoutes from '../modules/ledger/ledger.routes.js';
import financeRoutes from '../modules/finance/finance.routes.js';
import reportsRoutes from '../modules/reports/reports.routes.js';
import systemRoutes from '../modules/system/system.routes.js';
import leadsRoutes from '../modules/leads/leads.routes.js';
import invoiceRoutes from '../modules/sales/invoices.routes.js';
import ticketsRoutes from '../modules/support/tickets.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import userRoutes from '../modules/users/users.routes.js';
import departmentRoutes from '../modules/departments/departments.routes.js';
import locationRoutes from '../modules/locations/locations.routes.js';
import userInvitationRoutes from '../modules/users/user-invitations.routes.js';
import crmRoutes from '../modules/system/crm.routes.js';
import todoRoutes from '../modules/todos/todos.routes.js';
import todoGroupRoutes from '../modules/todo-groups/todo-groups.routes.js';

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/user-invitations', userInvitationRoutes);
router.use('/departments', departmentRoutes);
router.use('/locations', locationRoutes);
router.use('/crm', crmRoutes);
router.use('/todos', todoRoutes);
router.use('/todo-groups', todoGroupRoutes);
router.use('/permissions', permissionRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/finance', financeRoutes);
router.use('/reports', reportsRoutes);
router.use('/system', systemRoutes);
router.use('/leads', leadsRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/dashboard', dashboardRoutes);

// Temporary routes for modules requested
const modules = [
  'dashboard', 'documentation'
];

modules.forEach(moduleName => {
  router.get(`/${moduleName}`, (req, res) => {
    sendResponse(res, HttpStatus.OK, `${moduleName} module API reachable`);
  });
});

export default router;
