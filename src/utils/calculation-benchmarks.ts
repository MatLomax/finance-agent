/**
 * @fileoverview Calculation performance benchmarking utilities
 * 
 * Provides comprehensive benchmarking for financial calculation functions
 * including stress testing and performance validation.
 */

import { measureMainThreadBlocking } from './main-thread-blocking.js';

/**
 * Performance thresholds for calculations
 */
export const CALCULATION_THRESHOLDS = {
  MAX_CALCULATION_TIME_MS: 50,
  MAX_SIMULATION_TIME_MS: 200
};

/**
 * Comprehensive calculation performance benchmark
 * 
 * Tests performance of functions under various loads including
 * stress testing with multiple iterations for realistic analysis.
 * 
 */
export function benchmarkCalculations(calculationFunctions: any, testData: any): any {
  /** @type {Record<string, {singleExecution: Object, stressTest: Object, passesThreshold: boolean}>} */
  const results = {};
  
  for (const [funcName, func] of Object.entries(calculationFunctions)) {
    const funcTestData = testData[funcName] || [];
    
    // Single execution benchmark using main thread blocking measurement
    const singleRun = measureMainThreadBlocking(func, ...funcTestData);
    
    // Stress test with multiple iterations
    const stressTestStart = performance.now();
    const stressIterations = 1000;
    
    for (let i = 0; i < stressIterations; i++) {
      func(...funcTestData);
    }
    
    const stressTestEnd = performance.now();
    const stressTestTime = stressTestEnd - stressTestStart;
    const avgIterationTime = stressTestTime / stressIterations;
    
    results[funcName] = {
      singleExecution: singleRun,
      stressTest: {
        totalTime: stressTestTime,
        iterations: stressIterations,
        averageIterationTime: avgIterationTime,
        iterationsPerSecond: 1000 / avgIterationTime
      },
      passesThreshold: singleRun.maxTime < CALCULATION_THRESHOLDS.MAX_CALCULATION_TIME_MS
    };
  }
  
  return results;
}

/**
 * Validates calculation benchmarks against thresholds
 * 
 */
export function validateCalculationBenchmarks(benchmarkResults: any): any {
  const failures: any[] = [];
  let passed = 0;
  let failed = 0;
  
  for (const [funcName, result] of Object.entries(benchmarkResults)) {
    if (result.passesThreshold) {
      passed++;
    } else {
      failed++;
      failures.push(`${funcName}: execution time ${result.singleExecution.maxTime}ms exceeds limit ${CALCULATION_THRESHOLDS.MAX_CALCULATION_TIME_MS}ms`);
    }
  }
  
  return {
    isHealthy: failed === 0,
    failures,
    summary: {
      total: passed + failed,
      passed,
      failed
    }
  };
}
