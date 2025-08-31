/**
 * @fileoverview Tests for input section creation
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createInputSection } from './input-section.js';

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('createInputSection', () => {
  it('should create section with title and inputs', () => {
    const config = {
      title: 'Test Section',
      inputs: [
        {
          id: 'input1',
          label: 'Input 1',
          type: 'number',
          value: 10
        },
        {
          id: 'input2',
          label: 'Input 2',
          type: 'text',
          value: 20
        }
      ]
    };
    
    const section = createInputSection(config);
    
    assert.ok(section, 'Section should be created');
    assert.strictEqual(section.className, 'input-section');
    
    const title = section.querySelector('.section-title');
    assert.ok(title, 'Title should exist');
    assert.strictEqual(title.textContent, 'Test Section');
    
    const inputs = section.querySelectorAll('.input-field');
    assert.strictEqual(inputs.length, 2, 'Should have 2 input fields');
  });
  
  it('should include description when provided', () => {
    const config = {
      title: 'Test Section',
      description: 'This is a test description',
      inputs: []
    };
    
    const section = createInputSection(config);
    const description = section.querySelector('.section-description');
    
    assert.ok(description, 'Description should exist');
    assert.strictEqual(description.textContent, 'This is a test description');
  });
  
  it('should throw error for invalid config', () => {
    assert.throws(() => {
      createInputSection({ invalid: 'config' });
    }, /validation/i);
  });
});
