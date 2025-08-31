/**
 * @fileoverview Tests for wealth simulation helper functions
 * 
 * Tests the helper functions that process individual simulation years
 * for both working and retirement phases.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { processSimulationYear } from './simulation-helpers.js';

describe('processSimulationYear', () => {
  // Base parameters for testing
  const baseParams = {
    currentAge: 30,
    retirementAge: 65,
    lifespan: 85,
    annualExpenses: 3500 * 12,
    emergencyFundTarget: 3500 * 6,
    netSalaryMonthly0: 6000, // tax-free
    netSalaryMonthly1: 5000, // taxed
    taxRate: 0.17,
    investmentReturnRate: 6,
    allocations: {
      debtPhase: { debt: 80, savings: 10, investments: 10 },
      emergencyPhase: { debt: 0, savings: 70, investments: 30 },
      retirementPhase: { debt: 0, savings: 20, investments: 80 }
    }
  };

  it('should handle initial year (age = currentAge)', () => {
    const params = {
      ...baseParams,
      age: 30,
      debt: 50000,
      savings: 10000,
      investments: 5000
    };

    const result = processSimulationYear(params);

    assert.strictEqual(result.age, 30);
    assert.strictEqual(result.debt, 50000);
    assert.strictEqual(result.savings, 10000);
    assert.strictEqual(result.investments, 5000);
    assert.strictEqual(result.isRetired, false);
    assert.strictEqual(result.freeCapital, 0);
    assert.strictEqual(result.investmentGrossIncome, 0);
    assert.strictEqual(result.investmentNetIncome, 0);
  });

  it('should process working year with debt (Phase 1)', () => {
    const params = {
      ...baseParams,
      age: 31,
      debt: 50000,
      savings: 5000,
      investments: 2000
    };

    const result = processSimulationYear(params);

    assert.strictEqual(result.age, 31);
    assert.strictEqual(result.isRetired, false);
    // Free capital can be positive or negative depending on income vs expenses
    assert.strictEqual(typeof result.freeCapital, 'number');
    assert(result.debt <= 50000); // Debt should be reduced or same
    assert(result.savings >= 5000); // Savings should increase due to allocation
    assert(result.investments >= 2000); // Investments should increase due to allocation
    assert.strictEqual(typeof result.investmentGrossIncome, 'number');
    assert.strictEqual(typeof result.investmentNetIncome, 'number');
  });

  it('should process working year without debt (Phase 2 or 3)', () => {
    const params = {
      ...baseParams,
      age: 35,
      debt: 0,
      savings: 30000,
      investments: 20000
    };

    const result = processSimulationYear(params);

    assert.strictEqual(result.age, 35);
    assert.strictEqual(result.debt, 0);
    assert.strictEqual(result.isRetired, false);
    // Free capital can be positive or negative depending on income vs expenses
    assert.strictEqual(typeof result.freeCapital, 'number');
    assert(result.savings >= 30000); // Savings should increase due to allocation
    assert(result.investments >= 20000); // Investments should increase due to allocation
  });

  it('should handle tax-free vs taxed income years', () => {
    // Year 1 (tax-free)
    const paramsYear1 = {
      ...baseParams,
      age: 31,
      debt: 0,
      savings: 30000,
      investments: 10000
    };

    // Year 4 (taxed)
    const paramsYear4 = {
      ...baseParams,
      age: 34,
      debt: 0,
      savings: 30000,
      investments: 10000
    };

    const resultYear1 = processSimulationYear(paramsYear1);
    const resultYear4 = processSimulationYear(paramsYear4);

    // Year 1 should have higher free capital due to tax-free income
    assert(resultYear1.freeCapital > resultYear4.freeCapital);
  });

  it('should process retirement year', () => {
    const params = {
      ...baseParams,
      age: 66,
      debt: 0,
      savings: 200000,
      investments: 800000
    };

    const result = processSimulationYear(params);

    assert.strictEqual(result.age, 66);
    assert.strictEqual(result.isRetired, true);
    // freeCapital should be negative or zero if withdrawal/sale is needed
    assert(result.freeCapital <= 0); 
    assert(result.savingsWithdrawal >= 0);
    assert(result.investmentSale >= 0);
    assert.strictEqual(typeof result.investmentGrossIncome, 'number');
    assert.strictEqual(typeof result.investmentNetIncome, 'number');
  });

  it('should calculate investment income correctly', () => {
    const params = {
      ...baseParams,
      age: 35,
      debt: 0,
      savings: 50000,
      investments: 100000
    };

    const result = processSimulationYear(params);

    const expectedGrossIncome = 100000 * (6 / 100);
    const expectedNetIncome = expectedGrossIncome * (1 - 0.17);

    assert.strictEqual(result.investmentGrossIncome, expectedGrossIncome);
    assert.strictEqual(result.investmentNetIncome, expectedNetIncome);
  });

  it('should handle edge case of very high debt', () => {
    const params = {
      ...baseParams,
      age: 35,
      debt: 1000000, // Very high debt
      savings: 5000,
      investments: 2000
    };

    const result = processSimulationYear(params);

    assert.strictEqual(result.age, 35);
    assert(result.debt >= 0); // Debt cannot go negative
    assert.strictEqual(typeof result.savings, 'number');
    assert.strictEqual(typeof result.investments, 'number');
  });
});
