/**
 * @fileoverview Finance Agent - Main application controller
 * 
 * Main entry point that coordinates all application modules:
 * - Application layout and structure
 * - Financial input forms with auto-save
 * - Real-time calculation engine
 * - Results display with charts and tables
 * - Theme management and settings
 * - Error handling and graceful degradation
 * 
 * Maintains 100% feature parity with Thailand.html while providing
 * a modern, modular, testable architecture.
 */

import { initializeTheme } from './ui/theme-manager.js';
import { initializeAppLayout } from './ui/app-layout.js';
import { initializeAppControllers } from './ui/app-controllers.js';
import { createElement } from './utils/dom-helpers.js';

/**
 * Application state management
 * Tracks initialization status and module instances for cleanup
 * 
 * @typedef {Object} AppState
 * @property {boolean} isInitialized - Whether app is fully initialized
 * @property {Object|null} inputsInstance - Financial inputs module instance
 * @property {Object|null} calculationResults - Latest calculation results
 * @property {Object|null} lastError - Last error that occurred
 */

/** @type {AppState} */
const appState = {
  isInitialized: false,
  inputsInstance: null,
  calculationResults: null,
  lastError: null
};

/**
 * Create application error boundary
 * Displays user-friendly error messages for critical failures
 * 
 * @param {Error} error - Error that occurred
 * @param {string} context - Context where error occurred
 */
function handleCriticalError(error, context) {
  console.error(`❌ Critical error in ${context}:`, error);
  appState.lastError = { error, context, timestamp: Date.now() };
  
  const errorContainer = document.getElementById('app') || document.body;
  const errorDiv = createElement('div', {
    className: 'critical-error'
  });
  
  errorDiv.innerHTML = `
    <h2>⚠️ Application Error</h2>
    <p><strong>Context:</strong> ${context}</p>
    <p><strong>Error:</strong> ${error.message}</p>
    <p>Please refresh the page to try again.</p>
    <button onclick="window.location.reload()" type="button">Refresh Page</button>
  `;
  
  errorContainer.appendChild(errorDiv);
}

/**
 * Initialize the complete Finance Agent application
 * Coordinates all modules following the application lifecycle:
 * 1. Theme initialization
 * 2. Layout creation
 * 3. Controller initialization
 * 4. Error boundary setup
 */
function initializeApp() {
  try {
    console.log('🚀 Finance Agent initializing...');
    
    // Step 1: Initialize theme system before any DOM creation
    initializeTheme();
    
    // Step 2: Create or get main application container
    let appContainer = document.getElementById('app');
    if (!appContainer) {
      appContainer = createElement('div', { className: 'app-container' });
      appContainer.setAttribute('id', 'app');
      document.body.appendChild(appContainer);
    }
    
    // Step 3: Initialize application layout structure
    initializeAppLayout(appContainer);
    
    // Step 4: Initialize all controllers and modules
    initializeAppControllers(appState);
    
    // Step 5: Mark initialization complete
    appState.isInitialized = true;
    console.log('✅ Finance Agent initialization complete');
    
  } catch (/** @type {any} */ error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    handleCriticalError(errorObj, 'Application Initialization');
  }
}

/**
 * Application cleanup for graceful shutdown
 * Called when user navigates away or closes the page
 */
function cleanup() {
  try {
    if (appState.inputsInstance && typeof appState.inputsInstance === 'object' && 'destroy' in appState.inputsInstance) {
      /** @type {any} */ (appState.inputsInstance).destroy();
    }
    console.log('🧹 Finance Agent cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

/**
 * Initialize app when DOM is ready
 * Handles both immediate and deferred initialization
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Setup cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Global error handling for uncaught errors
window.addEventListener('error', (event) => {
  handleCriticalError(event.error, 'Global Error Handler');
});

window.addEventListener('unhandledrejection', (event) => {
  handleCriticalError(new Error(event.reason), 'Unhandled Promise Rejection');
});

// Export for testing and external access
export default { 
  initializeApp, 
  cleanup, 
  getAppState: () => ({ ...appState }) 
};
