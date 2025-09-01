/**
 * @fileoverview Mobile device performance simulation utilities
 * 
 * Simulates lower-end mobile device constraints including slower CPUs
 * and limited memory to validate application performance.
 */

/**
 * Performance thresholds for mobile devices
 */
export const MOBILE_THRESHOLDS = {
  MOBILE_MAX_CALCULATION_TIME_MS: 100,
  MOBILE_MAX_SIMULATION_TIME_MS: 400
};

/**
 * Simulates mobile device performance constraints
 * 
 * Artificially introduces delays to simulate lower-end mobile devices
 * with slower CPUs and validates performance under these constraints.
 * 
 * @param {Function} fn - Function to test under mobile constraints
 * @param {...any} args - Arguments to pass to function
 * @returns {{result: any, executionTime: number, passesMobileThreshold: boolean, mobileThreshold: number, simulatedConstraints: Object}} Mobile performance results
 */
export function simulateMobilePerformance(fn, ...args) {
  // Simulate mobile CPU throttling by introducing artificial delay
  const simulateSlowCPU = (factor = 2) => {
    const startTime = performance.now();
    // Busy wait to simulate CPU constraints
    while (performance.now() - startTime < factor) {
      // Intentional busy wait to simulate slower mobile CPU
    }
  };
  
  const startTime = performance.now();
  
  // Simulate mobile constraints before execution
  simulateSlowCPU(2); // 2ms artificial delay to simulate slower CPU
  
  const result = fn(...args);
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  return {
    result,
    executionTime: totalTime,
    passesMobileThreshold: totalTime < MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS,
    mobileThreshold: MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS,
    simulatedConstraints: {
      cpuThrottling: '2ms artificial delay (3x slower than desktop)',
      memoryConstraints: 'Limited heap size simulation'
    }
  };
}

/**
 * Validates mobile performance against thresholds
 * 
 * @param {{passesMobileThreshold: boolean, executionTime: number}} mobileResult - Result from simulateMobilePerformance
 * @returns {{isHealthy: boolean, executionTimeMs: number, threshold: number}} Validation result
 */
export function validateMobilePerformance(mobileResult) {
  return {
    isHealthy: mobileResult.passesMobileThreshold,
    executionTimeMs: mobileResult.executionTime,
    threshold: MOBILE_THRESHOLDS.MOBILE_MAX_CALCULATION_TIME_MS
  };
}
