/**
 * @fileoverview Tests for memory profiling utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

import { profileMemoryUsage, validateMemoryUsage, MEMORY_THRESHOLDS } from './runtime-performance.js';

describe('Memory Profiling', () => {
  describe('profileMemoryUsage', () => {
    it('should profile memory usage for simple functions', () => {
      const simpleFunction = (x: any, y: any) => x + y;
      const profile = profileMemoryUsage(simpleFunction, 5, 10);
      
      assert.strictEqual(profile.result, 15, 'Should return correct function result');
      assert.ok(profile.executionTime >= 0, 'Should measure execution time');
      
      // Memory profiling may not be available in all environments
      if (profile.memoryDelta) {
        assert.ok(typeof profile.memoryDelta.usedJSHeapSize === 'number', 'Should measure heap size delta');
        assert.ok(typeof profile.memoryDelta.totalJSHeapSize === 'number', 'Should measure total heap delta');
      }
      
      if (profile.initialMemory) {
        assert.ok(typeof profile.initialMemory.usedJSHeapSize === 'number', 'Should capture initial memory');
      }
      
      if (profile.finalMemory) {
        assert.ok(typeof profile.finalMemory.usedJSHeapSize === 'number', 'Should capture final memory');
      }
    });

    it('should handle functions that allocate memory', () => {
      const memoryAllocatingFunction = () => {
        // Allocate some memory
        const largeArray = new Array(1000).fill(0);
        return largeArray.length;
      };
      
      const profile = profileMemoryUsage(memoryAllocatingFunction);
      
      assert.strictEqual(profile.result, 1000, 'Should return correct function result');
      assert.ok(profile.executionTime >= 0, 'Should measure execution time');
    });

    it('should handle functions with parameters', () => {
      const parameterizedFunction = (a: any, b: any, c: any) => {
        const result: any[] = [];
        for (let i = 0; i < a; i++) {
          result.push(b * c);
        }
        return result.length;
      };
      
      const profile = profileMemoryUsage(parameterizedFunction, 10, 5, 3);
      
      assert.strictEqual(profile.result, 10, 'Should handle parameterized functions');
      assert.ok(profile.executionTime >= 0, 'Should measure execution time');
    });

    it('should handle functions without parameters', () => {
      const noParamFunction = () => Math.random();
      const profile = profileMemoryUsage(noParamFunction);
      
      assert.ok(typeof profile.result === 'number', 'Should execute function without parameters');
      assert.ok(profile.executionTime >= 0, 'Should measure execution time');
    });
  });

  describe('validateMemoryUsage', () => {
    it('should validate healthy memory usage when memory API unavailable', () => {
      const profileWithoutMemory = {
        result: 42,
        executionTime: 1.5,
        memoryDelta: null,
        initialMemory: null,
        finalMemory: null
      };
      
      const validation = validateMemoryUsage(profileWithoutMemory);
      
      assert.strictEqual(validation.isHealthy, true, 'Should be healthy when memory API unavailable');
      assert.strictEqual(validation.memoryGrowthMB, 0, 'Should report zero memory growth');
      assert.strictEqual(validation.threshold, MEMORY_THRESHOLDS.MAX_MEMORY_GROWTH_MB, 'Should report correct threshold');
      assert.ok(validation.note, 'Should include note about memory API availability');
    });

    it('should validate healthy memory usage with memory data', () => {
      const profileWithHealthyMemory = {
        result: 42,
        executionTime: 1.5,
        memoryDelta: {
          usedJSHeapSize: 1024 * 1024 * 2, // 2MB growth
          totalJSHeapSize: 1024 * 1024 * 2
        },
        initialMemory: { usedJSHeapSize: 10 * 1024 * 1024 },
        finalMemory: { usedJSHeapSize: 12 * 1024 * 1024 }
      };
      
      const validation = validateMemoryUsage(profileWithHealthyMemory);
      
      assert.strictEqual(validation.isHealthy, true, 'Should be healthy with moderate memory growth');
      assert.strictEqual(validation.memoryGrowthMB, 2, 'Should calculate memory growth correctly');
      assert.strictEqual(validation.threshold, MEMORY_THRESHOLDS.MAX_MEMORY_GROWTH_MB, 'Should report correct threshold');
    });

    it('should validate unhealthy memory usage', () => {
      const profileWithUnhealthyMemory = {
        result: 42,
        executionTime: 1.5,
        memoryDelta: {
          usedJSHeapSize: 1024 * 1024 * 10, // 10MB growth (exceeds 5MB threshold)
          totalJSHeapSize: 1024 * 1024 * 10
        },
        initialMemory: { usedJSHeapSize: 10 * 1024 * 1024 },
        finalMemory: { usedJSHeapSize: 20 * 1024 * 1024 }
      };
      
      const validation = validateMemoryUsage(profileWithUnhealthyMemory);
      
      assert.strictEqual(validation.isHealthy, false, 'Should detect unhealthy memory usage');
      assert.strictEqual(validation.memoryGrowthMB, 10, 'Should calculate high memory growth');
      assert.ok(validation.memoryGrowthMB > validation.threshold, 'Memory growth should exceed threshold');
    });
  });
});
