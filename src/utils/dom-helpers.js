import { Type } from '@sinclair/typebox';
import { validate } from '../lib/validators.js';

/**
 * DOM Helper Utilities for Finance Agent
 * 
 * Performance-optimized DOM manipulation utilities following vanilla JS best practices.
 * Provides element creation, event delegation, CSS custom property management,
 * and batched DOM updates for smooth UI interactions.
 */

// Validation schemas for type safety
const ElementAttributesSchema = Type.Object({}, { additionalProperties: true });
const PropertyNameSchema = Type.String({ minLength: 1 });
const PropertyValueSchema = Type.String();
const EventHandlersSchema = Type.Record(Type.String(), Type.Any());

/**
 * Create a DOM element with attributes in a performance-optimized way.
 * Avoids multiple DOM mutations by setting all properties before insertion.
 * 
 * @param {string} tagName - HTML tag name (div, span, button, etc.)
 * @param {Object} attributes - Element attributes and properties
 * @param {string} [attributes.className] - CSS class names
 * @param {string} [attributes.textContent] - Text content
 * @param {string} [attributes.innerHTML] - HTML content
 * @returns {HTMLElement} Created DOM element
 * @example
 * const button = createElement('button', {
 *   className: 'btn btn-primary',
 *   textContent: 'Save',
 *   'data-action': 'save'
 * });
 * @throws {Error} If tag name is empty or attributes are invalid
 */
export function createElement(tagName, attributes = {}) {
  // Input validation
  if (!tagName || typeof tagName !== 'string') {
    throw new Error('Tag name cannot be empty');
  }
  
  if (attributes !== null && typeof attributes !== 'object') {
    throw new Error('Attributes must be an object');
  }
  
  validate(ElementAttributesSchema, attributes);
  
  // Create element - modern browsers optimize this internally
  const element = document.createElement(tagName);
  
  // Batch all attribute setting to minimize DOM mutations
  // This is more efficient than setting properties one by one
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined) return; // Skip undefined values
    
    if (key === 'textContent') {
      element.textContent = String(value);
    } else if (key === 'innerHTML') {
      element.innerHTML = String(value);
    } else if (key === 'className') {
      element.className = String(value);
    } else if (key.startsWith('data-')) {
      // Dataset properties for modern data attributes
      const dataKey = key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      element.dataset[dataKey] = String(value);
    } else {
      // Standard attributes (id, type, href, etc.)
      element.setAttribute(key, String(value));
    }
  });
  
  return element;
}

/**
 * Set a CSS custom property (CSS variable) with performance optimization.
 * Uses CSS custom properties for efficient theming and dynamic styling.
 * 
 * @param {string} propertyName - CSS property name (with or without --)
 * @param {string} value - Property value
 * @param {HTMLElement} [element=document.documentElement] - Target element
 * @example
 * setCustomProperty('--primary-color', '#007bff');
 * setCustomProperty('theme-background', '#ffffff', container);
 * @throws {Error} If property name is empty or value is not a string
 */
export function setCustomProperty(propertyName, value, element = document.documentElement) {
  // Input validation
  validate(PropertyNameSchema, propertyName);
  validate(PropertyValueSchema, value);
  
  // Normalize property name - ensure it starts with --
  const normalizedName = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  
  // Use setProperty for CSS custom properties - more efficient than style assignment
  element.style.setProperty(normalizedName, value);
}

/**
 * Get a CSS custom property value with fallback handling.
 * Provides computed value resolution for CSS variables.
 * 
 * @param {string} propertyName - CSS property name (with or without --)
 * @param {HTMLElement} [element=document.documentElement] - Target element
 * @returns {string} Property value or empty string if not found
 * @example
 * const color = getCustomProperty('--primary-color'); // Returns '#007bff'
 */
export function getCustomProperty(propertyName, element = document.documentElement) {
  validate(PropertyNameSchema, propertyName);
  
  // Normalize property name
  const normalizedName = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  
  // Get computed style for accurate value resolution
  return getComputedStyle(element).getPropertyValue(normalizedName).trim();
}

