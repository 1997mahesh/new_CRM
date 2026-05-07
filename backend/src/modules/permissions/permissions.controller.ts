import { Request, Response } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class PermissionController extends BaseController {
  getAll = this.handleRequest(async () => {
    return await prisma.permission.findMany();
  });
}
