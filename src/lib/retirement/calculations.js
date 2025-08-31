/**
 * @fileoverview Retirement planning and withdrawal calculation functions
 * 
 * This module handles retirement-specific calculations including expense shortfalls,
 * safe withdrawal rates, and wealth preservation strategies. Critical for
 * long-term financial independence planning.
 * 
 * All functions are pure with TypeBox validation and educational documentation.
 */

import { Type } from '@sinclair/typebox';
import { validate } from '../validators.js';

/**
 * Schema for retirement withdrawal calculations
 */
const RetirementWithdrawalSchema = Type.Object({
  annualExpenses: Type.Number({ minimum: 0 }),
  investmentIncome: Type.Number({ minimum: 0 }),
  totalWealth: Type.Number({ minimum: 0 }),
  yearsRemaining: Type.Integer({ minimum: 0 })
});

/**
 * Calculates retirement expense shortfall
 * 
 * Shortfall = Annual Expenses - Investment Income
 * This determines how much additional money needs to be withdrawn
 * from savings/investments to cover living expenses in retirement.
 * 
 * @param {number} annualExpenses - Annual living expenses (must be positive)
 * @param {number} investmentIncome - Annual investment income (must be positive)
 * @returns {number} Shortfall amount (can be negative if income exceeds expenses)
 * 
 * @example
 * const shortfall = calculateRetirementShortfall(58584, 6000);
 * // Returns: 52584
 * // Explanation: €58,584 expenses - €6,000 income = €52,584 shortfall
 * 
 * @throws {Error} If input validation fails
 */
export function calculateRetirementShortfall(annualExpenses, investmentIncome) {
  validate(RetirementWithdrawalSchema, { 
    annualExpenses, 
    investmentIncome, 
    totalWealth: 0, 
    yearsRemaining: 1 
  });
  
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
 * @param {number} annualExpenses - Annual living expenses
 * @param {number} investmentIncome - Annual investment income  
 * @param {number} totalWealth - Current total wealth (savings + investments)
 * @param {number} yearsRemaining - Years remaining in retirement
 * @returns {number} Maximum safe withdrawal amount
 * 
 * @example
 * const maxWithdrawal = calculateMaxWithdrawal(58584, 6000, 800000, 20);
 * // Returns: 0 (insufficient funds for safe withdrawal)
 * 
 * @throws {Error} If input validation fails
 */
export function calculateMaxWithdrawal(annualExpenses, investmentIncome, totalWealth, yearsRemaining) {
  validate(RetirementWithdrawalSchema, { 
    annualExpenses, 
    investmentIncome, 
    totalWealth, 
    yearsRemaining 
  });
  
  const shortfall = calculateRetirementShortfall(annualExpenses, investmentIncome);
  const futureYears = yearsRemaining - 1;
  const futureExpenseNeeds = futureYears * annualExpenses;
  const availableForWithdrawal = totalWealth - futureExpenseNeeds;
  const maxSafeWithdrawal = Math.max(0, availableForWithdrawal);
  
  if (shortfall <= 0) return 0;
  
  return Math.min(shortfall, maxSafeWithdrawal);
}
