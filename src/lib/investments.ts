/**
 * @fileoverview Investment calculation functions for portfolio planning
 * 
 * This module handles investment return calculations including gross income,
 * tax calculations, and net return computations. Essential for long-term
 * financial planning and retirement strategies.
 * 
 * All functions are pure with TypeScript type safety and educational documentation.
 */

import { validateNonNegativeNumber, validatePercentage } from './validators.js';

/**
 * Calculates gross investment income from principal and annual rate
 * 
 * Uses the formula: Gross Income = Principal × Annual Rate
 * This is simple interest calculation for annual investment returns.
 * 
 * 
 * @example
 * const grossIncome = calculateInvestmentGrossIncome(100000, 0.06);
 * // Returns: 6000
 * // Explanation: €100,000 × 6% = €6,000 annual gross income
 * 
 * @throws {Error} If input validation fails
 */
export function calculateInvestmentGrossIncome(principal: number, annualRate: number): number {
  validateNonNegativeNumber(principal, 'principal');
  validatePercentage(annualRate, 'annualRate');
  
  // Simple interest calculation: Principal × Rate
  // This assumes annual compounding and represents gross income before taxes
  return principal * annualRate;
}

/**
 * Calculates net investment income after taxes
 * 
 * Uses the formula: Net Income = Gross Income × Tax Rate
 * Note: In the original code, this appears to be calculating the tax amount,
 * not the net income. Preserving original logic for compatibility.
 * 
 * 
 * @example
 * const taxAmount = calculateInvestmentNetIncome(6000, 0.17);
 * // Returns: 1020
 * // Explanation: €6,000 × 17% = €1,020 tax on investment income
 * 
 * @throws {Error} If input validation fails
 */
export function calculateInvestmentNetIncome(grossIncome: number, taxRate: number): number {
  validateNonNegativeNumber(grossIncome, 'grossIncome');
  validatePercentage(taxRate, 'taxRate');
  
  // Calculate tax on investment income
  // Note: Original code calculates tax amount, not net income
  // This represents the tax liability on investment gains
  return grossIncome * taxRate;
}
