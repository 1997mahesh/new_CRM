import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import crypto from 'crypto';

export class UserInvitationsController extends BaseController {
  getAll = this.handleRequest(async (req: Request) => {
    return await prisma.userInvitation.findMany({
      orderBy: { createdAt: 'desc' }
    });
  });

  create = this.handleRequest(async (req: Request) => {
    const { email, name, departmentId, roleId } = req.body;
    
    // Check if invitation already exists
    const existing = await prisma.userInvitation.findUnique({
      where: { email }
    });

    if (existing && existing.status === 'Pending') {
      throw new Error('Invitation already sent to this email');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    return await prisma.userInvitation.upsert({
      where: { email },
      create: {
        email,
        name,
        departmentId,
        roleId,
        token,
        expiresAt,
        status: 'Pending'
      },
      update: {
        name,
        departmentId,
        roleId,
        token,
        expiresAt,
        status: 'Pending'
      }
    });
  });

  delete = this.handleRequest(async (req: Request) => {
    return await prisma.userInvitation.delete({
      where: { id: req.params.id }
    });
  });
}
