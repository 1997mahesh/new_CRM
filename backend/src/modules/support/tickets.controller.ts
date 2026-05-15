import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';

export class TicketsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { 
      status, priority, department, category, source, search, 
      assignedUserId, customerId, overdue, resolved, dateRange,
      page = 1, limit = 10 
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'all' && status !== 'all_status') where.status = status;
    if (priority && priority !== 'all' && priority !== 'all_priority') where.priority = priority;
    if (department && department !== 'all' && department !== 'all_dept') where.department = department;
    if (category && category !== 'all' && category !== 'all_category') where.category = category;
    if (source && source !== 'all' && source !== 'all_source') where.source = source;
    if (customerId) where.customerId = customerId;
    
    if (assignedUserId === 'null' || assignedUserId === 'unassigned') {
      where.assignedUserId = null;
    } else if (assignedUserId && assignedUserId !== 'all' && assignedUserId !== 'all_agent') {
      where.assignedUserId = assignedUserId;
    }

    // Date Range filtering
    if (dateRange && dateRange !== 'all' && dateRange !== 'all_time' && dateRange !== 'all_date') {
      const now = new Date();
      if (dateRange === 'today') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        where.createdAt = { gte: start };
      } else if (dateRange === 'yesterday') {
        const start = new Date();
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        where.createdAt = { gte: start, lte: end };
      } else if (dateRange === 'week') {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        where.createdAt = { gte: start };
      } else if (dateRange === 'month') {
        const start = new Date();
        start.setMonth(now.getMonth() - 1);
        where.createdAt = { gte: start };
      }
    }

    if (overdue === 'true') {
      where.status = { notIn: ['Solved', 'Closed'] };
      where.slaDueDate = { lt: new Date() };
    }

    if (resolved === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.status = { in: ['Solved', 'Closed'] };
      where.updatedAt = { gte: today };
    }

    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { ticketNumber: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: { 
          assignedUser: { select: { id: true, firstName: true, lastName: true, email: true } },
          customer: { select: { id: true, name: true } }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.ticket.count({ where })
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
    return await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: { 
        assignedUser: true,
        customer: true,
        ticketActivities: {
          orderBy: { createdAt: 'desc' }
        },
        notes: {
          include: {
            author: true
          },
          orderBy: { createdAt: 'desc' }
        },
        messages: {
          include: {
            author: true
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      subject, customerId, customer_id, customerName, department, category, category_id,
      priority, assignedUserId, assigned_to, description, attachmentUrl, status,
      source, slaDueDate
    } = req.body;

    // Validation
    if (!subject) throw new Error("Ticket subject is required");
    if (!description) throw new Error("Ticket description is required");

    // Mapping for flexible payloads
    const finalCategory = category || category_id || "Technical";
    const finalAssignedUserId = assignedUserId || assigned_to || null;
    const finalCustomerId = customerId || customer_id || null;
    
    const cleanCustomerId = (finalCustomerId === 'null' || finalCustomerId === 'unassigned' || finalCustomerId === 'walkin' || !finalCustomerId) ? null : finalCustomerId;
    const cleanAssignedUserId = (finalAssignedUserId === 'null' || finalAssignedUserId === 'unassigned' || !finalAssignedUserId) ? null : finalAssignedUserId;
    
    // Auto-infer department if missing
    let finalDepartment = department;
    if (!finalDepartment) {
      if (finalCategory.includes('Support') || finalCategory.includes('Tech') || finalCategory.includes('Integration') || finalCategory.includes('Portal') || finalCategory.includes('Infrastructure')) {
        finalDepartment = "Technical";
      } else if (finalCategory.includes('Billing') || finalCategory.includes('Finance')) {
        finalDepartment = "Billing";
      } else if (finalCategory.includes('Security') || finalCategory.includes('Authentication')) {
        finalDepartment = "Security";
      } else if (finalCategory.includes('Sales') || finalCategory.includes('Lead')) {
        finalDepartment = "Sales";
      } else {
        finalDepartment = "Customer Success";
      }
    }

    const ticketNumber = await getAndIncrementNextNumber('ticket');
    
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        subject,
        customerId: cleanCustomerId,
        customerName: customerName || "System",
        department: finalDepartment,
        category: finalCategory,
        priority: priority || 'Medium',
        assignedUserId: cleanAssignedUserId,
        description,
        attachmentUrl,
        status: status || 'Open',
        source: source || 'Web',
        slaDueDate: slaDueDate ? new Date(slaDueDate) : null
      }
    });

    // Record creation activity
    await prisma.ticketActivity.create({
      data: {
        ticketId: ticket.id,
        action: 'Ticket Created',
        newValue: ticketNumber
      }
    });

    return ticket;
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      subject, customerId, customer_id, customerName, department, category, category_id,
      priority, assignedUserId, assigned_to, description, attachmentUrl, status,
      source, slaDueDate
    } = req.body;
    
    const finalCustomerId = (customerId || customer_id || null);
    const finalAssignedUserId = (assignedUserId || assigned_to || null);
    const finalCategory = category || category_id;

    const cleanCustomerId = (finalCustomerId === 'null' || finalCustomerId === 'unassigned' || finalCustomerId === 'walkin' || !finalCustomerId) ? null : finalCustomerId;
    const cleanAssignedUserId = (finalAssignedUserId === 'null' || finalAssignedUserId === 'unassigned' || !finalAssignedUserId) ? null : finalAssignedUserId;

    const existingTicket = await prisma.ticket.findUnique({
      where: { id: req.params.id }
    });

    if (!existingTicket) throw new Error("Ticket not found");

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        subject,
        customerId: cleanCustomerId,
        customerName,
        department,
        category: finalCategory,
        priority,
        assignedUserId: cleanAssignedUserId,
        description,
        attachmentUrl,
        status,
        source,
        slaDueDate: slaDueDate ? new Date(slaDueDate) : undefined,
        lastActivityAt: new Date()
      }
    });

    // Detect changes and log activities
    const activities: any[] = [];
    if (status && status !== existingTicket.status) {
      activities.push({
        ticketId: ticket.id,
        action: 'Status Changed',
        oldValue: existingTicket.status,
        newValue: status
      });
      
      if (status === 'Solved') {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { resolvedAt: new Date() }
        });
      } else if (status === 'Closed') {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { closedAt: new Date() }
        });
      }
    }

    if (priority && priority !== existingTicket.priority) {
      activities.push({
        ticketId: ticket.id,
        action: 'Priority Changed',
        oldValue: existingTicket.priority,
        newValue: priority
      });
    }

    if (cleanAssignedUserId !== existingTicket.assignedUserId) {
      activities.push({
        ticketId: ticket.id,
        action: 'Assignee Changed',
        oldValue: existingTicket.assignedUserId || 'Unassigned',
        newValue: cleanAssignedUserId || 'Unassigned'
      });
    }

    if (activities.length > 0) {
      await prisma.ticketActivity.createMany({ data: activities });
    }

    return ticket;
  });

  updateStatus = this.handleRequest(async (req: Request) => {
    const { status } = req.body;
    const { id } = req.params;

    const existingTicket = await prisma.ticket.findUnique({ where: { id } });
    if (!existingTicket) throw new Error("Ticket not found");

    const updateData: any = { 
      status,
      lastActivityAt: new Date()
    };

    if (status === 'Solved') updateData.resolvedAt = new Date();
    if (status === 'Closed') updateData.closedAt = new Date();
    if (status === 'Open' || status === 'In Progress') {
      updateData.resolvedAt = null;
      updateData.closedAt = null;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData
    });

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: 'Status Changed',
        oldValue: existingTicket.status,
        newValue: status
      }
    });

    return ticket;
  });

  updatePriority = this.handleRequest(async (req: Request) => {
    const { priority } = req.body;
    const { id } = req.params;

    const existingTicket = await prisma.ticket.findUnique({ where: { id } });
    if (!existingTicket) throw new Error("Ticket not found");

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { 
        priority,
        lastActivityAt: new Date()
      }
    });

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: 'Priority Changed',
        oldValue: existingTicket.priority,
        newValue: priority
      }
    });

    return ticket;
  });

  updateAssignee = this.handleRequest(async (req: Request) => {
    const { assignedUserId } = req.body;
    const { id } = req.params;

    const existingTicket = await prisma.ticket.findUnique({ where: { id } });
    if (!existingTicket) throw new Error("Ticket not found");

    const cleanAssignedUserId = (assignedUserId === 'null' || assignedUserId === 'unassigned' || !assignedUserId) ? null : assignedUserId;

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { 
        assignedUserId: cleanAssignedUserId,
        lastActivityAt: new Date()
      }
    });

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: 'Assignee Changed',
        oldValue: existingTicket.assignedUserId || 'Unassigned',
        newValue: cleanAssignedUserId || 'Unassigned'
      }
    });

    return ticket;
  });

  reopen = this.handleRequest(async (req: Request) => {
    const { id } = req.params;

    const existingTicket = await prisma.ticket.findUnique({ where: { id } });
    if (!existingTicket) throw new Error("Ticket not found");

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { 
        status: 'Open',
        resolvedAt: null,
        closedAt: null,
        lastActivityAt: new Date()
      }
    });

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: 'Ticket Reopened',
        oldValue: existingTicket.status,
        newValue: 'Open'
      }
    });

    return ticket;
  });

  addNote = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { content, userId } = req.body;

    const note = await prisma.ticketNote.create({
      data: {
        ticketId: id,
        content,
        userId: userId || null
      },
      include: {
        author: true
      }
    });

    await prisma.ticket.update({
      where: { id },
      data: {
        lastActivityAt: new Date()
      }
    });

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: 'Internal Note Added'
      }
    });

    return note;
  });

  duplicate = this.handleRequest(async (req: Request) => {
    const { id } = req.params;

    const existing = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!existing) throw new Error("Ticket not found");
    const nextNumber = await getAndIncrementNextNumber('ticket');
    const { id: _, ticketNumber: __, createdAt: ___, updatedAt: ____, resolvedAt: _____, closedAt: ______, ...dataToCopy } = existing;

    const duplicated = await prisma.ticket.create({
      data: {
        ...dataToCopy,
        ticketNumber: nextNumber,
        status: 'Open',
        lastActivityAt: new Date(),
        ticketActivities: {
          create: {
            action: 'Ticket Created (Duplicated)'
          }
        }
      }
    });

    return duplicated;
  });

  sendMessage = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { content, isCustomer, userId } = req.body;

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        content,
        isCustomer: !!isCustomer,
        userId: userId || null
      },
      include: {
        author: true
      }
    });

    await prisma.ticket.update({
      where: { id },
      data: {
        lastActivityAt: new Date()
      }
    });

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: isCustomer ? 'Customer Replied' : 'Agent Replied'
      }
    });

    return message;
  });

  getDashboardStats = this.handleRequest(async (req: Request) => {
    const { dateRange, priority, status, department } = req.query;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const where: any = {};
    if (priority && priority !== 'all') where.priority = priority;
    if (status && status !== 'all') where.status = status;
    if (department && department !== 'all') where.department = department;

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      if (dateRange === 'today') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        where.createdAt = { gte: start };
      } else if (dateRange === 'week') {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        where.createdAt = { gte: start };
      } else if (dateRange === 'month') {
        const start = new Date();
        start.setMonth(now.getMonth() - 1);
        where.createdAt = { gte: start };
      } else if (dateRange === 'this_year') {
        const start = new Date(now.getFullYear(), 0, 1);
        where.createdAt = { gte: start };
      }
    }

    const [
      statuses,
      priorities,
      departments,
      unassignedCount,
      resolvedTodayCount,
      totalTicketsCount,
      overdueTicketsList
    ] = await Promise.all([
      prisma.ticket.groupBy({
        where,
        by: ['status'],
        _count: true
      }),
      prisma.ticket.groupBy({
        where,
        by: ['priority'],
        _count: true
      }),
      prisma.ticket.groupBy({
        where,
        by: ['department'],
        _count: true
      }),
      prisma.ticket.count({
        where: { ...where, assignedUserId: null }
      }),
      prisma.ticket.count({
        where: { 
          ...where,
          status: { in: ['Solved', 'Closed'] },
          updatedAt: { gte: today }
        }
      }),
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where: {
          ...where,
          status: { notIn: ['Solved', 'Closed'] },
          createdAt: { lt: yesterday }
        },
        include: { assignedUser: true },
        take: 5,
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const unassignedTickets = await prisma.ticket.findMany({
      where: { ...where, assignedUserId: null },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return {
      stats: {
        statusDistribution: statuses,
        priorityDistribution: priorities,
        departmentDistribution: departments,
        unassignedCount,
        resolvedToday: resolvedTodayCount,
        totalTickets: totalTicketsCount,
        openTickets: statuses.find(s => s.status === 'Open')?._count || 0,
        inProgressTickets: statuses.find(s => s.status === 'In Progress')?._count || 0,
        overdueCount: await prisma.ticket.count({
          where: {
            ...where,
            status: { notIn: ['Solved', 'Closed'] },
            createdAt: { lt: yesterday }
          }
        })
      },
      overdueTickets: overdueTicketsList,
      unassignedTickets
    };
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.ticket.delete({
      where: { id: req.params.id }
    });
  });

  seed = this.handleRequest(async (req: Request) => {
    // Clear existing tickets to have a clean seed
    await prisma.ticket.deleteMany({});

    const users = await prisma.user.findMany({ take: 10 });
    const customers = await prisma.customer.findMany({ take: 20 });
    
    const seedData = [
      { id: "1", subject: "Unable to login after password reset", priority: "High", status: "Open", category: "Authentication", source: "Web" },
      { id: "2", subject: "Invoice PDF not downloading correctly", priority: "Medium", status: "In Progress", category: "Billing & Finance", source: "Email" },
      { id: "3", subject: "API webhook returning 500 error", priority: "Critical", status: "Open", category: "API Integration", source: "API" },
      { id: "4", subject: "Dashboard loading slowly for large reports", priority: "High", status: "Pending", category: "Technical Support", source: "Web" },
      { id: "5", subject: "Need dark mode support in CRM", priority: "Low", status: "Open", category: "Feature Requests", source: "Web" },
      { id: "6", subject: "Customer portal showing blank page", priority: "Critical", status: "In Progress", category: "Customer Portal", source: "Web" },
      { id: "7", subject: "SMTP email delivery failing intermittently", priority: "High", status: "Overdue", category: "Email Services", source: "Email" },
      { id: "8", subject: "Incorrect tax calculation on invoices", priority: "Medium", status: "Solved", category: "Billing & Finance", source: "Email" },
      { id: "9", subject: "2FA authentication SMS not received", priority: "High", status: "Open", category: "Security Issues", source: "Web" },
      { id: "10", subject: "Need export option for sales reports", priority: "Low", status: "Pending", category: "Feature Requests", source: "Web" },
      { id: "11", subject: "Server CPU usage spikes at midnight", priority: "Critical", status: "In Progress", category: "Server Infrastructure", source: "API" },
      { id: "12", subject: "Automation workflow not triggering emails", priority: "Medium", status: "Solved", category: "CRM Automation", source: "Internal" },
      { id: "13", subject: "Product images not uploading", priority: "Medium", status: "Open", category: "Technical Support", source: "Web" },
      { id: "14", subject: "Subscription renewal payment failed", priority: "High", status: "Pending", category: "Billing & Finance", source: "Web" },
      { id: "15", subject: "CRM search results inaccurate", priority: "Medium", status: "Solved", category: "Technical Support", source: "Web" },
      { id: "16", subject: "Need custom dashboard widgets", priority: "Low", status: "Open", category: "Feature Requests", source: "Web" },
      { id: "17", subject: "SSL certificate warning appearing", priority: "Critical", status: "Overdue", category: "Security Issues", source: "API" },
      { id: "18", subject: "Unable to assign leads to agents", priority: "Medium", status: "Closed", category: "CRM Automation", source: "Internal" },
      { id: "19", subject: "Inventory sync delay with warehouse", priority: "High", status: "In Progress", category: "API Integration", source: "API" },
      { id: "20", subject: "Need bulk customer import feature", priority: "Low", status: "Solved", category: "Feature Requests", source: "Web" },
      { id: "21", subject: "Reports page crashing on export", priority: "High", status: "Open", category: "Technical Support", source: "Web" },
      { id: "22", subject: "Duplicate invoices generated automatically", priority: "Critical", status: "Pending", category: "Billing & Finance", source: "Email" },
      { id: "23", subject: "User permissions not saving", priority: "Medium", status: "Solved", category: "Security Issues", source: "Web" },
      { id: "24", subject: "Webhook timeout during CRM sync", priority: "High", status: "In Progress", category: "API Integration", source: "API" },
      { id: "25", subject: "Need multi-language support", priority: "Low", status: "Closed", category: "Feature Requests", source: "Web" }
    ];

    const customerNames = [
      "Acme Corp", "Global Solutions", "TechFlow Inc", "Nexus Ventures", "Skyline Dynamics",
      "Starlight Media", "BlueWave Systems", "Summit Innovations", "Peak Performance", "EcoLogic Ltd",
      "Quantum Leap", "SilverLine Partners", "Everest Consulting", "Swift Logistics", "Fusion Enterprises",
      "Alpha Omega", "Vanguard Group", "Prism Interactive", "Beacon Technologies", "Ironclad Security"
    ];

    const tickets = [];
    const now = new Date();

    for (let i = 0; i < seedData.length; i++) {
      const data = seedData[i];
      const user = (i % 5 === 0 && i !== 0) || users.length === 0 ? null : users[i % users.length]; // Some unassigned
      const customer = customers.length === 0 ? null : customers[i % customers.length];
      const customerName = customer?.name || customerNames[i % customerNames.length];
      
      // Random date within last 60 days
      const createdAt = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
      
      // SLA Due Date: random 2-5 days from createdAt, or in the past for overdue
      let slaDueDate = new Date(createdAt.getTime() + (2 + Math.random() * 3) * 24 * 60 * 60 * 1000);
      if (data.status === 'Overdue') {
        slaDueDate = new Date(now.getTime() - (1 + Math.random() * 5) * 24 * 60 * 60 * 1000);
      }

      const ticketNumber = `TKT-2026-${String(i + 1).padStart(4, '0')}`;

      tickets.push({
        ticketNumber,
        subject: data.subject,
        description: `Realistic description for ticket ${ticketNumber}: The user reported ${data.subject.toLowerCase()}. This issue was identified via ${data.source}. We need to investigate and provide a resolution according to the ${data.priority} priority SLA.`,
        status: data.status === 'Overdue' ? 'Open' : data.status, 
        priority: data.priority,
        category: data.category,
        source: data.source,
        department: data.category.includes('Support') || data.category.includes('Tech') || data.category.includes('Integration') || data.category.includes('Portal') || data.category.includes('Infrastructure') ? "Technical" :
                    data.category.includes('Billing') || data.category.includes('Finance') ? "Billing" :
                    data.category.includes('Security') || data.category.includes('Authentication') ? "Security" :
                    data.category.includes('CRM') || data.category.includes('Automation') ? "Technical" : "Sales",
        customerName: customerName,
        customerId: customer?.id || null,
        assignedUserId: user?.id || null,
        slaDueDate: slaDueDate,
        createdAt: createdAt,
        updatedAt: data.status === 'Solved' || data.status === 'Closed' ? new Date() : createdAt
      });
    }

    // Special handling for Overdue tickets to make sure they are actually overdue in the dashboard
    // The dashboard logic uses `status NOT IN ['Solved', 'Closed']` and `slaDueDate < now`
    
    await prisma.ticket.createMany({ data: tickets });
    return { count: tickets.length };
  });
}
