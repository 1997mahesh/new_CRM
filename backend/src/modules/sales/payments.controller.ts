import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export class PaymentsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, method, search, page = 1, limit = 10, startDate, endDate, minAmount, maxAmount, customerId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (method && method !== 'all') where.method = method;
    if (customerId) where.customerId = customerId;
    
    if (search) {
      where.OR = [
        { receiptNumber: { contains: search as string, mode: 'insensitive' } },
        { reference: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { invoice: { number: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount as string);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount as string);
    }

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { invoice: true },
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.payment.count({ where })
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

  getStats = this.handleRequest(async (req: Request) => {
    const now = new Date();
    const mtdStart = startOfMonth(now);
    const mtdEnd = endOfMonth(now);
    
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Total Collections MTD
    const mtdCollections = await prisma.payment.aggregate({
      where: {
        status: 'Success',
        date: { gte: mtdStart, lte: mtdEnd }
      },
      _sum: { amount: true }
    });

    // Last Month Collections for growth
    const lastMonthCollections = await prisma.payment.aggregate({
      where: {
        status: 'Success',
        date: { gte: lastMonthStart, lte: lastMonthEnd }
      },
      _sum: { amount: true }
    });

    const currentMTD = mtdCollections._sum.amount || 0;
    const prevMTD = lastMonthCollections._sum.amount || 0;
    const growth = prevMTD > 0 ? parseFloat(((currentMTD - prevMTD) / prevMTD * 100).toFixed(1)) : 0;

    // Pending Clearances
    const pendingClearances = await prisma.payment.aggregate({
      where: {
        status: { in: ['Pending', 'Processing'] }
      },
      _sum: { amount: true },
      _count: { id: true }
    });

    // Average Payment Time
    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'Success' },
      include: { invoice: true },
      take: 100 
    });

    let totalDiffDays = 0;
    let count = 0;

    successfulPayments.forEach(p => {
      if (p.invoice) {
        const issue = new Date(p.invoice.issueDate).getTime();
        const pay = new Date(p.date).getTime();
        const diff = Math.ceil((pay - issue) / (1000 * 60 * 60 * 24));
        if (diff >= 0) {
          totalDiffDays += diff;
          count++;
        }
      }
    });

    const avgPaymentTime = count > 0 ? (totalDiffDays / count).toFixed(1) : 0;

    return {
      totalMTD: currentMTD,
      growth: growth,
      pendingCount: pendingClearances._count.id || 0,
      pendingAmount: pendingClearances._sum.amount || 0,
      avgTime: avgPaymentTime
    };
  });

  export = this.handleRequest(async (req: Request) => {
    const payments = await prisma.payment.findMany({
      include: { invoice: true },
      orderBy: { date: 'desc' }
    });

    // Simple CSV generation logic
    const header = "Receipt #,Invoice,Customer,Method,Amount,Date,Status,Reference\n";
    const rows = payments.map(p => {
      return `"${p.receiptNumber}","${p.invoice?.number || ''}","${p.customerName || ''}","${p.method}",${p.amount},"${format(new Date(p.date), 'yyyy-MM-dd')}","${p.status}","${p.reference || ''}"`;
    }).join("\n");

    const csvContent = header + rows;
    // In a real app we'd upload to a bucket, but here we can return as a data URL or similar if small
    // For now returning as a data string that the frontend can handle
    const base64 = Buffer.from(csvContent).toString('base64');
    return { url: `data:text/csv;base64,${base64}` };
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { invoice: true }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { invoiceId, amount, date, method, note, reference, status } = req.body;
    const paymentAmount = parseFloat(amount);

    return await prisma.$transaction(async (tx: any) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId }
      });

      if (!invoice) throw new Error('Invoice not found');

      const receiptNumber = await getAndIncrementNextNumber('RCP', tx);

      const payment = await tx.payment.create({
        data: {
          receiptNumber,
          invoiceId,
          customerId: invoice.customerId,
          customerName: invoice.customerName,
          amount: paymentAmount,
          date: (date && date !== "") ? new Date(date) : new Date(),
          method,
          status: status || 'Success',
          note,
          reference
        }
      });

      if (status === 'Success') {
        const newBalance = invoice.balance - paymentAmount;
        let invoiceStatus = invoice.status;
        if (newBalance <= 0) {
          invoiceStatus = 'paid';
        } else {
          invoiceStatus = 'partial';
        }

        await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            balance: newBalance < 0 ? 0 : newBalance,
            status: invoiceStatus
          }
        });
      }

      return payment;
    });
  });

  refund = this.handleRequest(async (req: Request) => {
    const { amount, reason, date } = req.body;
    const paymentId = req.params.id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true }
    });

    if (!payment) throw new Error('Payment not found');
    if (payment.status === 'Refunded') throw new Error('Payment already refunded');

    const refundAmount = parseFloat(amount) || payment.amount;

    return await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'Refunded',
          refundAmount,
          refundDate: (date && date !== "") ? new Date(date) : new Date(),
          refundReason: reason
        }
      });

      // Update invoice balance
      if (payment.invoice) {
        await tx.invoice.update({
          where: { id: payment.invoiceId },
          data: {
            balance: payment.invoice.balance + refundAmount,
            status: 'partial' // Mark as partial since it's no longer fully paid if it was
          }
        });
      }

      return updatedPayment;
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { invoice: true }
    });

    if (!payment) throw new Error('Payment not found');

    return await prisma.$transaction(async (tx) => {
      // Revert invoice balance if payment was Success
      if (payment.status === 'Success' && payment.invoice) {
        await tx.invoice.update({
          where: { id: payment.invoiceId },
          data: {
            balance: payment.invoice.balance + payment.amount,
            status: 'partial'
          }
        });
      }

      return await tx.payment.delete({
        where: { id: req.params.id }
      });
    });
  });
}
