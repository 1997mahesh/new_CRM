import { Request, Response, NextFunction } from 'express';
import { sendResponse, HttpStatus } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, err.stack);

  let status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';

  // Handle Prisma errors
  if (err.code === 'P2002') {
    status = HttpStatus.BAD_REQUEST;
    const targets = err.meta?.target || [];
    message = `Unique constraint failed on field(s): ${targets.join(', ')}`;
    
    // Friendly override for common fields
    if (targets.includes('number')) {
      message = 'The document number already exists. Please refresh or use a different number.';
    } else if (targets.includes('email')) {
      message = 'A user with this email already exists.';
    }
  }

  return sendResponse(res, status, message, null, {
    code: err.code,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
