/**
 * @fileoverview Tests for retirement calculation functions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateRetirementShortfall,
  calculateMaxWithdrawal
} from './retirement.js';

describe('Retirement Calculation Functions', () => {
  describe('calculateRetirementShortfall', () => {
    it('should calculate shortfall when expenses exceed income', () => {
      const result = calculateRetirementShortfall(58584, 6000);
      assert.strictEqual(result, 52584);
    });

    it('should return negative when income exceeds expenses', () => {
      const result = calculateRetirementShortfall(50000, 60000);
      assert.strictEqual(result, -10000);
    });

    it('should return zero when income equals expenses', () => {
      const result = calculateRetirementShortfall(50000, 50000);
      assert.strictEqual(result, 0);
    });

    it('should handle zero expenses', () => {
      const result = calculateRetirementShortfall(0, 6000);
      assert.strictEqual(result, -6000);
    });

    it('should handle zero income', () => {
      const result = calculateRetirementShortfall(58584, 0);
      assert.strictEqual(result, 58584);
    });
  });

  describe('calculateMaxWithdrawal', () => {
    it('should limit withdrawal based on future needs', () => {
      // Scenario: Need €52,584 but only have enough for 10 years
      const result = calculateMaxWithdrawal(58584, 6000, 585840, 20);
      // Future needs: (20-1) × 58584 = 1,113,096
      // Available: 585,840 - 1,113,096 = -527,256 (insufficient)
      assert.strictEqual(result, 0);
    });

    it('should allow full shortfall when sufficient wealth', () => {
      // Scenario: Have plenty of wealth for all years
      const result = calculateMaxWithdrawal(58584, 6000, 2000000, 20);
      // Shortfall: 58584 - 6000 = 52584
      // Future needs: (20-1) × 58584 = 1,113,096  
      // Available: 2,000,000 - 1,113,096 = 886,904 (sufficient)
      assert.strictEqual(result, 52584);
    });

    it('should handle case where income exceeds expenses', () => {
      const result = calculateMaxWithdrawal(50000, 60000, 500000, 10);
      // Shortfall is negative, so max withdrawal should be 0
      assert.strictEqual(result, 0);
    });

    it('should handle single year remaining', () => {
      const result = calculateMaxWithdrawal(58584, 6000, 100000, 1);
      // Future needs: (1-1) × 58584 = 0
      // Available: 100,000 - 0 = 100,000
      // Shortfall: 58584 - 6000 = 52584
      assert.strictEqual(result, 52584);
    });

    it('should handle zero years remaining', () => {
      const result = calculateMaxWithdrawal(58584, 6000, 100000, 0);
      // Future needs: (0-1) × 58584 = -58584 (negative years)
      // Available: 100,000 - (-58584) = 158,584
      // Shortfall: 58584 - 6000 = 52584
      assert.strictEqual(result, 52584);
    });
  });
});
