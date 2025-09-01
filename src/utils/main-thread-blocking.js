/**
 * @fileoverview Main thread blocking measurement for performance testing
 * 
 * Detects functions that block the main thread for too long, which could
 * freeze the UI and prevent responsive user interactions.
 */

/**
 * Performance thresholds for main thread blocking
 */
export const BLOCKING_THRESHOLDS = {
  MAX_BLOCKING_TIME_MS: 8 // Chrome DevTools recommendation
};

/**
 * Measures if a function blocks the main thread for too long
 * 
 * Uses performance.now() to detect blocking operations through
 * multiple measurement iterations for statistical accuracy.
 * 
 * @param {Function} fn - Function to test for blocking
 * @param {...any} args - Arguments to pass to function
 * @returns {{averageTime: number, maxTime: number, minTime: number, measurements: number[], isBlocking: boolean, blockingThreshold: number}} Blocking measurement results
 */
export function measureMainThreadBlocking(fn, ...args) {
  const measurements = [];
  const iterations = 10; // Multiple runs for statistical accuracy
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    fn(...args);
    const endTime = performance.now();
    measurements.push(endTime - startTime);
  }
  
  const avgTime = measurements.reduce((sum, time) => sum + time, 0) / iterations;
  const maxTime = Math.max(...measurements);
  const minTime = Math.min(...measurements);
  
  return {
    averageTime: avgTime,
    maxTime,
    minTime,
    measurements,
    isBlocking: maxTime > BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS,
    blockingThreshold: BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS
  };
}

/**
 * Validates blocking measurement against thresholds
 * 
 * @param {{isBlocking: boolean, maxTime: number}} blockingResult - Result from measureMainThreadBlocking
 * @returns {{isHealthy: boolean, maxTimeMs: number, threshold: number}} Validation result
 */
export function validateBlockingPerformance(blockingResult) {
  return {
    isHealthy: !blockingResult.isBlocking,
    maxTimeMs: blockingResult.maxTime,
    threshold: BLOCKING_THRESHOLDS.MAX_BLOCKING_TIME_MS
  };
}
