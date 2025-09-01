/**
 * @fileoverview Memory profiling utilities for runtime performance testing
 * 
 * Provides memory usage profiling for function execution analysis.
 * Limited to browser environments with performance.memory API support.
 */

/**
 * Performance thresholds for memory profiling
 */
export const MEMORY_THRESHOLDS = {
  MAX_MEMORY_GROWTH_MB: 5
};

/**
 * Measures memory usage before and after a function execution
 * 
 * Note: performance.memory is only available in Chrome and requires
 * --enable-precise-memory-info flag for accurate measurements.
 * 
 * @param {Function} fn - Function to profile
 * @param {...any} args - Arguments to pass to function
 * @returns {{result: any, executionTime: number, memoryDelta: Object|null, initialMemory: Object|null, finalMemory: Object|null}} Memory usage statistics
 */
export function profileMemoryUsage(fn, ...args) {
  // Check for performance.memory API availability (Chrome-specific)
  const hasMemoryAPI = typeof performance !== 'undefined' && 
                       // @ts-ignore - performance.memory is Chrome-specific extension
                       performance.memory !== undefined;
  
  const initialMemory = hasMemoryAPI ? {
    // @ts-ignore - performance.memory is Chrome-specific extension
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    // @ts-ignore - performance.memory is Chrome-specific extension  
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    // @ts-ignore - performance.memory is Chrome-specific extension
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
  } : null;
  
  const startTime = performance.now();
  const result = fn(...args);
  const endTime = performance.now();
  
  const finalMemory = hasMemoryAPI ? {
    // @ts-ignore - performance.memory is Chrome-specific extension
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    // @ts-ignore - performance.memory is Chrome-specific extension
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    // @ts-ignore - performance.memory is Chrome-specific extension
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
  } : null;
  
  return {
    result,
    executionTime: endTime - startTime,
    memoryDelta: initialMemory && finalMemory ? {
      usedJSHeapSize: finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize,
      totalJSHeapSize: finalMemory.totalJSHeapSize - initialMemory.totalJSHeapSize
    } : null,
    initialMemory,
    finalMemory
  };
}

/**
 * Validates memory usage against thresholds
 * 
 * @param {{memoryDelta: {usedJSHeapSize: number}|null}} memoryProfile - Result from profileMemoryUsage
 * @returns {{isHealthy: boolean, memoryGrowthMB: number, threshold: number, note?: string}} Validation result
 */
export function validateMemoryUsage(memoryProfile) {
  if (!memoryProfile.memoryDelta) {
    return {
      isHealthy: true,
      memoryGrowthMB: 0,
      threshold: MEMORY_THRESHOLDS.MAX_MEMORY_GROWTH_MB,
      note: 'Memory API not available'
    };
  }
  
  const memoryGrowthMB = memoryProfile.memoryDelta.usedJSHeapSize / (1024 * 1024);
  
  return {
    isHealthy: memoryGrowthMB <= MEMORY_THRESHOLDS.MAX_MEMORY_GROWTH_MB,
    memoryGrowthMB,
    threshold: MEMORY_THRESHOLDS.MAX_MEMORY_GROWTH_MB
  };
}
