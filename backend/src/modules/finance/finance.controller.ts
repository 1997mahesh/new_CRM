import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';

export class FinanceDashboardController extends BaseController {
  getStats = this.handleRequest(async (req: Request) => {
    const now = new Date();
    const mtdStart = startOfMonth(now);
    const mtdEnd = endOfMonth(now);
    const ytdStart = startOfYear(now);
    const ytdEnd = endOfYear(now);

    // MTD Expenses
    const mtdExpensesAgg = await prisma.expense.aggregate({
      where: {
        status: 'approved',
        date: { gte: mtdStart, lte: mtdEnd }
      },
      _sum: { amount: true }
    });

    // YTD Expenses
    const ytdExpensesAgg = await prisma.expense.aggregate({
      where: {
        status: 'approved',
        date: { gte: ytdStart, lte: ytdEnd }
      },
      _sum: { amount: true }
    });

    // Pending Approvals
    const pendingApprovalsCount = await prisma.expense.count({
      where: { status: 'pending' }
    });

    // Recent Expenses
    const recentExpenses = await prisma.expense.findMany({
      take: 5,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    // Monthly Expense Trend (Last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const agg = await prisma.expense.aggregate({
        where: {
          status: 'approved',
          date: { gte: start, lte: end }
        },
        _sum: { amount: true }
      });
      monthlyTrend.push({
        month: d.toLocaleString('default', { month: 'short' }),
        amount: agg._sum.amount || 0
      });
    }

    // Category Distribution
    const categories = await prisma.category.findMany({
      where: { type: 'expense' },
      include: {
        _count: {
          select: { expenses: { where: { status: 'approved' } } }
        },
        expenses: {
          where: { status: 'approved' },
          select: { amount: true }
        }
      }
    });

    const categoryStats = categories.map(c => ({
      name: c.name,
      amount: c.expenses.reduce((sum, e) => sum + e.amount, 0),
      count: c._count.expenses
    })).filter(c => c.amount > 0);

    return {
      mtdExpenses: mtdExpensesAgg._sum.amount || 0,
      ytdExpenses: ytdExpensesAgg._sum.amount || 0,
      pendingApprovals: pendingApprovalsCount,
      recentExpenses,
      monthlyTrend,
      categoryStats
    };
  });
}
