/**
 * @fileoverview Tests for optimal retirement age calculation
 * 
 * Tests the algorithm that finds the optimal retirement age by
 * evaluating different scenarios and optimizing for final wealth.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { findOptimalRetirementAge } from './optimal-retirement.js';

describe('findOptimalRetirementAge', () => {
  const baseInput = {
    currentAge: 30,
    lifespan: 90,
    grossUsd: 9000,
    eurUsd: 1.17,
    thbEur: 37.75,
    taxRate: 0.17,
    monthlyExpenses: 4000,
    totalDebt: 50000,
    totalSavings: 10000,
    totalInvestments: 5000,
    investmentReturnRate: 6,
    allocations: {
      debtPhase: { debt: 80, savings: 10, investments: 10 },
      emergencyPhase: { debt: 0, savings: 70, investments: 30 },
      retirementPhase: { debt: 0, savings: 20, investments: 80 }
    }
  };

  it('should return optimal retirement result structure', () => {
    const result = findOptimalRetirementAge(baseInput);

    assert.strictEqual(typeof result, 'object');
    assert.strictEqual(typeof result.age, 'number');
    assert(Array.isArray(result.simulation));
    assert.strictEqual(typeof result.finalWealth, 'number');
  });

  it('should find valid retirement age within lifespan', () => {
    const result = findOptimalRetirementAge(baseInput);

    // Retirement age should be between current age and lifespan
    assert(result.age > baseInput.currentAge);
    assert(result.age < baseInput.lifespan);
  });

  it('should return simulation data for the optimal age', () => {
    const result = findOptimalRetirementAge(baseInput);

    assert(Array.isArray(result.simulation));
    assert(result.simulation.length > 0);
    
    // Should span from current age to lifespan
    const firstYear = result.simulation[0];
    const lastYear = result.simulation[result.simulation.length - 1];
    
    assert.strictEqual(firstYear.age, baseInput.currentAge);
    assert.strictEqual(lastYear.age, baseInput.lifespan);
    
    // Should mark retirement properly
    const retirementYear = result.simulation.find(year => year.age === result.age);
    assert(retirementYear, 'Should find retirement year in simulation');
  });

  it('should handle high income scenario', () => {
    const highIncomeInput = {
      ...baseInput,
      grossUsd: 15000,
      totalDebt: 0,
      totalSavings: 100000,
      totalInvestments: 200000
    };

    const result = findOptimalRetirementAge(highIncomeInput);

    // High income should enable earlier retirement
    assert(result.age < 65);
    assert(result.finalWealth > 0);
  });

  it('should handle low income scenario', () => {
    const lowIncomeInput = {
      ...baseInput,
      grossUsd: 4000,
      monthlyExpenses: 3000,
      totalDebt: 100000
    };

    const result = findOptimalRetirementAge(lowIncomeInput);

    // Low income should require later retirement
    assert(result.age >= 60);
  });

  it('should handle edge case of very old current age', () => {
    const oldAgeInput = {
      ...baseInput,
      currentAge: 80,
      totalDebt: 0,
      totalSavings: 500000,
      totalInvestments: 1000000
    };

    const result = findOptimalRetirementAge(oldAgeInput);

    // Should handle near-retirement scenarios
    assert(result.age >= oldAgeInput.currentAge);
    assert(result.age < oldAgeInput.lifespan);
  });

  it('should provide fallback when no optimal retirement found', () => {
    const impossibleInput = {
      ...baseInput,
      grossUsd: 1000, // Very low income
      monthlyExpenses: 5000, // Very high expenses
      totalDebt: 500000, // Very high debt
      lifespan: 85
    };

    const result = findOptimalRetirementAge(impossibleInput);

    // Should still return a result even if not optimal
    assert.strictEqual(typeof result.age, 'number');
    assert(Array.isArray(result.simulation));
    assert.strictEqual(typeof result.finalWealth, 'number');
  });

  it('should calculate final wealth correctly', () => {
    const result = findOptimalRetirementAge(baseInput);

    const lastYear = result.simulation[result.simulation.length - 1];
    const expectedFinalWealth = lastYear.savings + lastYear.investments;

    assert.strictEqual(result.finalWealth, expectedFinalWealth);
  });

  it('should respect lifespan boundaries', () => {
    const shortLifeInput = {
      ...baseInput,
      lifespan: 70
    };

    const result = findOptimalRetirementAge(shortLifeInput);

    // Retirement age should be at least 5 years before death
    assert(result.age <= shortLifeInput.lifespan - 5);
  });
});
