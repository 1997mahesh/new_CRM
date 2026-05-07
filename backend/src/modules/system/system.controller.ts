import { Request, Response } from 'express';
import prisma from '../../prisma/index.js';
import { sendResponse, HttpStatus } from '../../utils/response.js';
import { auditLog } from '../../utils/audit.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const { group } = req.query;
    const where = group ? { group: group as string } : {};
    
    const settings = await prisma.setting.findMany({ where });
    
    // Transform to object for easier frontend use
    const settingsObj = settings.reduce((acc: any, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return sendResponse(res, HttpStatus.OK, 'Settings fetched', settingsObj);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { settings, group } = req.body; // settings is an object of key-value pairs
    const userId = (req as any).user?.id || null;

    const updates = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value), group: group || 'general' },
        create: { key, value: String(value), group: group || 'general' },
      });
    });

    await prisma.$transaction(updates);

    await auditLog(userId, 'UPDATE_SETTINGS', 'SYSTEM', `Updated ${group || 'general'} settings`);

    return sendResponse(res, HttpStatus.OK, 'Settings updated');
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getSystemInfo = async (req: Request, res: Response) => {
  try {
    const info = {
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      dbConnected: true, // If we reached here, DB is likely fine
    };

    return sendResponse(res, HttpStatus.OK, 'System information fetched', info);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const clearCache = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || null;
    
    // Clear Finance Dashboard Cache as an example
    await prisma.financeDashboardCache.deleteMany({});
    
    await auditLog(userId, 'CLEAR_CACHE', 'SYSTEM', 'System cache cleared');

    return sendResponse(res, HttpStatus.OK, 'Cache cleared successfully');
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
