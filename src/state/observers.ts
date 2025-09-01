/**
 * @fileoverview Observer pattern implementation export function notifyObservers(newData: any, previousData: any): boolean {
  observers.forEach(callback => {
    try {
      callback(newData, previousData);
    } catch (error) {
      console.error('Error in observer callback:', error);
    }
  });
  return true;
} change notifications
 * 
 * This module implements the observer pattern to allow UI components to register
 * callbacks that fire when financial data changes. This enables loose coupling
 * between the data layer and UI components.
 */

import { pull } from 'lodash-es';

/**
 * Observer registry for state change notifications
 * 
 * @type {Function[]}
 */
const observers: Array<(...args: any[]) => any> = [];

/**
 * Add an observer to be notified of financial data changes
 * 
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
export function addObserver(callback: (...args: any[]) => any): boolean {
  if (typeof callback !== 'function') {
    throw new Error('Observer callback must be a function');
  }
  
  observers.push(callback);
  return true;
}

/**
 * Remove an observer from the notification list
 * 
 */
export function removeObserver(callback: (...args: any[]) => any): boolean {
  const initialLength = observers.length;
  pull(observers, callback);
  return observers.length < initialLength;
}

/**
 * Notify all observers of a data change
 * 
 */
export function notifyObservers(newData: any, previousData: any): boolean {
  observers.forEach(callback => {
    try {
      callback(newData, previousData);
    } catch (error) {
      console.error('Error in financial data observer:', error);
    }
  });
  return true;
}
