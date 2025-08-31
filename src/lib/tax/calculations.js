/**
 * @fileoverview Tax calculation functions for income and investment taxes
 * 
 * This module handles all tax-related calculations for the finance agent.
 * Supports both income tax calculations and investment tax scenarios
 * for expat financial planning in Thailand.
 * 
 * All functions are pure with TypeBox validation and educational documentation.
 */

import { Type } from '@sinclair/typebox';
import { validate } from '../validators.js';



/**
 * Schema for tax calculations
 */
const TaxCalculationSchema = Type.Object({
  grossAmount: Type.Number({ minimum: 0 }),
  taxRate: Type.Number({ minimum: 0, maximum: 1 })
});



/**
 * Calculates net salary after tax deduction
 * 
 * Uses the formula: Net Salary = Gross Salary × (1 - Tax Rate)
 * This is the standard after-tax income calculation used globally.
 * 
 * In the Thailand scenario, expats are tax-free for the first 2 years,
 * then subject to local tax rates (typically 17% for this income level).
 * 
 * @param {number} grossSalary - Gross salary amount (must be positive)
 * @param {number} taxRate - Tax rate as decimal (0.17 = 17%, must be 0-1)
 * @returns {number} Net salary after tax deduction
 * 
 * @example
 * const netSalary = calculateNetSalary(7692.31, 0.17);
 * // Returns: 6384.62 (approximately)
 * // Explanation: €7692.31 × (1 - 0.17) = €7692.31 × 0.83 = €6384.62
 * 
 * @throws {Error} If input validation fails
 */
export function calculateNetSalary(grossSalary, taxRate) {
  validate(TaxCalculationSchema, { grossAmount: grossSalary, taxRate });
  
  // Calculate tax multiplier: (1 - tax rate)
  // This represents the percentage of income you keep after taxes
  // Example: 1 - 0.17 = 0.83 (keep 83% of gross income)
  const afterTaxMultiplier = 1 - taxRate;
  
  // Apply tax multiplier to gross salary
  // Example: €7692.31 × 0.83 = €6384.62 net salary
  return grossSalary * afterTaxMultiplier;
}
