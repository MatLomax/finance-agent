/**
 * @fileoverview Tests for calculation benchmarking utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

import { benchmarkCalculations, validateCalculationBenchmarks, CALCULATION_THRESHOLDS } from './calculation-benchmarks.js';

describe('Calculation Benchmarks', () => {
  describe('benchmarkCalculations', () => {
    it('should benchmark multiple functions', () => {
      const functions = {
        add: (a, b) => a + b,
        multiply: (a, b) => a * b,
        divide: (a, b) => a / b
      };
      
      const testData = {
        add: [5, 10],
        multiply: [3, 7],
        divide: [20, 4]
      };
      
      const results = benchmarkCalculations(functions, testData);
      
      assert.ok(results.add, 'Should have results for add function');
      assert.ok(results.multiply, 'Should have results for multiply function');
      assert.ok(results.divide, 'Should have results for divide function');
      
      // Check structure of results
      for (const funcName of Object.keys(functions)) {
        const result = results[funcName];
        assert.ok(result.singleExecution, `${funcName} should have single execution data`);
        assert.ok(result.stressTest, `${funcName} should have stress test data`);
        assert.ok(typeof result.passesThreshold === 'boolean', `${funcName} should have threshold result`);
        
        // Check stress test data
        assert.ok(result.stressTest.totalTime >= 0, `${funcName} stress test should measure time`);
        assert.strictEqual(result.stressTest.iterations, 1000, `${funcName} should run 1000 iterations`);
        assert.ok(result.stressTest.iterationsPerSecond > 0, `${funcName} should calculate iterations per second`);
      }
    });

    it('should handle functions without test data', () => {
      const functions = {
        noParams: () => 42
      };
      
      const testData = {}; // No test data provided
      
      const results = benchmarkCalculations(functions, testData);
      
      assert.ok(results.noParams, 'Should handle function without test data');
      assert.ok(results.noParams.passesThreshold, 'Simple function should pass threshold');
    });

    it('should detect slow functions', () => {
      const functions = {
        slowFunction: () => {
          const start = performance.now();
          while (performance.now() - start < CALCULATION_THRESHOLDS.MAX_CALCULATION_TIME_MS + 10) {
            // Intentionally slow
          }
        }
      };
      
      const results = benchmarkCalculations(functions, {});
      
      assert.strictEqual(results.slowFunction.passesThreshold, false, 'Slow function should fail threshold');
    });
  });

  describe('validateCalculationBenchmarks', () => {
    it('should validate healthy benchmark results', () => {
      const healthyResults = {
        func1: {
          passesThreshold: true,
          singleExecution: { maxTime: 2.1 }
        },
        func2: {
          passesThreshold: true,
          singleExecution: { maxTime: 1.8 }
        }
      };
      
      const validation = validateCalculationBenchmarks(healthyResults);
      
      assert.strictEqual(validation.isHealthy, true, 'Should validate healthy results');
      assert.strictEqual(validation.failures.length, 0, 'Should have no failures');
      assert.strictEqual(validation.summary.passed, 2, 'Should count passed functions');
      assert.strictEqual(validation.summary.failed, 0, 'Should count failed functions');
      assert.strictEqual(validation.summary.total, 2, 'Should count total functions');
    });

    it('should validate unhealthy benchmark results', () => {
      const unhealthyResults = {
        fastFunc: {
          passesThreshold: true,
          singleExecution: { maxTime: 3.2 }
        },
        slowFunc: {
          passesThreshold: false,
          singleExecution: { maxTime: 75.5 }
        }
      };
      
      const validation = validateCalculationBenchmarks(unhealthyResults);
      
      assert.strictEqual(validation.isHealthy, false, 'Should detect unhealthy results');
      assert.strictEqual(validation.failures.length, 1, 'Should have one failure');
      assert.ok(validation.failures[0].includes('slowFunc'), 'Should identify slow function');
      assert.strictEqual(validation.summary.passed, 1, 'Should count passed functions');
      assert.strictEqual(validation.summary.failed, 1, 'Should count failed functions');
    });
  });
});
