/**
 * @fileoverview Individual input field creation
 * 
 * Creates accessible input fields with labels, validation, and help text.
 * Handles different input types (number, text, range) with proper attributes.
 */

import { Type } from '@sinclair/typebox';
import { validate } from '../lib/validators.js';
import { createElement } from '../utils/dom-helpers.js';

// Validation schema for input configuration
const InputConfigSchema = Type.Object({
  id: Type.String({ minLength: 1 }),
  label: Type.String({ minLength: 1 }),
  type: Type.Union([Type.Literal('number'), Type.Literal('text'), Type.Literal('range')]),
  value: Type.Number(),
  min: Type.Optional(Type.Number()),
  max: Type.Optional(Type.Number()),
  step: Type.Optional(Type.Number()),
  unit: Type.Optional(Type.String()),
  helpText: Type.Optional(Type.String())
});

/**
 * Create the input element with proper attributes
 * 
 * @param {Object} config - Input configuration object
 * @param {string} config.id - Input field ID
 * @param {'number'|'text'|'range'} config.type - Input field type
 * @param {number} config.value - Initial value
 * @param {number} [config.min] - Minimum value for number/range inputs
 * @param {number} [config.max] - Maximum value for number/range inputs
 * @param {number} [config.step] - Step value for number/range inputs
 * @returns {HTMLInputElement} Configured input element
 */
function createInputElement(config) {
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
 * @param {Object} config - Input configuration object
 * @param {string} config.id - Input field ID
 * @param {string} config.label - Input field label
 * @param {'number'|'text'|'range'} config.type - Input field type
 * @param {number} config.value - Initial value
 * @param {number} [config.min] - Minimum value for number/range inputs
 * @param {number} [config.max] - Maximum value for number/range inputs
 * @param {number} [config.step] - Step value for number/range inputs
 * @param {string} [config.unit] - Unit display text
 * @param {string} [config.helpText] - Help text for the input
 * @returns {HTMLElement} Container element with label, input, and help text
 */
export function createInputField(config) {
  validate(InputConfigSchema, config);
  
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
