/**
 * @fileoverview Tests for shared validation utilities
 * 
 * Validates the type checking and validation helper functions used across
 * all financial calculation modules.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  validateNumber, 
  validatePositiveNumber, 
  validateNonNegativeNumber, 
  validatePercentage, 
  validateString, 
  validateRange 
} from './validators.js';

describe('validateNumber', () => {
  it('should pass for valid finite numbers', () => {
    assert.doesNotThrow(() => validateNumber(42, 'testNumber'));
    assert.doesNotThrow(() => validateNumber(-42, 'testNumber'));
    assert.doesNotThrow(() => validateNumber(0, 'testNumber'));
    assert.doesNotThrow(() => validateNumber(3.14, 'testNumber'));
  });
  
  it('should throw for non-numbers', () => {
    assert.throws(() => validateNumber('42', 'testNumber'), /testNumber must be a finite number/);
    assert.throws(() => validateNumber(null, 'testNumber'), /testNumber must be a finite number/);
    assert.throws(() => validateNumber(undefined, 'testNumber'), /testNumber must be a finite number/);
  });
  
  it('should throw for non-finite numbers', () => {
    assert.throws(() => validateNumber(NaN, 'testNumber'), /testNumber must be a finite number/);
    assert.throws(() => validateNumber(Infinity, 'testNumber'), /testNumber must be a finite number/);
    assert.throws(() => validateNumber(-Infinity, 'testNumber'), /testNumber must be a finite number/);
  });
});

describe('validatePositiveNumber', () => {
  it('should pass for positive numbers', () => {
    assert.doesNotThrow(() => validatePositiveNumber(1, 'testNumber'));
    assert.doesNotThrow(() => validatePositiveNumber(0.1, 'testNumber'));
    assert.doesNotThrow(() => validatePositiveNumber(1000, 'testNumber'));
  });
  
  it('should throw for zero and negative numbers', () => {
    assert.throws(() => validatePositiveNumber(0, 'testNumber'), /testNumber must be positive/);
    assert.throws(() => validatePositiveNumber(-1, 'testNumber'), /testNumber must be positive/);
  });
});

describe('validateNonNegativeNumber', () => {
  it('should pass for non-negative numbers', () => {
    assert.doesNotThrow(() => validateNonNegativeNumber(0, 'testNumber'));
    assert.doesNotThrow(() => validateNonNegativeNumber(1, 'testNumber'));
    assert.doesNotThrow(() => validateNonNegativeNumber(1000, 'testNumber'));
  });
  
  it('should throw for negative numbers', () => {
    assert.throws(() => validateNonNegativeNumber(-1, 'testNumber'), /testNumber cannot be negative/);
    assert.throws(() => validateNonNegativeNumber(-0.1, 'testNumber'), /testNumber cannot be negative/);
  });
});

describe('validatePercentage', () => {
  it('should pass for valid percentages (0-1)', () => {
    assert.doesNotThrow(() => validatePercentage(0, 'testPercentage'));
    assert.doesNotThrow(() => validatePercentage(0.5, 'testPercentage'));
    assert.doesNotThrow(() => validatePercentage(1, 'testPercentage'));
  });
  
  it('should throw for values outside 0-1 range', () => {
    assert.throws(() => validatePercentage(-0.1, 'testPercentage'), /testPercentage must be between 0 and 1/);
    assert.throws(() => validatePercentage(1.1, 'testPercentage'), /testPercentage must be between 0 and 1/);
  });
});

describe('validateString', () => {
  it('should pass for valid non-empty strings', () => {
    assert.doesNotThrow(() => validateString('hello', 'testString'));
    assert.doesNotThrow(() => validateString('a', 'testString'));
  });
  
  it('should throw for empty strings and non-strings', () => {
    assert.throws(() => validateString('', 'testString'), /testString must be a non-empty string/);
    assert.throws(() => validateString(42, 'testString'), /testString must be a non-empty string/);
    assert.throws(() => validateString(null, 'testString'), /testString must be a non-empty string/);
  });
});

describe('validateRange', () => {
  it('should pass for values within range', () => {
    assert.doesNotThrow(() => validateRange(5, 0, 10, 'testRange'));
    assert.doesNotThrow(() => validateRange(0, 0, 10, 'testRange'));
    assert.doesNotThrow(() => validateRange(10, 0, 10, 'testRange'));
  });
  
  it('should throw for values outside range', () => {
    assert.throws(() => validateRange(-1, 0, 10, 'testRange'), /testRange must be between 0 and 10/);
    assert.throws(() => validateRange(11, 0, 10, 'testRange'), /testRange must be between 0 and 10/);
  });
});
