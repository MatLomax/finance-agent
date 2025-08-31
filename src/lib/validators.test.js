/**
 * @fileoverview Tests for shared validation utilities
 * 
 * Validates the TypeBox validation helper function used across
 * all financial calculation modules.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Type } from '@sinclair/typebox';
import { validate } from './validators.js';

describe('validate', () => {
  it('should pass validation for valid data', () => {
    const schema = Type.Object({
      amount: Type.Number({ minimum: 0 }),
      rate: Type.Number({ minimum: 0, maximum: 1 })
    });
    
    const validData = { amount: 1000, rate: 0.05 };
    
    // Should not throw
    assert.doesNotThrow(() => {
      validate(schema, validData);
    });
  });
  
  it('should throw error for invalid data with detailed message', () => {
    const schema = Type.Object({
      amount: Type.Number({ minimum: 0 }),
      rate: Type.Number({ minimum: 0, maximum: 1 })
    });
    
    const invalidData = { amount: -100, rate: 1.5 };
    
    assert.throws(() => {
      validate(schema, invalidData);
    }, /Validation failed/);
  });
  
  it('should handle missing required properties', () => {
    const schema = Type.Object({
      amount: Type.Number({ minimum: 0 }),
      rate: Type.Number({ minimum: 0, maximum: 1 })
    });
    
    const incompleteData = { amount: 1000 };
    
    assert.throws(() => {
      validate(schema, incompleteData);
    }, /Validation failed/);
  });
  
  it('should handle incorrect data types', () => {
    const schema = Type.Object({
      amount: Type.Number({ minimum: 0 }),
      rate: Type.Number({ minimum: 0, maximum: 1 })
    });
    
    const wrongTypeData = { amount: '1000', rate: 0.05 };
    
    assert.throws(() => {
      validate(schema, wrongTypeData);
    }, /Validation failed/);
  });
  
  it('should validate nested objects', () => {
    const schema = Type.Object({
      user: Type.Object({
        age: Type.Number({ minimum: 18 }),
        income: Type.Number({ minimum: 0 })
      }),
      preferences: Type.Object({
        riskLevel: Type.String()
      })
    });
    
    const validNestedData = {
      user: { age: 30, income: 50000 },
      preferences: { riskLevel: 'moderate' }
    };
    
    assert.doesNotThrow(() => {
      validate(schema, validNestedData);
    });
  });
  
  it('should validate arrays', () => {
    const schema = Type.Object({
      expenses: Type.Array(Type.Number({ minimum: 0 }))
    });
    
    const validArrayData = { expenses: [100, 200, 300] };
    const invalidArrayData = { expenses: [100, -200, 300] };
    
    assert.doesNotThrow(() => {
      validate(schema, validArrayData);
    });
    
    assert.throws(() => {
      validate(schema, invalidArrayData);
    }, /Validation failed/);
  });
});
