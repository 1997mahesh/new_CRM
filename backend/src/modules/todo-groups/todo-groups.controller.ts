import { Request, Response } from 'express';
import prisma from '../../prisma/index.js';
import { BaseController } from '../../controllers/base.controller.js';

export class TodoGroupsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    return await prisma.todoGroup.findMany({
      include: {
        _count: {
          select: { todos: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.todoGroup.findUnique({
      where: { id: req.params.id },
      include: {
        todos: {
          include: { assignees: true }
        }
      }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    return await prisma.todoGroup.create({
      data: req.body
    });
  });

  update = this.handleRequest(async (req: Request) => {
    return await prisma.todoGroup.update({
      where: { id: req.params.id },
      data: req.body
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    // Delete todos first or let prisma handle it if configured
    await prisma.todo.deleteMany({
      where: { groupId: req.params.id }
    });
    return await prisma.todoGroup.delete({
      where: { id: req.params.id }
    });
  });
}
