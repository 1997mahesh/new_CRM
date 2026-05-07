import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class DepartmentsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    return await prisma.department.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    return await prisma.department.create({
      data: req.body
    });
  });

  update = this.handleRequest(async (req: Request) => {
    return await prisma.department.update({
      where: { id: req.params.id },
      data: req.body
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.department.delete({
      where: { id: req.params.id }
    });
  });
}
