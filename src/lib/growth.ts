/**
 * @fileoverview Growth and change calculation functions for financial analysis
 * 
 * This module provides percentage and absolute growth calculations used
 * throughout the finance agent for tracking portfolio performance,
 * wealth progression, and financial metrics over time.
 * 
 * All functions are pure with TypeScript type safety and educational documentation.
 */

import { validateNumber } from './validators.js';

/**
 * Calculates percentage growth between two values
 * 
 * Uses the formula: Growth % = ((Current - Previous) / Previous) × 100
 * This is the standard percentage change calculation used in finance.
 * 
 * 
 * @example
 * const growth = calculatePercentageGrowth(110000, 100000);
 * // Returns: 10
 * // Explanation: ((€110,000 - €100,000) / €100,000) × 100 = 10%
 * 
 * @throws {Error} If previous value is zero or validation fails
 */
export function calculatePercentageGrowth(current: number, previous: number): number {
  validateNumber(current, 'current');
  validateNumber(previous, 'previous');
  
  if (previous === 0) {
    throw new Error('Previous value cannot be zero for percentage calculation');
  }
  
  // Calculate the change amount
  const change = current - previous;
  
  // Calculate percentage change: (change / original) × 100
  // This gives us the percentage increase or decrease
  const percentageChange = (change / previous) * 100;
  
  return percentageChange;
}

/**
 * Calculates absolute growth between two values
 * 
 * Simple subtraction: Growth = Current - Previous
 * Used to show absolute change in monetary amounts.
 * 
 * 
 * @example
 * const growth = calculateAbsoluteGrowth(110000, 100000);
 * // Returns: 10000
 * // Explanation: €110,000 - €100,000 = €10,000 absolute growth
 * 
 * @throws {Error} If input validation fails
 */
export function calculateAbsoluteGrowth(current: number, previous: number): number {
  validateNumber(current, 'current');
  validateNumber(previous, 'previous');
  
  // Simple subtraction to get absolute change
  // Positive result indicates growth, negative indicates decline
  return current - previous;
}
