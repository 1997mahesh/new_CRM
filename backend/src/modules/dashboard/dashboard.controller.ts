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
      openInvoicesCount,
      overdueInvoicesCount,
      totalRevenuePaid,
      totalRevenuePending,
      openTickets,
      overdueTickets,
      lowStockCount,
      totalExpenses,
      totalAPOutstanding,
      pendingTasks,
      completedTasks,
      pipelineValue,
      leadsByStage,
      topCustomers,
      overdueInvoicesList,
      totalRevenueYear,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0,0,0,0))
          }
        }
      }),
      prisma.invoice.count({ where: { status: 'unpaid' } }),
      prisma.invoice.count({ 
        where: { 
          status: 'overdue',
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
      }),
      prisma.todo.count({ where: { status: { in: ['Pending', 'In Progress'] } } }),
      prisma.todo.count({ where: { status: 'Completed' } }),
      prisma.lead.aggregate({
        _sum: { value: true },
        where: { status: 'Open' }
      }),
      prisma.lead.groupBy({
        by: ['pipelineStage'],
        _count: true
      }),
      prisma.invoice.groupBy({
        by: ['customerId', 'customerName'],
        _sum: { totalAmount: true },
        where: { status: 'paid' },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5
      }),
      prisma.invoice.findMany({
        where: { status: 'overdue' },
        orderBy: { dueDate: 'asc' },
        take: 5
      }),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'paid',
          issueDate: {
            gte: new Date(now.getFullYear(), 0, 1)
          }
        }
      })
    ]);

    // Format leads by stage
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    const formattedLeadsByStage = stages.map(stage => {
      const match = leadsByStage.find(l => l.pipelineStage === stage);
      return {
        stage,
        count: match ? match._count : 0,
        percentage: match ? Math.round((match._count / (totalLeads || 1)) * 100) : 0
      };
    });

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
        revenueYTD: totalRevenueYear._sum.totalAmount || 0,
        openInvoices: openInvoicesCount,
        overdueInvoices: overdueInvoicesCount,
        pipelineLeads: totalLeads,
        pipelineValue: pipelineValue._sum.value || 0,
        newLeadsToday,
        openTickets,
        overdueTickets,
        lowStockCount,
        pendingRevenue: totalRevenuePending._sum.totalAmount || 0,
        expensesMTD: totalExpenses._sum.amount || 0,
        apOutstanding: totalAPOutstanding._sum.amount || 0,
        spendMTD: (totalExpenses._sum.amount || 0) + (totalAPOutstanding._sum.amount || 0),
        pendingTasks,
        completedTasks,
        forecast: (pipelineValue._sum.value || 0) * 0.2 // Simplified forecast
      },
      revenueChart: mockRevenueData,
      leadsByStage: formattedLeadsByStage,
      topCustomers: topCustomers.map(c => ({
        name: c.customerName || 'Unknown',
        id: c.customerId,
        revenue: c._sum.totalAmount || 0
      })),
      overdueInvoicesList: overdueInvoicesList
    };
  });
}
