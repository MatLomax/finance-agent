/**
 * @fileoverview Tests for financial data validation and migration
 * 
 * Tests validation functions and data migration logic for maintaining
 * data integrity across schema versions.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateFinancialData, migrateData } from './validation.js';

describe('validateFinancialData', () => {
  const validData = {
    // Income parameters
    grossUsd: 9000,
    eurUsd: 1.17,
    thbEur: 37.75,
    taxRate: 0.17,
    
    // Expenses
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
    discretionary: 350,
    
    // Phase allocations
    allocDebt1: 80,
    allocSavings1: 10,
    allocInvestment1: 10,
    allocDebt2: 0,
    allocSavings2: 70,
    allocInvestment2: 30,
    allocSavings3: 20,
    allocInvestment3: 80,
    
    // Personal parameters
    currentAge: 33,
    lifespan: 90,
    investmentReturnRate: 6,
    totalDebt: 75000,
    totalSavings: 0,
    totalInvestments: 0
  };

  it('should validate correct financial data', () => {
    const result = validateFinancialData(validData);
    assert.strictEqual(result, true);
  });
  
  it('should reject null or undefined data', () => {
    assert.strictEqual(validateFinancialData(null), false);
    assert.strictEqual(validateFinancialData(undefined), false);
  });
  
  it('should reject non-object data', () => {
    assert.strictEqual(validateFinancialData('string'), false);
    assert.strictEqual(validateFinancialData(123), false);
    assert.strictEqual(validateFinancialData([]), false);
  });
  
  it('should reject data with missing numeric fields', () => {
    const incompleteData = { ...validData };
    delete incompleteData.grossUsd;
    
    assert.strictEqual(validateFinancialData(incompleteData), false);
  });
  
  it('should reject data with non-numeric fields', () => {
    const invalidData = { ...validData, grossUsd: 'not a number' };
    assert.strictEqual(validateFinancialData(invalidData), false);
  });
  
  it('should reject data with NaN values', () => {
    const invalidData = { ...validData, grossUsd: NaN };
    assert.strictEqual(validateFinancialData(invalidData), false);
  });
  
  it('should reject invalid current age', () => {
    const tooYoung = { ...validData, currentAge: 17 };
    assert.strictEqual(validateFinancialData(tooYoung), false);
    
    const tooOld = { ...validData, currentAge: 101 };
    assert.strictEqual(validateFinancialData(tooOld), false);
  });
  
  it('should reject invalid lifespan', () => {
    const lifespanTooLow = { ...validData, lifespan: 30 }; // Less than current age
    assert.strictEqual(validateFinancialData(lifespanTooLow), false);
    
    const lifespanTooHigh = { ...validData, lifespan: 121 };
    assert.strictEqual(validateFinancialData(lifespanTooHigh), false);
  });
  
  it('should reject invalid phase 1 allocations', () => {
    const invalidPhase1 = { ...validData, allocDebt1: 50, allocSavings1: 30, allocInvestment1: 30 }; // Sums to 110
    assert.strictEqual(validateFinancialData(invalidPhase1), false);
  });
  
  it('should reject invalid phase 2 allocations', () => {
    const invalidPhase2 = { ...validData, allocDebt2: 10, allocSavings2: 60, allocInvestment2: 20 }; // Sums to 90
    assert.strictEqual(validateFinancialData(invalidPhase2), false);
  });
  
  it('should reject invalid phase 3 allocations', () => {
    const invalidPhase3 = { ...validData, allocSavings3: 30, allocInvestment3: 80 }; // Sums to 110
    assert.strictEqual(validateFinancialData(invalidPhase3), false);
  });
  
  it('should accept phase allocations with small rounding errors', () => {
    const slightlyOff = { ...validData, allocDebt1: 80.001, allocSavings1: 10, allocInvestment1: 9.999 };
    assert.strictEqual(validateFinancialData(slightlyOff), true);
  });
  
  it('should validate all required expense fields', () => {
    const expenseFields = [
      'housing', 'utilities', 'diningGroceries', 'hiredStaff',
      'transportation', 'healthInsurance', 'petCare', 'wellness',
      'entertainment', 'weekendTrips', 'annualHoliday', 'discretionary'
    ];
    
    expenseFields.forEach(field => {
      const missingField = { ...validData };
      delete missingField[field];
      assert.strictEqual(validateFinancialData(missingField), false, `Should reject when ${field} is missing`);
    });
  });
  
  it('should validate edge cases for age ranges', () => {
    const edgeAge18 = { ...validData, currentAge: 18 };
    assert.strictEqual(validateFinancialData(edgeAge18), true);
    
    const edgeAge100 = { ...validData, currentAge: 100, lifespan: 100 };
    assert.strictEqual(validateFinancialData(edgeAge100), true);
  });
});

describe('migrateData', () => {
  it('should add schema version to legacy data', () => {
    const legacyData = {
      grossUsd: 9000,
      eurUsd: 1.17,
      housing: 1400
    };
    
    const migrated = migrateData(legacyData);
    
    assert.strictEqual(migrated.schemaVersion, 1);
    assert.strictEqual(typeof migrated.lastUpdated, 'string');
    assert.strictEqual(migrated.version, '1.0.0');
    assert.strictEqual(migrated.grossUsd, 9000); // Original data preserved
  });
  
  it('should preserve existing schema version', () => {
    const currentData = {
      schemaVersion: 1,
      grossUsd: 9000,
      lastUpdated: '2023-01-01T00:00:00Z',
      version: '1.0.0'
    };
    
    const migrated = migrateData(currentData);
    
    assert.strictEqual(migrated.schemaVersion, 1);
    assert.strictEqual(migrated.lastUpdated, '2023-01-01T00:00:00Z');
    assert.strictEqual(migrated.version, '1.0.0');
  });
  
  it('should not modify the original data object', () => {
    const originalData = { grossUsd: 9000 };
    const migrated = migrateData(originalData);
    
    assert.notStrictEqual(originalData, migrated);
    assert.strictEqual(originalData.schemaVersion, undefined);
    assert.strictEqual(migrated.schemaVersion, 1);
  });
  
  it('should handle empty data objects', () => {
    const emptyData = {};
    const migrated = migrateData(emptyData);
    
    assert.strictEqual(migrated.schemaVersion, 1);
    assert.strictEqual(typeof migrated.lastUpdated, 'string');
    assert.strictEqual(migrated.version, '1.0.0');
  });
  
  it('should preserve all existing properties', () => {
    const complexData = {
      grossUsd: 9000,
      expenses: { housing: 1400, utilities: 200 },
      goals: { retirement: true },
      metadata: { created: '2023-01-01' }
    };
    
    const migrated = migrateData(complexData);
    
    assert.strictEqual(migrated.grossUsd, 9000);
    assert.deepStrictEqual(migrated.expenses, { housing: 1400, utilities: 200 });
    assert.deepStrictEqual(migrated.goals, { retirement: true });
    assert.deepStrictEqual(migrated.metadata, { created: '2023-01-01' });
    assert.strictEqual(migrated.schemaVersion, 1);
  });
  
  it('should create valid lastUpdated timestamp', () => {
    const data = { grossUsd: 9000 };
    const migrated = migrateData(data);
    
    const timestamp = new Date(migrated.lastUpdated);
    assert(timestamp instanceof Date);
    assert(!isNaN(timestamp.getTime()));
    
    // Should be recent (within last 10 seconds)
    const now = new Date();
    const timeDiff = now - timestamp;
    assert(timeDiff >= 0 && timeDiff < 10000);
  });
});
