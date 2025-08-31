/**
 * @fileoverview Finance Agent - Ultra-lightweight main application
 * Main entry point with minimal dependencies for optimal bundle size.
 */

import { createElement } from './utils/dom-helpers.js';
import { initializeTheme, toggleTheme } from './ui/theme-manager.js';

/**
 * Application state
 */
const appState = {
  currentTheme: 'dark',
  isInitialized: false
};

/**
 * Create main application layout
 * @param {HTMLElement} container - Root container
 */
function createAppLayout(container) {
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
  
  const main = createElement('main', { className: 'app-main' });
  const inputsSection = createElement('section', { 
    className: 'inputs-section',
    innerHTML: '<h2>Financial Inputs</h2><p>Input forms will be loaded here.</p>'
  });
  inputsSection.setAttribute('id', 'inputs-container');
  
  const resultsSection = createElement('section', { 
    className: 'results-section',
    innerHTML: '<h2>Results</h2><p>Calculation results will be displayed here.</p>'
  });
  resultsSection.setAttribute('id', 'results-container');
  
  main.appendChild(inputsSection);
  main.appendChild(resultsSection);
  
  container.appendChild(header);
  container.appendChild(main);
  
  return { themeToggle };
}

/**
 * Initialize the application
 */
function initializeApp() {
  try {
    console.log('🚀 Finance Agent initializing...');
    
    initializeTheme();
    
    let appContainer = document.getElementById('app');
    if (!appContainer) {
      appContainer = createElement('div', { className: 'app-container' });
      appContainer.setAttribute('id', 'app');
      document.body.appendChild(appContainer);
    }
    
    const { themeToggle } = createAppLayout(appContainer);
    
    themeToggle.addEventListener('click', () => {
      try {
        const newTheme = toggleTheme();
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      } catch (error) {
        console.error('Failed to toggle theme:', error);
      }
    });
    
    appState.isInitialized = true;
    console.log('✅ Finance Agent initialization complete');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDiv = createElement('div', {
      className: 'error-message',
      innerHTML: `<h2>Error</h2><p>Failed to initialize app: ${errorMessage}</p>`
    });
    document.body.appendChild(errorDiv);
  }
}

function cleanup() {
  console.log('🧹 Cleanup completed');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

window.addEventListener('beforeunload', cleanup);

export default { initializeApp, cleanup, getAppState: () => ({ ...appState }) };
