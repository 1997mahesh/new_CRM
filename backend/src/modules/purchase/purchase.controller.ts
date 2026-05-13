import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from 'date-fns';

export class PurchaseController extends BaseController {
  getDashboardStats = this.handleRequest(async (req: Request) => {
    const now = new Date();
    const mtdStart = startOfMonth(now);
    const mtdEnd = endOfMonth(now);
    const ytdStart = startOfYear(now);
    const ytdEnd = endOfYear(now);

    // Filter by vendor if provided
    const { vendorId, fromDate, toDate } = req.query;
    const vId = vendorId && vendorId !== 'all' ? String(vendorId) : undefined;
    
    let dateRangeCondition = {};
    if (fromDate && toDate) {
      const start = new Date(fromDate as string);
      const end = new Date(toDate as string);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        dateRangeCondition = {
          issueDate: {
            gte: start,
            lte: end
          }
        };
      }
    }

    const [spendMTD, spendYTD, openPOs, outstandingBills] = await Promise.all([
      // Spend MTD: total approved POs for current month
      prisma.purchaseOrder.aggregate({
        where: {
          issueDate: { gte: mtdStart, lte: mtdEnd },
          status: { in: ['Confirmed', 'Received'] },
          ...(vId ? { vendorId: vId } : {}),
          ...dateRangeCondition
        },
        _sum: { totalAmount: true }
      }),
      // Spend YTD: total approved POs for current year
      prisma.purchaseOrder.aggregate({
        where: {
          issueDate: { gte: ytdStart, lte: ytdEnd },
          status: { in: ['Confirmed', 'Received'] },
          ...(vId ? { vendorId: vId } : {}),
          ...dateRangeCondition
        },
        _sum: { totalAmount: true }
      }),
      // Open POs: not completed/cancelled
      prisma.purchaseOrder.count({
        where: {
          status: { in: ['Draft', 'Sent', 'Confirmed', 'Pending Approval'] },
          ...(vId ? { vendorId: vId } : {}),
          ...dateRangeCondition
        }
      }),
      // Outstanding Bills: unpaid or partially paid
      prisma.vendorBill.aggregate({
        where: {
          status: { in: ['unpaid', 'partial', 'overdue'] },
          ...(vId ? { vendorId: vId } : {}),
          ...(Object.keys(dateRangeCondition).length > 0 ? {
            dueDate: (dateRangeCondition as any).issueDate
          } : {})
        },
        _sum: { balance: true }
      })
    ]);

    return {
      spendMTD: spendMTD._sum.totalAmount || 0,
      spendYTD: spendYTD._sum.totalAmount || 0,
      openPOs,
      outstandingBills: outstandingBills._sum.balance || 0
    };
  });

  getSpendAnalytics = this.handleRequest(async (req: Request) => {
    const { vendorId } = req.query;
    const vId = vendorId && vendorId !== 'all' ? String(vendorId) : undefined;
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => subMonths(now, 11 - i));
    
    const results = await Promise.all(months.map(async (monthDate) => {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthData = await prisma.purchaseOrder.aggregate({
        where: {
          issueDate: { gte: monthStart, lte: monthEnd },
          status: { in: ['Confirmed', 'Received'] },
          ...(vId ? { vendorId: vId } : {})
        },
        _sum: { totalAmount: true },
        _count: { id: true }
      });
      
      return {
        month: format(monthDate, 'MMM'),
        spend: monthData._sum.totalAmount || 0,
        volume: monthData._count.id || 0
      };
    }));

    return results;
  });

  getTopVendors = this.handleRequest(async (req: Request) => {
    const topVendors = await prisma.purchaseOrder.groupBy({
      by: ['vendorId', 'vendorName'],
      where: {
        status: { in: ['Confirmed', 'Received'] }
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        _sum: {
          totalAmount: 'desc'
        }
      },
      take: 5
    });

    // Get max amount for percentage calculation
    const maxAmount = topVendors[0]?._sum.totalAmount || 1;

    return topVendors.map((v, idx) => ({
      id: v.vendorId,
      name: v.vendorName || 'Unknown Vendor',
      amount: v._sum.totalAmount || 0,
      percentage: Math.round(((v._sum.totalAmount || 0) / maxAmount) * 100),
      color: ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][idx % 5]
    }));
  });

  getOverdueBills = this.handleRequest(async (req: Request) => {
    const now = new Date();
    const overdueBills = await prisma.vendorBill.findMany({
      where: {
        status: { in: ['unpaid', 'partial', 'overdue'] },
        dueDate: { lt: now }
      },
      orderBy: {
        dueDate: 'asc'
      },
      take: 10
    });

    return overdueBills.map(bill => {
      const diffTime = Math.abs(now.getTime() - new Date(bill.dueDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        id: bill.id,
        number: bill.number,
        vendor: bill.vendorName,
        dueDate: bill.dueDate,
        days: diffDays,
        amount: bill.balance,
        status: diffDays > 10 ? 'Critical' : 'Overdue'
      };
    });
  });

  getPendingPOs = this.handleRequest(async (req: Request) => {
    const pendingPOs = await prisma.purchaseOrder.findMany({
      where: {
        status: { in: ['Draft', 'Sent', 'Confirmed', 'Pending Approval'] }
      },
      orderBy: {
        issueDate: 'desc'
      },
      take: 10
    });

    return pendingPOs.map(po => ({
      id: po.id,
      number: po.number,
      vendor: po.vendorName,
      date: po.issueDate,
      amount: po.totalAmount,
      status: po.status
    }));
  });
}
