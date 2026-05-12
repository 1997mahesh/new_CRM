import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';

export class OrdersController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'all') {
      where.status = { equals: status as string, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { number: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { title: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.order.count({ where })
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
    return await prisma.order.findUnique({
      where: { id: req.params.id }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, title, issueDate, deliveryDate,
      subtotal, discount, discountType, discountValue, taxAmount, totalAmount, status, items, notes, terms, quotationId 
    } = req.body;
    
    return await prisma.order.create({
      data: {
        number,
        customerId,
        customerName,
        title,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        subtotal: parseFloat(subtotal) || 0,
        discount: parseFloat(discount) || 0,
        discountType: discountType || 'Fixed',
        discountValue: parseFloat(discountValue) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        totalAmount: parseFloat(totalAmount) || 0,
        status: status || 'Draft',
        items: items || [],
        notes,
        terms,
        quotationId
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, title, issueDate, deliveryDate,
      subtotal, discount, discountType, discountValue, taxAmount, totalAmount, status, items, notes, terms 
    } = req.body;
    
    return await prisma.order.update({
      where: { id: req.params.id },
      data: {
        number,
        customerId,
        customerName,
        title,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
        subtotal: subtotal !== undefined ? parseFloat(subtotal) : undefined,
        discount: discount !== undefined ? parseFloat(discount) : undefined,
        discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        taxAmount: taxAmount !== undefined ? parseFloat(taxAmount) : undefined,
        totalAmount: totalAmount !== undefined ? parseFloat(totalAmount) : undefined,
        status,
        items,
        notes,
        terms
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.order.delete({
      where: { id: req.params.id }
    });
  });

  duplicate = this.handleRequest(async (req: Request) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const newNumber = await getAndIncrementNextNumber('order');

    const { id, createdAt, updatedAt, ...data } = order as any;
    
    return await prisma.order.create({
      data: {
        ...data,
        number: newNumber,
        status: 'Draft',
        issueDate: new Date(),
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null
      }
    });
  });
}
