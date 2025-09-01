/**
 * @fileoverview Tests for App Controllers Module
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { initializeAppControllers } from './app-controllers.js';

describe('App Controllers', () => {
  it('should throw error when required containers are missing', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
    
    const appState = { inputsInstance: null, calculationResults: null };
    
    assert.throws(() => {
      initializeAppControllers(appState);
    }, /Failed to find required containers/);
  });
  
  it('should initialize when all containers are present', () => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="inputs-container"></div>
          <div id="results-container"></div>
          <button class="theme-toggle"></button>
        </body>
      </html>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
    
    const appState = { inputsInstance: null, calculationResults: null };
    
    // Should not throw
    assert.doesNotThrow(() => {
      initializeAppControllers(appState);
    });
  });
});
