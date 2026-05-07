import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class ExpenseController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, categoryId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [items, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.expense.count({ where })
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
    return await prisma.expense.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { amount, date, description, categoryId, status, paymentMethod, merchant, reference, receiptUrl } = req.body;
    return await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        description,
        categoryId,
        status: status || 'draft',
        paymentMethod,
        merchant,
        reference,
        receiptUrl
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { amount, date, description, categoryId, status, paymentMethod, merchant, reference, receiptUrl } = req.body;
    return await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        description,
        categoryId,
        status,
        paymentMethod,
        merchant,
        reference,
        receiptUrl
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.expense.delete({
      where: { id: req.params.id }
    });
  });

  approve = this.handleRequest(async (req: any) => {
    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        status: 'approved',
        approvedBy: req.user.id,
        approvalDate: new Date()
      }
    });

    // Create ledger entry upon approval
    const lastEntry = await prisma.ledgerEntry.findFirst({ orderBy: { date: 'desc' } });
    const balance = (lastEntry?.balance || 0) - expense.amount;

    await prisma.ledgerEntry.create({
      data: {
        date: expense.date,
        description: `Expense approved: ${expense.description || expense.merchant || 'No description'}`,
        type: 'expense',
        debit: expense.amount,
        balance,
        reference: expense.id
      }
    });

    return expense;
  });

  reject = this.handleRequest(async (req: any) => {
    const { reason } = req.body;
    return await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user.id,
        approvalDate: new Date()
      }
    });
  });
}
