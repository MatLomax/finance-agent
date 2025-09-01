/**
 * @fileoverview Individual input field creation
 * 
 * Creates accessible input fields with labels, validation, and help text.
 * Handles different input types (number, text, range) with proper attributes.
 */

import { validateString, validateNumber } from '../lib/validators.js';
import { createElement } from '../utils/dom-helpers.js';

/**
 * Create the input element with proper attributes
 * 
 */
function createInputElement(config: object): any {
  const input = createElement('input', {
    className: `input-field__input input-field__input--${config.type}`
  });
  
  // Set input attributes manually due to createElement type limitations
  input.setAttribute('id', config.id);
  input.setAttribute('name', config.id);
  input.setAttribute('type', config.type === 'range' ? 'range' : 'number');
  input.setAttribute('value', config.value.toString());
  
  if (config.min !== undefined) {
    input.setAttribute('min', config.min.toString());
  }
  if (config.max !== undefined) {
    input.setAttribute('max', config.max.toString());
  }
  if (config.step !== undefined) {
    input.setAttribute('step', config.step.toString());
  }
  
  return /** @type {HTMLInputElement} */ (input);
}

/**
 * Create a labeled input field with validation and help text
 * 
 */
export function createInputField(config: object): any {
  validateString(config.id, 'id');
  validateString(config.label, 'label');
  validateNumber(config.value, 'value');
  
  const container = createElement('div', {
    className: 'input-field'
  });
  
  // Set data attribute manually (createElement limitation workaround)
  container.setAttribute('data-input-id', config.id);
  
  // Create label with accessibility
  const label = createElement('label', {
    className: 'input-label',
    textContent: config.label
  });
  label.setAttribute('for', config.id);
  
  // Create input wrapper for styling and units
  const inputWrapper = createElement('div', {
    className: 'input-wrapper'
  });
  
  // Create the input element
  const input = createInputElement(config);
  
  inputWrapper.appendChild(input);
  
  container.appendChild(label);
  container.appendChild(inputWrapper);
  
  return container;
}
