import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { sendResponse, HttpStatus } from '../utils/response.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, HttpStatus.UNAUTHORIZED, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    };
    next();
  } catch (error) {
    return sendResponse(res, HttpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }
};

import prisma from '../prisma/index.js';

export const checkPermissions = (requiredPermissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          roles: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return sendResponse(res, HttpStatus.UNAUTHORIZED, 'User not found');
      }

      const userPermissions = user.roles.flatMap(role => 
        role.permissions.map(rp => rp.permission.name)
      );
      const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

      if (!hasPermission) {
        return sendResponse(res, HttpStatus.FORBIDDEN, 'Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
