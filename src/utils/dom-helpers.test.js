import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import {
  createElement,
  setCustomProperty,
  getCustomProperty,
  batchDOMUpdates,
  createEventDelegator,
  removeAllEventListeners
} from './dom-helpers.js';

describe('DOM Helper Utilities', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Setup JSDOM environment for each test
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.getComputedStyle = window.getComputedStyle;
    global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
    global.cancelAnimationFrame = (id) => clearTimeout(id);
  });

  afterEach(() => {
    // Clean up global references
    delete global.document;
    delete global.window;
    delete global.getComputedStyle;
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
  });

  describe('createElement', () => {
    it('should create element with tag name only', () => {
      const element = createElement('div');
      
      assert.strictEqual(element.tagName, 'DIV');
      assert.strictEqual(element.className, '');
      assert.strictEqual(element.innerHTML, '');
    });

    it('should create element with attributes', () => {
      const element = createElement('input', {
        type: 'text',
        id: 'test-input',
        'data-testid': 'input-field'
      });
      
      assert.strictEqual(element.tagName, 'INPUT');
      assert.strictEqual(element.type, 'text');
      assert.strictEqual(element.id, 'test-input');
      assert.strictEqual(element.dataset.testid, 'input-field');
    });

    it('should create element with class names', () => {
      const element = createElement('button', {
        className: 'btn btn-primary'
      });
      
      assert.strictEqual(element.className, 'btn btn-primary');
      assert.ok(element.classList.contains('btn'));
      assert.ok(element.classList.contains('btn-primary'));
    });

    it('should create element with text content', () => {
      const element = createElement('span', {
        textContent: 'Hello World'
      });
      
      assert.strictEqual(element.textContent, 'Hello World');
    });

    it('should create element with innerHTML', () => {
      const element = createElement('div', {
        innerHTML: '<span>Inner content</span>'
      });
      
      assert.strictEqual(element.innerHTML, '<span>Inner content</span>');
      assert.strictEqual(element.children.length, 1);
      assert.strictEqual(element.children[0].tagName, 'SPAN');
    });

    it('should throw error for invalid tag name', () => {
      assert.throws(
        () => createElement(''),
        /Tag name cannot be empty/
      );
    });

    it('should throw error for invalid attributes', () => {
      assert.throws(
        () => createElement('div', 'invalid'),
        /Attributes must be an object/
      );
    });
  });

  describe('CSS Custom Properties', () => {
    beforeEach(() => {
      // Create a test element
      const testElement = document.createElement('div');
      testElement.id = 'test-element';
      document.body.appendChild(testElement);
    });

    it('should set custom property on document root', () => {
      setCustomProperty('--test-color', '#ff0000');
      
      const value = getCustomProperty('--test-color');
      assert.strictEqual(value, '#ff0000');
    });

    it('should set custom property on specific element', () => {
      const element = document.getElementById('test-element');
      setCustomProperty('--element-width', '100px', element);
      
      const value = getCustomProperty('--element-width', element);
      assert.strictEqual(value, '100px');
    });

    it('should return empty string for non-existent property', () => {
      const value = getCustomProperty('--non-existent');
      assert.strictEqual(value, '');
    });

    it('should handle property names with and without dashes', () => {
      setCustomProperty('test-prop', 'value1');
      setCustomProperty('--test-prop2', 'value2');
      
      assert.strictEqual(getCustomProperty('test-prop'), 'value1');
      assert.strictEqual(getCustomProperty('--test-prop2'), 'value2');
    });

    it('should throw error for invalid property name', () => {
      assert.throws(
        () => setCustomProperty('', 'value'),
        /Expected string length greater or equal to 1/
      );
    });

    it('should throw error for invalid property value', () => {
      assert.throws(
        () => setCustomProperty('--test', null),
        /Expected string/
      );
    });
  });

  describe('batchDOMUpdates', () => {
    it('should execute updates in next animation frame', async () => {
      let executed = false;
      
      batchDOMUpdates(() => {
        executed = true;
      });
      
      // Should not execute immediately
      assert.strictEqual(executed, false);
      
      // Wait for animation frame
      await new Promise(resolve => setTimeout(resolve, 20));
      assert.strictEqual(executed, true);
    });

    it('should handle multiple updates in same batch', async () => {
      let count = 0;
      
      batchDOMUpdates(() => { count += 1; });
      batchDOMUpdates(() => { count += 2; });
      batchDOMUpdates(() => { count += 3; });
      
      assert.strictEqual(count, 0);
      
      // Wait for animation frame
      await new Promise(resolve => setTimeout(resolve, 20));
      assert.strictEqual(count, 6);
    });

    it('should return cancellation function', () => {
      const cancel = batchDOMUpdates(() => {
        assert.fail('Should not execute');
      });
      
      assert.strictEqual(typeof cancel, 'function');
      cancel(); // Cancel the update
    });

    it('should handle errors in update function', async () => {
      batchDOMUpdates(() => {
        throw new Error('Test error');
      });
      
      // Wait for animation frame - should not crash
      await new Promise(resolve => setTimeout(resolve, 20));
      // Test passes if we reach this point without throwing
    });

    it('should throw error for non-function update', () => {
      assert.throws(
        () => batchDOMUpdates('not a function'),
        /Update must be a function/
      );
    });
  });

  describe('createEventDelegator', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      container.innerHTML = `
        <button class="btn" data-action="save">Save</button>
        <button class="btn" data-action="cancel">Cancel</button>
        <div class="card">
          <button class="delete-btn" data-id="123">Delete</button>
        </div>
      `;
      document.body.appendChild(container);
    });

    it('should create event delegator and handle events', () => {
      let clickedAction = null;
      
      const delegator = createEventDelegator(container, 'click', {
        '.btn': (event, element) => {
          clickedAction = element.dataset.action;
        }
      });
      
      // Simulate click on save button
      const saveBtn = container.querySelector('[data-action="save"]');
      saveBtn.click();
      
      assert.strictEqual(clickedAction, 'save');
      
      // Cleanup
      delegator.destroy();
    });

    it('should handle multiple selectors', () => {
      const events = [];
      
      const delegator = createEventDelegator(container, 'click', {
        '.btn': (event, element) => {
          events.push(`btn-${element.dataset.action}`);
        },
        '.delete-btn': (event, element) => {
          events.push(`delete-${element.dataset.id}`);
        }
      });
      
      container.querySelector('[data-action="save"]').click();
      container.querySelector('.delete-btn').click();
      
      assert.deepStrictEqual(events, ['btn-save', 'delete-123']);
      
      delegator.destroy();
    });

    it('should handle nested elements correctly', () => {
      let targetId = null;
      
      const delegator = createEventDelegator(container, 'click', {
        '.delete-btn': (event, element) => {
          targetId = element.dataset.id;
        }
      });
      
      // Click on nested delete button
      const deleteBtn = container.querySelector('.delete-btn');
      deleteBtn.click();
      
      assert.strictEqual(targetId, '123');
      
      delegator.destroy();
    });

    it('should provide destroy method for cleanup', () => {
      const delegator = createEventDelegator(container, 'click', {
        '.btn': () => {}
      });
      
      assert.strictEqual(typeof delegator.destroy, 'function');
      
      // Should not throw
      delegator.destroy();
    });

    it('should throw error for invalid container', () => {
      assert.throws(
        () => createEventDelegator(null, 'click', {}),
        /Container must be a DOM element/
      );
    });

    it('should throw error for invalid event type', () => {
      assert.throws(
        () => createEventDelegator(container, '', {}),
        /Event type cannot be empty/
      );
    });

    it('should throw error for invalid handlers', () => {
      assert.throws(
        () => createEventDelegator(container, 'click', null),
        /Handlers must be an object/
      );
    });
  });

  describe('removeAllEventListeners', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('button');
      document.body.appendChild(element);
    });

    it('should remove all event listeners by cloning element', () => {
      let clickCount = 0;
      
      element.addEventListener('click', () => { clickCount++; });
      element.addEventListener('click', () => { clickCount++; });
      
      // Verify listeners are attached
      element.click();
      assert.strictEqual(clickCount, 2);
      
      const newElement = removeAllEventListeners(element);
      
      // Original element should still have listeners
      element.click();
      assert.strictEqual(clickCount, 4);
      
      // New element should have no listeners
      newElement.click();
      assert.strictEqual(clickCount, 4); // No change
      
      // New element should be in DOM
      assert.strictEqual(newElement.parentNode, document.body);
      assert.strictEqual(element.parentNode, null);
    });

    it('should preserve element attributes and content', () => {
      element.id = 'test-btn';
      element.className = 'btn primary';
      element.textContent = 'Click me';
      element.dataset.value = '123';
      
      const newElement = removeAllEventListeners(element);
      
      assert.strictEqual(newElement.id, 'test-btn');
      assert.strictEqual(newElement.className, 'btn primary');
      assert.strictEqual(newElement.textContent, 'Click me');
      assert.strictEqual(newElement.dataset.value, '123');
    });

    it('should handle element without parent', () => {
      const orphan = document.createElement('div');
      
      const newElement = removeAllEventListeners(orphan);
      
      assert.strictEqual(newElement.tagName, 'DIV');
      assert.strictEqual(newElement.parentNode, null);
    });

    it('should throw error for invalid element', () => {
      assert.throws(
        () => removeAllEventListeners(null),
        /Element must be a DOM element/
      );
    });
  });
});
