/**
 * @fileoverview Financial allocation and debt payment calculation functions
 * 
 * This module handles allocation strategies and debt payment calculations.
 * Essential for optimizing cash flow between debt elimination, savings,
 * and investment goals in personal finance planning.
 * 
 * All functions are pure with TypeBox validation and educational documentation.
 */

import { clamp } from 'lodash-es';
import { Type } from '@sinclair/typebox';
import { validate } from './validators.js';



/**
 * Schema for allocation calculations
 */
const AllocationSchema = Type.Object({
  freeCapital: Type.Number(),
  debtAllocation: Type.Number({ minimum: 0, maximum: 1 }),
  savingsAllocation: Type.Number({ minimum: 0, maximum: 1 }),
  investmentAllocation: Type.Number({ minimum: 0, maximum: 1 })
});

/**
 * Schema for debt payment calculations
 */
const DebtPaymentSchema = Type.Object({
  currentDebt: Type.Number({ minimum: 0 }),
  availablePayment: Type.Number()
});



/**
 * Calculates optimal debt payment amount
 * 
 * Debt payment is the minimum of:
 * 1. Current debt balance (can't pay more than you owe)
 * 2. Available payment amount (can't pay more than you have)
 * 
 * @param {number} currentDebt - Current debt balance (must be positive)
 * @param {number} availablePayment - Available payment amount (must be positive)
 * @returns {number} Optimal debt payment amount
 * 
 * @example
 * const payment = calculateDebtPayment(5000, 8000);
 * // Returns: 5000
 * // Explanation: Can pay off entire €5,000 debt with €8,000 available
 * 
 * @throws {Error} If input validation fails
 */
export function calculateDebtPayment(currentDebt, availablePayment) {
  validate(DebtPaymentSchema, { currentDebt, availablePayment });
  
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
 * @param {number} freeCapital - Available free capital for allocation
 * @param {number} debtAllocation - Debt allocation percentage (0-1)
 * @param {number} savingsAllocation - Savings allocation percentage (0-1)  
 * @param {number} investmentAllocation - Investment allocation percentage (0-1)
 * @returns {Object} Allocation amounts for each category
 * 
 * @example
 * const allocations = calculateAllocationAmounts(10000, 0.8, 0.1, 0.1);
 * // Returns: { debt: 8000, savings: 1000, investment: 1000 }
 * // Explanation: €10,000 × 80% = €8,000 to debt, etc.
 * 
 * @throws {Error} If input validation fails
 */
export function calculateAllocationAmounts(freeCapital, debtAllocation, savingsAllocation, investmentAllocation) {
  validate(AllocationSchema, { 
    freeCapital, 
    debtAllocation, 
    savingsAllocation, 
    investmentAllocation 
  });
  
  // Apply percentage allocations to free capital
  // Each allocation represents how much of free capital goes to each category
  return {
    debt: freeCapital * debtAllocation,
    savings: freeCapital * savingsAllocation,
    investment: freeCapital * investmentAllocation
  };
}
