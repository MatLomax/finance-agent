/**
 * @fileoverview Tests for display state and UI element formatting utilities
 * 
 * Tests cover phase labels, age ranges, and other UI state displays
 * for the financial planning interface.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatPhaseLabel, formatAgeRange } from './display.js';

describe('Display State Formatting Functions', () => {
  describe('formatPhaseLabel', () => {
    test('formats debt free phase label', () => {
      const result = formatPhaseLabel('debtFree');
      assert.ok(result.includes('Debt Elimination'));
      assert.ok(result.includes('🎯'));
      assert.ok(result.includes('#dc2626'));
    });

    test('formats emergency fund phase label', () => {
      const result = formatPhaseLabel('emergencyFund');
      assert.ok(result.includes('Emergency Fund'));
      assert.ok(result.includes('🛡️'));
      assert.ok(result.includes('#ca8a04'));
    });

    test('formats retirement phase label', () => {
      const result = formatPhaseLabel('retirement');
      assert.ok(result.includes('Retirement Planning'));
      assert.ok(result.includes('🏖️'));
      assert.ok(result.includes('#2563eb'));
    });

    test('formats death phase label', () => {
      const result = formatPhaseLabel('death');
      assert.ok(result.includes('Retirement Years'));
      assert.ok(result.includes('💀'));
      assert.ok(result.includes('#7c3aed'));
    });

    test('applies active styling when isActive is true', () => {
      const result = formatPhaseLabel('debtFree', true);
      assert.ok(result.includes('#b91c1c')); // Active color
      assert.ok(result.includes('bold'));
    });

    test('applies normal styling when isActive is false', () => {
      const result = formatPhaseLabel('debtFree', false);
      assert.ok(result.includes('#dc2626')); // Normal color
      assert.ok(result.includes('normal'));
    });

    test('defaults to inactive when isActive not specified', () => {
      const result = formatPhaseLabel('debtFree');
      assert.ok(result.includes('normal'));
    });

    test('validates phase parameter', () => {
      assert.throws(() => formatPhaseLabel(123), /must be string/);
      assert.throws(() => formatPhaseLabel(null), /must be string/);
      assert.throws(() => formatPhaseLabel(undefined), /must be string/);
    });

    test('validates isActive parameter', () => {
      assert.throws(() => formatPhaseLabel('debtFree', 'true'), /must be boolean/);
      assert.throws(() => formatPhaseLabel('debtFree', 1), /must be boolean/);
    });

    test('throws error for unknown phase', () => {
      assert.throws(() => formatPhaseLabel('unknown'), /Unknown phase: unknown/);
      assert.throws(() => formatPhaseLabel(''), /Unknown phase/);
    });

    test('includes valid phases in error message', () => {
      try {
        formatPhaseLabel('invalid');
      } catch (error) {
        assert.ok(error.message.includes('debtFree'));
        assert.ok(error.message.includes('emergencyFund'));
        assert.ok(error.message.includes('retirement'));
        assert.ok(error.message.includes('death'));
      }
    });
  });

  describe('formatAgeRange', () => {
    test('formats basic age range', () => {
      assert.strictEqual(formatAgeRange(25, 30), '25 - 30');
      assert.strictEqual(formatAgeRange(0, 5), '0 - 5');
      assert.strictEqual(formatAgeRange(65, 85), '65 - 85');
    });

    test('handles same start and end age', () => {
      assert.strictEqual(formatAgeRange(30, 30), '30 - 30');
    });

    test('adds current indicator when isCurrentAge is true', () => {
      assert.strictEqual(formatAgeRange(25, 30, true), '25 - 30 (current)');
    });

    test('no current indicator when isCurrentAge is false', () => {
      assert.strictEqual(formatAgeRange(25, 30, false), '25 - 30');
    });

    test('defaults to no current indicator when not specified', () => {
      assert.strictEqual(formatAgeRange(25, 30), '25 - 30');
    });

    test('validates age parameters', () => {
      assert.throws(() => formatAgeRange('25', 30), /must be numbers/);
      assert.throws(() => formatAgeRange(25, '30'), /must be numbers/);
      assert.throws(() => formatAgeRange(null, 30), /must be numbers/);
      assert.throws(() => formatAgeRange(25, undefined), /must be numbers/);
    });

    test('validates isCurrentAge parameter', () => {
      assert.throws(() => formatAgeRange(25, 30, 'true'), /must be boolean/);
      assert.throws(() => formatAgeRange(25, 30, 1), /must be boolean/);
    });

    test('validates non-negative ages', () => {
      assert.throws(() => formatAgeRange(-1, 30), /must be non-negative/);
      assert.throws(() => formatAgeRange(25, -1), /must be non-negative/);
      assert.throws(() => formatAgeRange(-5, -1), /must be non-negative/);
    });

    test('validates start age not greater than end age', () => {
      assert.throws(() => formatAgeRange(30, 25), /Start age cannot be greater than end age/);
      assert.throws(() => formatAgeRange(100, 50), /Start age cannot be greater than end age/);
    });

    test('handles very large age ranges', () => {
      assert.strictEqual(formatAgeRange(0, 100), '0 - 100');
      assert.strictEqual(formatAgeRange(50, 150), '50 - 150');
    });
  });
});
