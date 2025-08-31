/**
 * Finance Agent - Ultra-lightweight vanilla JavaScript
 * Entry point for the finance application
 */

console.log('🚀 Finance Agent initialized');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = '<h2>Finance Agent Ready</h2><p>Ultra-lightweight vanilla JavaScript finance application.</p>';
  }
});

export default {};
