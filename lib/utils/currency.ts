// utils/currency.ts
export const stripCurrency = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toString();
  }
  
  // Remove currency symbols and commas
  return value.replace(/[₹$,\s]/g, '').trim();
};

export const cleanMoneyValue = (value: string | number): number => {
  const cleaned = stripCurrency(value);
  const parsed = parseFloat(cleaned);
  
  // Ensure positive value (backend validation requirement)
  return parsed > 0 ? parsed : 0;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
