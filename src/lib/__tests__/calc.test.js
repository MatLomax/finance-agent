/**
 * @fileoverview Comprehensive tests for calc.js pure mathematical functions
 * 
 * Tests all pure mathematical functions extracted from Thailand.html with:
 * - Valid input scenarios with expected outputs
 * - Invalid input validation and error handling
 * - Edge cases and boundary conditions
 * - Performance validation (must complete in <50ms per rule)
 * 
 * Uses Node.js native test runner for zero dependencies and fast execution.
 */

import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  calculateAbsoluteGrowth,
  calculateAllocationAmounts,
  calculateAnnualExpenses,
  calculateDebtPayment,
  calculateEmergencyFundTarget,
  calculateInvestmentGrossIncome,
  calculateInvestmentNetIncome,
  calculateMaxWithdrawal,
  calculateMonthlyExpenses,
  calculateNetSalary,
  calculatePercentageGrowth,
  calculateRetirementShortfall,
  convertEurToThb,
  convertUsdToEur
} from '../calc.js';

// =============================================================================
// CURRENCY CONVERSION TESTS
// =============================================================================

describe('Currency Conversion Functions', () => {
  describe('convertUsdToEur', () => {
    it('should convert USD to EUR correctly', () => {
      const result = convertUsdToEur(9000, 1.17);
      assert.strictEqual(Math.round(result * 100) / 100, 7692.31);
    });

    it('should handle zero USD amount', () => {
      const result = convertUsdToEur(0, 1.17);
      assert.strictEqual(result, 0);
    });

    it('should throw error for negative USD amount', () => {
      assert.throws(() => convertUsdToEur(-100, 1.17), /Validation failed/);
    });

    it('should throw error for zero exchange rate', () => {
      assert.throws(() => convertUsdToEur(1000, 0), /Validation failed/);
    });

    it('should throw error for negative exchange rate', () => {
      assert.throws(() => convertUsdToEur(1000, -1.17), /Validation failed/);
    });
  });

  describe('convertEurToThb', () => {
    it('should convert EUR to THB correctly', () => {
      const result = convertEurToThb(1000, 37.75);
      assert.strictEqual(result, 37750);
    });

    it('should handle zero EUR amount', () => {
      const result = convertEurToThb(0, 37.75);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional amounts', () => {
      const result = convertEurToThb(100.50, 37.75);
      assert.strictEqual(result, 3793.875);
    });

    it('should throw error for negative EUR amount', () => {
      assert.throws(() => convertEurToThb(-100, 37.75), /Validation failed/);
    });

    it('should throw error for zero exchange rate', () => {
      assert.throws(() => convertEurToThb(1000, 0), /Validation failed/);
    });
  });
});

// =============================================================================
// TAX CALCULATION TESTS
// =============================================================================

describe('Tax Calculation Functions', () => {
  describe('calculateNetSalary', () => {
    it('should calculate net salary with 17% tax rate', () => {
      const result = calculateNetSalary(7692.31, 0.17);
      assert.strictEqual(Math.round(result * 100) / 100, 6384.62);
    });

    it('should handle zero tax rate (tax-free)', () => {
      const result = calculateNetSalary(7692.31, 0);
      assert.strictEqual(result, 7692.31);
    });

    it('should handle 100% tax rate', () => {
      const result = calculateNetSalary(7692.31, 1);
      assert.strictEqual(result, 0);
    });

    it('should handle zero gross salary', () => {
      const result = calculateNetSalary(0, 0.17);
      assert.strictEqual(result, 0);
    });

    it('should throw error for negative gross salary', () => {
      assert.throws(() => calculateNetSalary(-1000, 0.17), /Validation failed/);
    });

    it('should throw error for tax rate above 100%', () => {
      assert.throws(() => calculateNetSalary(1000, 1.5), /Validation failed/);
    });

    it('should throw error for negative tax rate', () => {
      assert.throws(() => calculateNetSalary(1000, -0.1), /Validation failed/);
    });
  });
});

// =============================================================================
// EXPENSE CALCULATION TESTS
// =============================================================================

