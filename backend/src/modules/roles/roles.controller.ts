import { Request, Response } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import { RoleService } from './roles.service.js';
import { sendResponse, HttpStatus } from '../../utils/response.js';

export class RoleController extends BaseController {
  private roleService = new RoleService();

  getAll = this.handleRequest(async () => {
    return await this.roleService.getAll();
  });

  getById = this.handleRequest(async (req: Request) => {
    return await this.roleService.getById(req.params.id);
  });

  create = this.handleRequest(async (req: Request) => {
    return await this.roleService.create(req.body);
  });

  update = this.handleRequest(async (req: Request) => {
    return await this.roleService.update(req.params.id, req.body);
  });

  delete = this.handleRequest(async (req: Request) => {
    return await this.roleService.delete(req.params.id);
  });

  updatePermissions = this.handleRequest(async (req: Request) => {
    const { permissionIds } = req.body;
    return await this.roleService.updatePermissions(req.params.id, permissionIds);
  });
}
