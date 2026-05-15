
export interface ProcurementItem {
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  discountType: 'Fixed' | 'Percentage';
  discountValue: number;
}

export interface ProcurementTotals {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}

export interface LineTotalResult {
  lineSubtotal: number;
  taxAmount: number;
  discountAmount: number;
  lineTotal: number;
}

/**
 * Calculates totals for a single line item
 */
export const calculateLineTotal = (item: ProcurementItem): LineTotalResult => {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const taxPercent = Number(item.taxPercent) || 0;
  const discountValue = Number(item.discountValue) || 0;

  const lineSubtotal = quantity * unitPrice;
  
  let discountAmount = 0;
  if (item.discountType === 'Percentage') {
    discountAmount = (lineSubtotal * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }

  const taxAmount = (lineSubtotal * taxPercent) / 100;
  const lineTotal = lineSubtotal + taxAmount - discountAmount;

  return {
    lineSubtotal,
    taxAmount,
    discountAmount,
    lineTotal
  };
};

/**
 * Calculates summary totals for a list of items and an optional global discount
 */
export const calculateProcurementTotals = (
  items: ProcurementItem[], 
  globalDiscountType: 'Fixed' | 'Percentage' = 'Fixed',
  globalDiscountValue: number = 0
): ProcurementTotals => {
  let subtotal = 0;
  let taxAmount = 0;
  let lineDiscountAmount = 0;

  items.forEach(item => {
    const result = calculateLineTotal(item);
    subtotal += result.lineSubtotal;
    taxAmount += result.taxAmount;
    lineDiscountAmount += result.discountAmount;
  });

  let globalDiscountAmount = 0;
  if (globalDiscountType === 'Percentage') {
    globalDiscountAmount = (subtotal * globalDiscountValue) / 100;
  } else {
    globalDiscountAmount = globalDiscountValue;
  }

  const totalDiscount = lineDiscountAmount + globalDiscountAmount;
  const totalAmount = subtotal + taxAmount - totalDiscount;

  return {
    subtotal,
    taxAmount,
    discountAmount: totalDiscount,
    totalAmount: Math.max(0, totalAmount)
  };
};

/**
 * Utility to format currency with proper ERP precision
 */
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
