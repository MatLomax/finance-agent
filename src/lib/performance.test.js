/**
 * @fileoverview Performance tests for all calculation functions
 * 
 * Tests that all calculation functions complete within performance thresholds
 * when called together. This ensures the pure functions remain fast and
 * don't introduce performance regressions.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

// Direct imports from domain modules (no barrel files)
import { convertUsdToEur, convertEurToThb } from './currency.js';
import { calculateNetSalary } from './tax.js';
import { 
  calculateMonthlyExpenses, 
  calculateAnnualExpenses, 
  calculateEmergencyFundTarget 
} from './expenses.js';
import { 
  calculateInvestmentGrossIncome, 
  calculateInvestmentNetIncome 
} from './investments.js';
import { 
  calculateRetirementShortfall, 
  calculateMaxWithdrawal 
} from './retirement.js';
import { 
  calculateDebtPayment, 
  calculateAllocationAmounts 
} from './allocations.js';
import { 
  calculatePercentageGrowth, 
  calculateAbsoluteGrowth 
} from './growth.js';

describe('Performance Tests', () => {
  it('should complete all function calls within 50ms total', () => {
    const startTime = performance.now();
    
    // Run a representative sample of all functions
    convertUsdToEur(9000, 1.17);
    convertEurToThb(1000, 37.75);
    calculateNetSalary(7692.31, 0.17);
    calculateMonthlyExpenses({
      housing: 1400, utilities: 200, diningGroceries: 750,
      hiredStaff: 340, transportation: 100, healthInsurance: 550,
      petCare: 120, wellness: 605, entertainment: 150,
      weekendTrips: 167, annualHoliday: 750, discretionary: 350
    });
    calculateAnnualExpenses(4882);
    calculateEmergencyFundTarget(4882);
    calculateInvestmentGrossIncome(100000, 0.06);
    calculateInvestmentNetIncome(6000, 0.17);
    calculateRetirementShortfall(58584, 6000);
    calculateMaxWithdrawal(58584, 6000, 800000, 20);
    calculateDebtPayment(5000, 8000);
    calculateAllocationAmounts(10000, 0.8, 0.1, 0.1);
    calculatePercentageGrowth(110000, 100000);
    calculateAbsoluteGrowth(110000, 100000);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // All pure functions should complete very quickly
    assert.ok(executionTime < 50, `Execution time ${executionTime}ms exceeds 50ms limit`);
  });
});
