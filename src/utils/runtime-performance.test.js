/**
 * @fileoverview Comprehensive runtime performance tests
 * 
 * Tests memory usage, main thread blocking, calculation benchmarks,
 * and mobile device simulation for all financial calculation functions.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

// Performance testing utilities
import { profileMemoryUsage, validateMemoryUsage } from '../utils/runtime-performance.js';
import { measureMainThreadBlocking, validateBlockingPerformance } from '../utils/main-thread-blocking.js';
import { benchmarkCalculations, validateCalculationBenchmarks } from '../utils/calculation-benchmarks.js';
import { simulateMobilePerformance, validateMobilePerformance } from '../utils/mobile-simulation.js';

// Financial calculation functions to test
import { convertUsdToEur } from '../lib/currency.js';
import { calculateNetSalary } from '../lib/tax.js';
import { calculateMonthlyExpenses } from '../lib/expenses.js';
import { calculateInvestmentGrossIncome } from '../lib/investments.js';
import { calculateAllocationAmounts } from '../lib/allocations.js';

// Test data for each function
const testData = {
  convertUsdToEur: [9000, 1.17],
  convertEurToThb: [1000, 37.75],
  calculateNetSalary: [7692.31, 0.17],
  calculateMonthlyExpenses: [{
    housing: 1400, utilities: 200, diningGroceries: 750,
    hiredStaff: 340, transportation: 100, healthInsurance: 550,
    petCare: 120, wellness: 605, entertainment: 150,
    weekendTrips: 167, annualHoliday: 750, discretionary: 350
  }],
  calculateAnnualExpenses: [4882],
  calculateEmergencyFundTarget: [4882],
  calculateInvestmentGrossIncome: [100000, 0.06],
  calculateInvestmentNetIncome: [6000, 0.17],
  calculateRetirementShortfall: [58584, 6000],
  calculateMaxWithdrawal: [58584, 6000, 800000, 20],
  calculateDebtPayment: [5000, 8000],
  calculateAllocationAmounts: [10000, 0.8, 0.1, 0.1],
  calculatePercentageGrowth: [110000, 100000],
  calculateAbsoluteGrowth: [110000, 100000]
};

// Functions to test (subset for focused testing)
const functionsToTest = {
  convertUsdToEur,
  calculateNetSalary,
  calculateMonthlyExpenses,
  calculateInvestmentGrossIncome,
  calculateAllocationAmounts
};

describe('Runtime Performance Tests', () => {
  describe('Memory Profiling', () => {
    it('should profile memory usage for currency conversion', () => {
      const profile = profileMemoryUsage(convertUsdToEur, ...testData.convertUsdToEur);
      const validation = validateMemoryUsage(profile);
      
      assert.ok(profile.executionTime >= 0, 'Should measure execution time');
      assert.ok(validation.isHealthy, 'Should pass memory usage validation');
      assert.ok(validation.memoryGrowthMB <= validation.threshold, 'Memory growth should be within limits');
    });

    it('should profile memory usage for complex calculations', () => {
      const profile = profileMemoryUsage(calculateMonthlyExpenses, ...testData.calculateMonthlyExpenses);
      const validation = validateMemoryUsage(profile);
      
      assert.ok(validation.isHealthy, 'Complex calculations should not cause memory issues');
    });
  });

  describe('Main Thread Blocking', () => {
    it('should measure blocking for all calculation functions', () => {
      for (const [funcName, func] of Object.entries(functionsToTest)) {
        const args = testData[funcName];
        const blocking = measureMainThreadBlocking(func, ...args);
        const validation = validateBlockingPerformance(blocking);
        
        assert.ok(blocking.measurements.length === 10, `Should run 10 iterations for ${funcName}`);
        assert.ok(validation.isHealthy, `${funcName} should not block main thread (${blocking.maxTime}ms)`);
        assert.ok(blocking.averageTime >= 0, `Should measure average time for ${funcName}`);
      }
    });
  });

  describe('Calculation Benchmarks', () => {
    it('should benchmark all calculation functions', () => {
      const benchmarks = benchmarkCalculations(functionsToTest, testData);
      const validation = validateCalculationBenchmarks(benchmarks);
      
      assert.ok(validation.isHealthy, `All functions should pass performance thresholds: ${validation.failures.join(', ')}`);
      assert.strictEqual(validation.summary.failed, 0, 'No functions should fail performance tests');
      assert.ok(validation.summary.total > 0, 'Should test multiple functions');
      
      // Verify each function has complete benchmark data
      for (const [funcName, result] of Object.entries(benchmarks)) {
        assert.ok(result.singleExecution.averageTime >= 0, `${funcName} should have single execution data`);
        assert.ok(result.stressTest.iterationsPerSecond > 0, `${funcName} should have stress test data`);
        assert.ok(result.passesThreshold, `${funcName} should pass performance threshold`);
      }
    });
  });

  describe('Mobile Performance Simulation', () => {
    it('should simulate mobile constraints for calculation functions', () => {
      for (const [funcName, func] of Object.entries(functionsToTest)) {
        const args = testData[funcName];
        const mobileResult = simulateMobilePerformance(func, ...args);
        const validation = validateMobilePerformance(mobileResult);
        
        assert.ok(mobileResult.executionTime > 0, `Should measure execution time for ${funcName}`);
        assert.ok(validation.isHealthy, `${funcName} should pass mobile performance (${mobileResult.executionTime}ms)`);
        assert.ok(mobileResult.simulatedConstraints.cpuThrottling, 'Should include constraint simulation details');
      }
    });
  });
});
