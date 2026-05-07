import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class InvoicesController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { number: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { issueDate: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.invoice.count({ where })
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
    return await prisma.invoice.findUnique({
      where: { id: req.params.id }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, issueDate, dueDate, 
      amount, taxAmount, totalAmount, status, items, notes 
    } = req.body;
    
    return await prisma.invoice.create({
      data: {
        number,
        customerId,
        customerName,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: new Date(dueDate),
        amount: parseFloat(amount),
        taxAmount: taxAmount ? parseFloat(taxAmount) : 0,
        totalAmount: parseFloat(totalAmount),
        status: status || 'unpaid',
        items: items || [],
        notes
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, issueDate, dueDate, 
      amount, taxAmount, totalAmount, status, items, notes 
    } = req.body;
    
    return await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        number,
        customerId,
        customerName,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        amount: amount ? parseFloat(amount) : undefined,
        taxAmount: taxAmount ? parseFloat(taxAmount) : undefined,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        status,
        items,
        notes
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.invoice.delete({
      where: { id: req.params.id }
    });
  });
}
