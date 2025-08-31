/**
 * @fileoverview Tests for financial data persistence module
 * 
 * Tests the localStorage persistence functionality including saving, loading,
 * validation, migration, and observer pattern implementation.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node.js testing environment
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Set up global localStorage mock
global.localStorage = localStorageMock;

import {
  loadFinancialData,
  saveFinancialData,
  resetFinancialData,
  updateFinancialData,
  exportFinancialData,
  importFinancialData,
  addObserver,
  removeObserver,
  getDefaultFinancialData,
  validateFinancialData
} from './financial-data.js';

describe('Financial Data Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should load default data when no stored data exists', () => {
    const data = loadFinancialData();
    const defaults = getDefaultFinancialData();
    
    assert.strictEqual(data.grossUsd, defaults.grossUsd);
    assert.strictEqual(data.currentAge, defaults.currentAge);
    assert.strictEqual(data.totalDebt, defaults.totalDebt);
  });

  it('should save and load financial data correctly', () => {
    const testData = getDefaultFinancialData();
    testData.grossUsd = 10000;
    testData.housing = 2000;
    
    const saved = saveFinancialData(testData);
    assert.strictEqual(saved, true);
    
    const loaded = loadFinancialData();
    assert.strictEqual(loaded.grossUsd, 10000);
    assert.strictEqual(loaded.housing, 2000);
  });

  it('should validate financial data correctly', () => {
    const validData = getDefaultFinancialData();
    assert.strictEqual(validateFinancialData(validData), true);
    
    const invalidData = { ...validData };
    delete invalidData.grossUsd;
    assert.strictEqual(validateFinancialData(invalidData), false);
    
    const invalidAge = { ...validData, currentAge: 150 };
    assert.strictEqual(validateFinancialData(invalidAge), false);
  });

  it('should update specific fields correctly', () => {
    // First save some initial data
    saveFinancialData(getDefaultFinancialData());
    
    const success = updateFinancialData({
      grossUsd: 12000,
      housing: 1800
    });
    
    assert.strictEqual(success, true);
    
    const updated = loadFinancialData();
    assert.strictEqual(updated.grossUsd, 12000);
    assert.strictEqual(updated.housing, 1800);
    // Other fields should remain unchanged
    assert.strictEqual(updated.currentAge, 33);
  });

  it('should reset data to defaults', () => {
    // First save some modified data
    const modifiedData = getDefaultFinancialData();
    modifiedData.grossUsd = 15000;
    saveFinancialData(modifiedData);
    
    // Reset to defaults
    const success = resetFinancialData();
    assert.strictEqual(success, true);
    
    const data = loadFinancialData();
    const defaults = getDefaultFinancialData();
    assert.strictEqual(data.grossUsd, defaults.grossUsd);
  });

  it('should export and import data correctly', () => {
    const testData = getDefaultFinancialData();
    testData.grossUsd = 11000;
    saveFinancialData(testData);
    
    const exported = exportFinancialData();
    assert.strictEqual(typeof exported, 'string');
    
    // Clear data and import
    localStorage.clear();
    const success = importFinancialData(exported);
    assert.strictEqual(success, true);
    
    const imported = loadFinancialData();
    assert.strictEqual(imported.grossUsd, 11000);
  });

  it('should handle observer pattern correctly', () => {
    let notified = false;
    let receivedData = null;
    
    const observer = (data) => {
      notified = true;
      receivedData = data;
    };
    
    addObserver(observer);
    
    const testData = getDefaultFinancialData();
    testData.grossUsd = 13000;
    saveFinancialData(testData);
    
    assert.strictEqual(notified, true);
    assert.strictEqual(receivedData.grossUsd, 13000);
    
    // Test removing observer
    const removed = removeObserver(observer);
    assert.strictEqual(removed, true);
  });
});