describe('Expense Calculation Functions', () => {
  const sampleExpenses = {
    housing: 1400,
    utilities: 200,
    diningGroceries: 750,
    hiredStaff: 340,
    transportation: 100,
    healthInsurance: 550,
    petCare: 120,
    wellness: 605,
    entertainment: 150,
    weekendTrips: 167,
    annualHoliday: 750,
    discretionary: 350
  };

  describe('calculateMonthlyExpenses', () => {
    it('should sum all expense categories correctly', () => {
      const result = calculateMonthlyExpenses(sampleExpenses);
      assert.strictEqual(result, 5482);
    });

    it('should handle zero expenses', () => {
      const zeroExpenses = Object.fromEntries(
        Object.keys(sampleExpenses).map(key => [key, 0])
      );
      const result = calculateMonthlyExpenses(zeroExpenses);
      assert.strictEqual(result, 0);
    });

    it('should handle single expense category', () => {
      const result = calculateMonthlyExpenses({ housing: 1000 });
      assert.strictEqual(result, 1000);
    });

    it('should throw error for negative expense values', () => {
      const invalidExpenses = { ...sampleExpenses, housing: -100 };
      assert.throws(() => calculateMonthlyExpenses(invalidExpenses), /non-negative numbers/);
    });

    it('should throw error for non-number expense values', () => {
      const invalidExpenses = { ...sampleExpenses, housing: 'invalid' };
      assert.throws(() => calculateMonthlyExpenses(invalidExpenses), /non-negative numbers/);
    });
  });

  describe('calculateAnnualExpenses', () => {
    it('should multiply monthly expenses by 12', () => {
      const result = calculateAnnualExpenses(4882);
      assert.strictEqual(result, 58584);
    });

    it('should handle zero monthly expenses', () => {
      const result = calculateAnnualExpenses(0);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional monthly expenses', () => {
      const result = calculateAnnualExpenses(1000.50);
      assert.strictEqual(result, 12006);
    });

    it('should throw error for negative monthly expenses', () => {
      assert.throws(() => calculateAnnualExpenses(-1000), /non-negative number/);
    });

    it('should throw error for non-number input', () => {
      assert.throws(() => calculateAnnualExpenses('invalid'), /non-negative number/);
    });
  });

  describe('calculateEmergencyFundTarget', () => {
    it('should multiply monthly expenses by 6', () => {
      const result = calculateEmergencyFundTarget(4882);
      assert.strictEqual(result, 29292);
    });

    it('should handle zero monthly expenses', () => {
      const result = calculateEmergencyFundTarget(0);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional monthly expenses', () => {
      const result = calculateEmergencyFundTarget(1000.50);
      assert.strictEqual(result, 6003);
    });

    it('should throw error for negative monthly expenses', () => {
      assert.throws(() => calculateEmergencyFundTarget(-1000), /non-negative number/);
    });
  });
});

// =============================================================================
// INVESTMENT CALCULATION TESTS
// =============================================================================

describe('Investment Calculation Functions', () => {
  describe('calculateInvestmentGrossIncome', () => {
    it('should calculate 6% return on €100,000', () => {
      const result = calculateInvestmentGrossIncome(100000, 0.06);
      assert.strictEqual(result, 6000);
    });

    it('should handle zero principal', () => {
      const result = calculateInvestmentGrossIncome(0, 0.06);
      assert.strictEqual(result, 0);
    });

    it('should handle zero return rate', () => {
      const result = calculateInvestmentGrossIncome(100000, 0);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional rates', () => {
      const result = calculateInvestmentGrossIncome(100000, 0.065);
      assert.strictEqual(result, 6500);
    });

    it('should throw error for negative principal', () => {
      assert.throws(() => calculateInvestmentGrossIncome(-100000, 0.06), /Validation failed/);
    });

    it('should throw error for negative rate', () => {
      assert.throws(() => calculateInvestmentGrossIncome(100000, -0.06), /Validation failed/);
    });

    it('should throw error for rate above 100%', () => {
      assert.throws(() => calculateInvestmentGrossIncome(100000, 1.5), /Validation failed/);
    });
  });

  describe('calculateInvestmentNetIncome', () => {
    it('should calculate tax on investment income', () => {
      const result = calculateInvestmentNetIncome(6000, 0.17);
      assert.strictEqual(Math.round(result * 100) / 100, 1020);
    });

    it('should handle zero gross income', () => {
      const result = calculateInvestmentNetIncome(0, 0.17);
      assert.strictEqual(result, 0);
    });

    it('should handle zero tax rate', () => {
      const result = calculateInvestmentNetIncome(6000, 0);
      assert.strictEqual(result, 0);
    });

    it('should handle 100% tax rate', () => {
      const result = calculateInvestmentNetIncome(6000, 1);
      assert.strictEqual(result, 6000);
    });

    it('should throw error for negative gross income', () => {
      assert.throws(() => calculateInvestmentNetIncome(-6000, 0.17), /Validation failed/);
    });
  });
});

