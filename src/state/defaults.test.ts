/**
 * @fileoverview Tests for default financial data values
 * 
 * Validates the default financial data structure, schema version,
 * and the function that returns default values.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getDefaultFinancialData } from './defaults.js';

describe('getDefaultFinancialData', () => {
  it('should return default financial data with schema information', () => {
    const defaults = getDefaultFinancialData();
    
    // Schema information
    assert.strictEqual(typeof defaults.schemaVersion, 'number');
    assert(defaults.schemaVersion >= 1);
    
    // Metadata
    assert.strictEqual(typeof defaults.lastUpdated, 'string');
    assert.strictEqual(typeof defaults.version, 'string');
  });
  
  it('should have valid income parameters', () => {
    const defaults = getDefaultFinancialData();
    
    // Income parameters (USD/EUR amounts)
    assert.strictEqual(typeof defaults.grossUsd, 'number');
    assert(defaults.grossUsd > 0);
    assert.strictEqual(typeof defaults.eurUsd, 'number');
    assert(defaults.eurUsd > 0);
    assert.strictEqual(typeof defaults.thbEur, 'number');
    assert(defaults.thbEur > 0);
    assert.strictEqual(typeof defaults.taxRate, 'number');
    assert(defaults.taxRate >= 0 && defaults.taxRate <= 1);
  });
  
  it('should have all required expense categories in EUR', () => {
    const defaults = getDefaultFinancialData();
    
    // Monthly expenses (EUR amounts)
    const expenseCategories = [
      'housing', 'utilities', 'diningGroceries', 'hiredStaff',
      'transportation', 'healthInsurance', 'petCare', 'wellness',
      'entertainment', 'weekendTrips', 'annualHoliday', 'discretionary'
    ];
    
    expenseCategories.forEach(category => {
      assert(Object.prototype.hasOwnProperty.call(defaults, category), 
        `Missing expense category: ${category}`);
      assert.strictEqual(typeof defaults[category], 'number');
      assert(defaults[category] >= 0, `Expense category ${category} must be non-negative`);
    });
  });
  
  it('should have valid phase allocation percentages', () => {
    const defaults = getDefaultFinancialData();
    
    // Phase allocation percentages
    assert.strictEqual(typeof defaults.allocDebt1, 'number');
    assert.strictEqual(typeof defaults.allocSavings1, 'number');
    assert.strictEqual(typeof defaults.allocInvestment1, 'number');
    assert.strictEqual(defaults.allocDebt1 + defaults.allocSavings1 + defaults.allocInvestment1, 100);
    
    assert.strictEqual(typeof defaults.allocDebt2, 'number');
    assert.strictEqual(typeof defaults.allocSavings2, 'number');
    assert.strictEqual(typeof defaults.allocInvestment2, 'number');
    assert.strictEqual(defaults.allocDebt2 + defaults.allocSavings2 + defaults.allocInvestment2, 100);
    
    assert.strictEqual(typeof defaults.allocSavings3, 'number');
    assert.strictEqual(typeof defaults.allocInvestment3, 'number');
    assert.strictEqual(defaults.allocSavings3 + defaults.allocInvestment3, 100);
  });
  
  it('should have valid personal and investment parameters', () => {
    const defaults = getDefaultFinancialData();
    
    // Personal and investment parameters
    assert.strictEqual(typeof defaults.currentAge, 'number');
    assert(defaults.currentAge >= 18 && defaults.currentAge <= 100);
    assert.strictEqual(typeof defaults.lifespan, 'number');
    assert(defaults.lifespan > defaults.currentAge);
    assert.strictEqual(typeof defaults.investmentReturnRate, 'number');
    assert(defaults.investmentReturnRate >= 0);
    assert.strictEqual(typeof defaults.totalDebt, 'number');
    assert(defaults.totalDebt >= 0);
    assert.strictEqual(typeof defaults.totalSavings, 'number');
    assert(defaults.totalSavings >= 0);
    assert.strictEqual(typeof defaults.totalInvestments, 'number');
    assert(defaults.totalInvestments >= 0);
  });
  
  it('should return a copy of default data (not reference)', () => {
    const defaults1 = getDefaultFinancialData();
    const defaults2 = getDefaultFinancialData();
    
    // Should be different objects but same values
    assert.notStrictEqual(defaults1, defaults2);
    assert.deepStrictEqual(defaults1, defaults2);
  });
  
  it('should have mathematically consistent default values', () => {
    const defaults = getDefaultFinancialData();
    
    // Income and rates should be positive
    assert(defaults.grossUsd > 0);
    assert(defaults.eurUsd > 0);
    assert(defaults.thbEur > 0);
    
    // Tax rate should be a valid percentage
    assert(defaults.taxRate >= 0 && defaults.taxRate <= 1);
    
    // Total monthly expenses should be calculable
    const totalExpenses = defaults.housing + defaults.utilities + defaults.diningGroceries +
      defaults.hiredStaff + defaults.transportation + defaults.healthInsurance +
      defaults.petCare + defaults.wellness + defaults.entertainment +
      defaults.weekendTrips + defaults.annualHoliday + defaults.discretionary;
    
    assert(totalExpenses > 0, 'Total expenses should be positive');
    
    // Age relationship should be valid
    assert(defaults.currentAge > 0);
    assert(defaults.lifespan > defaults.currentAge);
    
    // Investment return should be positive
    assert(defaults.investmentReturnRate > 0);
  });
  
  it('should have valid phase allocation strategies', () => {
    const defaults = getDefaultFinancialData();
    
    // Phase 1: Debt elimination - should prioritize debt
    assert(defaults.allocDebt1 >= 50, 'Phase 1 should prioritize debt elimination');
    assert(defaults.allocDebt1 >= defaults.allocSavings1, 'Phase 1 debt allocation should exceed savings');
    assert(defaults.allocDebt1 >= defaults.allocInvestment1, 'Phase 1 debt allocation should exceed investments');
    
    // Phase 2: Emergency fund - should have no debt allocation
    assert.strictEqual(defaults.allocDebt2, 0, 'Phase 2 should have no debt allocation');
    assert(defaults.allocSavings2 >= defaults.allocInvestment2, 'Phase 2 should prioritize savings over investments');
    
    // Phase 3: Wealth building - should prioritize investments
    assert(defaults.allocInvestment3 >= defaults.allocSavings3, 'Phase 3 should prioritize investments over savings');
    assert(defaults.allocInvestment3 >= 50, 'Phase 3 should have substantial investment allocation');
  });
});
