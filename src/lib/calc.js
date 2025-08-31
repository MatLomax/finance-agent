/**
 * @fileoverview Backward compatibility layer for split calculation modules
 * 
 * This file maintains compatibility with existing imports while providing
 * access to the new modular structure. All functions are now organized
 * into focused domain modules for better maintainability.
 */

// Re-export all functions for backward compatibility
export { convertUsdToEur, convertEurToThb } from './currency/index.js';
export { calculateNetSalary } from './tax/index.js';
export { 
  calculateMonthlyExpenses, 
  calculateAnnualExpenses, 
  calculateEmergencyFundTarget 
} from './expenses/index.js';
export { 
  calculateInvestmentGrossIncome, 
  calculateInvestmentNetIncome 
} from './investments/index.js';
export { 
  calculateRetirementShortfall, 
  calculateMaxWithdrawal 
} from './retirement/index.js';
export { 
  calculateDebtPayment, 
  calculateAllocationAmounts 
} from './allocations/index.js';
export { 
  calculatePercentageGrowth, 
  calculateAbsoluteGrowth 
} from './growth/index.js';
