/**
 * @fileoverview Financial allocation and debt payment calculation functions
 * 
 * This module handles allocation strategies and debt payment calculations.
 * Essential for optimizing cash flow between debt elimination, savings,
 * and investment goals in personal finance planning.
 * 
 * All functions are pure with TypeScript type safety and educational documentation.
 */

import { clamp } from 'lodash-es';
import { validateNonNegativeNumber, validatePercentage, validateNumber } from './validators.js';
import type { AllocationAmounts } from '../types/index.js';
/**
 * Calculates optimal debt payment amount
 * 
 * Debt payment is the minimum of:
 * 1. Current debt balance (can't pay more than you owe)
 * 2. Available payment amount (can't pay more than you have)
 * 
 * 
 * @example
 * const payment = calculateDebtPayment(5000, 8000);
 * // Returns: 5000
 * // Explanation: Can pay off entire €5,000 debt with €8,000 available
 * 
 * @throws {Error} If input validation fails
 */
export function calculateDebtPayment(currentDebt: number, availablePayment: number): number {
  validateNonNegativeNumber(currentDebt, 'currentDebt');
  validateNumber(availablePayment, 'availablePayment');
  
  // Clamp the payment between 0 and current debt
  // This ensures we never overpay (pay more than debt balance)
  // and never pay negative amounts
  return clamp(availablePayment, 0, currentDebt);
}

/**
 * Calculates allocation amounts from free capital
 * 
 * Applies percentage allocations to free capital to determine
 * how much goes to debt payment, savings, and investments.
 * 
 * 
 * @example
 * const allocations = calculateAllocationAmounts(10000, 0.8, 0.1, 0.1);
 * // Returns: { debt: 8000, savings: 1000, investment: 1000 }
 * // Explanation: €10,000 × 80% = €8,000 to debt, etc.
 * 
 * @throws {Error} If input validation fails
 */
export function calculateAllocationAmounts(freeCapital: number, debtAllocation: number, savingsAllocation: number, investmentAllocation: number): AllocationAmounts {
  validateNumber(freeCapital, 'freeCapital');
  validatePercentage(debtAllocation, 'debtAllocation');
  validatePercentage(savingsAllocation, 'savingsAllocation');
  validatePercentage(investmentAllocation, 'investmentAllocation');
  
  // Apply percentage allocations to free capital
  // Each allocation represents how much of free capital goes to each category
  return {
    debtPayment: freeCapital * debtAllocation,
    savingsContribution: freeCapital * savingsAllocation,
    investmentContribution: freeCapital * investmentAllocation
  };
}
