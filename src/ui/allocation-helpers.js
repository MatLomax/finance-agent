/**
 * @fileoverview Allocation constraint helpers
 * 
 * This module handles the complex logic for maintaining valid allocation percentages
 * across the three financial phases. Ensures allocations always sum to 100%.
 */

/**
 * Update the displayed value for range inputs
 * 
 * @param {HTMLInputElement} input - Range input element
 */
export function updateRangeDisplay(input) {
  if (!input || !input.parentElement) return;
  
  const valueDisplay = input.parentElement.querySelector('.range-value');
  if (valueDisplay) {
    const value = parseFloat(input.value);
    const isPercentage = input.id.includes('Rate') || input.id.includes('alloc');
    valueDisplay.textContent = isPercentage ? 
      `${(value * 100).toFixed(1)}%` : 
      value.toString();
  }
}

/**
 * Update Phase 1 allocation constraints (debt + savings + investment = 100%)
 * 
 * @param {string} changedField - The field that was changed
 * @param {number} newValue - New value for the changed field
 * @param {HTMLElement} container - Container with all input fields
 */
function updatePhase1Allocations(changedField, newValue, container) {
  const savingsInput = /** @type {HTMLInputElement | null} */ (container.querySelector('#allocSavings1'));
  const investmentInput = /** @type {HTMLInputElement | null} */ (container.querySelector('#allocInvestment1'));
  
  if (!savingsInput || !investmentInput) return;
  
  if (changedField === 'allocDebt1') {
    const remaining = 1 - newValue;
    const currentSavings = parseFloat(savingsInput.value);
    const newInvestment = remaining - currentSavings;
    
    if (newInvestment >= 0 && newInvestment <= 1) {
      investmentInput.value = newInvestment.toString();
      updateRangeDisplay(investmentInput);
    } else {
      // Split remaining equally between savings and investment
      const halfRemaining = remaining * 0.5;
      savingsInput.value = halfRemaining.toString();
      investmentInput.value = halfRemaining.toString();
      updateRangeDisplay(savingsInput);
      updateRangeDisplay(investmentInput);
    }
  }
}

/**
 * Update Phase 2 allocation constraints (savings + investment = 100%)
 * 
 * @param {string} changedField - The field that was changed
 * @param {number} newValue - New value for the changed field
 * @param {HTMLElement} container - Container with all input fields
 */
function updatePhase2Allocations(changedField, newValue, container) {
  const savingsInput = /** @type {HTMLInputElement | null} */ (container.querySelector('#allocSavings2'));
  const investmentInput = /** @type {HTMLInputElement | null} */ (container.querySelector('#allocInvestment2'));
  
  if (!savingsInput || !investmentInput) return;
  
  if (changedField === 'allocSavings2') {
    investmentInput.value = (1 - newValue).toString();
    updateRangeDisplay(investmentInput);
  } else if (changedField === 'allocInvestment2') {
    savingsInput.value = (1 - newValue).toString();
    updateRangeDisplay(savingsInput);
  }
}

/**
 * Update Phase 3 allocation constraints (savings + investment = 100%)
 * 
 * @param {string} changedField - The field that was changed
 * @param {number} newValue - New value for the changed field
 * @param {HTMLElement} container - Container with all input fields
 */
function updatePhase3Allocations(changedField, newValue, container) {
  const savingsInput = /** @type {HTMLInputElement | null} */ (container.querySelector('#allocSavings3'));
  const investmentInput = /** @type {HTMLInputElement | null} */ (container.querySelector('#allocInvestment3'));
  
  if (!savingsInput || !investmentInput) return;
  
  if (changedField === 'allocSavings3') {
    investmentInput.value = (1 - newValue).toString();
    updateRangeDisplay(investmentInput);
  } else if (changedField === 'allocInvestment3') {
    savingsInput.value = (1 - newValue).toString();
    updateRangeDisplay(savingsInput);
  }
}

/**
 * Update allocation constraints to ensure valid percentages
 * Automatically adjusts allocation percentages when one changes to maintain 100% total
 * 
 * @param {string} phaseNumber - Phase number ('1', '2', or '3')
 * @param {string} changedField - The field that was changed
 * @param {number} newValue - New value for the changed field
 * @param {HTMLElement} container - Container with all input fields
 */
export function updateAllocationConstraints(phaseNumber, changedField, newValue, container) {
  if (phaseNumber === '1') {
    updatePhase1Allocations(changedField, newValue, container);
  } else if (phaseNumber === '2') {
    updatePhase2Allocations(changedField, newValue, container);
  } else if (phaseNumber === '3') {
    updatePhase3Allocations(changedField, newValue, container);
  }
}
