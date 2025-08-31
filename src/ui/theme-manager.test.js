/**
 * @fileoverview Tests for theme and settings management module
 * 
 * Tests theme switching, settings persistence, localStorage handling,
 * and validation scenarios for the theme manager.
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

// Mock document for Node.js testing environment
const documentMock = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => null,
    style: {
      setProperty: () => {},
      getPropertyValue: () => ''
    }
  }
};

// Set up global mocks
global.localStorage = localStorageMock;
global.document = documentMock;

// Mock setCustomProperty function since we can't import DOM helpers in Node.js
// We don't actually test DOM manipulation, just that the functions don't throw

import {
  loadSettings,
  saveSettings,
  setTheme,
  toggleTheme,
  initializeTheme
} from './theme-manager.js';

describe('Theme Manager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('loadSettings', () => {
    it('should return default settings when no stored data exists', () => {
      const settings = loadSettings();
      
      assert.strictEqual(typeof settings, 'object');
      assert.strictEqual(settings.theme, 'dark');
      assert.strictEqual(settings.preferredCurrency, 'EUR');
      assert.strictEqual(settings.schemaVersion, 1);
      assert.strictEqual(typeof settings.lastUpdated, 'string');
    });

    it('should return stored settings when valid data exists', () => {
      const testSettings = {
        theme: 'light',
        preferredCurrency: 'USD',
        schemaVersion: 1,
        lastUpdated: '2023-01-01T00:00:00.000Z'
      };
      
      localStorage.setItem('finance-agent-settings', JSON.stringify(testSettings));
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'light');
      assert.strictEqual(settings.preferredCurrency, 'USD');
    });

    it('should return defaults when stored data is invalid JSON', () => {
      localStorage.setItem('finance-agent-settings', 'invalid-json');
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark');
      assert.strictEqual(settings.preferredCurrency, 'EUR');
    });

    it('should return defaults when stored data fails schema validation', () => {
      const invalidSettings = {
        theme: 'invalid-theme',
        preferredCurrency: 'EUR'
        // missing required fields
      };
      
      localStorage.setItem('finance-agent-settings', JSON.stringify(invalidSettings));
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark');
      assert.strictEqual(settings.preferredCurrency, 'EUR');
    });
  });

  describe('saveSettings', () => {
    it('should save valid settings to localStorage', () => {
      const testSettings = {
        theme: 'light',
        preferredCurrency: 'USD',
        schemaVersion: 1,
        lastUpdated: '2023-01-01T00:00:00.000Z'
      };
      
      const success = saveSettings(testSettings);
      
      assert.strictEqual(success, true);
      
      const stored = localStorage.getItem('finance-agent-settings');
      const parsed = JSON.parse(stored);
      assert.strictEqual(parsed.theme, 'light');
      assert.strictEqual(parsed.preferredCurrency, 'USD');
    });

    it('should reject invalid settings', () => {
      const invalidSettings = {
        theme: 'invalid-theme',
        preferredCurrency: 'EUR'
        // missing required fields
      };
      
      const success = saveSettings(invalidSettings);
      
      assert.strictEqual(success, false);
      assert.strictEqual(localStorage.getItem('finance-agent-settings'), null);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => { throw new Error('Storage full'); };
      
      const testSettings = {
        theme: 'light',
        preferredCurrency: 'EUR',
        schemaVersion: 1,
        lastUpdated: '2023-01-01T00:00:00.000Z'
      };
      
      const success = saveSettings(testSettings);
      
      assert.strictEqual(success, false);
      
      // Restore original function
      localStorage.setItem = originalSetItem;
    });
  });

  describe('setTheme', () => {
    it('should set valid theme and persist to storage', () => {
      const success = setTheme('light');
      
      assert.strictEqual(success, true);
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'light');
    });

    it('should reject invalid theme values', () => {
      const success = setTheme('invalid-theme');
      
      assert.strictEqual(success, false);
      
      // Should not have saved anything
      assert.strictEqual(localStorage.getItem('finance-agent-settings'), null);
    });

    it('should preserve other settings when updating theme', () => {
      // First save some settings
      const initialSettings = {
        theme: 'dark',
        preferredCurrency: 'USD',
        schemaVersion: 1,
        lastUpdated: '2023-01-01T00:00:00.000Z'
      };
      saveSettings(initialSettings);
      
      // Update theme
      setTheme('light');
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'light');
      assert.strictEqual(settings.preferredCurrency, 'USD'); // Should be preserved
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      // Start with dark theme (default)
      const newTheme = toggleTheme();
      
      assert.strictEqual(newTheme, 'light');
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'light');
    });

    it('should toggle from light to dark', () => {
      // First set to light
      setTheme('light');
      
      const newTheme = toggleTheme();
      
      assert.strictEqual(newTheme, 'dark');
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark');
    });
  });

  describe('initializeTheme', () => {
    it('should apply stored theme on initialization', () => {
      // Set a theme first
      setTheme('light');
      
      // Initialize theme (this would normally apply CSS variables)
      // We can't test the actual CSS application in Node.js, but we can
      // ensure the function doesn't throw and uses the stored settings
      assert.doesNotThrow(() => {
        initializeTheme();
      });
    });

    it('should apply default theme when no settings exist', () => {
      // Initialize with no stored settings
      assert.doesNotThrow(() => {
        initializeTheme();
      });
      
      // Verify it would use default theme
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle localStorage being unavailable', () => {
      // Mock localStorage to throw on access
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => { throw new Error('No storage'); };
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark');
      assert.strictEqual(settings.preferredCurrency, 'EUR');
      
      // Restore original function
      localStorage.getItem = originalGetItem;
    });

    it('should handle malformed JSON gracefully', () => {
      localStorage.setItem('finance-agent-settings', '{invalid-json}');
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark');
    });

    it('should handle missing required fields in stored data', () => {
      const incompleteSettings = {
        theme: 'light'
        // missing other required fields
      };
      
      localStorage.setItem('finance-agent-settings', JSON.stringify(incompleteSettings));
      
      const settings = loadSettings();
      assert.strictEqual(settings.theme, 'dark'); // Should fall back to defaults
      assert.strictEqual(settings.preferredCurrency, 'EUR');
    });
  });
});
