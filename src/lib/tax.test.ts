/**
 * @fileoverview Tests for tax calculation functions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateNetSalary } from './tax.js';

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
      assert.throws(() => calculateNetSalary(-1000, 0.17), /cannot be negative/);
    });

    it('should throw error for tax rate above 100%', () => {
      assert.throws(() => calculateNetSalary(1000, 1.5), /must be between 0 and 1/);
    });

    it('should throw error for negative tax rate', () => {
      assert.throws(() => calculateNetSalary(1000, -0.1), /must be between 0 and 1/);
    });
  });
});
