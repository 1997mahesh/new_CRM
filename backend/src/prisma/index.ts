import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: config.db.url,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

if (config.env !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
