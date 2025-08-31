/**
 * @fileoverview Backward compatibility layer for split calculation modules
 * 
 * This file maintains compatibility with existing imports while providing
 * access to the new modular structure. All functions are now organized
 * into focused domain modules for better maintainability.
 */

// Re-export all functions for backward compatibility
export { convertUsdToEur, convertEurToThb } from './currency.js';
export { calculateNetSalary } from './tax.js';
export { 
  calculateMonthlyExpenses, 
  calculateAnnualExpenses, 
  calculateEmergencyFundTarget 
} from './expenses.js';
export { 
  calculateInvestmentGrossIncome, 
  calculateInvestmentNetIncome 
} from './investments.js';
export { 
  calculateRetirementShortfall, 
  calculateMaxWithdrawal 
} from './retirement.js';
export { 
  calculateDebtPayment, 
  calculateAllocationAmounts 
} from './allocations.js';
export { 
  calculatePercentageGrowth, 
  calculateAbsoluteGrowth 
} from './growth.js';
