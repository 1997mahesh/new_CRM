import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/index.js';
import { config } from '../../config/index.js';
import { auditLog } from '../../utils/audit.js';

export class AuthService {
  async login(email: string, password: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user || user.isActive === false) {
      await auditLog(null, 'LOGIN_FAILED', 'auth', `Failed login attempt for email: ${email}`, ipAddress);
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await auditLog(user.id, 'LOGIN_FAILED', 'auth', 'Invalid password', ipAddress);
      throw { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles.map(r => r.name) },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await auditLog(user.id, 'LOGIN_SUCCESS', 'auth', 'User logged in successfully', ipAddress);

    return {
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles.map(r => r.name),
        },
      },
    };
  }

  async logout(userId: string, ipAddress?: string) {
    await auditLog(userId, 'LOGOUT', 'auth', 'User logged out', ipAddress);
    return { message: 'Logged out successfully' };
  }

  async register(userData: any) {
    // Registration logic - placeholder
    return { message: 'Registration logic placeholder' };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    return user;
  }
}
