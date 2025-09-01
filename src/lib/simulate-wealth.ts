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
import type {
  AllocationAmounts,
  FinancialAllocations,
  FinancialPhase,
  SimulationInput,
  SimulationYearParams,
  YearlySimulationData,
  WealthSimulationResult,
  RetirementWithdrawal
} from '../types/index.js';
import { processSimulationYear } from './simulation-helpers.ts';

// JSDoc type definitions for wealth simulation
// See individual modules for more detailed type definitions

/**
 * Determines current financial phase based on debt and emergency fund status
 * 
 * @param debt - Current debt balance
 * @param savings - Current savings balance  
 * @param emergencyFundTarget - Required emergency fund amount
 * @returns Current financial phase
 */
export function determineFinancialPhase(
  debt: number, 
  savings: number, 
  emergencyFundTarget: number
): FinancialPhase {
  if (debt > 0) {
    return 'debt';
  } else if (savings < emergencyFundTarget) {
    return 'emergency';
  } else {
    return 'retirement';
  }
}

/**
 * Calculate allocation amounts for each category based on phase
 * 
 * @param freeCapital - Available capital for allocation
 * @param phase - Current financial phase
 * @param allocations - Phase-specific allocation percentages
 * @param currentDebt - Current debt balance (for debt payment cap)
 * @returns Allocation amounts { debtPayment, savingsContribution, investmentContribution }
 */
export function calculateAllocationAmounts(
  freeCapital: number, 
  phase: FinancialPhase, 
  allocations: FinancialAllocations, 
  currentDebt: number = 0
): AllocationAmounts {
  let phaseAllocations: any;
  
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
  
  // Calculate raw allocation amounts
  const rawDebtPayment = freeCapital * debtAlloc;
  const savingsContribution = freeCapital * savingsAlloc;
  const investmentContribution = freeCapital * investmentAlloc;
  
  // Cap debt payment at available debt balance
  const debtPayment = clamp(rawDebtPayment, 0, currentDebt);
  
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





 * @returns {any} Withdrawal amounts { savingsWithdrawal, investmentSale }
 */
export function calculateRetirementWithdrawal(
  annualExpenses: number,
  investmentNetIncome: number,
  savings: number,
  investments: number,
  yearsRemaining: number
): RetirementWithdrawal {
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


 * @returns {any[]} Year-by-year simulation results with financial details
 */
export function simulateWealthTrajectory(input: SimulationInput, retirementAge: number): YearlySimulationData[] {
  const { currentAge, lifespan, totalDebt, totalSavings, totalInvestments,
    grossSalaryMonthly, taxRate, investmentReturnRate, monthlyExpenses, allocations,
    emergencyFundMonths = 6 } = input;
  
  let debt = totalDebt;
  let savings = totalSavings;
  let investments = totalInvestments;
  
  const results: any[] = [];
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
