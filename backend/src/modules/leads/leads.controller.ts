import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class LeadsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { status, pipelineStage, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (pipelineStage) where.pipelineStage = pipelineStage;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { companyName: { contains: search as string, mode: 'insensitive' } },
        { contactPerson: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { assignedUser: true },
        orderBy: [
          { sortOrder: 'asc' },
          { updatedAt: 'desc' }
        ],
        skip,
        take: Number(limit)
      }),
      prisma.lead.count({ where })
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
    return await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: { assignedUser: true }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { 
      title, companyName, contactPerson, email, phone, 
      source, pipelineStage, value, assignedUserId, priority, notes, status,
      expectedCloseDate, tags
    } = req.body;
    
    return await prisma.lead.create({
      data: {
        title,
        companyName,
        contactPerson,
        email,
        phone,
        source,
        pipelineStage: pipelineStage || 'New',
        value: value ? parseFloat(value) : 0,
        assignedUserId: assignedUserId || null,
        priority: priority || 'Medium',
        notes,
        expectedCloseDate: (expectedCloseDate && expectedCloseDate !== "") ? new Date(expectedCloseDate) : null,
        tags: tags || [],
        status: status || 'Open'
      }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { 
      title, companyName, contactPerson, email, phone, 
      source, pipelineStage, value, assignedUserId, priority, notes, status,
      expectedCloseDate, tags
    } = req.body;
    
    return await prisma.lead.update({
      where: { id: req.params.id },
      data: {
        title,
        companyName,
        contactPerson,
        email,
        phone,
        source,
        pipelineStage,
        value: value ? parseFloat(value) : undefined,
        assignedUserId: assignedUserId || null,
        priority,
        notes,
        expectedCloseDate: (expectedCloseDate && expectedCloseDate !== "") ? new Date(expectedCloseDate) : undefined,
        tags: tags || undefined,
        status
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.lead.delete({
      where: { id: req.params.id }
    });
  });

  updateStage = this.handleRequest(async (req: Request) => {
    const { pipelineStage, sortOrder } = req.body;
    return await prisma.lead.update({
      where: { id: req.params.id },
      data: { 
        pipelineStage,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined
      }
    });
  });
}
