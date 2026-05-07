import { Request, Response, NextFunction } from 'express';
import { sendResponse, HttpStatus } from '../utils/response.js';

export class BaseController {
  // Generic handler to remove boilerplate
  protected handleRequest(
    handler: (req: Request, res: Response) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await handler(req, res);
        if (result && result.message) {
          return sendResponse(res, result.status || HttpStatus.OK, result.message, result.data);
        }
        return sendResponse(res, HttpStatus.OK, 'Success', result);
      } catch (error) {
        next(error);
      }
    };
  }
}
