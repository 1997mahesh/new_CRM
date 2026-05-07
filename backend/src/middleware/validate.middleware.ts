import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendResponse, HttpStatus } from '../utils/response.js';

export const validate = (schema: z.ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendResponse(
          res,
          HttpStatus.BAD_REQUEST,
          'Validation failed',
          null,
          error.issues.map((e) => ({
            path: e.path,
            message: e.message,
          }))
        );
      }
      next(error);
    }
  };
};
