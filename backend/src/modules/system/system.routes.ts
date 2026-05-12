import { Router } from 'express';
import * as systemController from './system.controller.js';
import * as settingsController from './settings.controller.js';
import * as modulesLogsController from './modules-logs.controller.js';

const router = Router();

// General & System
router.get('/settings', systemController.getSettings);
router.post('/settings', systemController.updateSettings);
router.get('/info', systemController.getSystemInfo);
router.post('/clear-cache', systemController.clearCache);

// Currencies
router.get('/currencies', settingsController.getCurrencies);
router.post('/currencies', settingsController.createCurrency);
router.put('/currencies/:id', settingsController.updateCurrency);
router.delete('/currencies/:id', settingsController.deleteCurrency);

// Tax Rates
router.get('/tax-rates', settingsController.getTaxRates);
router.post('/tax-rates', settingsController.createTaxRate);
router.put('/tax-rates/:id', settingsController.updateTaxRate);
router.delete('/tax-rates/:id', settingsController.deleteTaxRate);

// Email Templates
router.get('/email-templates', settingsController.getEmailTemplates);
router.post('/email-templates', settingsController.createEmailTemplate);
router.put('/email-templates/:id', settingsController.updateEmailTemplate);
router.delete('/email-templates/:id', settingsController.deleteEmailTemplate);

// Number Series
router.get('/number-series', settingsController.getNumberSeries);
router.get('/number-series/next/:key', settingsController.getNextNumber);
router.put('/number-series/:id', settingsController.updateNumberSeries);

// Modules
router.get('/modules', modulesLogsController.getModules);
router.put('/modules/:id', modulesLogsController.toggleModule);

// Audit Logs
router.get('/audit-logs', modulesLogsController.getAuditLogs);

export default router;
