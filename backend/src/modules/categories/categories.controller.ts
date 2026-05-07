import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class CategoryController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { type } = req.query;
    return await prisma.category.findMany({
      where: type ? { type: type as string } : {},
      orderBy: { name: 'asc' }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.category.findUnique({
      where: { id: req.params.id }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { name, type, description, isActive } = req.body;
    return await prisma.category.create({
      data: { name, type, description, isActive }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { name, type, description, isActive } = req.body;
    return await prisma.category.update({
      where: { id: req.params.id },
      data: { name, type, description, isActive }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.category.delete({
      where: { id: req.params.id }
    });
  });
}
