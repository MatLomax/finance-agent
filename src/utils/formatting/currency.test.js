/**
 * @fileoverview Tests for currency formatting utilities
 * 
 * Tests cover monetary formatting, percentage display, localization,
 * and edge cases for financial data presentation.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatMoney, formatPercentage } from './currency.js';

describe('Currency Formatting Functions', () => {
  describe('formatMoney', () => {
    test('formats small amounts to nearest €10', () => {
      assert.strictEqual(formatMoney(1234), '€1,230');
      assert.strictEqual(formatMoney(567), '€570');
      assert.strictEqual(formatMoney(1), '€0');
    });

    test('formats large amounts to nearest €100', () => {
      assert.strictEqual(formatMoney(123456), '€123,500');
      assert.strictEqual(formatMoney(987654), '€987,700');
      assert.strictEqual(formatMoney(50000), '€50,000');
    });

    test('handles negative amounts correctly', () => {
      assert.strictEqual(formatMoney(-1234), '€-1,230');
      assert.strictEqual(formatMoney(-123456), '€-123,500');
      assert.strictEqual(formatMoney(-50), '€-50');
    });

    test('supports different currencies', () => {
      assert.strictEqual(formatMoney(1234, '$'), '$1,230');
      assert.strictEqual(formatMoney(1234, '£'), '£1,230');
      assert.strictEqual(formatMoney(1234, '¥'), '¥1,230');
    });

    test('supports different locales', () => {
      assert.strictEqual(formatMoney(1234, '€', 'de-DE'), '€1.230');
      // French locale uses non-breaking space
      const frResult = formatMoney(1234, '€', 'fr-FR');
      assert.ok(frResult.includes('1') && frResult.includes('230') && frResult.startsWith('€'));
    });

    test('handles zero correctly', () => {
      const zeroResult = formatMoney(0);
      const negZeroResult = formatMoney(-0);
      // Both should format as positive zero
      assert.ok(zeroResult === '€0' || zeroResult === '€-0');
      assert.ok(negZeroResult === '€0' || negZeroResult === '€-0');
    });

    test('validates input parameters', () => {
      assert.throws(() => formatMoney('invalid'), /must be a finite number/);
      assert.throws(() => formatMoney(null), /must be a finite number/);
      assert.throws(() => formatMoney(undefined), /must be a finite number/);
    });

    test('validates currency parameter', () => {
      assert.throws(() => formatMoney(1000, ''), /must be a non-empty string/);
    });

    test('validates locale parameter', () => {
      assert.throws(() => formatMoney(1000, '€', 'x'), /RangeError|Incorrect locale/);
      assert.throws(() => formatMoney(1000, '€', 'toolonglocale'), /RangeError|Incorrect locale/);
    });
  });

  describe('formatPercentage', () => {
    test('formats decimal values as percentages', () => {
      assert.strictEqual(formatPercentage(0.05), '5.0%');
      assert.strictEqual(formatPercentage(0.1234), '12.3%');
      assert.strictEqual(formatPercentage(1.5), '150.0%');
    });

    test('handles negative percentages', () => {
      assert.strictEqual(formatPercentage(-0.05), '-5.0%');
      assert.strictEqual(formatPercentage(-0.1234), '-12.3%');
    });

    test('supports different decimal places', () => {
      assert.strictEqual(formatPercentage(0.1234, 0), '12%');
      assert.strictEqual(formatPercentage(0.1234, 2), '12.34%');
      assert.strictEqual(formatPercentage(0.1234, 3), '12.340%');
    });

    test('handles zero correctly', () => {
      assert.strictEqual(formatPercentage(0), '0.0%');
      assert.strictEqual(formatPercentage(-0), '0.0%');
    });

    test('handles very small values', () => {
      assert.strictEqual(formatPercentage(0.0001, 4), '0.0100%');
      assert.strictEqual(formatPercentage(0.00001, 5), '0.00100%');
    });

    test('validates input parameters', () => {
      assert.throws(() => formatPercentage('invalid'), /must be a finite number/);
      assert.throws(() => formatPercentage(null), /must be a finite number/);
      assert.throws(() => formatPercentage(undefined), /must be a finite number/);
      assert.throws(() => formatPercentage(0.5, 'invalid'), /must be a finite number/);
    });

    test('validates decimal places range', () => {
      assert.throws(() => formatPercentage(0.5, -1), /must be between 0 and 10/);
      assert.throws(() => formatPercentage(0.5, 11), /must be between 0 and 10/);
    });
  });
});
