/**
 * @fileoverview Currency conversion functions for international financial calculations
 * 
 * This module handles all currency conversion operations used in the finance agent.
 * Supports USD → EUR → THB conversion chain for expat financial planning.
 * 
 * All functions are pure with TypeBox validation and educational documentation.
 */

import { Type } from '@sinclair/typebox';
import { validate } from '../validators.js';



/**
 * Schema for currency conversion calculations
 */
const CurrencyConversionSchema = Type.Object({
  amount: Type.Number({ minimum: 0 }),
  exchangeRate: Type.Number({ exclusiveMinimum: 0 })
});



/**
 * Converts USD amount to EUR using exchange rate
 * 
 * This function performs basic currency conversion using the formula:
 * EUR Amount = USD Amount / Exchange Rate
 * 
 * Used in the finance agent to convert gross USD salary to EUR for
 * expense calculations and local currency planning.
 * 
 * @param {number} usdAmount - Amount in USD (must be positive)
 * @param {number} eurUsdRate - EUR/USD exchange rate (must be positive)
 * @returns {number} Equivalent amount in EUR
 * 
 * @example
 * const eurAmount = convertUsdToEur(9000, 1.17);
 * // Returns: 7692.31 (approximately)
 * // Explanation: $9000 USD ÷ 1.17 EUR/USD = €7692.31 EUR
 * 
 * @throws {Error} If input validation fails
 */
export function convertUsdToEur(usdAmount, eurUsdRate) {
  validate(CurrencyConversionSchema, { amount: usdAmount, exchangeRate: eurUsdRate });
  
  // Direct currency conversion: divide by exchange rate
  // Example: $9000 USD ÷ 1.17 EUR/USD = €7692.31 EUR
  return usdAmount / eurUsdRate;
}

/**
 * Converts EUR amount to THB using exchange rate
 * 
 * This function performs currency conversion using the formula:
 * THB Amount = EUR Amount × Exchange Rate
 * 
 * Used for converting European expenses to Thai Baht for local
 * cost-of-living calculations in Chiang Mai.
 * 
 * @param {number} eurAmount - Amount in EUR (must be positive)
 * @param {number} thbEurRate - THB/EUR exchange rate (must be positive)
 * @returns {number} Equivalent amount in THB
 * 
 * @example
 * const thbAmount = convertEurToThb(1000, 37.75);
 * // Returns: 37750
 * // Explanation: €1000 EUR × 37.75 THB/EUR = ฿37,750 THB
 * 
 * @throws {Error} If input validation fails
 */
export function convertEurToThb(eurAmount, thbEurRate) {
  validate(CurrencyConversionSchema, { amount: eurAmount, exchangeRate: thbEurRate });
  
  // Direct currency conversion: multiply by exchange rate
  // Example: €1000 EUR × 37.75 THB/EUR = ฿37,750 THB
  return eurAmount * thbEurRate;
}
