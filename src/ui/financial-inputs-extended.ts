/**
 * @fileoverview Extended financial input form module
 * 
 * Creates a comprehensive financial input form with all expense categories,
 * phase allocations, and auto-save functionality that matches Thailand.html.
 */

import { batchDOMUpdates, createElement, createEventDelegator } from '../utils/dom-helpers.js';
import { loadFinancialData, updateFinancialData, addObserver } from '../state/financial-data.js';

/**
 * Create a simple input field
 * 
 */
function createSimpleInput(key: string, label: string, value: number, step: string = '0.01', isPercentage: boolean = false): any {
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
  input.setAttribute('min', '0');
  
  inputGroup.appendChild(labelEl);
  inputGroup.appendChild(input);
  
  return { inputGroup, input };
}

/**
 * Create a form section with title and inputs
 * 
 */
function createSection(title: string, inputs: HTMLElement[], explanation: any = ''): any {
  const section = createElement('section', { className: 'form-section' });
  
  const header = createElement('h2', {
    className: 'section-title',
    textContent: title
  });
  
  section.appendChild(header);
  
  inputs.forEach(input => {
    section.appendChild(input);
  });
  
  if (explanation) {
    const explanationEl = createElement('div', { 
      className: 'explanation',
      textContent: explanation
    });
    section.appendChild(explanationEl);
  }
  
  return section;
}

/**
 * Populate form with current data
 * 
 */
function populateForm(form: HTMLElement): any {
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
 */
export function createFinancialInputs(targetContainer: HTMLElement): any {
  if (!targetContainer) {
    throw new Error('Target container must be a valid DOM element');
  }
  
  const data = loadFinancialData();
  const form = createElement('form', { className: 'financial-form' });
  
  // Income section
  form.appendChild(createSection('Monthly Income', [
    createSimpleInput('grossUsd', 'Gross USD Monthly Income', data.grossUsd, '100').inputGroup,
    createSimpleInput('eurUsd', 'Exchange Rate EUR/USD', data.eurUsd, '0.01').inputGroup,
    createSimpleInput('thbEur', 'Exchange Rate THB/EUR', data.thbEur, '0.01').inputGroup,
    createSimpleInput('taxRate', 'Tax Rate After 2 Years (%)', data.taxRate, '0.01', true).inputGroup
  ]));
  
  // Setup event handling and lifecycle
  setupFormHandling(form, targetContainer);
  
  return {
    destroy() {
      if (form.parentNode) form.parentNode.removeChild(form);
    }
  };
}

/**
 * Setup form event handling and lifecycle
 * 
 */
function setupFormHandling(form: HTMLElement, targetContainer: HTMLElement): any {
  let saveTimeout = 0;
  const debouncedSave = (/** @type {Record<string: any, number>} */ data: any): any => {
    clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(() => updateFinancialData(data), 300);
  };
  
  createEventDelegator(form, 'input', {
    'input': (/** @type {Event} */ _e, /** @type {HTMLInputElement} */ el) => {
      const value = parseFloat(el.value) || 0;
      const finalValue = el.id === 'taxRate' ? value / 100 : value;
      debouncedSave({ [el.id]: finalValue });
    }
  });
  
  populateForm(form);
  batchDOMUpdates(() => targetContainer.appendChild(form));
  addObserver(() => populateForm(form));
}
