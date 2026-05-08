import { Request, Response } from 'express';
import prisma from '../../prisma/index.js';
import { sendResponse, HttpStatus } from '../../utils/response.js';

export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const invoices = await prisma.invoice.findMany({ where });
    
    // Revenue stats
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    
    // Invoice Aging
    const now = new Date();
    const aging = {
      current: 0,
      '30_days': 0,
      '60_days': 0,
      '90_plus': 0
    };

    invoices.forEach(inv => {
      if (inv.status !== 'Paid') {
        const diffDays = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 0) aging.current += inv.amount;
        else if (diffDays <= 30) aging['30_days'] += inv.amount;
        else if (diffDays <= 90) aging['60_days'] += inv.amount;
        else aging['90_plus'] += inv.amount;
      }
    });

    // Top Customers (Summary by customerId)
    const customerStats = invoices.reduce((acc: any, inv) => {
      acc[inv.customerId] = (acc[inv.customerId] || 0) + inv.amount;
      return acc;
    }, {});

    const topCustomers = Object.entries(customerStats).map(([id, amount]) => ({ id, amount })).sort((a: any, b: any) => b.amount - a.amount);

    return sendResponse(res, HttpStatus.OK, 'Sales report fetched', {
      stats: {
        totalRevenue,
        paidRevenue,
        outstanding: totalRevenue - paidRevenue
      },
      aging,
      topCustomers,
      invoices
    });
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getPurchaseReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const pos = await prisma.purchaseOrder.findMany({ 
      where,
      include: { vendor: true }
    });

    const totalSpend = pos.reduce((sum, po) => sum + po.amount, 0);
    
    // Vendor reports
    const vendorStats = pos.reduce((acc: any, po) => {
      const name = po.vendor.name;
      acc[name] = (acc[name] || 0) + po.amount;
      return acc;
    }, {});

    const topVendors = Object.entries(vendorStats).map(([name, amount]) => ({ name, amount })).sort((a: any, b: any) => b.amount - a.amount);

    return sendResponse(res, HttpStatus.OK, 'Purchase report fetched', {
      totalSpend,
      topVendors,
      purchaseOrders: pos
    });
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getStockReport = async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.query;
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;

    const inventory = await prisma.inventory.findMany({ 
      where,
      include: { warehouse: true }
    });

    const totalValuation = inventory.reduce((sum, item) => sum + item.valuation, 0);
    const lowStockItems = inventory.filter(item => item.quantity < 10);

    const warehouseDistribution = inventory.reduce((acc: any, item) => {
      const name = item.warehouse.name;
      acc[name] = (acc[name] || 0) + item.valuation;
      return acc;
    }, {});

    return sendResponse(res, HttpStatus.OK, 'Stock report fetched', {
      totalValuation,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      warehouseDistribution,
      inventory
    });
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getFinanceReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Invoices (Income)
    const invoices = await prisma.invoice.findMany({
      where: startDate && endDate ? {
        createdAt: { gte: new Date(startDate as string), lte: new Date(endDate as string) }
      } : {}
    });

    // Expenses (Costs)
    const expenses = await prisma.expense.findMany({
      where: startDate && endDate ? {
        date: { gte: new Date(startDate as string), lte: new Date(endDate as string) }
      } : {}
    });

    const totalIncome = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalIncome - totalExpenses;

    // Outstanding AR/AP
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    
    // For AP we could use Purchase Orders status
    const pos = await prisma.purchaseOrder.findMany({
       where: { status: { not: 'Received' } }
    });
    const outstandingAP = pos.reduce((sum, po) => sum + po.amount, 0);

    return sendResponse(res, HttpStatus.OK, 'Finance report fetched', {
      summary: {
        totalIncome,
        totalExpenses,
        netProfit: profit,
        margin: totalIncome > 0 ? (profit / totalIncome) * 100 : 0
      },
      receivables: unpaidInvoices,
      payables: outstandingAP
    });
  } catch (error: any) {
    return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
