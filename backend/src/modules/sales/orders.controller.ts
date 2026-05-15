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
        issueDate: (issueDate && issueDate !== "") ? new Date(issueDate) : new Date(),
        deliveryDate: (deliveryDate && deliveryDate !== "") ? new Date(deliveryDate) : null,
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
        issueDate: (issueDate && issueDate !== "") ? new Date(issueDate) : undefined,
        deliveryDate: (deliveryDate && deliveryDate !== "") ? new Date(deliveryDate) : undefined,
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

    return await (prisma as any).$transaction(async (tx: any) => {
      const newNumber = await getAndIncrementNextNumber('order', tx);

      const { id, createdAt, updatedAt, ...data } = order as any;
      
      return await tx.order.create({
        data: {
          ...data,
          number: newNumber,
          status: 'Draft',
          issueDate: new Date(),
          deliveryDate: (data.deliveryDate && data.deliveryDate !== "") ? new Date(data.deliveryDate) : null
        }
      });
    });
  });

  fulfill = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) throw new Error('Order not found');
    if (order.status === 'Shipped' || order.status === 'Delivered') {
        throw new Error('Order already fulfilled');
    }

    const items = order.items as any[] || [];

    await (prisma as any).$transaction(async (tx: any) => {
      for (const item of items) {
        if (item.productId) {
          const product = await tx.inventory.findUnique({
            where: { id: item.productId }
          });

          if (product) {
            const warehouseId = product.warehouseId || (await tx.warehouse.findFirst())?.id;
            
            await tx.inventory.update({
              where: { id: item.productId },
              data: {
                currentStock: { decrement: Math.floor(item.quantity) },
                status: ((product.currentStock - Math.floor(item.quantity)) <= 0) ? 'Out of Stock' : 
                        ((product.currentStock - Math.floor(item.quantity)) <= product.minimumStock) ? 'Low Stock' : 'In Stock'
              }
            });

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                type: 'OUT',
                quantity: Math.floor(item.quantity),
                warehouseId: warehouseId!,
                referenceType: 'SALES_ORDER',
                referenceId: order.number,
                cost: product.costPrice,
                createdBy: userId,
                date: new Date()
              }
            });
          }
        }
      }

      await tx.order.update({
        where: { id },
        data: { status: 'Shipped' }
      });
    });

    return { message: 'Order fulfilled and stock updated' };
  });
}
