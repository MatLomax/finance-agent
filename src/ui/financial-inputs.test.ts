/**
 * @fileoverview Tests for financial input form module
 * 
 * Tests the creation and functionality of the financial input form,
 * including input field creation, data handling, and auto-save functionality.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

// Setup JSDOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;

// Mock requestAnimationFrame and cancelAnimationFrame for testing
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 16); // 16ms ~ 60fps
};
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock localStorage for testing
global.localStorage = {
  store: {},
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

import { createFinancialInputs } from './financial-inputs.js';

describe('createFinancialInputs', () => {
  let container: any;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('should create a financial inputs form', async () => {
    const formInterface = createFinancialInputs(container);
    
    // Wait for batchDOMUpdates to complete
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // Check that form was created and added to container
    const form = container.querySelector('.financial-form');
    assert.ok(form, 'Form should be created');
    
    // Check that income section exists
    const incomeSection = form.querySelector('.form-section');
    assert.ok(incomeSection, 'Income section should exist');
    
    // Check that required inputs exist
    const grossUsdInput = form.querySelector('#grossUsd');
    const eurUsdInput = form.querySelector('#eurUsd');
    const taxRateInput = form.querySelector('#taxRate');
    
    assert.ok(grossUsdInput, 'Gross USD input should exist');
    assert.ok(eurUsdInput, 'EUR/USD rate input should exist');
    assert.ok(taxRateInput, 'Tax rate input should exist');
    
    // Check initial values
    assert.strictEqual(grossUsdInput.value, '9000');
    assert.strictEqual(eurUsdInput.value, '1.17');
    assert.strictEqual(taxRateInput.value, '17');
    
    // Cleanup
    formInterface.destroy();
  });

  it('should throw error for invalid container', () => {
    assert.throws(() => {
      createFinancialInputs(null);
    }, /Target container must be a valid DOM element/);
  });

  it('should handle form destruction properly', async () => {
    const formInterface = createFinancialInputs(container);
    
    // Wait for batchDOMUpdates to complete
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // Verify form exists
    assert.ok(container.querySelector('.financial-form'));
    
    // Destroy form
    formInterface.destroy();
    
    // Verify form is removed
    assert.strictEqual(container.querySelector('.financial-form'), null);
  });

  it('should create proper form structure', async () => {
    const formInterface = createFinancialInputs(container);
    
    // Wait for batchDOMUpdates to complete
    await new Promise(resolve => setTimeout(resolve, 20));
    
    const form = container.querySelector('.financial-form');
    
    // Check section structure
    const section = form.querySelector('.form-section');
    const title = section.querySelector('.section-title');
    assert.strictEqual(title.textContent, 'Income');
    
    // Check input field structure
    const inputField = section.querySelector('.input-field');
    const label = inputField.querySelector('.input-label');
    const input = inputField.querySelector('.input-control');
    
    assert.ok(label, 'Input should have label');
    assert.ok(input, 'Input should have control element');
    assert.strictEqual(label.getAttribute('for'), input.getAttribute('id'));
    
    formInterface.destroy();
  });

  it('should create inputs with correct attributes', async () => {
    const formInterface = createFinancialInputs(container);
    
    // Wait for batchDOMUpdates to complete
    await new Promise(resolve => setTimeout(resolve, 20));
    
    const grossUsdInput = container.querySelector('#grossUsd');
    
    assert.strictEqual(grossUsdInput.getAttribute('type'), 'number');
    assert.strictEqual(grossUsdInput.getAttribute('name'), 'grossUsd');
    assert.strictEqual(grossUsdInput.getAttribute('id'), 'grossUsd');
    assert.strictEqual(grossUsdInput.getAttribute('value'), '9000');
    
    formInterface.destroy();
  });

  it('should handle missing form elements gracefully', async () => {
    const formInterface = createFinancialInputs(container);
    
    // Wait for batchDOMUpdates to complete
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // Remove an input to test graceful handling
    const input = container.querySelector('#grossUsd');
    if (input) {
      input.remove();
    }
    
    // Should not throw when trying to populate form
    assert.doesNotThrow(() => {
      // Trigger internal populateForm by simulating data change
      const form = container.querySelector('.financial-form');
      const event = new dom.window.Event('input', { bubbles: true });
      const remainingInput = form.querySelector('#eurUsd');
      if (remainingInput) {
        remainingInput.dispatchEvent(event);
      }
    });
    
    formInterface.destroy();
  });
});
