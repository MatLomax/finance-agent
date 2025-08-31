/**
 * @fileoverview Tests for growth and change formatting utilities
 * 
 * Tests cover growth indicators, delta displays, and change visualization
 * with color coding for financial performance tracking.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatGrowth, formatDelta } from './growth.js';

describe('Growth and Change Formatting Functions', () => {
  describe('formatGrowth', () => {
    test('formats positive growth with colors and percentage', () => {
      const result = formatGrowth(52000, 50000);
      assert.ok(result.includes('€2,000'));
      assert.ok(result.includes('4.0%'));
      assert.ok(result.includes('#10b981')); // Green color
      assert.ok(result.includes('+'));
    });

    test('formats negative growth with colors and percentage', () => {
      const result = formatGrowth(48000, 50000);
      assert.ok(result.includes('€2,000'));
      assert.ok(result.includes('-4.0%'));
      assert.ok(result.includes('#ef4444')); // Red color
      assert.ok(result.includes('-'));
    });

    test('returns empty string when no previous value', () => {
      assert.strictEqual(formatGrowth(50000, null), '');
      assert.strictEqual(formatGrowth(50000, 0), '');
    });

    test('supports disabling percentage display', () => {
      const result = formatGrowth(52000, 50000, false);
      assert.ok(result.includes('€2,000'));
      assert.ok(!result.includes('%'));
    });

    test('supports disabling colors for accessibility', () => {
      const result = formatGrowth(52000, 50000, true, false);
      assert.ok(result.includes('#6b7280')); // Neutral gray
      assert.ok(!result.includes('#10b981')); // No green
    });

    test('rounds growth amounts to nearest €100', () => {
      const result = formatGrowth(51250, 50000);
      assert.ok(result.includes('€1,300')); // Rounded from €1,250
    });

    test('handles zero growth', () => {
      const result = formatGrowth(50000, 50000);
      assert.ok(result.includes('€0'));
      assert.ok(result.includes('0.0%'));
      assert.ok(result.includes('#6b7280')); // Neutral color
    });

    test('handles very large amounts', () => {
      const result = formatGrowth(1500000, 1000000);
      assert.ok(result.includes('€500,000'));
      assert.ok(result.includes('50.0%'));
    });

    test('validates input parameters', () => {
      assert.throws(() => formatGrowth('invalid', 50000), /Validation failed/);
      assert.throws(() => formatGrowth(52000, 'invalid'), /Validation failed/);
      assert.throws(() => formatGrowth(52000, 50000, 'invalid'), /Validation failed/);
    });
  });

  describe('formatDelta', () => {
    test('formats positive delta with green color', () => {
      const result = formatDelta(1250, 1000);
      assert.ok(result.includes('+ €250'));
      assert.ok(result.includes('#10b981')); // Green color
    });

    test('formats negative delta with red color', () => {
      const result = formatDelta(750, 1000);
      assert.ok(result.includes('€250'));
      assert.ok(result.includes('#ef4444')); // Red color
      assert.ok(!result.includes('+')); // No plus sign for negative
    });

    test('returns empty string when no previous value', () => {
      assert.strictEqual(formatDelta(1000, null), '');
    });

    test('filters changes below minimum threshold', () => {
      assert.strictEqual(formatDelta(1001, 1000, 50), ''); // €1 change, 50 threshold
      assert.strictEqual(formatDelta(1025, 1000, 50), ''); // €25 change, 50 threshold
    });

    test('shows changes above minimum threshold', () => {
      const result = formatDelta(1060, 1000, 50);
      assert.ok(result.includes('+ €60'));
    });

    test('supports different currencies', () => {
      const result = formatDelta(1250, 1000, 1, '$');
      assert.ok(result.includes('$250'));
    });

    test('handles zero delta', () => {
      assert.strictEqual(formatDelta(1000, 1000), '');
    });

    test('uses default threshold of 1', () => {
      const result = formatDelta(1002, 1000);
      assert.ok(result.includes('+ €0')); // Shows €2 rounded to €0
    });

    test('validates input parameters', () => {
      assert.throws(() => formatDelta('invalid', 1000), /Validation failed/);
      assert.throws(() => formatDelta(1250, 'invalid'), /Validation failed/);
      assert.throws(() => formatDelta(1250, 1000, -1), /Validation failed/);
      assert.throws(() => formatDelta(1250, 1000, 1, ''), /Validation failed/);
    });

    test('handles very large deltas', () => {
      const result = formatDelta(150000, 100000, 1000);
      assert.ok(result.includes('+ €50,000'));
    });

    test('respects currency placement in output', () => {
      const resultEur = formatDelta(1250, 1000, 1, '€');
      const resultUsd = formatDelta(1250, 1000, 1, '$');
      assert.ok(resultEur.includes('€250'));
      assert.ok(resultUsd.includes('$250'));
    });
  });
});
