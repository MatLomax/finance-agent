/**
 * @fileoverview Tests for main thread blocking measurement utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

import { measureMainThreadBlocking, validateBlockingPerformance, BLOCKING_THRESHOLDS } from './main-thread-blocking.js';

describe('Main Thread Blocking Measurement', () => {
  describe('measureMainThreadBlocking', () => {
    it('should measure execution time for fast functions', () => {
      const fastFunction = (x: any, y: any) => x + y;
      const result = measureMainThreadBlocking(fastFunction, 5, 10);
      
      assert.ok(result.averageTime >= 0, 'Should measure average time');
      assert.ok(result.maxTime >= result.minTime, 'Max time should be >= min time');
      assert.strictEqual(result.measurements.length, 10, 'Should run 10 iterations');
      assert.strictEqual(result.blockingThreshold, BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS, 'Should use correct threshold');
      assert.strictEqual(result.isBlocking, false, 'Fast function should not be blocking');
    });

    it('should detect blocking for slow functions', () => {
      const slowFunction = () => {
        const start = performance.now();
        // Busy wait for more than threshold
        while (performance.now() - start < BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS + 5) {
          // Intentional blocking
        }
      };
      
      const result = measureMainThreadBlocking(slowFunction);
      
      assert.strictEqual(result.isBlocking, true, 'Slow function should be detected as blocking');
      assert.ok(result.maxTime > BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS, 'Max time should exceed threshold');
    });

    it('should handle functions with parameters', () => {
      const parameterizedFunction = (a: any, b: any, c: any) => {
        return a * b + c;
      };
      
      const result = measureMainThreadBlocking(parameterizedFunction, 2, 3, 5);
      
      assert.ok(result.averageTime >= 0, 'Should handle parameterized functions');
      assert.strictEqual(result.isBlocking, false, 'Simple math should not block');
    });
  });

  describe('validateBlockingPerformance', () => {
    it('should validate healthy blocking performance', () => {
      const healthyResult = {
        isBlocking: false,
        maxTime: 2.5,
        averageTime: 1.8
      };
      
      const validation = validateBlockingPerformance(healthyResult);
      
      assert.strictEqual(validation.isHealthy, true, 'Should validate healthy performance');
      assert.strictEqual(validation.maxTimeMs, 2.5, 'Should report correct max time');
      assert.strictEqual(validation.threshold, BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS, 'Should report correct threshold');
    });

    it('should validate unhealthy blocking performance', () => {
      const unhealthyResult = {
        isBlocking: true,
        maxTime: 15.2,
        averageTime: 12.1
      };
      
      const validation = validateBlockingPerformance(unhealthyResult);
      
      assert.strictEqual(validation.isHealthy, false, 'Should detect unhealthy performance');
      assert.strictEqual(validation.maxTimeMs, 15.2, 'Should report actual max time');
    });
  });
});
