/**
 * @fileoverview Helper functions for wealth simulation processing
 */

import {
  calculateAllocationAmounts,
  calculateRetirementWithdrawal,
  determineFinancialPhase
} from './simulate-wealth.js';

/**
 * Helper function to process a single simulation year
 */
export function processSimulationYear(params: SimulationYearParams): SimulationYearResult {
  const { age, currentAge, retirementAge, debt, savings, investments,
    annualExpenses, emergencyFundTarget, netSalaryMonthly0, netSalaryMonthly1,
    investmentReturnRate, taxRate, lifespan, allocations } = params;

  const yearsFromStart = age - currentAge;
  const isRetired = age >= retirementAge;

  if (yearsFromStart === 0) {
    return { age, debt, savings, investments, isRetired: false, freeCapital: 0,
      investmentGrossIncome: 0, investmentNetIncome: 0, savingsWithdrawal: 0,
      investmentSale: 0, phase: determineFinancialPhase(debt, savings, emergencyFundTarget) };
  }

  const investmentGrossIncome = investments * (investmentReturnRate / 100);
  const investmentNetIncome = investmentGrossIncome * (1 - taxRate);

  if (isRetired) {
    return processRetirementYear({ age, debt, savings, investments, annualExpenses,
      investmentNetIncome, investmentGrossIncome, lifespan, emergencyFundTarget });
  }
  
  return processWorkingYear({ age, debt, savings, investments, yearsFromStart, annualExpenses,
    emergencyFundTarget, netSalaryMonthly0, netSalaryMonthly1,
    investmentNetIncome, investmentGrossIncome, allocations });
}

/**

 */
function processRetirementYear(params: Pick<SimulationYearParams, 'age' | 'debt' | 'savings' | 'investments' | 'annualExpenses' | 'emergencyFundTarget' | 'lifespan'> & { investmentNetIncome: number; investmentGrossIncome: number }): SimulationYearResult {
  const { age, debt, savings, investments, annualExpenses,
    investmentNetIncome, investmentGrossIncome, lifespan, emergencyFundTarget } = params;
  
  const withdrawal = calculateRetirementWithdrawal(annualExpenses, investmentNetIncome,
    savings, investments, lifespan - age);
  
  return { 
    age, debt, 
    savings: savings - withdrawal.savingsWithdrawal,
    investments: investments - withdrawal.investmentSale, 
    isRetired: true,
    freeCapital: -(withdrawal.savingsWithdrawal + withdrawal.investmentSale),
    investmentGrossIncome, investmentNetIncome,
    savingsWithdrawal: withdrawal.savingsWithdrawal, 
    investmentSale: withdrawal.investmentSale,
    phase: determineFinancialPhase(debt, savings, emergencyFundTarget) 
  };
}

/**

 */
function processWorkingYear(params: Pick<SimulationYearParams, 'age' | 'debt' | 'savings' | 'investments' | 'emergencyFundTarget' | 'allocations'> & { yearsFromStart: number; annualExpenses: number; netSalaryMonthly0: number; netSalaryMonthly1: number; investmentNetIncome: number; investmentGrossIncome: number }): SimulationYearResult {
  const { age, debt, savings, investments, yearsFromStart, annualExpenses,
    emergencyFundTarget, netSalaryMonthly0, netSalaryMonthly1,
    investmentNetIncome, investmentGrossIncome, allocations } = params;
  
  const netSalaryMonthly = yearsFromStart <= 2 ? netSalaryMonthly0 : netSalaryMonthly1;
  const freeCapital = netSalaryMonthly * 12 - annualExpenses + investmentNetIncome;
  const currentPhase = determineFinancialPhase(debt, savings, emergencyFundTarget);
  const allocationAmounts = calculateAllocationAmounts(freeCapital, currentPhase, allocations, debt);
  
  // Calculate new balances after allocations
  const newDebt = Math.max(0, debt - allocationAmounts.debtPayment);
  const newSavings = savings + allocationAmounts.savingsContribution;
  const newInvestments = investments + allocationAmounts.investmentContribution;
  
  // Determine phase based on new balances (after allocations)
  const finalPhase = determineFinancialPhase(newDebt, newSavings, emergencyFundTarget);
  
  return { 
    age, 
    debt: newDebt,
    savings: newSavings,
    investments: newInvestments,
    isRetired: false, freeCapital, investmentGrossIncome, investmentNetIncome,
    savingsWithdrawal: 0, investmentSale: 0, phase: finalPhase 
  };
}
