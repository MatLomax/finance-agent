/**
 * @fileoverview Retirement planning and withdrawal calculation functions
 * 
 * This module handles retirement-specific calculations including expense shortfalls,
 * safe withdrawal rates, and wealth preservation strategies. Critical for
 * long-term financial independence planning.
 * 
 * All functions are pure with TypeScript type safety and educational documentation.
 */

import { validateNonNegativeNumber, validateRange } from './validators.js';

/**
 * Calculates retirement expense shortfall
 * 
 * Shortfall = Annual Expenses - Investment Income
 * This determines how much additional money needs to be withdrawn
 * from savings/investments to cover living expenses in retirement.
 * 
 * 
 * @example
 * const shortfall = calculateRetirementShortfall(58584, 6000);
 * // Returns: 52584
 * // Explanation: €58,584 expenses - €6,000 income = €52,584 shortfall
 * 
 * @throws {Error} If input validation fails
 */
export function calculateRetirementShortfall(annualExpenses: number, investmentIncome: number): number {
  validateNonNegativeNumber(annualExpenses, 'annualExpenses');
  validateNonNegativeNumber(investmentIncome, 'investmentIncome');
  
  // Calculate the gap between expenses and passive income
  // Positive result means you need to withdraw additional funds
  // Negative result means your investment income exceeds expenses
  return annualExpenses - investmentIncome;
}

/**
 * Calculates maximum safe withdrawal amount for retirement
 * 
 * Ensures safe withdrawal rates to preserve wealth for future years.
 * Formula: Max Withdrawal = min(Shortfall, Total Wealth - Future Needs)
 * 
 * 
 * @example
 * const maxWithdrawal = calculateMaxWithdrawal(58584, 6000, 800000, 20);
 * // Returns: 0 (insufficient funds for safe withdrawal)
 * 
 * @throws {Error} If input validation fails
 */
export function calculateMaxWithdrawal(annualExpenses: number, investmentIncome: number, totalWealth: number, yearsRemaining: number): number {
  validateNonNegativeNumber(annualExpenses, 'annualExpenses');
  validateNonNegativeNumber(investmentIncome, 'investmentIncome');
  validateNonNegativeNumber(totalWealth, 'totalWealth');
  validateRange(yearsRemaining, 0, 100, 'yearsRemaining');
  
  const shortfall = calculateRetirementShortfall(annualExpenses, investmentIncome);
  const futureYears = yearsRemaining - 1;
  const futureExpenseNeeds = futureYears * annualExpenses;
  const availableForWithdrawal = totalWealth - futureExpenseNeeds;
  const maxSafeWithdrawal = Math.max(0, availableForWithdrawal);
  
  if (shortfall <= 0) return 0;
  
  return Math.min(shortfall, maxSafeWithdrawal);
}
