import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class LedgerController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { type, startDate, endDate, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [items, total] = await Promise.all([
      prisma.ledgerEntry.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.ledgerEntry.count({ where })
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

  createEntry = this.handleRequest(async (req: Request) => {
    const { date, description, type, amount, reference } = req.body;
    
    // Calculate new balance
    const lastEntry = await prisma.ledgerEntry.findFirst({ orderBy: { date: 'desc' }, take: 1 });
    const currentBalance = lastEntry?.balance || 0;
    
    let newBalance = currentBalance;
    let debit = 0;
    let credit = 0;

    if (type === 'income') {
      credit = parseFloat(amount);
      newBalance += credit;
    } else {
      debit = parseFloat(amount);
      newBalance -= debit;
    }

    return await prisma.ledgerEntry.create({
      data: {
        date: date ? new Date(date) : new Date(),
        description,
        type,
        debit,
        credit,
        balance: newBalance,
        reference
      }
    });
  });
}
