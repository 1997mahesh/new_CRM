import prisma from '../prisma/index.js';
import { logger } from './logger.js';

export const auditLog = async (
  userId: string | null,
  action: string,
  module: string,
  details?: string,
  ipAddress?: string
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        module,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    logger.error('Failed to create audit log', error);
  }
};
