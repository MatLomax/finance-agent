/**
 * @fileoverview Tests for input field creation
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createInputField } from './input-field.js';

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('createInputField', () => {
  it('should create basic input field with label', () => {
    const config = {
      id: 'test-input',
      label: 'Test Label',
      type: 'number',
      value: 42
    };
    
    const field = createInputField(config);
    
    assert.ok(field, 'Field should be created');
    assert.strictEqual(field.className, 'input-field');
    
    const label = field.querySelector('.input-label');
    assert.ok(label, 'Label should exist');
    assert.strictEqual(label.textContent, 'Test Label');
    assert.strictEqual(label.getAttribute('for'), 'test-input');
    
    const input = field.querySelector('input');
    assert.ok(input, 'Input should exist');
    assert.strictEqual(input.getAttribute('id'), 'test-input');
    assert.strictEqual(input.getAttribute('value'), '42');
    assert.strictEqual(input.getAttribute('type'), 'number');
  });
  
  it('should create range input with proper type', () => {
    const config = {
      id: 'range-input',
      label: 'Range Label',
      type: 'range',
      value: 50,
      min: 0,
      max: 100,
      step: 5
    };
    
    const field = createInputField(config);
    const input = field.querySelector('input');
    
    assert.strictEqual(input.getAttribute('type'), 'range');
    assert.strictEqual(input.getAttribute('min'), '0');
    assert.strictEqual(input.getAttribute('max'), '100');
    assert.strictEqual(input.getAttribute('step'), '5');
  });
  
  it('should throw error for invalid config', () => {
    assert.throws(() => {
      createInputField({ invalid: 'config' });
    }, /validation/i);
  });
  
  it('should handle optional attributes', () => {
    const config = {
      id: 'simple-input',
      label: 'Simple',
      type: 'number',
      value: 10
      // No min, max, step
    };
    
    const field = createInputField(config);
    const input = field.querySelector('input');
    
    assert.strictEqual(input.getAttribute('min'), null);
    assert.strictEqual(input.getAttribute('max'), null);
    assert.strictEqual(input.getAttribute('step'), null);
  });
});
