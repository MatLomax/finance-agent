/**
 * @fileoverview Simple financial input form module
 * 
 * Creates a basic financial input form with auto-save functionality.
 * Focuses on core functionality while maintaining architectural compliance.
 */

import { createElement, createEventDelegator, batchDOMUpdates } from '../utils/dom-helpers.js';
import { loadFinancialData, updateFinancialData, addObserver } from '../state/financial-data.js';

/**
 * Create a simple input field
 * 
 * @param {string} id - Field ID
 * @param {string} label - Field label
 * @param {string} type - Input type
 * @param {number} value - Initial value
 * @returns {HTMLElement} Input field container
 */
function createSimpleInput(id, label, type, value) {
  const container = createElement('div', { className: 'input-field' });
  
  const labelEl = createElement('label', { 
    className: 'input-label',
    textContent: label 
  });
  labelEl.setAttribute('for', id);
  
  const input = createElement('input', { className: 'input-control' });
  input.setAttribute('id', id);
  input.setAttribute('name', id);
  input.setAttribute('type', type);
  input.setAttribute('value', value.toString());
  
  container.appendChild(labelEl);
  container.appendChild(input);
  
  return container;
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
      input.setAttribute('value', value.toString());
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
  
  const form = createElement('form', { className: 'financial-form' });
  
  const incomeInputs = [
    createSimpleInput('grossUsd', 'Gross USD', 'number', 9000),
    createSimpleInput('eurUsd', 'EUR/USD Rate', 'number', 1.17),
    createSimpleInput('taxRate', 'Tax Rate (%)', 'number', 17)
  ];
  
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
