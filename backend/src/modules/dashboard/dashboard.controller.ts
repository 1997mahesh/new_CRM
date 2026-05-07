import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class DashboardController extends BaseController {
  getStats = this.handleRequest(async (req: Request) => {
    // Current month range
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [
      totalLeads,
      newLeadsToday,
      openInvoices,
      overdueInvoices,
      totalRevenuePaid,
      totalRevenuePending,
      openTickets,
      overdueTickets,
      lowStockCount,
      totalExpenses,
      totalAPOutstanding,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(now.setHours(0,0,0,0))
          }
        }
      }),
      prisma.invoice.count({ where: { status: 'unpaid' } }),
      prisma.invoice.count({ 
        where: { 
          status: 'unpaid',
          dueDate: { lt: new Date() }
        } 
      }),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'paid' }
      }),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'unpaid' }
      }),
      prisma.ticket.count({ where: { status: 'Open' } }),
      prisma.ticket.count({ 
        where: { 
          status: 'Open',
          updatedAt: { lt: new Date(Date.now() - 48 * 60 * 60 * 1000) } // 48h limit
        } 
      }),
      prisma.inventory.count({
        where: {
          quantity: { lt: 10 } // Simplified low stock
        }
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: firstDayMonth }
        }
      }),
      prisma.purchaseOrder.aggregate({
        _sum: { amount: true },
        where: { status: 'Pending' }
      })
    ]);

    // Mock revenue growth for chart (normally would be aggregated query)
    const mockRevenueData = [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 48000 },
      { month: "Apr", revenue: 61000 },
      { month: "May", revenue: 55000 },
      { month: "Jun", revenue: 67000 },
      { month: "Jul", revenue: 72000 },
      { month: "Aug", revenue: 68000 },
      { month: "Sep", revenue: 75000 },
      { month: "Oct", revenue: 82000 },
      { month: "Nov", revenue: 79000 },
      { month: "Dec", revenue: (totalRevenuePaid._sum.totalAmount || 0) + (totalRevenuePending._sum.totalAmount || 0) },
    ];

    return {
      stats: {
        revenueMTD: totalRevenuePaid._sum.totalAmount || 0,
        openInvoices,
        overdueInvoices,
        pipelineLeads: totalLeads,
        newLeadsToday,
        openTickets,
        overdueTickets,
        lowStockCount,
        pendingRevenue: totalRevenuePending._sum.totalAmount || 0,
        expensesMTD: totalExpenses._sum.amount || 0,
        apOutstanding: totalAPOutstanding._sum.amount || 0,
        spendMTD: (totalExpenses._sum.amount || 0) + (totalAPOutstanding._sum.amount || 0)
      },
      revenueChart: mockRevenueData
    };
  });
}
