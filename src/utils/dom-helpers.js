/**
 * @fileoverview Lightweight DOM utilities
 * Minimal DOM manipulation utilities for the finance agent without heavy dependencies.
 */

/**
 * Create a DOM element with attributes
 * @param {string} tagName - HTML tag name
 * @param {Object} [attributes={}] - Element attributes
 * @returns {HTMLElement} Created element
 */
export function createElement(tagName, attributes = {}) {
  if (!tagName || typeof tagName !== 'string') {
    throw new Error('Tag name cannot be empty');
  }
  
  if (attributes !== null && typeof attributes !== 'object') {
    throw new Error('Attributes must be an object');
  }
  
  const element = document.createElement(tagName);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined) return;
    
    if (key === 'textContent') {
      element.textContent = String(value);
    } else if (key === 'innerHTML') {
      element.innerHTML = String(value);
    } else if (key === 'className') {
      element.className = String(value);
    } else if (key.startsWith('data-')) {
      const dataKey = key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      element.dataset[dataKey] = String(value);
    } else {
      element.setAttribute(key, String(value));
    }
  });
  
  return element;
}

/**
 * Set CSS custom property
 * @param {string} propertyName - Property name
 * @param {string} value - Property value
 * @param {HTMLElement} [element] - Target element
 */
export function setCustomProperty(propertyName, value, element = document.documentElement) {
  if (!propertyName || typeof propertyName !== 'string') {
    throw new Error('Property name must be a non-empty string');
  }
  if (typeof value !== 'string') {
    throw new Error('Property value must be a string');
  }
  
  const normalizedName = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  element.style.setProperty(normalizedName, value);
}

/**
 * Get CSS custom property value
 * @param {string} propertyName - Property name
 * @param {HTMLElement} element - Target element
 * @returns {string} Property value
 */
export function getCustomProperty(propertyName, element = document.documentElement) {
  const normalizedName = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  return getComputedStyle(element).getPropertyValue(normalizedName).trim();
}

/**
 * Batch DOM updates using requestAnimationFrame
 * @param {Function} updateFunction - Function containing DOM updates
 * @returns {Function} Cancellation function
 */
export function batchDOMUpdates(updateFunction) {
  if (typeof updateFunction !== 'function') {
    throw new Error('Update must be a function');
  }
  
  const frameId = requestAnimationFrame(() => {
    try {
      updateFunction();
    } catch (error) {
      console.error('Error in batched DOM update:', error);
    }
  });
  
  return () => cancelAnimationFrame(frameId);
}

/**
 * Create event delegation system
 * @param {HTMLElement} container - Container element
 * @param {string} eventType - Event type
 * @param {Object} handlers - Map of selectors to handlers
 * @returns {Object} Delegator with destroy method
 */
export function createEventDelegator(container, eventType, handlers) {
  if (!container || typeof container.addEventListener !== 'function') {
    throw new Error('Container must be a DOM element');
  }
  
  if (!eventType || typeof eventType !== 'string') {
    throw new Error('Event type cannot be empty');
  }
  
  if (!handlers || typeof handlers !== 'object') {
    throw new Error('Handlers must be an object');
  }
  
  const handleEvent = (/** @type {Event} */ event) => {
    for (const [selector, handler] of Object.entries(handlers)) {
      const target = /** @type {Element} */ (event.target).closest(selector);
      if (target && container.contains(target)) {
        handler(event, target);
      }
    }
  };
  
  container.addEventListener(eventType, handleEvent);
  
  return {
    destroy() {
      container.removeEventListener(eventType, handleEvent);
    }
  };
}

/**
 * Remove all event listeners from an element by cloning it
 * @param {HTMLElement} element - Element to clean
 * @returns {HTMLElement} Cleaned element
 */
export function removeAllEventListeners(element) {
  if (!element || typeof element.cloneNode !== 'function') {
    throw new Error('Element must be a DOM element');
  }
  
  const cloned = /** @type {HTMLElement} */ (element.cloneNode(true));
  if (element.parentNode) {
    element.parentNode.replaceChild(cloned, element);
  }
  return cloned;
}
