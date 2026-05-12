import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class ContactsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { search, status, type, assignedUserId, customerId } = req.query as any;

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (type && type !== 'all') {
      where.type = type;
    }
    if (assignedUserId && assignedUserId !== 'all') {
      where.assignedUserId = assignedUserId;
    }
    if (customerId && customerId !== 'all' && customerId !== 'none') {
        where.customerId = customerId;
    }

    return await prisma.contact.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.contact.findUnique({
      where: { id: req.params.id },
      include: {
        customer: {
          select: { id: true, name: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { id, ...data } = req.body;
    
    const cleanedData: any = { ...data };
    if (cleanedData.assignedUserId === 'none' || cleanedData.assignedUserId === '') {
      cleanedData.assignedUserId = null;
    }
    if (cleanedData.customerId === 'none' || cleanedData.customerId === '') {
        cleanedData.customerId = null;
    }

    return await prisma.contact.create({
      data: cleanedData,
      include: {
        customer: {
          select: { id: true, name: true }
        },
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
    if (updateData.customerId === 'none' || updateData.customerId === '') {
        updateData.customerId = null;
    }

    return await prisma.contact.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        customer: {
          select: { id: true, name: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.contact.delete({
      where: { id: req.params.id }
    });
  });
}
