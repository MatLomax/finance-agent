/**
 * @fileoverview Tests for financial allocation and debt payment functions
 * 
 * Tests allocation strategies and debt payment calculations used
 * in personal finance planning optimization.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateDebtPayment, calculateAllocationAmounts } from './allocations.js';

describe('calculateDebtPayment', () => {
  it('should calculate debt payment when payment covers full debt', () => {
    const result = calculateDebtPayment(5000, 8000);
    assert.strictEqual(result, 5000);
  });
  
  it('should calculate debt payment when payment is less than debt', () => {
    const result = calculateDebtPayment(10000, 6000);
    assert.strictEqual(result, 6000);
  });
  
  it('should handle zero debt', () => {
    const result = calculateDebtPayment(0, 5000);
    assert.strictEqual(result, 0);
  });
  
  it('should handle zero available payment', () => {
    const result = calculateDebtPayment(5000, 0);
    assert.strictEqual(result, 0);
  });
  
  it('should handle negative available payment', () => {
    const result = calculateDebtPayment(5000, -1000);
    assert.strictEqual(result, 0);
  });
  
  it('should handle equal debt and payment amounts', () => {
    const result = calculateDebtPayment(5000, 5000);
    assert.strictEqual(result, 5000);
  });
  
  it('should throw error for negative debt', () => {
    assert.throws(() => {
      calculateDebtPayment(-1000, 5000);
    }, /Validation failed/);
  });
  
  it('should handle small debt amounts', () => {
    const result = calculateDebtPayment(0.01, 100);
    assert.strictEqual(result, 0.01);
  });
  
  it('should handle large debt amounts', () => {
    const result = calculateDebtPayment(1000000, 50000);
    assert.strictEqual(result, 50000);
  });
});

describe('calculateAllocationAmounts', () => {
  it('should calculate allocations with standard percentages', () => {
    const result = calculateAllocationAmounts(10000, 0.8, 0.1, 0.1);
    
    assert.strictEqual(result.debt, 8000);
    assert.strictEqual(result.savings, 1000);
    assert.strictEqual(result.investment, 1000);
  });
  
  it('should handle zero free capital', () => {
    const result = calculateAllocationAmounts(0, 0.8, 0.1, 0.1);
    
    assert.strictEqual(result.debt, 0);
    assert.strictEqual(result.savings, 0);
    assert.strictEqual(result.investment, 0);
  });
  
  it('should handle 100% debt allocation', () => {
    const result = calculateAllocationAmounts(5000, 1.0, 0.0, 0.0);
    
    assert.strictEqual(result.debt, 5000);
    assert.strictEqual(result.savings, 0);
    assert.strictEqual(result.investment, 0);
  });
  
  it('should handle 100% investment allocation', () => {
    const result = calculateAllocationAmounts(3000, 0.0, 0.0, 1.0);
    
    assert.strictEqual(result.debt, 0);
    assert.strictEqual(result.savings, 0);
    assert.strictEqual(result.investment, 3000);
  });
  
  it('should handle equal allocations', () => {
    const result = calculateAllocationAmounts(3000, 0.333, 0.333, 0.334);
    
    assert.strictEqual(result.debt, 999);
    assert.strictEqual(result.savings, 999);
    // Use Math.round to handle floating point precision
    assert.strictEqual(Math.round(result.investment), 1002);
  });
  
  it('should handle negative free capital', () => {
    const result = calculateAllocationAmounts(-2000, 0.5, 0.3, 0.2);
    
    assert.strictEqual(result.debt, -1000);
    assert.strictEqual(result.savings, -600);
    assert.strictEqual(result.investment, -400);
  });
  
  it('should throw error for invalid allocation percentages', () => {
    assert.throws(() => {
      calculateAllocationAmounts(1000, 1.5, 0.1, 0.1); // > 1.0
    }, /Validation failed/);
    
    assert.throws(() => {
      calculateAllocationAmounts(1000, -0.1, 0.1, 0.1); // < 0.0
    }, /Validation failed/);
  });
  
  it('should handle small capital amounts', () => {
    const result = calculateAllocationAmounts(1, 0.5, 0.3, 0.2);
    
    assert.strictEqual(result.debt, 0.5);
    assert.strictEqual(result.savings, 0.3);
    assert.strictEqual(result.investment, 0.2);
  });
  
  it('should handle large capital amounts', () => {
    const result = calculateAllocationAmounts(1000000, 0.6, 0.2, 0.2);
    
    assert.strictEqual(result.debt, 600000);
    assert.strictEqual(result.savings, 200000);
    assert.strictEqual(result.investment, 200000);
  });
  
  it('should preserve precision for decimal allocations', () => {
    const result = calculateAllocationAmounts(7500, 0.666, 0.167, 0.167);
    
    assert.strictEqual(result.debt, 4995);
    assert.strictEqual(result.savings, 1252.5);
    assert.strictEqual(result.investment, 1252.5);
  });
});