/**
 * Batch DOM updates using requestAnimationFrame for optimal performance.
 * Prevents layout thrashing by grouping DOM mutations into single frame.
 * Essential for smooth animations and responsive UI interactions.
 * 
 * @param {Function} updateFunction - Function containing DOM updates
 * @returns {Function} Cancellation function to abort the update
 * @example
 * const cancel = batchDOMUpdates(() => {
 *   element1.textContent = 'New text';
 *   element2.style.display = 'block';
 *   element3.classList.add('active');
 * });
 * @throws {Error} If update function is not provided
 */
export function batchDOMUpdates(updateFunction) {
  if (typeof updateFunction !== 'function') {
    throw new Error('Update must be a function');
  }
  
  // Schedule update for next animation frame (typically 16ms)
  // This ensures updates happen during browser's repaint cycle
  const frameId = requestAnimationFrame(() => {
    try {
      updateFunction();
    } catch (error) {
      // Log error but don't crash the application
      console.error('Error in batched DOM update:', error);
    }
  });
  
  // Return cancellation function for cleanup
  return () => cancelAnimationFrame(frameId);
}

/**
 * Create an efficient event delegation system for dynamic content.
 * Uses single event listener at container level to handle multiple child events.
 * Significantly improves performance for lists, tables, and dynamic UI elements.
 * 
 * @param {HTMLElement} container - Container element for event delegation
 * @param {string} eventType - Event type (click, change, keydown, etc.)
 * @param {Object} handlers - Map of CSS selectors to handler functions
 * @returns {Object} Delegator object with destroy method for cleanup
 * @example
 * const delegator = createEventDelegator(container, 'click', {
 *   '.delete-btn': (event, element) => deleteItem(element.dataset.id),
 *   '.edit-btn': (event, element) => editItem(element.dataset.id)
 * });
 * @throws {Error} If container, event type, or handlers are invalid
 */
export function createEventDelegator(container, eventType, handlers) {
  // Input validation
  if (!container || typeof container.addEventListener !== 'function') {
    throw new Error('Container must be a DOM element');
  }
  
  if (!eventType || typeof eventType !== 'string') {
    throw new Error('Event type cannot be empty');
  }
  
  if (!handlers || typeof handlers !== 'object') {
    throw new Error('Handlers must be an object');
  }
  
  validate(EventHandlersSchema, handlers);
  
  // Single event listener for all delegated events
  // This is much more efficient than individual listeners
  const handleEvent = (/** @type {Event} */ event) => {
    // Walk up the DOM tree to find matching selectors
    let element = /** @type {HTMLElement | null} */ (event.target);
    
    while (element && element !== container) {
      // Check each selector against current element
      for (const [selector, handler] of Object.entries(handlers)) {
        if (element.matches && element.matches(selector)) {
          // Call handler with event and matched element
          try {
            handler(event, element);
          } catch (error) {
            console.error(`Error in event handler for ${selector}:`, error);
          }
          return; // Stop propagation after first match
        }
      }
      element = element.parentElement;
    }
  };
  
  // Attach single listener to container
  container.addEventListener(eventType, handleEvent);
  
  // Return cleanup interface
  return {
    destroy() {
      container.removeEventListener(eventType, handleEvent);
    }
  };
}

/**
 * Remove all event listeners from an element by cloning it.
 * This is the most reliable way to remove all listeners when references are lost.
 * Useful for cleaning up dynamically created elements or resetting event state.
 * 
 * @param {HTMLElement} element - Element to clean
 * @returns {HTMLElement} New element without event listeners
 * @example
 * const cleanButton = removeAllEventListeners(buttonWithManyListeners);
 * @throws {Error} If element is not a valid DOM element
 */
export function removeAllEventListeners(element) {
  if (!element || typeof element.cloneNode !== 'function') {
    throw new Error('Element must be a DOM element');
  }
  
  // Clone element without event listeners
  // cloneNode(true) copies all attributes and children but no event listeners
  const cleanElement = /** @type {HTMLElement} */ (element.cloneNode(true));
  
  // Replace original element in DOM if it has a parent
  if (element.parentNode) {
    element.parentNode.replaceChild(cleanElement, element);
  }
  
  return cleanElement;
}
