import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class UsersController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        isActive: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { role: true }
    });
  });
}
