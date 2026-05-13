import prisma from '../prisma/index.js';

export const getAndIncrementNextNumber = async (key: string, transactionClient?: any): Promise<string> => {
  const getNext = async (tx: any) => {
    // Standardize key to lowercase to avoid casing duplicates
    const searchKey = key.toLowerCase();
    
    // Standard defaults for known modules
    const defaults: Record<string, { prefix: string; padding: number }> = {
      'rcp': { prefix: 'RCP-', padding: 5 },
      'invoice': { prefix: 'INV-', padding: 5 },
      'quotation': { prefix: 'QTN-', padding: 5 },
      'order': { prefix: 'ORD-', padding: 5 }
    };
    
    const config = defaults[searchKey] || { prefix: `${searchKey.toUpperCase()}-`, padding: 4 };

    // Use upsert with atomic increment to ensure thread safety
    // We search by exact name (lowercase)
    const series = await tx.numberSeries.upsert({
      where: { name: searchKey },
      update: { lastNumber: { increment: 1 } },
      create: {
        name: searchKey,
        prefix: config.prefix,
        padding: config.padding,
        lastNumber: 1
      }
    });
    
    return `${series.prefix}${String(series.lastNumber).padStart(series.padding, '0')}`;
  };

  if (transactionClient) {
    return await getNext(transactionClient);
  }

  return await (prisma as any).$transaction(getNext);
};