// =============================================================================
// RETIREMENT CALCULATION TESTS
// =============================================================================

describe('Retirement Calculation Functions', () => {
  describe('calculateRetirementShortfall', () => {
    it('should calculate shortfall when expenses exceed income', () => {
      const result = calculateRetirementShortfall(58584, 6000);
      assert.strictEqual(result, 52584);
    });

    it('should return negative when income exceeds expenses', () => {
      const result = calculateRetirementShortfall(50000, 60000);
      assert.strictEqual(result, -10000);
    });

    it('should return zero when income equals expenses', () => {
      const result = calculateRetirementShortfall(50000, 50000);
      assert.strictEqual(result, 0);
    });

    it('should handle zero expenses', () => {
      const result = calculateRetirementShortfall(0, 6000);
      assert.strictEqual(result, -6000);
    });

    it('should handle zero income', () => {
      const result = calculateRetirementShortfall(58584, 0);
      assert.strictEqual(result, 58584);
    });
  });

  describe('calculateMaxWithdrawal', () => {
    it('should limit withdrawal based on future needs', () => {
      // Scenario: Need €52,584 but only have enough for 10 years
      const result = calculateMaxWithdrawal(58584, 6000, 585840, 20);
      // Future needs: (20-1) × 58584 = 1,113,096
      // Available: 585,840 - 1,113,096 = -527,256 (insufficient)
      assert.strictEqual(result, 0);
    });

    it('should allow full shortfall when sufficient wealth', () => {
      // Scenario: Have plenty of wealth for all years
      const result = calculateMaxWithdrawal(58584, 6000, 2000000, 20);
      // Shortfall: 58584 - 6000 = 52584
      // Future needs: (20-1) × 58584 = 1,113,096  
      // Available: 2,000,000 - 1,113,096 = 886,904 (sufficient)
      assert.strictEqual(result, 52584);
    });

    it('should handle case where income exceeds expenses', () => {
      const result = calculateMaxWithdrawal(50000, 60000, 500000, 10);
      // Shortfall is negative, so max withdrawal should be 0
      assert.strictEqual(result, 0);
    });

    it('should handle single year remaining', () => {
      const result = calculateMaxWithdrawal(58584, 6000, 100000, 1);
      // Future needs: (1-1) × 58584 = 0
      // Available: 100,000 - 0 = 100,000
      // Shortfall: 58584 - 6000 = 52584
      assert.strictEqual(result, 52584);
    });

    it('should handle zero years remaining', () => {
      const result = calculateMaxWithdrawal(58584, 6000, 100000, 0);
      // Future needs: (0-1) × 58584 = -58584 (negative years)
      // Available: 100,000 - (-58584) = 158,584
      // Shortfall: 58584 - 6000 = 52584
      assert.strictEqual(result, 52584);
    });
  });
});

// =============================================================================
// ALLOCATION AND PAYMENT TESTS
// =============================================================================

