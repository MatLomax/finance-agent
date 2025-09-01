/**
 * @fileoverview Application Controllers Module
 * 
 * Initializes and coordinates all application controllers including
 * inputs, calculations, results display, and theme management.
 */

import { toggleTheme } from './theme-manager.js';
import { createFinancialInputs } from './financial-inputs-extended.js';
import { createSummaryCards } from './summary-cards.js';
import { createPhaseTable } from './phase-tables.js';
import { triggerCalculation, subscribeToCalculations, debouncedCalculation } from './calculation-controller.js';
import { addObserver } from '../state/financial-data.js';
import { batchDOMUpdates } from '../utils/dom-helpers.js';

/**
 * Initialize financial inputs module
 * 
 */
function initializeInputs(container: HTMLElement, appState: any) {
  try {
    appState.inputsInstance = createFinancialInputs(container);
    console.log('✅ Financial inputs initialized');
  } catch (error) {
    console.error('❌ Failed to initialize financial inputs:', error);
    container.innerHTML = '<p class="error">Failed to load inputs.</p>';
  }
}

/**
 * Update results display with calculation data
 * 
 */
async function updateResults(container: HTMLElement, results: any) {
  if (!results) {
    container.innerHTML = '<p class="loading">Calculating...</p>';
    return;
  }
  
  try {
    batchDOMUpdates(() => {
      container.innerHTML = '';
      
      // Create summary cards
      const summaryData = {
        grossSalaryMonthly: results.grossSalaryMonthly || 0,
        netSalaryMonthly0: results.netSalaryMonthly0 || 0,
        netSalaryMonthly1: results.netSalaryMonthly1 || 0,
        monthlyExpenses: results.monthlyExpenses || 0,
        emergencyFundTarget: results.emergencyFundTarget || 0,
        taxRate: results.taxRate || 0,
        currentAge: results.currentAge || 25
      };
      
      const summaryCards = createSummaryCards(summaryData, {});
      container.appendChild(summaryCards);
      
      // Create phase tables if simulation data exists
      if (results.simulationData && results.simulationData.length > 0) {
        const phaseConfig = { phase: 'debt-elimination', allocationPercentage: 100 };
        const phaseTable = createPhaseTable(results.simulationData, phaseConfig, null, 0.15);
        container.appendChild(phaseTable);
      }
    });
    
    // Lazy load chart after DOM updates
    if (results.simulationData && results.simulationData.length > 0) {
      try {
        const { createChartSection } = await import('./chart-loader.js');
        const chartSection = createChartSection(results.simulationData);
        container.appendChild(chartSection);
      } catch (chartError) {
        console.warn('Chart module not available:', chartError);
      }
    }
    
    console.log('✅ Results updated successfully');
  } catch (error) {
    console.error('❌ Failed to update results:', error);
    container.innerHTML = '<p class="error">Failed to display results.</p>';
  }
}

/**
 * Setup calculation event handling
 * 
 */
function setupCalculationHandling(resultsContainer: HTMLElement, appState: any) {
  // Subscribe to calculation events
  subscribeToCalculations((/** @type {any} */ event) => {
    if (event.type === 'calculation-start') {
      updateResults(resultsContainer, null);
    } else if (event.type === 'calculation-complete') {
      appState.calculationResults = event.results;
      updateResults(resultsContainer, event.results);
    }
  });
  
  // Listen for financial data changes
  addObserver(() => {
    debouncedCalculation();
  });
  
  // Trigger initial calculation with longer delay to ensure everything is loaded
  console.log('⏰ Scheduling initial calculation...');
  setTimeout(() => {
    console.log('🔄 Triggering initial calculation now...');
    const result = triggerCalculation();
    console.log('💡 Initial calculation result:', result);
  }, 500);
}

/**
 * Setup theme toggle functionality
 * 
 */
function setupThemeToggle(themeButton: HTMLElement) {
  themeButton.addEventListener('click', () => {
    try {
      const newTheme = toggleTheme();
      themeButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    } catch (error) {
      console.error('❌ Failed to toggle theme:', error);
    }
  });
}

/**
 * Initialize all application controllers
 * 
 */
export function initializeAppControllers(appState: any) {
  // Get container references
  const inputsContainer = document.getElementById('inputs-container');
  const resultsContainer = document.getElementById('results-container');
  const themeToggle = /** @type {HTMLElement} */ (document.querySelector('.theme-toggle'));
  
  if (!inputsContainer || !resultsContainer || !themeToggle) {
    throw new Error('Failed to find required containers');
  }
  
  // Initialize modules
  initializeInputs(inputsContainer, appState);
  setupCalculationHandling(resultsContainer, appState);
  setupThemeToggle(themeToggle);
}
