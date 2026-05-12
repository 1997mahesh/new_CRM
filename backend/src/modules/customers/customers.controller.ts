import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class CustomersController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { search, status, source, assignedUserId } = req.query as any;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (source && source !== 'all') {
      where.source = source;
    }
    if (assignedUserId && assignedUserId !== 'all') {
      where.assignedUserId = assignedUserId;
    }

    return await prisma.customer.findMany({
      where,
      include: {
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { id, ...data } = req.body;
    
    // Clean up empty strings or 'none' for relations
    const cleanedData: any = { ...data };
    if (cleanedData.assignedUserId === 'none' || cleanedData.assignedUserId === '') {
      cleanedData.assignedUserId = null;
    }

    return await prisma.customer.create({
      data: cleanedData,
      include: {
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { id, ...data } = req.body;
    const updateData: any = { ...data };
    
    if (updateData.assignedUserId === 'none' || updateData.assignedUserId === '') {
      updateData.assignedUserId = null;
    }

    return await prisma.customer.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.customer.delete({
      where: { id: req.params.id }
    });
  });
}
