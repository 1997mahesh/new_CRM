import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';

export class InvoicesController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { number: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { payments: true },
        orderBy: { issueDate: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.invoice.count({ where })
    ]);

    // Calculate aging summary
    const today = new Date();
    const allUnpaid = await prisma.invoice.findMany({
      where: { 
        status: { notIn: ['paid', 'void', 'draft'] },
        balance: { gt: 0 }
      }
    });

    const agingSummary = {
      current: 0,
      oneToThirty: 0,
      thirtyToSixty: 0,
      sixtyPlus: 0,
      totalOverdue: 0
    };

    allUnpaid.forEach(inv => {
      const dueDate = new Date(inv.dueDate);
      const diffDays = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        agingSummary.current += inv.balance || 0;
      } else {
        agingSummary.totalOverdue += inv.balance || 0;
        if (diffDays <= 30) agingSummary.oneToThirty += inv.balance || 0;
        else if (diffDays <= 60) agingSummary.thirtyToSixty += inv.balance || 0;
        else agingSummary.sixtyPlus += inv.balance || 0;
      }
    });

    return {
      items,
      summary: agingSummary,
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
      where: { id: req.params.id },
      include: { payments: { orderBy: { date: 'desc' } } }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, issueDate, dueDate, 
      amount, discount, discountType, discountValue, taxAmount, totalAmount, status, items, notes, terms, orderId 
    } = req.body;
    
    return await prisma.invoice.create({
      data: {
        number,
        customerId,
        customerName,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: new Date(dueDate),
        amount: parseFloat(amount),
        discount: parseFloat(discount || 0),
        discountType: discountType || 'Fixed',
        discountValue: parseFloat(discountValue || 0),
        taxAmount: taxAmount ? parseFloat(taxAmount) : 0,
        totalAmount: parseFloat(totalAmount),
        balance: parseFloat(totalAmount),
        status: status || 'draft',
        items: items || [],
        notes,
        terms,
        orderId
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      number, customerId, customerName, issueDate, dueDate, 
      amount, discount, discountType, discountValue, taxAmount, totalAmount, status, items, notes, terms, orderId 
    } = req.body;
    
    // If updating total amount, we should also update balance, but this is tricky if payments exist.
    // In a real app, you'd recalculate balance based on payments.
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { payments: true }
    });

    if (!invoice) throw new Error('Invoice not found');

    const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);
    const newTotalAmount = totalAmount ? parseFloat(totalAmount) : invoice.totalAmount;
    const newBalance = newTotalAmount - totalPaid;

    return await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        number,
        customerId,
        customerName,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        amount: amount ? parseFloat(amount) : undefined,
        discount: discount !== undefined ? parseFloat(discount) : undefined,
        discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        taxAmount: taxAmount !== undefined ? parseFloat(taxAmount) : undefined,
        totalAmount: newTotalAmount,
        balance: newBalance,
        status,
        items,
        notes,
        terms,
        orderId
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    // Delete payments first
    await prisma.payment.deleteMany({ where: { invoiceId: req.params.id } });
    return await prisma.invoice.delete({
      where: { id: req.params.id }
    });
  });

  recordPayment = this.handleRequest(async (req: Request) => {
    const { amount, date, method, note, reference } = req.body;
    const invoiceId = req.params.id;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true }
    });

    if (!invoice) throw new Error('Invoice not found');

    const paymentAmount = parseFloat(amount);
    const newBalance = invoice.balance - paymentAmount;

    let status = invoice.status;
    if (newBalance <= 0) {
      status = 'paid';
    } else {
      status = 'partial';
    }

    return await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoiceId,
          amount: paymentAmount,
          date: date ? new Date(date) : new Date(),
          method,
          note,
          reference
        }
      }),
      prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          balance: newBalance < 0 ? 0 : newBalance,
          status
        }
      })
    ]);
  });

  voidInvoice = this.handleRequest(async (req: Request) => {
    return await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status: 'void' }
    });
  });

  duplicate = this.handleRequest(async (req: Request) => {
    const original = await prisma.invoice.findUnique({
      where: { id: req.params.id }
    });

    if (!original) throw new Error('Invoice not found');

    const number = await getAndIncrementNextNumber('invoice');

    return await prisma.invoice.create({
      data: {
        number,
        customerId: original.customerId,
        customerName: original.customerName,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        amount: original.amount,
        discount: original.discount,
        discountType: original.discountType,
        discountValue: original.discountValue,
        taxAmount: original.taxAmount,
        totalAmount: original.totalAmount,
        balance: original.totalAmount,
        status: 'draft',
        items: original.items || [],
        notes: original.notes,
        terms: original.terms,
        orderId: original.orderId
      }
    });
  });

  createFromOrder = this.handleRequest(async (req: Request) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const number = await getAndIncrementNextNumber('invoice');

    return await prisma.invoice.create({
      data: {
        number,
        customerId: order.customerId,
        customerName: order.customerName,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days later
        amount: order.subtotal,
        discount: order.discount,
        discountType: order.discountType,
        discountValue: order.discountValue,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        balance: order.totalAmount,
        status: 'sent', // Automatically set to sent when created from order usually
        items: order.items || [],
        notes: order.notes,
        terms: order.terms,
        orderId: order.id
      }
    });
  });
}
