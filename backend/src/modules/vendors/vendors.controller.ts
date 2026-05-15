import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class VendorsController extends BaseController {
  list = this.handleRequest(async (req: Request) => {
    const { search, status } = req.query;
    
    const where: any = {};
    
    if (status && status !== 'All') {
      where.status = status;
    }
    
    if (search) {
      const searchStr = String(search);
      where.OR = [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { email: { contains: searchStr, mode: 'insensitive' } },
        { contactPerson: { contains: searchStr, mode: 'insensitive' } },
        { phone: { contains: searchStr, mode: 'insensitive' } },
        { taxNumber: { contains: searchStr, mode: 'insensitive' } },
      ];
    }

    const vendors = await prisma.vendor.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { purchaseOrders: true }
        }
      }
    });
    return vendors;
  });

  get = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        bills: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });
    return vendor;
  });

  create = this.handleRequest(async (req: Request) => {
    const { id, ...data } = req.body;
    const vendor = await prisma.vendor.create({
      data
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        type: 'Created',
        message: `Vendor "${vendor.name}" was created.`,
        vendorId: vendor.id
      }
    });
    
    return vendor;
  });

  update = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    const vendor = await prisma.vendor.update({
      where: { id },
      data
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        type: 'Updated',
        message: `Vendor details were updated.`,
        vendorId: vendor.id
      }
    });
    
    return vendor;
  });

  delete = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    return await prisma.vendor.delete({
      where: { id }
    });
  });

  archive = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { status: 'Inactive' }
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        type: 'Updated',
        message: `Vendor was marked as Inactive/Archived.`,
        vendorId: vendor.id
      }
    });
    
    return vendor;
  });

  import = this.handleRequest(async (req: Request) => {
    const { vendors } = req.body;
    if (!Array.isArray(vendors)) {
      throw new Error('Invalid data format. Expected an array of vendors.');
    }

    const results = await Promise.all(
      vendors.map(async (v) => {
        try {
          return await prisma.vendor.upsert({
            where: { name: v.name },
            update: v,
            create: v
          });
        } catch (error) {
          return { error: (error as Error).message, data: v };
        }
      })
    );

    return results;
  });
}
