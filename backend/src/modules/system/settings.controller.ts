import { Request, Response } from 'express';
import prisma from '../../prisma/index.js';
import { sendResponse, HttpStatus } from '../../utils/response.js';
import { auditLog } from '../../utils/audit.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';

// Currencies
export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await prisma.currency.findMany({ orderBy: { code: 'asc' } });
    return sendResponse(res, HttpStatus.OK, 'Currencies fetched', currencies);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createCurrency = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = (req as any).user?.id || null;

    if (data.isDefault) {
      await prisma.currency.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
    }

    const currency = await prisma.currency.create({ data });
    await auditLog(userId, 'CREATE_CURRENCY', 'SYSTEM', `Created currency ${currency.code}`);
    
    return sendResponse(res, HttpStatus.CREATED, 'Currency created', currency);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = (req as any).user?.id || null;

    if (data.isDefault) {
      await prisma.currency.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
    }

    const currency = await prisma.currency.update({ where: { id }, data });
    await auditLog(userId, 'UPDATE_CURRENCY', 'SYSTEM', `Updated currency ${currency.code}`);

    return sendResponse(res, HttpStatus.OK, 'Currency updated', currency);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;

    const currency = await prisma.currency.delete({ where: { id } });
    await auditLog(userId, 'DELETE_CURRENCY', 'SYSTEM', `Deleted currency ${currency.code}`);

    return sendResponse(res, HttpStatus.OK, 'Currency deleted');
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Tax Rates
export const getTaxRates = async (req: Request, res: Response) => {
  try {
    const rates = await prisma.taxRate.findMany({ orderBy: { name: 'asc' } });
    return sendResponse(res, HttpStatus.OK, 'Tax rates fetched', rates);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createTaxRate = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = (req as any).user?.id || null;

    const rate = await prisma.taxRate.create({ data });
    await auditLog(userId, 'CREATE_TAX_RATE', 'SYSTEM', `Created tax rate ${rate.name}`);

    return sendResponse(res, HttpStatus.CREATED, 'Tax rate created', rate);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateTaxRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = (req as any).user?.id || null;

    const rate = await prisma.taxRate.update({ where: { id }, data });
    await auditLog(userId, 'UPDATE_TAX_RATE', 'SYSTEM', `Updated tax rate ${rate.name}`);

    return sendResponse(res, HttpStatus.OK, 'Tax rate updated', rate);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteTaxRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;

    const rate = await prisma.taxRate.delete({ where: { id } });
    await auditLog(userId, 'DELETE_TAX_RATE', 'SYSTEM', `Deleted tax rate ${rate.name}`);

    return sendResponse(res, HttpStatus.OK, 'Tax rate deleted');
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Email Templates
export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.emailTemplate.findMany({ orderBy: { name: 'asc' } });
    return sendResponse(res, HttpStatus.OK, 'Email templates fetched', templates);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createEmailTemplate = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = (req as any).user?.id || null;

    const template = await prisma.emailTemplate.create({ data });
    await auditLog(userId, 'CREATE_EMAIL_TEMPLATE', 'SYSTEM', `Created email template ${template.name}`);

    return sendResponse(res, HttpStatus.CREATED, 'Email template created', template);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = (req as any).user?.id || null;

    const template = await prisma.emailTemplate.update({ where: { id }, data });
    await auditLog(userId, 'UPDATE_EMAIL_TEMPLATE', 'SYSTEM', `Updated email template ${template.name}`);

    return sendResponse(res, HttpStatus.OK, 'Email template updated', template);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;

    const template = await prisma.emailTemplate.delete({ where: { id } });
    await auditLog(userId, 'DELETE_EMAIL_TEMPLATE', 'SYSTEM', `Deleted email template ${template.name}`);

    return sendResponse(res, HttpStatus.OK, 'Email template deleted');
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Number Series
export const getNumberSeries = async (req: Request, res: Response) => {
  try {
    const series = await prisma.numberSeries.findMany({ orderBy: { name: 'asc' } });
    return sendResponse(res, HttpStatus.OK, 'Number series fetched', series);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateNumberSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = (req as any).user?.id || null;

    const series = await prisma.numberSeries.update({ where: { id }, data });
    await auditLog(userId, 'UPDATE_NUMBER_SERIES', 'SYSTEM', `Updated number series ${series.name}`);

    return sendResponse(res, HttpStatus.OK, 'Number series updated', series);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getNextNumber = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const formatted = await getAndIncrementNextNumber(key);
    return sendResponse(res, HttpStatus.OK, 'Next number fetched', formatted);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
