/**
 * @fileoverview Observer pattern implementation for state change notifications
 * 
 * This module implements the observer pattern to allow UI components to register
 * callbacks that fire when financial data changes. This enables loose coupling
 * between the data layer and UI components.
 */

/**
 * Observer registry for state change notifications
 * 
 * @type {Function[]}
 */
const observers = [];

/**
 * Add an observer to be notified of financial data changes
 * 
 * @param {Function} callback - Function to call when data changes.
 *   The callback receives two parameters:
 *   - data: The new financial data
 *   - previous: The previous financial data (optional)
 * 
 * @example
 * addObserver((data, previous) => {
 *   console.log('Financial data updated:', data);
 *   updateUI(data);
 * });
 */
export function addObserver(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Observer callback must be a function');
  }
  observers.push(callback);
}

/**
 * Remove an observer from the notification list
 * 
 * @param {Function} callback - The callback function to remove
 * @returns {boolean} True if observer was found and removed, false otherwise
 */
export function removeObserver(callback) {
  const index = observers.indexOf(callback);
  if (index > -1) {
    observers.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Notify all observers of a data change
 * 
 * @param {Record<string, any>} newData - The new financial data
 * @param {Record<string, any>} [previousData] - The previous financial data
 */
export function notifyObservers(newData, previousData) {
  observers.forEach(callback => {
    try {
      callback(newData, previousData);
    } catch (error) {
      console.error('Error in financial data observer:', error);
    }
  });
}
