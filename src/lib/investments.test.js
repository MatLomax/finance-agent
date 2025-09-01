/**
 * @fileoverview Tests for investment calculation functions
 * 
 * Tests investment return calculations including gross income
 * and tax calculations for portfolio planning.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateInvestmentGrossIncome, calculateInvestmentNetIncome } from './investments.js';

describe('calculateInvestmentGrossIncome', () => {
  it('should calculate gross income for standard investment', () => {
    const result = calculateInvestmentGrossIncome(100000, 0.06);
    assert.strictEqual(result, 6000);
  });
  
  it('should handle zero principal', () => {
    const result = calculateInvestmentGrossIncome(0, 0.06);
    assert.strictEqual(result, 0);
  });
  
  it('should handle zero rate', () => {
    const result = calculateInvestmentGrossIncome(100000, 0);
    assert.strictEqual(result, 0);
  });
  
  it('should calculate with high return rate', () => {
    const result = calculateInvestmentGrossIncome(50000, 0.12);
    assert.strictEqual(result, 6000);
  });
  
  it('should calculate with low return rate', () => {
    const result = calculateInvestmentGrossIncome(100000, 0.02);
    assert.strictEqual(result, 2000);
  });
  
  it('should handle small principal amounts', () => {
    const result = calculateInvestmentGrossIncome(1000, 0.05);
    assert.strictEqual(result, 50);
  });
  
  it('should handle large principal amounts', () => {
    const result = calculateInvestmentGrossIncome(1000000, 0.07);
    assert.strictEqual(result, 70000);
  });
  
  it('should throw error for negative principal', () => {
    assert.throws(() => {
      calculateInvestmentGrossIncome(-1000, 0.06);
    }, /cannot be negative/);
  });
  
  it('should throw error for negative rate', () => {
    assert.throws(() => {
      calculateInvestmentGrossIncome(100000, -0.05);
    }, /must be between 0 and 1/);
  });
  
  it('should throw error for rate above 100%', () => {
    assert.throws(() => {
      calculateInvestmentGrossIncome(100000, 1.5);
    }, /must be between 0 and 1/);
  });
  
  it('should handle exact 100% return rate', () => {
    const result = calculateInvestmentGrossIncome(10000, 1.0);
    assert.strictEqual(result, 10000);
  });
  
  it('should preserve decimal precision', () => {
    const result = calculateInvestmentGrossIncome(33333, 0.067);
    assert.strictEqual(result, 2233.311);
  });
});

describe('calculateInvestmentNetIncome', () => {
  it('should calculate tax amount on investment income', () => {
    const result = calculateInvestmentNetIncome(6000, 0.17);
    // Use Math.round to handle floating point precision
    assert.strictEqual(Math.round(result), 1020);
  });
  
  it('should handle zero gross income', () => {
    const result = calculateInvestmentNetIncome(0, 0.17);
    assert.strictEqual(result, 0);
  });
  
  it('should handle zero tax rate', () => {
    const result = calculateInvestmentNetIncome(6000, 0);
    assert.strictEqual(result, 0);
  });
  
  it('should calculate with high tax rate', () => {
    const result = calculateInvestmentNetIncome(10000, 0.30);
    assert.strictEqual(result, 3000);
  });
  
  it('should calculate with low tax rate', () => {
    const result = calculateInvestmentNetIncome(5000, 0.05);
    assert.strictEqual(result, 250);
  });
  
  it('should handle small income amounts', () => {
    const result = calculateInvestmentNetIncome(100, 0.20);
    assert.strictEqual(result, 20);
  });
  
  it('should handle large income amounts', () => {
    const result = calculateInvestmentNetIncome(100000, 0.25);
    assert.strictEqual(result, 25000);
  });
  
  it('should throw error for negative gross income', () => {
    assert.throws(() => {
      calculateInvestmentNetIncome(-1000, 0.17);
    }, /cannot be negative/);
  });
  
  it('should throw error for negative tax rate', () => {
    assert.throws(() => {
      calculateInvestmentNetIncome(6000, -0.05);
    }, /must be between 0 and 1/);
  });
  
  it('should throw error for tax rate above 100%', () => {
    assert.throws(() => {
      calculateInvestmentNetIncome(6000, 1.2);
    }, /must be between 0 and 1/);
  });
  
  it('should handle exact 100% tax rate', () => {
    const result = calculateInvestmentNetIncome(5000, 1.0);
    assert.strictEqual(result, 5000);
  });
  
  it('should preserve decimal precision for tax calculations', () => {
    const result = calculateInvestmentNetIncome(7531.25, 0.173);
    assert.strictEqual(result, 1302.906250);
  });
  
  it('should handle common tax scenarios', () => {
    // Standard capital gains tax scenarios
    const standardRate = calculateInvestmentNetIncome(10000, 0.15);
    assert.strictEqual(standardRate, 1500);
    
    const higherRate = calculateInvestmentNetIncome(10000, 0.20);
    assert.strictEqual(higherRate, 2000);
    
    const topRate = calculateInvestmentNetIncome(10000, 0.28);
    // Use Math.round to handle floating point precision
    assert.strictEqual(Math.round(topRate), 2800);
  });
});
