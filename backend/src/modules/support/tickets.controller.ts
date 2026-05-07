import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class TicketsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, priority, department, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (department) where.department = department;
    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: { assignedUser: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.ticket.count({ where })
    ]);

    return {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    };
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: { assignedUser: true }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      subject, customerId, customerName, department, 
      priority, assignedUserId, description, attachmentUrl, status 
    } = req.body;
    
    return await prisma.ticket.create({
      data: {
        subject,
        customerId: customerId || null,
        customerName,
        department,
        priority: priority || 'Medium',
        assignedUserId: assignedUserId || null,
        description,
        attachmentUrl,
        status: status || 'Open'
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      subject, customerId, customerName, department, 
      priority, assignedUserId, description, attachmentUrl, status 
    } = req.body;
    
    return await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        subject,
        customerId: customerId || null,
        customerName,
        department,
        priority,
        assignedUserId: assignedUserId || null,
        description,
        attachmentUrl,
        status
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.ticket.delete({
      where: { id: req.params.id }
    });
  });
}
