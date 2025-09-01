/**
 * @fileoverview Tests for mobile performance simulation utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

import { simulateMobilePerformance, validateMobilePerformance, MOBILE_THRESHOLDS } from './mobile-simulation.js';

describe('Mobile Performance Simulation', () => {
  describe('simulateMobilePerformance', () => {
    it('should simulate mobile constraints for fast functions', () => {
      const fastFunction = (x: any, y: any) => x + y;
      const result = simulateMobilePerformance(fastFunction, 5, 10);
      
      assert.strictEqual(result.result, 15, 'Should return correct function result');
      assert.ok(result.executionTime >= 2, 'Should include simulated delay (at least 2ms)');
      assert.ok(result.executionTime < MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS, 'Fast function should pass mobile threshold');
      assert.strictEqual(result.passesMobileThreshold, true, 'Should pass mobile threshold');
      assert.strictEqual(result.mobileThreshold, MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS, 'Should report correct threshold');
      assert.ok(result.simulatedConstraints.cpuThrottling, 'Should include constraint details');
    });

    it('should detect functions that fail mobile thresholds', () => {
      const slowFunction = () => {
        const start = performance.now();
        // Wait longer than mobile threshold (minus the 2ms simulation delay)
        while (performance.now() - start < MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS - 2 + 10) {
          // Intentionally slow
        }
      };
      
      const result = simulateMobilePerformance(slowFunction);
      
      assert.strictEqual(result.passesMobileThreshold, false, 'Slow function should fail mobile threshold');
      assert.ok(result.executionTime >= MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS, 'Should exceed mobile threshold');
    });

    it('should handle functions with parameters', () => {
      const parameterizedFunction = (a: any, b: any, c: any) => a * b + c;
      const result = simulateMobilePerformance(parameterizedFunction, 2, 3, 5);
      
      assert.strictEqual(result.result, 11, 'Should handle parameterized functions correctly');
      assert.ok(result.executionTime >= 2, 'Should include mobile simulation delay');
      assert.strictEqual(result.passesMobileThreshold, true, 'Simple math should pass mobile threshold');
    });

    it('should handle functions without parameters', () => {
      const noParamFunction = () => Math.PI * 2;
      const result = simulateMobilePerformance(noParamFunction);
      
      assert.ok(result.result > 6 && result.result < 7, 'Should execute function without parameters');
      assert.ok(result.executionTime >= 2, 'Should apply mobile simulation constraints');
    });
  });

  describe('validateMobilePerformance', () => {
    it('should validate healthy mobile performance', () => {
      const healthyResult = {
        passesMobileThreshold: true,
        executionTime: 25.3
      };
      
      const validation = validateMobilePerformance(healthyResult);
      
      assert.strictEqual(validation.isHealthy, true, 'Should validate healthy mobile performance');
      assert.strictEqual(validation.executionTimeMs, 25.3, 'Should report correct execution time');
      assert.strictEqual(validation.threshold, MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS, 'Should report correct threshold');
    });

    it('should validate unhealthy mobile performance', () => {
      const unhealthyResult = {
        passesMobileThreshold: false,
        executionTime: 150.7
      };
      
      const validation = validateMobilePerformance(unhealthyResult);
      
      assert.strictEqual(validation.isHealthy, false, 'Should detect unhealthy mobile performance');
      assert.strictEqual(validation.executionTimeMs, 150.7, 'Should report actual execution time');
      assert.strictEqual(validation.threshold, MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS, 'Should report threshold');
    });
  });
});
