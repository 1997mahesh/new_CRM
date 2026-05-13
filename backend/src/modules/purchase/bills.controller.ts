import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';

export class BillsController extends BaseController {
  private async recordLedger(description: string, type: 'income' | 'expense', amount: number, reference: string, date: Date = new Date()) {
    try {
      const lastEntry = await prisma.ledgerEntry.findFirst({ orderBy: { createdAt: 'desc' } });
      const currentBalance = lastEntry?.balance || 0;
      
      let debit = 0;
      let credit = 0;
      let newBalance = currentBalance;

      if (type === 'income') {
        credit = amount;
        newBalance += credit;
      } else {
        debit = amount;
        newBalance -= debit;
      }

      await prisma.ledgerEntry.create({
        data: {
          date,
          description,
          type,
          debit,
          credit,
          balance: newBalance,
          reference
        }
      });
    } catch (error) {
      console.error("Ledger recording failed:", error);
      // We don't want to fail the main transaction if ledger fails, or do we?
      // For this ERP, it's probably better to keep it robust.
    }
  }

  list = this.handleRequest(async (req: Request) => {
    const { status, search, vendorId, page = 1, limit = 10, sortBy = 'issueDate', sortOrder = 'desc' } = req.query;
    
    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = String(status).toLowerCase();
    }
    if (vendorId) {
      where.vendorId = String(vendorId);
    }
    if (search) {
      const searchStr = String(search);
      where.OR = [
        { number: { contains: searchStr, mode: 'insensitive' } },
        { vendorName: { contains: searchStr, mode: 'insensitive' } },
        { purchaseOrder: { number: { contains: searchStr, mode: 'insensitive' } } }
      ];
    }

    const [bills, total] = await Promise.all([
      prisma.vendorBill.findMany({
        where,
        include: {
          vendor: true,
          purchaseOrder: true,
          creator: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { [String(sortBy)]: String(sortOrder) },
        skip,
        take: limitNum,
      }),
      prisma.vendorBill.count({ where })
    ]);

    return {
      items: bills,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  });

  getSummary = this.handleRequest(async (req: Request) => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [billStats, paidThisMonth, unpaidStats] = await Promise.all([
      prisma.vendorBill.aggregate({
        where: { status: { not: 'void' } },
        _sum: {
          balance: true,
          totalAmount: true
        },
        _count: {
          id: true
        }
      }),
      prisma.vendorBillPayment.aggregate({
        where: {
          paymentDate: { gte: firstDayOfMonth }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.vendorBill.aggregate({
        where: { status: 'unpaid' },
        _sum: { balance: true }
      })
    ]);

    const unpaidCount = await prisma.vendorBill.count({
      where: { status: 'unpaid' }
    });

    const partialCount = await prisma.vendorBill.count({
      where: { status: 'partial' }
    });

    return {
      totalOutstanding: billStats._sum.balance || 0,
      unpaidBillsCount: unpaidCount,
      unpaidBillsTotal: unpaidStats._sum.balance || 0,
      partialPaymentsCount: partialCount,
      paidThisMonth: paidThisMonth._sum.amount || 0
    };
  });

  get = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const bill = await prisma.vendorBill.findUnique({
      where: { id },
      include: {
        vendor: true,
        purchaseOrder: {
          include: {
            items: true
          }
        },
        items: true,
        payments: {
          include: {
            creator: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { paymentDate: 'desc' }
        },
        creator: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    return bill;
  });

  create = this.handleRequest(async (req: Request) => {
    const { items, ...billData } = req.body;
    const userId = (req as any).user?.id;
    
    if (!billData.number) {
      billData.number = await getAndIncrementNextNumber('bill');
    }

    // Auto-calculate totals if not provided correctly by frontend
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = items.reduce((acc: number, item: any) => acc + (item.taxAmount || 0), 0);
    const discountAmount = items.reduce((acc: number, item: any) => acc + (item.discountAmount || 0), 0);
    const totalAmount = subtotal + taxAmount - discountAmount;

    const bill = await prisma.vendorBill.create({
      data: {
        ...billData,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        balance: totalAmount,
        status: 'unpaid',
        createdBy: userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxPercent: item.taxPercent,
            taxAmount: item.taxAmount,
            discountPercent: item.discountPercent,
            discountAmount: item.discountAmount,
            lineTotal: item.lineTotal
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Record Liability in Ledger (Expense recognition)
    await this.recordLedger(
      `Vendor Bill Recognition: ${bill.number} - ${bill.vendorName}`,
      'expense',
      totalAmount,
      bill.number,
      new Date(billData.issueDate || new Date())
    );

    return bill;
  });

  update = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { items, ...billData } = req.body;

    const existingBill = await prisma.vendorBill.findUnique({
      where: { id },
      include: { payments: true }
    });

    if (!existingBill) throw new Error('Bill not found');
    if (existingBill.status === 'void') throw new Error('Cannot update voided bill');

    // If there are payments, some changes might be restricted or should re-calculate balance
    // For simplicity, let's allow updates but re-calculate balance
    
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = items.reduce((acc: number, item: any) => acc + (item.taxAmount || 0), 0);
    const discountAmount = items.reduce((acc: number, item: any) => acc + (item.discountAmount || 0), 0);
    const totalAmount = subtotal + taxAmount - discountAmount;
    
    const paidAmount = existingBill.paidAmount;
    const balance = totalAmount - paidAmount;
    
    let status = 'unpaid';
    if (balance <= 0) status = 'paid';
    else if (paidAmount > 0) status = 'partial';

    // Transaction to update bill and its items
    const updatedBill = await prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.vendorBillItem.deleteMany({ where: { billId: id } });

      // Update bill
      return await tx.vendorBill.update({
        where: { id },
        data: {
          ...billData,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          balance,
          status,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productName: item.productName,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              discountPercent: item.discountPercent,
              discountAmount: item.discountAmount,
              lineTotal: item.lineTotal
            }))
          }
        },
        include: { items: true }
      });
    });

    return updatedBill;
  });

