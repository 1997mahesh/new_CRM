import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import bcrypt from 'bcrypt';

export class UsersController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    const { search, status, role, department, location } = req.query as any;

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (role && role !== 'all') {
      where.roles = { some: { id: role } };
    }
    if (department && department !== 'all') {
      where.departmentId = department;
    }
    if (location && location !== 'all') {
      where.locationId = location;
    }

    return await prisma.user.findMany({
      where,
      include: {
        roles: true,
        department: true,
        location: true,
        reportingManager: {
          select: { id: true, firstName: true, lastName: true }
        },
        approver: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  getById = this.handleRequest(async (req: Request) => {
    return await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        roles: true,
        department: true,
        location: true,
        reportingManager: {
          select: { id: true, firstName: true, lastName: true }
        },
        approver: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { password, roleIds, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'Welcome@123', 10);
    
    // Clean up empty strings or 'none' for relations
    const cleanedData: any = { ...data };
    ['departmentId', 'locationId', 'reportingManagerId', 'approverId'].forEach(field => {
      if (cleanedData[field] === 'none' || cleanedData[field] === '') {
        cleanedData[field] = null;
      }
    });

    return await prisma.user.create({
      data: {
        ...cleanedData,
        password: hashedPassword,
        roles: {
          connect: roleIds ? roleIds.map((id: string) => ({ id })) : []
        }
      },
      include: { roles: true }
    });
  });

  update = this.handleRequest(async (req: Request) => {
    const { id, password, roleIds, ...data } = req.body;
    const updateData: any = { ...data };
    
    // Clean up empty strings or 'none' for relations
    ['departmentId', 'locationId', 'reportingManagerId', 'approverId'].forEach(field => {
      if (updateData[field] === 'none' || updateData[field] === '') {
        updateData[field] = null;
      }
    });

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (roleIds) {
      updateData.roles = {
        set: roleIds.map((id: string) => ({ id }))
      };
    }

    return await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      include: { roles: true }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), status: 'Inactive' }
    });
  });
}
