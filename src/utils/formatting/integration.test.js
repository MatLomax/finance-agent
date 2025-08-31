/**
 * @fileoverview Integration and performance tests for formatting utilities
 * 
 * Tests cover real-world scenarios combining multiple formatting functions
 * and performance requirements for the formatting system.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatMoney, formatPercentage } from './currency.js';
import { formatGrowth, formatDelta } from './growth.js';
import { formatPhaseLabel, formatAgeRange } from './display.js';
import { getAccessibleColors, getResponsiveFontSize } from './accessibility.js';

describe('Integration and Edge Case Tests', () => {
  describe('Real-world financial scenarios', () => {
    test('handles typical investment portfolio display', () => {
      const currentValue = 125000;
      const previousValue = 120000;
      
      const moneyFormat = formatMoney(currentValue);
      const growthFormat = formatGrowth(currentValue, previousValue);
      
      assert.strictEqual(moneyFormat, '€125,000');
      assert.ok(growthFormat.includes('+€5,000'));
      assert.ok(growthFormat.includes('+4.2%'));
    });

    test('handles emergency fund progress display', () => {
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

    test('handles debt elimination tracking', () => {
      const remainingDebt = 25000;
      const monthlyPayment = 2000;
      
      const debtFormat = formatMoney(remainingDebt);
      const paymentFormat = formatMoney(monthlyPayment);
      const phaseLabel = formatPhaseLabel('debtFree', true);
      
      assert.strictEqual(debtFormat, '€25,000');
      assert.strictEqual(paymentFormat, '€2,000');
      assert.ok(phaseLabel.includes('font-weight: bold'));
    });

    test('handles retirement years display', () => {
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
    test('handles very large numbers efficiently', () => {
      const largeNumber = 999999999;
      const result = formatMoney(largeNumber);
      assert.strictEqual(result, '€1,000,000,000'); // Rounded to nearest 100
    });

    test('handles very small decimals', () => {
      const smallPercentage = 0.001;
      const result = formatPercentage(smallPercentage, 3);
      assert.strictEqual(result, '0.100%');
    });

    test('handles extreme growth ratios', () => {
      const result = formatGrowth(1000000, 1);
      assert.ok(result.includes('+€1,000,000'));
      assert.ok(result.includes('+99999900.0%'));
    });
  });

  describe('Accessibility compliance', () => {
    test('provides high contrast colors when requested', () => {
      const highContrastPositive = getAccessibleColors('positive', true);
      const normalPositive = getAccessibleColors('positive', false);
      
      assert.strictEqual(highContrastPositive.contrast, 'AAA');
      assert.strictEqual(normalPositive.contrast, 'AA');
      assert.notStrictEqual(highContrastPositive.primary, normalPositive.primary);
    });

    test('provides responsive font sizes for different devices', () => {
      const desktopPrimary = getResponsiveFontSize('primary', false);
      const mobilePrimary = getResponsiveFontSize('primary', true);
      
      assert.ok(desktopPrimary.includes('clamp'));
      assert.ok(mobilePrimary.includes('clamp'));
      assert.notStrictEqual(desktopPrimary, mobilePrimary);
    });
  });
});

describe('Performance Tests', () => {
  test('completes all formatting functions within 50ms total', () => {
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

  test('handles batch formatting operations efficiently', () => {
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
