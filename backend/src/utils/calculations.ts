
/**
 * Centralized calculation logic for procurement and sales
 * Replicated from frontend to ensure consistency
 */

export interface LineItem {
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  discountType?: 'Fixed' | 'Percentage';
  discountValue?: number;
}

export const calculateLineTotal = (item: LineItem) => {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const taxPercent = Number(item.taxPercent) || 0;
  const discountType = item.discountType || 'Fixed';
  const discountValue = Number(item.discountValue) || 0;

  const lineSubtotal = quantity * unitPrice;
  
  let discountAmount = 0;
  if (discountType === 'Percentage') {
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

export const calculateTotals = (
  items: LineItem[], 
  globalDiscountType: 'Fixed' | 'Percentage' = 'Fixed', 
  globalDiscountValue: number = 0
) => {
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const result = calculateLineTotal(item);
    subtotal += result.lineSubtotal;
    totalTax += result.taxAmount;
    totalDiscount += result.discountAmount;
  });

  let globalDiscountAmount = 0;
  if (globalDiscountType === 'Percentage') {
    globalDiscountAmount = (subtotal * globalDiscountValue) / 100;
  } else {
    globalDiscountAmount = globalDiscountValue;
  }

  const finalDiscount = totalDiscount + globalDiscountAmount;
  const grandTotal = subtotal + totalTax - finalDiscount;

  return {
    subtotal,
    taxAmount: totalTax,
    discountAmount: finalDiscount,
    totalAmount: Math.max(0, grandTotal)
  };
};
