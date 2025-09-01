/**
 * @fileoverview Tests for currency conversion functions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  convertUsdToEur,
  convertEurToThb
} from './currency.js';

describe('Currency Conversion Functions', () => {
  describe('convertUsdToEur', () => {
    it('should convert USD to EUR correctly', () => {
      const result = convertUsdToEur(9000, 1.17);
      assert.strictEqual(Math.round(result * 100) / 100, 7692.31);
    });

    it('should handle zero USD amount', () => {
      const result = convertUsdToEur(0, 1.17);
      assert.strictEqual(result, 0);
    });

    it('should throw error for negative USD amount', () => {
      assert.throws(() => convertUsdToEur(-100, 1.17), /cannot be negative/);
    });

    it('should throw error for zero exchange rate', () => {
      assert.throws(() => convertUsdToEur(1000, 0), /must be positive/);
    });

    it('should throw error for negative exchange rate', () => {
      assert.throws(() => convertUsdToEur(1000, -1.17), /must be positive/);
    });
  });

  describe('convertEurToThb', () => {
    it('should convert EUR to THB correctly', () => {
      const result = convertEurToThb(1000, 37.75);
      assert.strictEqual(result, 37750);
    });

    it('should handle zero EUR amount', () => {
      const result = convertEurToThb(0, 37.75);
      assert.strictEqual(result, 0);
    });

    it('should handle fractional amounts', () => {
      const result = convertEurToThb(100.50, 37.75);
      assert.strictEqual(result, 3793.875);
    });

    it('should throw error for negative EUR amount', () => {
      assert.throws(() => convertEurToThb(-100, 37.75), /cannot be negative/);
    });

    it('should throw error for zero exchange rate', () => {
      assert.throws(() => convertEurToThb(1000, 0), /must be positive/);
    });
  });
});
