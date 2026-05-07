import { Request, Response } from 'express';
import prisma from '../../prisma/index.js';
import { BaseController } from '../../controllers/base.controller.js';

export class TodosController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, priority, groupId, assigneeId, search } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (groupId) where.groupId = groupId;
    if (assigneeId) {
      where.assignees = {
        some: { id: assigneeId as string }
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    return await prisma.todo.findMany({
      where,
      include: {
        group: true,
        assignees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.todo.findUnique({
      where: { id: req.params.id },
      include: {
        group: true,
        assignees: true
      }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { assigneeIds, ...data } = req.body;
    return await prisma.todo.create({
      data: {
        ...data,
        assignees: assigneeIds ? {
          connect: assigneeIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        group: true,
        assignees: true
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { assigneeIds, ...data } = req.body;
    return await prisma.todo.update({
      where: { id: req.params.id },
      data: {
        ...data,
        assignees: assigneeIds ? {
          set: [], // Clear existing
          connect: assigneeIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        group: true,
        assignees: true
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.todo.delete({
      where: { id: req.params.id }
    });
  });
}
