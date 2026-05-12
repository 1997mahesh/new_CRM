import prisma from '../prisma/index.js';

export const getAndIncrementNextNumber = async (key: string): Promise<string> => {
  return await (prisma as any).$transaction(async (tx: any) => {
    const series = await tx.numberSeries.findFirst({
      where: { name: { contains: key, mode: 'insensitive' } }
    });
    
    if (!series) {
      // High-collision fallback for missing series
      const count = await tx.quotation.count(); // Generic fallback
      return `${key.toUpperCase()}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
    
    const nextVal = series.lastNumber + 1;
    
    await tx.numberSeries.update({
      where: { id: series.id },
      data: { lastNumber: nextVal }
    });
    
    return `${series.prefix}${String(nextVal).padStart(series.padding, '0')}`;
  });
};
