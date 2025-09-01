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
 * @param {number} amount - Monetary amount to format
 * @param {string} [currency='€'] - Currency symbol
 * @param {string} [locale='en-US'] - Locale for number formatting
 * @returns {string} Formatted currency string
 */
export function formatMoney(amount, currency = '€', locale = 'en-US') {
  validateNumber(amount, 'amount');
  validateString(currency, 'currency');
  validateString(locale, 'locale');
  
  let rounded;
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
 * @param {number} value - Decimal value (0.05 = 5%)
 * @param {number} [decimalPlaces=1] - Number of decimal places to show
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimalPlaces = 1) {
  validateNumber(value, 'value');
  validateNumber(decimalPlaces, 'decimalPlaces');
  
  if (decimalPlaces < 0 || decimalPlaces > 10) {
    throw new Error('Decimal places must be between 0 and 10');
  }
  
  const percentage = value * 100;
  const formatted = percentage.toFixed(decimalPlaces);
  return formatted + '%';
}
