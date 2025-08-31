/**
 * @fileoverview Tests for growth calculation functions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculatePercentageGrowth,
  calculateAbsoluteGrowth
} from './growth.js';

describe('Percentage and Growth Functions', () => {
  describe('calculatePercentageGrowth', () => {
    it('should calculate positive growth percentage', () => {
      const result = calculatePercentageGrowth(110000, 100000);
      assert.strictEqual(result, 10);
    });

    it('should calculate negative growth percentage', () => {
      const result = calculatePercentageGrowth(90000, 100000);
      assert.strictEqual(result, -10);
    });

    it('should handle zero growth', () => {
      const result = calculatePercentageGrowth(100000, 100000);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional growth', () => {
      const result = calculatePercentageGrowth(105000, 100000);
      assert.strictEqual(result, 5);
    });

    it('should handle negative current value', () => {
      const result = calculatePercentageGrowth(-50000, 100000);
      assert.strictEqual(result, -150);
    });

    it('should handle negative previous value', () => {
      const result = calculatePercentageGrowth(50000, -100000);
      assert.strictEqual(result, -150);
    });

    it('should throw error for zero previous value', () => {
      assert.throws(() => calculatePercentageGrowth(110000, 0), /Previous value cannot be zero/);
    });
  });

  describe('calculateAbsoluteGrowth', () => {
    it('should calculate positive absolute growth', () => {
      const result = calculateAbsoluteGrowth(110000, 100000);
      assert.strictEqual(result, 10000);
    });

    it('should calculate negative absolute growth', () => {
      const result = calculateAbsoluteGrowth(90000, 100000);
      assert.strictEqual(result, -10000);
    });

    it('should handle zero growth', () => {
      const result = calculateAbsoluteGrowth(100000, 100000);
      assert.strictEqual(result, 0);
    });

    it('should handle negative values', () => {
      const result = calculateAbsoluteGrowth(-50000, -60000);
      assert.strictEqual(result, 10000);
    });

    it('should handle zero values', () => {
      const result = calculateAbsoluteGrowth(0, 100000);
      assert.strictEqual(result, -100000);
    });

    it('should handle fractional values', () => {
      const result = calculateAbsoluteGrowth(100.50, 100.25);
      assert.strictEqual(result, 0.25);
    });
  });
});
