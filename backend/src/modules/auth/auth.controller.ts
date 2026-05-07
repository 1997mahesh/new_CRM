import { Request, Response } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import { AuthService } from './auth.service.js';
import { sendResponse, HttpStatus } from '../../utils/response.js';

export class AuthController extends BaseController {
  private authService = new AuthService();

  login = this.handleRequest(async (req: Request) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    return await this.authService.login(email, password, ipAddress);
  });

  logout = this.handleRequest(async (req: any) => {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    return await this.authService.logout(req.user.id, ipAddress);
  });

  register = this.handleRequest(async (req: Request) => {
    return await this.authService.register(req.body);
  });

  getMe = this.handleRequest(async (req: any) => {
    return await this.authService.getProfile(req.user.id);
  });
}
