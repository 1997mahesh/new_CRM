import { Request, Response } from 'express';
import prisma from '../../prisma/index.js';
import { sendResponse, HttpStatus } from '../../utils/response.js';
import { auditLog } from '../../utils/audit.js';

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.appModule.findMany({ orderBy: { name: 'asc' } });
    return sendResponse(res, HttpStatus.OK, 'Modules fetched', modules);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const toggleModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;
    const userId = (req as any).user?.id || null;

    const appModule = await prisma.appModule.update({
      where: { id },
      data: { isEnabled }
    });

    await auditLog(userId, isEnabled ? 'ENABLE_MODULE' : 'DISABLE_MODULE', 'SYSTEM', `Module ${appModule.name} ${isEnabled ? 'enabled' : 'disabled'}`);

    return sendResponse(res, HttpStatus.OK, `Module ${isEnabled ? 'enabled' : 'disabled'}`, appModule);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { userId, module, action } = req.query;
    const where: any = {};
    if (userId) where.userId = userId as string;
    if (module) where.module = module as string;
    if (action) where.action = action as string;

    const logs = await prisma.auditLog.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit for performance
    });

    return sendResponse(res, HttpStatus.OK, 'Audit logs fetched', logs);
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
