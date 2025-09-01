/**
 * Calculation Engine Controller
 * 
 * Orchestrates calculation triggers with optimized performance.
 * Coordinates input changes with simulation recalculation and manages
 * loading states during computation with graceful error handling.
 * 
 * @module calculation-controller
 */

import { debounce, pull } from 'lodash-es';
import { simulateWealthTrajectory } from '../lib/simulate-wealth.js';
import { loadFinancialData } from '../state/financial-data.js';
import { getCachedSimulation, setCachedSimulation } from '../state/simulation-results.js';
import { validateFinancialData } from '../state/validation.js';

// State tracking
let isCalculating = false;
/** @type {Function[]} */
const subscribers: any[] = [];

/**
 * Subscribe to calculation state changes.
 * 
 */
export function subscribeToCalculations(callback: (...args: any[]) => any): (...args: any[]) => any {
  subscribers.push(callback);
  return () => {
    pull(subscribers, callback);
  };
}

/**
 * Notify calculation subscribers of state changes.
 * 
 * @private
 */
function notifySubscribers(event: object): (...args: any[]) => any {
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
 */
function performCalculation(financialData: object): (...args: any[]) => any {
  try {
    const isValid = validateFinancialData(financialData);
    if (!isValid) {
      throw new Error('Invalid financial data provided');
    }

    // Transform financial data to simulation input format
    const grossEur = financialData.grossUsd / financialData.eurUsd;
    const simulationInput = {
      ...financialData,
      grossSalaryMonthly: grossEur,
      allocations: {
        debtPhase: { 
          debt: financialData.allocDebt1, 
          savings: financialData.allocSavings1, 
          investments: financialData.allocInvestment1 
        },
        emergencyPhase: { 
          debt: financialData.allocDebt2, 
          savings: financialData.allocSavings2, 
          investments: financialData.allocInvestment2 
        },
        retirementPhase: { 
          debt: 0, 
          savings: financialData.allocSavings3, 
          investments: financialData.allocInvestment3 
        }
      }
    };

    const simulationResults = simulateWealthTrajectory(simulationInput, 65);
    return { success: true, data: simulationResults };
  } catch (/** @type {any} */ error) {
    return { success: false, error: error.message || 'Calculation failed' };
  }
}

/**
 * Trigger wealth simulation calculation.
 * 
 */
export function triggerCalculation(options: any = {}): (...args: any[]) => any {
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