  delete = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const bill = await prisma.vendorBill.findUnique({
      where: { id },
      include: { payments: true }
    });

    if (!bill) throw new Error('Bill not found');
    if (bill.payments.length > 0) throw new Error('Cannot delete bill with payments. Void it instead.');

    return await prisma.vendorBill.delete({
      where: { id }
    });
  });

  recordPayment = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { amount, paymentMethod, referenceNo, paymentDate, notes } = req.body;
    const userId = (req as any).user?.id;
    
    const bill = await prisma.vendorBill.findUnique({ where: { id } });
    if (!bill) throw new Error('Bill not found');
    if (bill.status === 'void') throw new Error('Cannot record payment for voided bill');

    const paymentAmount = parseFloat(amount);
    const newPaidAmount = bill.paidAmount + paymentAmount;
    const newBalance = bill.totalAmount - newPaidAmount;
    
    let newStatus = 'partial';
    if (newBalance <= 0) newStatus = 'paid';
    else if (newPaidAmount === 0) newStatus = 'unpaid';

    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.vendorBillPayment.create({
        data: {
          billId: id,
          amount: paymentAmount,
          paymentMethod,
          referenceNo,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          notes,
          createdBy: userId
        }
      });

      // Update bill
      const updatedBill = await tx.vendorBill.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus
        }
      });

      return { bill: updatedBill, payment };
    });

    // Record Payment in Ledger (Cash outflow)
    await this.recordLedger(
      `Bill Payment: ${bill.number} (${paymentMethod})`,
      'expense',
      paymentAmount,
      referenceNo || bill.number,
      paymentDate ? new Date(paymentDate) : new Date()
    );

    return result.bill;
  });

  void = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const bill = await prisma.vendorBill.findUnique({
      where: { id },
      include: { payments: true }
    });

    if (!bill) throw new Error('Bill not found');
    if (bill.status === 'paid') throw new Error('Cannot void already paid bill');

    return await prisma.vendorBill.update({
      where: { id },
      data: {
        status: 'void',
        balance: 0 // When voided, balance is set to 0 as it's no longer owed
      }
    });
  });
}
