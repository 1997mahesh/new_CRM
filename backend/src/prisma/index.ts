import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';

const globalForPrisma = global as unknown as { prisma: any };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: config.db.url,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
}).$extends({
  query: {
    $allOperations({ model, operation, args, query }) {
      // Basic retry logic for connection errors
      const execute = async (attempt = 1): Promise<any> => {
        try {
          return await query(args);
        } catch (error: any) {
          // SqlState(E57P01) is "terminating connection due to administrator command"
          // We can try to retry once if it's a connection-related error
          if (attempt < 3 && (
            error.message?.includes('E57P01') || 
            error.message?.includes('terminating connection') ||
            error.message?.includes('closed unexpectedly') ||
            error.message?.includes('connection') ||
            error.code === 'P2024' || // Connection timeout
            error.code === 'P1017'    // Server has closed the connection
          )) {
            console.log(`Retrying ${operation} on ${model} after connection error (attempt ${attempt + 1})...`);
            
            // If it's a fatal connection error, force a disconnect to refresh the pool
            if (error.message?.includes('E57P01') || error.message?.includes('terminating connection')) {
              try {
                // We use the global reference or just try to disconnect if available
                if (globalForPrisma.prisma) {
                  await globalForPrisma.prisma.$disconnect();
                }
              } catch (e) {
                // Ignore disconnect errors
              }
            }

            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            return execute(attempt + 1);
          }
          throw error;
        }
      };
      return execute();
    },
  },
});

if (config.env !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
