/**
 * Calculation Engine Controller
 * 
 * Orchestrates calculation triggers with optimized performance.
 * Coordinates input changes with simulation recalculation and manages
 * loading states during computation with graceful error handling.
 * 
 * @module calculation-controller
 */

import { simulateWealthTrajectory } from '../lib/simulate-wealth.js';
import { loadFinancialData } from '../state/financial-data.js';
import { getCachedSimulation, setCachedSimulation } from '../state/simulation-results.js';
import { validateFinancialData } from '../state/validation.js';

// State tracking
let isCalculating = false;
/** @type {Function[]} */
const subscribers = [];

/**
 * Simple debounce implementation for calculation triggers.
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to delay
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  /** @type {ReturnType<typeof setTimeout>|undefined} */
  let timeout;
  return function(/** @type {...any} */ ...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Subscribe to calculation state changes.
 * 
 * @param {Function} callback - Function called with calculation events
 * @returns {Function} Unsubscribe function
 */
export function subscribeToCalculations(callback) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) subscribers.splice(index, 1);
  };
}

/**
 * Notify calculation subscribers of state changes.
 * 
 * @param {Object} event - Event object with type and data
 * @private
 */
function notifySubscribers(event) {
  subscribers.forEach(callback => {
    try {
      callback(event);
    } catch (error) {
      console.error('Error in calculation subscriber:', error);
    }
  });
}

/**
 * Perform wealth simulation calculation with error handling.
 * 
 * @param {Object} financialData - Financial input data
 * @returns {{success: boolean, data?: any, error?: string}} Simulation results or error information
 */
function performCalculation(financialData) {
  try {
    const isValid = validateFinancialData(financialData);
    if (!isValid) {
      throw new Error('Invalid financial data provided');
    }

    const simulationResults = simulateWealthTrajectory(financialData, 65);
    return { success: true, data: simulationResults };
  } catch (/** @type {any} */ error) {
    return { success: false, error: error.message || 'Calculation failed' };
  }
}

/**
 * Trigger wealth simulation calculation.
 * 
 * @param {{forceRecalculation?: boolean}} [options={}] - Calculation options
 * @returns {{success: boolean, data?: any, error?: string, fromCache?: boolean}} Calculation results with success/error status
 */
export function triggerCalculation(options = {}) {
  if (isCalculating) {
    return { success: false, error: 'Calculation already in progress' };
  }

  try {
    isCalculating = true;
    notifySubscribers({ type: 'calculation-start' });

    const financialData = loadFinancialData();
    const cached = getCachedSimulation(financialData);
    
    if (cached && !options.forceRecalculation) {
      notifySubscribers({ type: 'calculation-complete', results: cached });
      return { success: true, data: cached, fromCache: true };
    }

    const result = performCalculation(financialData);
    if (result.success && result.data) {
      setCachedSimulation(financialData, result.data);
    }

    notifySubscribers({ type: 'calculation-complete', results: result.data });
    return result;
  } finally {
    isCalculating = false;
  }
}

/**
 * Debounced calculation trigger for input handling.
 */
export const debouncedCalculation = debounce(triggerCalculation, 300);
