/**
 * @fileoverview Simple financial input form module
 * 
 * Creates a basic financial input form with auto-save functionality.
 * Focuses on core functionality while maintaining architectural compliance.
 */

import { batchDOMUpdates, createElement, createEventDelegator } from '../utils/dom-helpers.js';
import { loadFinancialData, updateFinancialData, addObserver } from '../state/financial-data.js';

/**
 * Create a simple input field
 * 
 * @param {string} key - Field key for storage and DOM IDs
 * @param {string} label - Field label
 * @param {number} value - Initial value
 * @param {string} step - Input step attribute
 * @param {boolean} isPercentage - Whether to convert decimal to percentage for display
 * @returns {{inputGroup: HTMLElement, input: HTMLElement}} Input field container and input
 */
function createSimpleInput(key, label, value, step = '0.01', isPercentage = false) {
  const inputGroup = createElement('div', { className: 'input-field' });
  
  const labelEl = createElement('label', { 
    className: 'input-label',
    textContent: label 
  });
  labelEl.setAttribute('for', key);
  
  // Convert decimal to percentage for display if needed
  const displayValue = isPercentage ? (value * 100).toString() : value.toString();
  
  const input = createElement('input', {
    className: 'input-control'
  });
  
  // Set input attributes manually due to createElement type limitations
  input.setAttribute('type', 'number');
  input.setAttribute('id', key);
  input.setAttribute('name', key);
  input.setAttribute('value', displayValue);
  input.setAttribute('step', step);
  
  inputGroup.appendChild(labelEl);
  inputGroup.appendChild(input);
  
  return { inputGroup, input };
}

/**
 * Create a form section
 * 
 * @param {string} title - Section title
 * @param {Array<HTMLElement>} inputs - Input elements
 * @returns {HTMLElement} Section element
 */
function createSection(title, inputs) {
  const section = createElement('section', { className: 'form-section' });
  
  const header = createElement('h2', {
    className: 'section-title',
    textContent: title
  });
  
  section.appendChild(header);
  
  inputs.forEach(input => {
    section.appendChild(input);
  });
  
  return section;
}

/**
 * Populate form with current data
 * 
 * @param {HTMLElement} form - Form element
 */
function populateForm(form) {
  const data = loadFinancialData();
  
  Object.entries(data).forEach(([key, value]) => {
    const input = form.querySelector(`#${key}`);
    if (input && typeof value === 'number') {
      // Convert tax rate from decimal to percentage for display
      const displayValue = (key === 'taxRate') ? (value * 100).toString() : value.toString();
      input.setAttribute('value', displayValue);
    }
  });
}

/**
 * Create the complete financial inputs form
 * 
 * @param {HTMLElement} targetContainer - Element to append the form to
 * @returns {Object} Interface for interacting with the form
 */
export function createFinancialInputs(targetContainer) {
  if (!targetContainer) {
    throw new Error('Target container must be a valid DOM element');
  }
  
  const data = loadFinancialData();
  
  const form = createElement('form', { className: 'financial-form' });
  
  const incomeInputs = [
    createSimpleInput('grossUsd', 'Gross USD', data.grossUsd),
    createSimpleInput('eurUsd', 'EUR/USD Rate', data.eurUsd),
    createSimpleInput('taxRate', 'Tax Rate (%)', data.taxRate, '0.01', true)
  ].map(item => item.inputGroup);
  
  form.appendChild(createSection('Income', incomeInputs));
  
  let saveTimeout = 0;
  const debouncedSave = (/** @type {Record<string, number>} */ data) => {
    clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(() => updateFinancialData(data), 300);
  };
  
  const handler = createEventDelegator(form, 'input', {
    'input': (/** @type {Event} */ _e, /** @type {HTMLInputElement} */ el) => {
      const value = parseFloat(el.value) || 0;
      const finalValue = el.id === 'taxRate' ? value / 100 : value;
      debouncedSave({ [el.id]: finalValue });
    }
  });
  
  populateForm(form);
  batchDOMUpdates(() => targetContainer.appendChild(form));
  addObserver(() => populateForm(form));
  
  return {
    destroy() {
      /** @type {any} */ (handler).destroy();
      clearTimeout(saveTimeout);
      if (form.parentNode) form.parentNode.removeChild(form);
    }
  };
}
