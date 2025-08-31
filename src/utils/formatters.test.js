/**
 * @fileoverview Comprehensive tests for UI formatting utility functions
 * 
 * Tests all formatting functions with:
 * - Valid formatting scenarios with expected outputs
 * - Invalid input validation and error handling
 * - Edge cases and boundary conditions
 * - UI/UX behavior verification
 * - Accessibility compliance testing
 * - Performance validation
 * 
 * Uses Node.js native test runner for zero dependencies and fast execution.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatMoney,
  formatPercentage,
  formatGrowth,
  formatDelta,
  formatPhaseLabel,
  formatAgeRange,
  getAccessibleColors,
  getResponsiveFontSize
} from './formatters.js';

// =============================================================================
// CURRENCY FORMATTING TESTS
// =============================================================================

describe('Currency Formatting Functions', () => {
  describe('formatMoney', () => {
    it('should format large amounts with intelligent rounding (nearest 100)', () => {
      const result = formatMoney(15750);
      assert.strictEqual(result, '€15,800');
    });

    it('should format small amounts with intelligent rounding (nearest 10)', () => {
      const result = formatMoney(1234);
      assert.strictEqual(result, '€1,230');
    });

    it('should handle negative amounts correctly', () => {
      const result = formatMoney(-5432);
      assert.strictEqual(result, '€-5,430');
    });

    it('should handle zero amount', () => {
      const result = formatMoney(0);
      assert.strictEqual(result, '€0');
    });

    it('should handle custom currency symbol', () => {
      const result = formatMoney(1000, '$');
      assert.strictEqual(result, '$1,000');
    });

    it('should handle different locale formatting', () => {
      const result = formatMoney(1234.56, '€', 'en-US');
      assert.strictEqual(result, '€1,230');
    });

    it('should apply large amount rounding at exactly 10000', () => {
      const result = formatMoney(10000);
      assert.strictEqual(result, '€10,000');
    });

    it('should apply small amount rounding just below 10000', () => {
      const result = formatMoney(9999);
      assert.strictEqual(result, '€10,000');
    });

    it('should throw error for non-number amount', () => {
      assert.throws(() => formatMoney('invalid'), /Validation failed/);
    });

    it('should throw error for invalid currency', () => {
      assert.throws(() => formatMoney(1000, ''), /Validation failed/);
    });
  });

  describe('formatPercentage', () => {
    it('should format decimal to percentage with default 1 decimal place', () => {
      const result = formatPercentage(0.0567);
      assert.strictEqual(result, '5.7%');
    });

    it('should format with custom decimal places', () => {
      const result = formatPercentage(0.3333, 2);
      assert.strictEqual(result, '33.33%');
    });

    it('should format with zero decimal places', () => {
      const result = formatPercentage(0.3333, 0);
      assert.strictEqual(result, '33%');
    });

    it('should handle negative percentages', () => {
      const result = formatPercentage(-0.15);
      assert.strictEqual(result, '-15.0%');
    });

    it('should handle zero percentage', () => {
      const result = formatPercentage(0);
      assert.strictEqual(result, '0.0%');
    });

    it('should handle values greater than 1 (over 100%)', () => {
      const result = formatPercentage(1.5);
      assert.strictEqual(result, '150.0%');
    });

    it('should throw error for non-number value', () => {
      assert.throws(() => formatPercentage('invalid'), /must be numbers/);
    });

    it('should throw error for invalid decimal places', () => {
      assert.throws(() => formatPercentage(0.5, -1), /must be between 0 and 10/);
      assert.throws(() => formatPercentage(0.5, 11), /must be between 0 and 10/);
    });
  });
});

// =============================================================================
// GROWTH AND CHANGE FORMATTING TESTS
// =============================================================================

describe('Growth and Change Formatting Functions', () => {
  describe('formatGrowth', () => {
    it('should format positive growth with both absolute and percentage', () => {
      const result = formatGrowth(110000, 100000);
      assert.ok(result.includes('+€10,000'));
      assert.ok(result.includes('+10.0%'));
      assert.ok(result.includes('#10b981')); // Green color
    });

    it('should format negative growth with both absolute and percentage', () => {
      const result = formatGrowth(90000, 100000);
      assert.ok(result.includes('-€10,000'));
      assert.ok(result.includes('-10.0%'));
      assert.ok(result.includes('#ef4444')); // Red color
    });

    it('should format zero growth', () => {
      const result = formatGrowth(100000, 100000);
      assert.ok(result.includes('€0'));
      assert.ok(result.includes('0.0%'));
      assert.ok(result.includes('#6b7280')); // Gray color
    });

    it('should handle small growth amounts with rounding', () => {
      const result = formatGrowth(100150, 100000);
      assert.ok(result.includes('+€200')); // Rounded to nearest 100
    });

    it('should return empty string for zero previous value', () => {
      const result = formatGrowth(100000, 0);
      assert.strictEqual(result, '');
    });

    it('should return empty string for null/undefined previous value', () => {
      const result = formatGrowth(100000, null);
      assert.strictEqual(result, '');
    });

    it('should hide percentage when showPercentage is false', () => {
      const result = formatGrowth(110000, 100000, false);
      assert.ok(result.includes('+€10,000'));
      assert.ok(!result.includes('%'));
    });

    it('should use neutral colors when showColors is false', () => {
      const result = formatGrowth(110000, 100000, true, false);
      assert.ok(result.includes('#6b7280')); // Gray color regardless of growth
    });

    it('should handle fractional percentages correctly', () => {
      const result = formatGrowth(100500, 100000);
      assert.ok(result.includes('0.5%'));
    });

    it('should throw error for invalid inputs', () => {
      assert.throws(() => formatGrowth('invalid', 100000), /Validation failed/);
      assert.throws(() => formatGrowth(110000, 'invalid'), /Validation failed/);
    });
  });

  describe('formatDelta', () => {
    it('should format positive delta with currency', () => {
      const result = formatDelta(1150, 1000);
      assert.ok(result.includes('+ €150'));
      assert.ok(result.includes('#10b981')); // Green color
    });

    it('should format negative delta', () => {
      const result = formatDelta(850, 1000);
      assert.ok(result.includes('€150')); // No + sign for negative
      assert.ok(result.includes('#ef4444')); // Red color
    });

    it('should return empty string for changes below threshold', () => {
      const result = formatDelta(1001, 1000, 10);
      assert.strictEqual(result, '');
    });

    it('should return empty string for null previous value', () => {
      const result = formatDelta(1000, null);
      assert.strictEqual(result, '');
    });

    it('should handle custom currency symbol', () => {
      const result = formatDelta(1150, 1000, 1, '$');
      assert.ok(result.includes('$150'));
    });

    it('should handle custom threshold values', () => {
      const result = formatDelta(1005, 1000, 10);
      assert.strictEqual(result, ''); // Below threshold
      
      const result2 = formatDelta(1015, 1000, 10);
      assert.ok(result2.includes('€20')); // Above threshold (rounded)
    });

    it('should handle zero delta', () => {
      const result = formatDelta(1000, 1000);
      assert.strictEqual(result, '');
    });

    it('should throw error for invalid inputs', () => {
      assert.throws(() => formatDelta('invalid', 1000), /Validation failed/);
      assert.throws(() => formatDelta(1000, 'invalid'), /Validation failed/);
    });
  });
});

// =============================================================================
// DISPLAY STATE FORMATTING TESTS
// =============================================================================

describe('Display State Formatting Functions', () => {
  describe('formatPhaseLabel', () => {
    it('should format debt elimination phase', () => {
      const result = formatPhaseLabel('debtFree');
      assert.ok(result.includes('🎯'));
      assert.ok(result.includes('Debt Elimination'));
      assert.ok(result.includes('#dc2626')); // Red color
    });

    it('should format emergency fund phase', () => {
      const result = formatPhaseLabel('emergencyFund');
      assert.ok(result.includes('🛡️'));
      assert.ok(result.includes('Emergency Fund'));
      assert.ok(result.includes('#ca8a04')); // Orange color
    });

    it('should format retirement planning phase', () => {
      const result = formatPhaseLabel('retirement');
      assert.ok(result.includes('🏖️'));
      assert.ok(result.includes('Retirement Planning'));
      assert.ok(result.includes('#2563eb')); // Blue color
    });

    it('should format retirement years phase', () => {
      const result = formatPhaseLabel('death');
      assert.ok(result.includes('💀'));
      assert.ok(result.includes('Retirement Years'));
      assert.ok(result.includes('#7c3aed')); // Purple color
    });

    it('should apply active styling when isActive is true', () => {
      const result = formatPhaseLabel('debtFree', true);
      assert.ok(result.includes('#b91c1c')); // Darker active color
      assert.ok(result.includes('font-weight: bold'));
    });

    it('should apply normal styling when isActive is false', () => {
      const result = formatPhaseLabel('debtFree', false);
      assert.ok(result.includes('#dc2626')); // Normal color
      assert.ok(result.includes('font-weight: normal'));
    });

    it('should throw error for unknown phase', () => {
      assert.throws(() => formatPhaseLabel('unknown'), /Unknown phase/);
    });

    it('should throw error for invalid input types', () => {
      assert.throws(() => formatPhaseLabel(123), /must be string/);
      assert.throws(() => formatPhaseLabel('debtFree', 'invalid'), /must be boolean/);
    });
  });

  describe('formatAgeRange', () => {
    it('should format basic age range', () => {
      const result = formatAgeRange(33, 45);
      assert.strictEqual(result, '33 - 45');
    });

    it('should format age range with current indicator', () => {
      const result = formatAgeRange(33, 45, true);
      assert.strictEqual(result, '33 - 45 (current)');
    });

    it('should handle same start and end age', () => {
      const result = formatAgeRange(35, 35);
      assert.strictEqual(result, '35 - 35');
    });

    it('should handle zero ages', () => {
      const result = formatAgeRange(0, 25);
      assert.strictEqual(result, '0 - 25');
    });

    it('should throw error for negative ages', () => {
      assert.throws(() => formatAgeRange(-1, 45), /must be non-negative/);
      assert.throws(() => formatAgeRange(33, -1), /must be non-negative/);
    });

    it('should throw error when start age > end age', () => {
      assert.throws(() => formatAgeRange(45, 33), /cannot be greater than end age/);
    });

    it('should throw error for invalid input types', () => {
      assert.throws(() => formatAgeRange('33', 45), /must be numbers/);
      assert.throws(() => formatAgeRange(33, '45'), /must be numbers/);
      assert.throws(() => formatAgeRange(33, 45, 'invalid'), /must be boolean/);
    });
  });
});

// =============================================================================
// ACCESSIBILITY AND RESPONSIVE HELPER TESTS
// =============================================================================

describe('Accessibility and Responsive Helper Functions', () => {
  describe('getAccessibleColors', () => {
    it('should return positive colors for normal contrast', () => {
      const result = getAccessibleColors('positive');
      assert.strictEqual(result.primary, '#059669');
      assert.strictEqual(result.background, '#d1fae5');
      assert.strictEqual(result.contrast, 'AA');
    });

    it('should return positive colors for high contrast', () => {
      const result = getAccessibleColors('positive', true);
      assert.strictEqual(result.primary, '#065f46');
      assert.strictEqual(result.background, '#ecfdf5');
      assert.strictEqual(result.contrast, 'AAA');
    });

    it('should return negative colors for normal contrast', () => {
      const result = getAccessibleColors('negative');
      assert.strictEqual(result.primary, '#dc2626');
      assert.strictEqual(result.background, '#fee2e2');
      assert.strictEqual(result.contrast, 'AA');
    });

    it('should return negative colors for high contrast', () => {
      const result = getAccessibleColors('negative', true);
      assert.strictEqual(result.primary, '#991b1b');
      assert.strictEqual(result.background, '#fef2f2');
      assert.strictEqual(result.contrast, 'AAA');
    });

    it('should return neutral colors for normal contrast', () => {
      const result = getAccessibleColors('neutral');
      assert.strictEqual(result.primary, '#6b7280');
      assert.strictEqual(result.background, '#f9fafb');
      assert.strictEqual(result.contrast, 'AA');
    });

    it('should return neutral colors for high contrast', () => {
      const result = getAccessibleColors('neutral', true);
      assert.strictEqual(result.primary, '#374151');
      assert.strictEqual(result.background, '#ffffff');
      assert.strictEqual(result.contrast, 'AAA');
    });

    it('should throw error for unknown color type', () => {
      assert.throws(() => getAccessibleColors('unknown'), /Unknown color type/);
    });

    it('should throw error for invalid input types', () => {
      assert.throws(() => getAccessibleColors(123), /must be string/);
      assert.throws(() => getAccessibleColors('positive', 'invalid'), /must be boolean/);
    });
  });

  describe('getResponsiveFontSize', () => {
    it('should return primary font size for desktop', () => {
      const result = getResponsiveFontSize('primary');
      assert.strictEqual(result, 'clamp(1.25rem, 2.5vw, 2rem)');
    });

    it('should return primary font size for mobile', () => {
      const result = getResponsiveFontSize('primary', true);
      assert.strictEqual(result, 'clamp(1.125rem, 4vw, 1.5rem)');
    });

    it('should return secondary font size for desktop', () => {
      const result = getResponsiveFontSize('secondary');
      assert.strictEqual(result, 'clamp(1rem, 2vw, 1.25rem)');
    });

    it('should return secondary font size for mobile', () => {
      const result = getResponsiveFontSize('secondary', true);
      assert.strictEqual(result, 'clamp(0.875rem, 3.5vw, 1.125rem)');
    });

    it('should return caption font size for desktop', () => {
      const result = getResponsiveFontSize('caption');
      assert.strictEqual(result, 'clamp(0.875rem, 1.5vw, 1rem)');
    });

    it('should return caption font size for mobile', () => {
      const result = getResponsiveFontSize('caption', true);
      assert.strictEqual(result, 'clamp(0.75rem, 2vw, 0.875rem)');
    });

    it('should return label font size for desktop', () => {
      const result = getResponsiveFontSize('label');
      assert.strictEqual(result, 'clamp(0.75rem, 1.25vw, 0.875rem)');
    });

    it('should return label font size for mobile', () => {
      const result = getResponsiveFontSize('label', true);
      assert.strictEqual(result, 'clamp(0.6875rem, 1.8vw, 0.8rem)');
    });

    it('should throw error for unknown importance level', () => {
      assert.throws(() => getResponsiveFontSize('unknown'), /Unknown importance level/);
    });

    it('should throw error for invalid input types', () => {
      assert.throws(() => getResponsiveFontSize(123), /must be string/);
      assert.throws(() => getResponsiveFontSize('primary', 'invalid'), /must be boolean/);
    });
  });
});

// =============================================================================
// INTEGRATION AND EDGE CASE TESTS
// =============================================================================

describe('Integration and Edge Case Tests', () => {
  describe('Real-world financial scenarios', () => {
    it('should handle typical investment portfolio display', () => {
      const currentValue = 125000;
      const previousValue = 120000;
      
      const moneyFormat = formatMoney(currentValue);
      const growthFormat = formatGrowth(currentValue, previousValue);
      
      assert.strictEqual(moneyFormat, '€125,000');
      assert.ok(growthFormat.includes('+€5,000'));
      assert.ok(growthFormat.includes('+4.2%'));
    });

    it('should handle emergency fund progress display', () => {
      const current = 15000;
      const target = 18000;
      const percentage = current / target;
      
      const currentFormat = formatMoney(current);
      const targetFormat = formatMoney(target);
      const progressFormat = formatPercentage(percentage, 0);
      
      assert.strictEqual(currentFormat, '€15,000');
      assert.strictEqual(targetFormat, '€18,000');
      assert.strictEqual(progressFormat, '83%');
    });

    it('should handle debt elimination tracking', () => {
      const remainingDebt = 25000;
      const monthlyPayment = 2000;
      
      const debtFormat = formatMoney(remainingDebt);
      const paymentFormat = formatMoney(monthlyPayment);
      const phaseLabel = formatPhaseLabel('debtFree', true);
      
      assert.strictEqual(debtFormat, '€25,000');
      assert.strictEqual(paymentFormat, '€2,000');
      assert.ok(phaseLabel.includes('font-weight: bold'));
    });

    it('should handle retirement years display', () => {
      const currentAge = 67;
      const lifeExpectancy = 85;
      const yearlyExpenses = 45000;
      const remainingWealth = 800000;
      
      const ageRange = formatAgeRange(currentAge, lifeExpectancy, true);
      const expensesFormat = formatMoney(yearlyExpenses);
      const wealthFormat = formatMoney(remainingWealth);
      
      assert.strictEqual(ageRange, '67 - 85 (current)');
      assert.strictEqual(expensesFormat, '€45,000');
      assert.strictEqual(wealthFormat, '€800,000');
    });
  });

  describe('Performance edge cases', () => {
    it('should handle very large numbers efficiently', () => {
      const largeNumber = 999999999;
      const result = formatMoney(largeNumber);
      assert.strictEqual(result, '€1,000,000,000'); // Rounded to nearest 100
    });

    it('should handle very small decimals', () => {
      const smallPercentage = 0.001;
      const result = formatPercentage(smallPercentage, 3);
      assert.strictEqual(result, '0.100%');
    });

    it('should handle extreme growth ratios', () => {
      const result = formatGrowth(1000000, 1);
      assert.ok(result.includes('+€1,000,000'));
      assert.ok(result.includes('+99999900.0%'));
    });
  });

  describe('Accessibility compliance', () => {
    it('should provide high contrast colors when requested', () => {
      const highContrastPositive = getAccessibleColors('positive', true);
      const normalPositive = getAccessibleColors('positive', false);
      
      assert.strictEqual(highContrastPositive.contrast, 'AAA');
      assert.strictEqual(normalPositive.contrast, 'AA');
      assert.notStrictEqual(highContrastPositive.primary, normalPositive.primary);
    });

    it('should provide responsive font sizes for different devices', () => {
      const desktopPrimary = getResponsiveFontSize('primary', false);
      const mobilePrimary = getResponsiveFontSize('primary', true);
      
      assert.ok(desktopPrimary.includes('clamp'));
      assert.ok(mobilePrimary.includes('clamp'));
      assert.notStrictEqual(desktopPrimary, mobilePrimary);
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance Tests', () => {
  it('should complete all formatting functions within 50ms total', () => {
    const startTime = performance.now();
    
    // Run a representative sample of all formatting functions
    formatMoney(15750);
    formatMoney(-5432, '$');
    formatPercentage(0.0567);
    formatPercentage(0.3333, 2);
    formatGrowth(110000, 100000);
    formatGrowth(90000, 100000, false);
    formatDelta(1150, 1000);
    formatDelta(850, 1000, 10, '$');
    formatPhaseLabel('debtFree', true);
    formatPhaseLabel('retirement', false);
    formatAgeRange(33, 45, true);
    formatAgeRange(67, 85);
    getAccessibleColors('positive', true);
    getAccessibleColors('negative');
    getResponsiveFontSize('primary', true);
    getResponsiveFontSize('caption');
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // All formatting functions should complete very quickly
    assert.ok(executionTime < 50, `Execution time ${executionTime}ms exceeds 50ms limit`);
  });

  it('should handle batch formatting operations efficiently', () => {
    const startTime = performance.now();
    
    // Simulate formatting a large financial dashboard
    const portfolioItems = Array.from({ length: 100 }, (_, i) => ({
      current: 100000 + (i * 1000),
      previous: 100000 + ((i - 1) * 1000)
    }));
    
    portfolioItems.forEach(item => {
      formatMoney(item.current);
      if (item.previous > 0) {
        formatGrowth(item.current, item.previous);
        formatDelta(item.current, item.previous);
      }
    });
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Batch operations should still complete quickly
    assert.ok(executionTime < 100, `Batch execution time ${executionTime}ms exceeds 100ms limit`);
  });
});
