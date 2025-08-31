/**
 * @fileoverview Tests for accessibility and responsive design utilities
 * 
 * Tests cover WCAG-compliant color schemes and responsive font sizing
 * for accessible financial data presentation.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getAccessibleColors, getResponsiveFontSize } from './accessibility.js';

describe('Accessibility and Responsive Helper Functions', () => {
  describe('getAccessibleColors', () => {
    test('returns positive color scheme in normal contrast', () => {
      const colors = getAccessibleColors('positive');
      assert.strictEqual(colors.primary, '#059669');
      assert.strictEqual(colors.background, '#d1fae5');
      assert.strictEqual(colors.contrast, 'AA');
    });

    test('returns positive color scheme in high contrast', () => {
      const colors = getAccessibleColors('positive', true);
      assert.strictEqual(colors.primary, '#065f46');
      assert.strictEqual(colors.background, '#ecfdf5');
      assert.strictEqual(colors.contrast, 'AAA');
    });

    test('returns negative color scheme in normal contrast', () => {
      const colors = getAccessibleColors('negative');
      assert.strictEqual(colors.primary, '#dc2626');
      assert.strictEqual(colors.background, '#fee2e2');
      assert.strictEqual(colors.contrast, 'AA');
    });

    test('returns negative color scheme in high contrast', () => {
      const colors = getAccessibleColors('negative', true);
      assert.strictEqual(colors.primary, '#991b1b');
      assert.strictEqual(colors.background, '#fef2f2');
      assert.strictEqual(colors.contrast, 'AAA');
    });

    test('returns neutral color scheme in normal contrast', () => {
      const colors = getAccessibleColors('neutral');
      assert.strictEqual(colors.primary, '#6b7280');
      assert.strictEqual(colors.background, '#f9fafb');
      assert.strictEqual(colors.contrast, 'AA');
    });

    test('returns neutral color scheme in high contrast', () => {
      const colors = getAccessibleColors('neutral', true);
      assert.strictEqual(colors.primary, '#374151');
      assert.strictEqual(colors.background, '#ffffff');
      assert.strictEqual(colors.contrast, 'AAA');
    });

    test('defaults to normal contrast when highContrast not specified', () => {
      const colors = getAccessibleColors('positive');
      assert.strictEqual(colors.contrast, 'AA');
    });

    test('validates type parameter', () => {
      assert.throws(() => getAccessibleColors(123), /must be string/);
      assert.throws(() => getAccessibleColors(null), /must be string/);
      assert.throws(() => getAccessibleColors(undefined), /must be string/);
    });

    test('validates highContrast parameter', () => {
      assert.throws(() => getAccessibleColors('positive', 'true'), /must be boolean/);
      assert.throws(() => getAccessibleColors('positive', 1), /must be boolean/);
    });

    test('throws error for unknown color type', () => {
      assert.throws(() => getAccessibleColors('unknown'), /Unknown color type: unknown/);
      assert.throws(() => getAccessibleColors(''), /Unknown color type/);
    });

    test('includes valid types in error message', () => {
      try {
        getAccessibleColors('invalid');
      } catch (error) {
        assert.ok(error.message.includes('positive'));
        assert.ok(error.message.includes('negative'));
        assert.ok(error.message.includes('neutral'));
      }
    });

    test('all color schemes have required properties', () => {
      const types = ['positive', 'negative', 'neutral'];
      types.forEach(type => {
        const normal = getAccessibleColors(type, false);
        const high = getAccessibleColors(type, true);
        
        assert.ok(normal.primary);
        assert.ok(normal.background);
        assert.ok(normal.contrast);
        assert.ok(high.primary);
        assert.ok(high.background);
        assert.ok(high.contrast);
      });
    });
  });

  describe('getResponsiveFontSize', () => {
    test('returns primary font size for desktop', () => {
      const fontSize = getResponsiveFontSize('primary');
      assert.strictEqual(fontSize, 'clamp(1.25rem, 2.5vw, 2rem)');
    });

    test('returns primary font size for mobile', () => {
      const fontSize = getResponsiveFontSize('primary', true);
      assert.strictEqual(fontSize, 'clamp(1.125rem, 4vw, 1.5rem)');
    });

    test('returns secondary font size for desktop', () => {
      const fontSize = getResponsiveFontSize('secondary');
      assert.strictEqual(fontSize, 'clamp(1rem, 2vw, 1.25rem)');
    });

    test('returns secondary font size for mobile', () => {
      const fontSize = getResponsiveFontSize('secondary', true);
      assert.strictEqual(fontSize, 'clamp(0.875rem, 3.5vw, 1.125rem)');
    });

    test('returns caption font size for desktop', () => {
      const fontSize = getResponsiveFontSize('caption');
      assert.strictEqual(fontSize, 'clamp(0.875rem, 1.5vw, 1rem)');
    });

    test('returns caption font size for mobile', () => {
      const fontSize = getResponsiveFontSize('caption', true);
      assert.strictEqual(fontSize, 'clamp(0.75rem, 2vw, 0.875rem)');
    });

    test('returns label font size for desktop', () => {
      const fontSize = getResponsiveFontSize('label');
      assert.strictEqual(fontSize, 'clamp(0.75rem, 1.25vw, 0.875rem)');
    });

    test('returns label font size for mobile', () => {
      const fontSize = getResponsiveFontSize('label', true);
      assert.strictEqual(fontSize, 'clamp(0.6875rem, 1.8vw, 0.8rem)');
    });

    test('defaults to desktop when isMobile not specified', () => {
      const fontSize = getResponsiveFontSize('primary');
      assert.strictEqual(fontSize, 'clamp(1.25rem, 2.5vw, 2rem)');
    });

    test('validates importance parameter', () => {
      assert.throws(() => getResponsiveFontSize(123), /must be string/);
      assert.throws(() => getResponsiveFontSize(null), /must be string/);
      assert.throws(() => getResponsiveFontSize(undefined), /must be string/);
    });

    test('validates isMobile parameter', () => {
      assert.throws(() => getResponsiveFontSize('primary', 'true'), /must be boolean/);
      assert.throws(() => getResponsiveFontSize('primary', 1), /must be boolean/);
    });

    test('throws error for unknown importance level', () => {
      assert.throws(() => getResponsiveFontSize('unknown'), /Unknown importance level: unknown/);
      assert.throws(() => getResponsiveFontSize(''), /Unknown importance level/);
    });

    test('includes valid levels in error message', () => {
      try {
        getResponsiveFontSize('invalid');
      } catch (error) {
        assert.ok(error.message.includes('primary'));
        assert.ok(error.message.includes('secondary'));
        assert.ok(error.message.includes('caption'));
        assert.ok(error.message.includes('label'));
      }
    });

    test('all importance levels return clamp CSS functions', () => {
      const levels = ['primary', 'secondary', 'caption', 'label'];
      levels.forEach(level => {
        const desktop = getResponsiveFontSize(level, false);
        const mobile = getResponsiveFontSize(level, true);
        
        assert.ok(desktop.startsWith('clamp('));
        assert.ok(desktop.endsWith(')'));
        assert.ok(mobile.startsWith('clamp('));
        assert.ok(mobile.endsWith(')'));
      });
    });
  });
});
