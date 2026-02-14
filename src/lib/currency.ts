// Currency formatting utility for Nigerian Naira
// Used throughout the application for consistent currency display

export const CURRENCY_SYMBOL = "₦";
export const CURRENCY_NAME = "Nigerian Naira";
export const CURRENCY_CODE = "NGN";

/**
 * Format a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₦ symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | undefined | null, includeSymbol: boolean = true): string {
  // Handle undefined, null, or NaN values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? '₦0' : '0';
  }
  
  const formatted = amount.toLocaleString('en-NG');
  return includeSymbol ? `₦${formatted}` : formatted;
}

/**
 * Format currency for input placeholders
 * @param amount - The amount to format
 * @returns Formatted string without symbol
 */
export function formatCurrencyPlaceholder(amount: number): string {
  return formatCurrency(amount, false);
}