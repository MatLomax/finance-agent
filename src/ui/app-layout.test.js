/**
 * @fileoverview Tests for App Layout Module
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { initializeAppLayout } from './app-layout.js';

describe('App Layout', () => {
  it('should create main layout structure', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    
    const container = document.createElement('div');
    initializeAppLayout(container);
    
    const header = container.querySelector('.app-header');
    const main = container.querySelector('.app-main');
    const title = container.querySelector('.app-title');
    const themeToggle = container.querySelector('.theme-toggle');
    
    assert.ok(header, 'Header should be created');
    assert.ok(main, 'Main section should be created');
    assert.ok(title, 'Title should be created');
    assert.ok(themeToggle, 'Theme toggle should be created');
    assert.strictEqual(title.textContent, 'Finance Agent');
  });
  
  it('should create input and results containers with proper IDs', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    
    const container = document.createElement('div');
    initializeAppLayout(container);
    
    const inputsContainer = container.querySelector('#inputs-container');
    const resultsContainer = container.querySelector('#results-container');
    
    assert.ok(inputsContainer, 'Inputs container should be created');
    assert.ok(resultsContainer, 'Results container should be created');
    assert.strictEqual(inputsContainer.className, 'inputs-section');
    assert.strictEqual(resultsContainer.className, 'results-section');
  });
});
