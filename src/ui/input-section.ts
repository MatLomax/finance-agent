/**
 * @fileoverview Input section creation
 * 
 * Creates sections of related input fields with titles and descriptions.
 * Handles the organization and layout of multiple input fields.
 */

import { validateString } from '../lib/validators.js';
import { createElement } from '../utils/dom-helpers.js';
import { createInputField } from './input-field.js';

/**
 * Create a section of related input fields
 * 
 */
export function createInputSection(sectionConfig: object): HTMLElement {
  validateString(sectionConfig.title, 'title');
  
  const section = createElement('section', {
    className: 'input-section'
  });
  
  // Create section header
  const header = createElement('header', {
    className: 'section-header'
  });
  
  const title = createElement('h2', {
    className: 'section-title',
    textContent: sectionConfig.title
  });
  
  header.appendChild(title);
  
  if (sectionConfig.description) {
    const description = createElement('p', {
      className: 'section-description',
      textContent: sectionConfig.description
    });
    header.appendChild(description);
  }
  
  // Create input grid container
  const inputGrid = createElement('div', {
    className: 'input-grid'
  });
  
  // Create all input fields
  sectionConfig.inputs.forEach((inputConfig) => {
    const field = createInputField(/** @type {any} */ (inputConfig));
    inputGrid.appendChild(field);
  });
  
  section.appendChild(header);
  section.appendChild(inputGrid);
  
  return section;
}