describe('Allocation and Payment Functions', () => {
  describe('calculateDebtPayment', () => {
    it('should pay full debt when payment exceeds debt', () => {
      const result = calculateDebtPayment(5000, 8000);
      assert.strictEqual(result, 5000);
    });

    it('should pay available amount when debt exceeds payment', () => {
      const result = calculateDebtPayment(10000, 3000);
      assert.strictEqual(result, 3000);
    });

    it('should handle zero debt', () => {
      const result = calculateDebtPayment(0, 5000);
      assert.strictEqual(result, 0);
    });

    it('should handle zero payment available', () => {
      const result = calculateDebtPayment(5000, 0);
      assert.strictEqual(result, 0);
    });

    it('should handle negative available payment', () => {
      const result = calculateDebtPayment(5000, -1000);
      assert.strictEqual(result, 0);
    });

    it('should throw error for negative debt', () => {
      assert.throws(() => calculateDebtPayment(-5000, 1000), /Validation failed/);
    });
  });

  describe('calculateAllocationAmounts', () => {
    it('should allocate free capital correctly', () => {
      const result = calculateAllocationAmounts(10000, 0.8, 0.1, 0.1);
      assert.deepStrictEqual(result, {
        debt: 8000,
        savings: 1000,
        investment: 1000
      });
    });

    it('should handle zero free capital', () => {
      const result = calculateAllocationAmounts(0, 0.8, 0.1, 0.1);
      assert.deepStrictEqual(result, {
        debt: 0,
        savings: 0,
        investment: 0
      });
    });

    it('should handle negative free capital', () => {
      const result = calculateAllocationAmounts(-1000, 0.8, 0.1, 0.1);
      assert.deepStrictEqual(result, {
        debt: -800,
        savings: -100,
        investment: -100
      });
    });

    it('should handle zero allocations', () => {
      const result = calculateAllocationAmounts(10000, 0, 0, 0);
      assert.deepStrictEqual(result, {
        debt: 0,
        savings: 0,
        investment: 0
      });
    });

    it('should handle 100% single allocation', () => {
      const result = calculateAllocationAmounts(10000, 1, 0, 0);
      assert.deepStrictEqual(result, {
        debt: 10000,
        savings: 0,
        investment: 0
      });
    });

    it('should throw error for allocation above 100%', () => {
      assert.throws(() => calculateAllocationAmounts(10000, 1.5, 0, 0), /Validation failed/);
    });

    it('should throw error for negative allocation', () => {
      assert.throws(() => calculateAllocationAmounts(10000, -0.1, 0, 0), /Validation failed/);
    });
  });
});

// =============================================================================
// PERCENTAGE AND GROWTH TESTS
// =============================================================================

describe('Percentage and Growth Functions', () => {
  describe('calculatePercentageGrowth', () => {
    it('should calculate positive growth percentage', () => {
      const result = calculatePercentageGrowth(110000, 100000);
      assert.strictEqual(result, 10);
    });

    it('should calculate negative growth percentage', () => {
      const result = calculatePercentageGrowth(90000, 100000);
      assert.strictEqual(result, -10);
    });

    it('should handle zero growth', () => {
      const result = calculatePercentageGrowth(100000, 100000);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional growth', () => {
      const result = calculatePercentageGrowth(105000, 100000);
      assert.strictEqual(result, 5);
    });

    it('should handle negative current value', () => {
      const result = calculatePercentageGrowth(-50000, 100000);
      assert.strictEqual(result, -150);
    });

    it('should handle negative previous value', () => {
      const result = calculatePercentageGrowth(50000, -100000);
      assert.strictEqual(result, -150);
    });

    it('should throw error for zero previous value', () => {
      assert.throws(() => calculatePercentageGrowth(110000, 0), /Previous value cannot be zero/);
    });
  });

  describe('calculateAbsoluteGrowth', () => {
    it('should calculate positive absolute growth', () => {
      const result = calculateAbsoluteGrowth(110000, 100000);
      assert.strictEqual(result, 10000);
    });

    it('should calculate negative absolute growth', () => {
      const result = calculateAbsoluteGrowth(90000, 100000);
      assert.strictEqual(result, -10000);
    });

    it('should handle zero growth', () => {
      const result = calculateAbsoluteGrowth(100000, 100000);
      assert.strictEqual(result, 0);
    });

    it('should handle negative values', () => {
      const result = calculateAbsoluteGrowth(-50000, -60000);
      assert.strictEqual(result, 10000);
    });

    it('should handle zero values', () => {
      const result = calculateAbsoluteGrowth(0, 100000);
      assert.strictEqual(result, -100000);
    });

    it('should handle fractional values', () => {
      const result = calculateAbsoluteGrowth(100.50, 100.25);
      assert.strictEqual(result, 0.25);
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

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
