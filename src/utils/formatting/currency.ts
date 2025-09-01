/**
 * @fileoverview Currency and percentage formatting utilities
 * 
 * This module handles monetary amounts and percentage displays with intelligent
 * rounding and localization support. Essential for financial data presentation.
 */

import { validateNumber, validateString } from '../../lib/validators.js';

/**
 * Formats monetary amounts with intelligent rounding and localization
 * UX: Large amounts (≥€10,000) round to nearest €100, small amounts to nearest €10
 * 
 */
export function formatMoney(amount: number, currency: any = '€', locale: any = 'en-US'): string {
  validateNumber(amount, 'amount');
  validateString(currency, 'currency');
  validateString(locale, 'locale');
  
  let rounded: any;
  if (Math.abs(amount) >= 10000) {
    rounded = Math.round(amount / 100) * 100;
  } else {
    rounded = Math.round(amount / 10) * 10;
  }
  
  const formattedNumber = rounded.toLocaleString(locale);
  return currency + formattedNumber;
}

/**
 * Formats decimal values as percentages with configurable precision
 * 
 */
export function formatPercentage(value: number, decimalPlaces: any = 1): string {
  validateNumber(value, 'value');
  validateNumber(decimalPlaces, 'decimalPlaces');
  
  if (decimalPlaces < 0 || decimalPlaces > 10) {
    throw new Error('Decimal places must be between 0 and 10');
  }
  
  const percentage = value * 100;
  const formatted = percentage.toFixed(decimalPlaces);
  return formatted + '%';
}
