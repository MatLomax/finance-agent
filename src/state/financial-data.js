/**
 * @fileoverview Financial data persistence and management
 * 
 * Manages storage, loading, and validation of financial input data with 
 * localStorage persistence, schema versioning, and change notifications.
 */

import { formatISO } from 'date-fns';
import { validateFinancialData, migrateData } from './validation.js';
import { getDefaultFinancialData } from './defaults.js';
import { notifyObservers, addObserver, removeObserver } from './observers.js';

/**
 * Storage key for financial data in localStorage
 */
const STORAGE_KEY = 'finance-agent-financial-data';

/**
 * Current data schema version for migration handling
 */
const SCHEMA_VERSION = 1;

/**
 * Check if localStorage is available and functional
 * 
 * @returns {boolean} True if localStorage is available and functional
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage not available:', (error instanceof Error ? error.message : 'Unknown error'));
    return false;
  }
}

/**
 * Load financial data from localStorage
 * 
 * @returns {Record<string, any>} Financial data object with all required fields
 */
export function loadFinancialData() {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, using default values');
    return getDefaultFinancialData();
  }
  
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      console.log('No stored financial data found, using defaults');
      return getDefaultFinancialData();
    }
    
    const parsedData = JSON.parse(storedData);
    const migratedData = migrateData(parsedData);
    
    if (!validateFinancialData(migratedData)) {
      console.warn('Stored financial data is invalid, using defaults');
      return getDefaultFinancialData();
    }
    
    console.log('Successfully loaded financial data from storage');
    return migratedData;
    
  } catch (error) {
    console.error('Error loading financial data:', error);
    console.warn('Falling back to default values');
    return getDefaultFinancialData();
  }
}

/**
 * Save financial data to localStorage
 * 
 * @param {Record<string, any>} data - Financial data to save
 * @returns {boolean} True if save was successful, false otherwise
 */
export function saveFinancialData(data) {
  if (!validateFinancialData(data)) {
    console.error('Cannot save invalid financial data');
    return false;
  }
  
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, data not persisted');
    return false;
  }
  
  try {
    const previousData = loadFinancialData();
    
    const dataToSave = {
      ...data,
      schemaVersion: SCHEMA_VERSION,
      lastUpdated: formatISO(new Date())
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    notifyObservers(dataToSave, previousData);
    
    console.log('Successfully saved financial data');
    return true;
    
  } catch (error) {
    console.error('Error saving financial data:', error);
    return false;
  }
}

// Re-export observer functions
export { addObserver, removeObserver };

// Re-export utility functions  
export { getDefaultFinancialData, validateFinancialData };

/**
 * Reset financial data to default values
 * 
 * @returns {boolean} True if reset was successful, false otherwise
 */
export function resetFinancialData() {
  console.log('Resetting financial data to defaults');
  return saveFinancialData(getDefaultFinancialData());
}

/**
 * Update specific fields in financial data
 * 
 * @param {Record<string, any>} updates - Object containing fields to update
 * @returns {boolean} True if update was successful, false otherwise
 */
export function updateFinancialData(updates) {
  if (!updates || typeof updates !== 'object') {
    console.error('Updates must be an object');
    return false;
  }
  
  const currentData = loadFinancialData();
  const updatedData = { ...currentData, ...updates };
  
  return saveFinancialData(updatedData);
}

/**
 * Export financial data for backup or transfer
 * 
 * @returns {string} JSON string of current financial data
 */
export function exportFinancialData() {
  const data = loadFinancialData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import financial data from backup or transfer
 * 
 * @param {string} jsonString - JSON string of financial data to import
 * @returns {boolean} True if import was successful, false otherwise
 */
export function importFinancialData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (!validateFinancialData(data)) {
      console.error('Imported data is invalid');
      return false;
    }
    
    return saveFinancialData(data);
    
  } catch (error) {
    console.error('Error importing financial data:', error);
    return false;
  }
}
