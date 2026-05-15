import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';

export class QuotationsController extends BaseController {
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
      prisma.quotation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.quotation.count({ where })
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
    return await prisma.quotation.findUnique({
      where: { id: req.params.id }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, title, issueDate, validUntil, 
      subtotal, discount, discountType, discountValue, taxAmount, totalAmount, status, items, notes, terms 
    } = req.body;
    
    return await prisma.quotation.create({
      data: {
        number,
        customerId,
        customerName,
        title,
        issueDate: (issueDate && issueDate !== "") ? new Date(issueDate) : new Date(),
        validUntil: (validUntil && validUntil !== "") ? new Date(validUntil) : null,
        subtotal: parseFloat(subtotal) || 0,
        discount: parseFloat(discount) || 0,
        discountType: discountType || 'Fixed',
        discountValue: parseFloat(discountValue) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        totalAmount: parseFloat(totalAmount) || 0,
        status: status || 'Draft',
        items: items || [],
        notes,
        terms
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, title, issueDate, validUntil, 
      subtotal, discount, discountType, discountValue, taxAmount, totalAmount, status, items, notes, terms 
    } = req.body;
    
    return await prisma.quotation.update({
      where: { id: req.params.id },
      data: {
        number,
        customerId,
        customerName,
        title,
        issueDate: (issueDate && issueDate !== "") ? new Date(issueDate) : undefined,
        validUntil: (validUntil && validUntil !== "") ? new Date(validUntil) : undefined,
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
    return await prisma.quotation.delete({
      where: { id: req.params.id }
    });
  });

  duplicate = this.handleRequest(async (req: Request) => {
    const quotation = await prisma.quotation.findUnique({
      where: { id: req.params.id }
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    return await (prisma as any).$transaction(async (tx: any) => {
      // Generate new unique number using series
      const newNumber = await getAndIncrementNextNumber('quotation', tx);

      const { id, createdAt, updatedAt, ...data } = quotation as any;
      
      return await tx.quotation.create({
        data: {
          ...data,
          number: newNumber,
          status: 'Draft',
          issueDate: new Date(),
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days later
        }
      });
    });
  });

  convertToOrder = this.handleRequest(async (req: Request) => {
    const quotation = await prisma.quotation.findUnique({
      where: { id: req.params.id }
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // Check if already converted
    const existingOrder = await prisma.order.findUnique({
      where: { quotationId: quotation.id }
    });

    if (existingOrder) {
      return existingOrder;
    }

    return await (prisma as any).$transaction(async (tx: any) => {
      const orderNumber = await getAndIncrementNextNumber('order', tx);

      const order = await tx.order.create({
        data: {
          number: orderNumber,
          customerId: quotation.customerId,
          customerName: quotation.customerName,
          title: quotation.title,
          issueDate: new Date(),
          subtotal: quotation.subtotal,
          discount: quotation.discount,
          discountType: (quotation as any).discountType || 'Fixed',
          discountValue: (quotation as any).discountValue || 0,
          taxAmount: quotation.taxAmount,
          totalAmount: quotation.totalAmount,
          status: 'Draft',
          items: quotation.items || [],
          notes: quotation.notes,
          terms: quotation.terms,
          quotationId: quotation.id
        }
      });

      // Update quotation status
      await tx.quotation.update({
        where: { id: quotation.id },
        data: { status: 'Accepted' }
      });

      return order;
    });
  });
}
