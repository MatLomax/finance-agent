/**
 * @fileoverview Wealth Simulation Module
 * 
 * Core engine for multi-phase financial planning and wealth trajectory modeling.
 * This module simulates year-by-year financial progression through three key phases:
 * 1. Debt Elimination Phase - Focus on paying off debts
 * 2. Emergency Fund Phase - Building 6-month expense buffer  
 * 3. Retirement Phase - Accumulating wealth for retirement
 * 
 * The simulation uses dynamic allocation strategies that automatically adjust
 * based on current financial state, ensuring optimal capital deployment.
 */

import { clamp } from 'lodash-es';
import { processSimulationYear } from './simulation-helpers.js';

// JSDoc type definitions for wealth simulation
// See individual modules for more detailed type definitions

/**
 * Determines current financial phase based on debt and emergency fund status
 * 
 * @param {number} debt - Current debt balance
 * @param {number} savings - Current savings balance  
 * @param {number} emergencyFundTarget - Required emergency fund amount
 * @returns {'debt'|'emergency'|'retirement'} Current financial phase
 */
export function determineFinancialPhase(debt, savings, emergencyFundTarget) {
  if (debt > 0) {
    return 'debt';
  } else if (savings < emergencyFundTarget) {
    return 'emergency';
  } else {
    return 'retirement';
  }
}

/**
 * Calculates allocation amounts based on current phase and available capital
 * 
 * Phase-based allocation strategy:
 * - Debt Phase: Aggressive debt paydown (80% debt, 10% savings, 10% investments)
 * - Emergency Phase: Build safety net (0% debt, 70% savings, 30% investments)  
 * - Retirement Phase: Wealth accumulation (0% debt, 20% savings, 80% investments)
 * 
 * @param {number} freeCapital - Available capital for allocation
 * @param {string} phase - Current financial phase
 * @param {any} allocations - Allocation percentages for each phase
 * @param {number} currentDebt - Current debt balance for capping debt payments
 * @returns {any} Allocation amounts { debtPayment, savingsContribution, investmentContribution }
 */
export function calculateAllocationAmounts(freeCapital, phase, allocations, currentDebt = 0) {
  let phaseAllocations;
  
  switch (phase) {
  case 'debt':
    phaseAllocations = allocations.debtPhase;
    break;
  case 'emergency':
    phaseAllocations = allocations.emergencyPhase;
    break;
  case 'retirement':
    phaseAllocations = allocations.retirementPhase;
    break;
  default:
    throw new Error(`Unknown financial phase: ${phase}`);
  }
  
  // Convert percentages to decimals
  const debtAlloc = phaseAllocations.debt / 100;
  const savingsAlloc = phaseAllocations.savings / 100;
  const investmentAlloc = phaseAllocations.investments / 100;
  
  // Calculate allocation amounts
  const debtPayment = clamp(freeCapital * debtAlloc, 0, currentDebt);
  const savingsContribution = freeCapital * savingsAlloc;
  const investmentContribution = freeCapital * investmentAlloc;
  
  return {
    debtPayment,
    savingsContribution,
    investmentContribution
  };
}

/**
 * Calculates retirement withdrawal strategy to cover annual expenses
 * 
 * Withdrawal priority:
 * 1. Use investment income first
 * 2. Withdraw from savings if needed
 * 3. Sell investments as last resort
 * 4. Ensure sufficient wealth remains for future years
 * 
 * @param {number} annualExpenses - Required annual expenses in retirement
 * @param {number} investmentNetIncome - Annual net income from investments
 * @param {number} savings - Current savings balance
 * @param {number} investments - Current investment balance
 * @param {number} yearsRemaining - Years of life remaining
 * @returns {any} Withdrawal amounts { savingsWithdrawal, investmentSale }
 */
export function calculateRetirementWithdrawal(
  annualExpenses, 
  investmentNetIncome, 
  savings, 
  investments, 
  yearsRemaining
) {
  // Calculate shortfall after investment income
  const shortfall = annualExpenses - investmentNetIncome;
  
  if (shortfall <= 0) {
    // Investment income covers all expenses
    return { savingsWithdrawal: 0, investmentSale: 0 };
  }
  
  // Ensure we never deplete wealth below what's needed for future years
  const futureExpensesNeeded = Math.max(0, (yearsRemaining - 1) * annualExpenses);
  const totalCurrentWealth = savings + investments;
  const maxWithdrawal = Math.max(0, totalCurrentWealth - futureExpensesNeeded);
  
  // Limit withdrawal to what's available and needed
  const actualWithdrawal = Math.min(shortfall, maxWithdrawal);
  
  // Withdraw from savings first, then investments
  const savingsWithdrawal = Math.min(savings, actualWithdrawal);
  const investmentSale = Math.max(0, actualWithdrawal - savingsWithdrawal);
  
  return { savingsWithdrawal, investmentSale };
}

/**
 * Simulates wealth trajectory for a single retirement age scenario
 * 
 * This is the core simulation engine that models year-by-year financial progression
 * from current age to lifespan, automatically transitioning between financial phases
 * and applying appropriate allocation strategies.
 * 
 * @param {any} input - Simulation input parameters (validated against schema)
 * @param {number} retirementAge - Target retirement age to test
 * @returns {any[]} Year-by-year simulation results with financial details
 */
export function simulateWealthTrajectory(input, retirementAge) {
  const { currentAge, lifespan, totalDebt, totalSavings, totalInvestments,
    grossSalaryMonthly, taxRate, investmentReturnRate, monthlyExpenses, allocations,
    emergencyFundMonths = 6 } = input;
  
  let debt = totalDebt;
  let savings = totalSavings;
  let investments = totalInvestments;
  
  const results = [];
  const annualExpenses = monthlyExpenses * 12;
  const emergencyFundTarget = monthlyExpenses * emergencyFundMonths;
  const netSalaryMonthly0 = grossSalaryMonthly;
  const netSalaryMonthly1 = grossSalaryMonthly * (1 - taxRate);
  
  for (let age = currentAge; age <= lifespan; age++) {
    const yearResult = processSimulationYear({
      age, currentAge, retirementAge, debt, savings, investments,
      annualExpenses, emergencyFundTarget, netSalaryMonthly0, netSalaryMonthly1,
      investmentReturnRate, taxRate, lifespan, allocations
    });
    
    debt = yearResult.debt;
    savings = yearResult.savings;
    investments = yearResult.investments;
    results.push(yearResult);
  }
  
  return results;
}

// Helper functions for processing simulation years - moved to separate modules for brevity

// Optimal retirement age functions moved to optimal-retirement.js
export { findOptimalRetirementAge } from './optimal-retirement.js';

// Phase organization functions moved to phase-organization.js
export { organizeSimulationByPhases } from './phase-organization.js';
