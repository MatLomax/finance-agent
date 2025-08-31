/**
 * @fileoverview Application Layout Module
 * 
 * Creates the main application layout structure with header, 
 * input sections, and results sections.
 */

import { createElement } from '../utils/dom-helpers.js';

/**
 * Create the main application layout structure
 * 
 * @param {HTMLElement} container - Container to append layout to
 */
export function initializeAppLayout(container) {
  // Header
  const header = createElement('header', { className: 'app-header' });
  const title = createElement('h1', { 
    textContent: 'Finance Agent',
    className: 'app-title'
  });
  const themeToggle = createElement('button', {
    textContent: '🌙',
    className: 'theme-toggle'
  });
  themeToggle.setAttribute('type', 'button');
  
  header.appendChild(title);
  header.appendChild(themeToggle);
  
  // Main content areas
  const main = createElement('main', { className: 'app-main' });
  
  const inputsSection = createElement('section', { className: 'inputs-section' });
  inputsSection.setAttribute('id', 'inputs-container');
  
  const resultsSection = createElement('section', { className: 'results-section' });
  resultsSection.setAttribute('id', 'results-container');
  
  main.appendChild(inputsSection);
  main.appendChild(resultsSection);
  
  container.appendChild(header);
  container.appendChild(main);
}
