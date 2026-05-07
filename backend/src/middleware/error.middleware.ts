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

  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';

  return sendResponse(res, status, message, null, {
    code: err.code,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
