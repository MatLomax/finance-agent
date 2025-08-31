/**
 * @fileoverview Lightweight theme management
 * Theme switching and settings persistence without heavy dependencies.
 */

import { formatISO } from 'date-fns';
import { setCustomProperty } from '../utils/dom-helpers.js';

const STORAGE_KEY = 'finance-agent-settings';
const DEFAULT_SETTINGS = {
  theme: 'dark',
  preferredCurrency: 'EUR',
  schemaVersion: 1,
  lastUpdated: formatISO(new Date())
};

const THEME_VARS = {
  dark: {
    '--bg-primary': '#0f0f23',
    '--bg-secondary': '#1a1a2e',
    '--text-primary': '#ffffff',
    '--text-secondary': '#cccccc',
    '--border-color': '#333333',
    '--accent-color': '#00ff41'
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8f9fa',
    '--text-primary': '#212529',
    '--text-secondary': '#495057',
    '--border-color': '#dee2e6',
    '--accent-color': '#0066cc'
  }
};

/**
 * Load theme settings from localStorage with fallback to defaults
 * @returns {Object} Settings object
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isValidSettings(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fall through to default
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Simple settings validation
 * @param {any} settings - Settings to validate
 * @returns {boolean} True if valid
 */
function isValidSettings(settings) {
  return settings &&
         typeof settings === 'object' &&
         (settings.theme === 'dark' || settings.theme === 'light') &&
         typeof settings.preferredCurrency === 'string' &&
         typeof settings.schemaVersion === 'number';
}

/**
 * Save settings to storage
 * @param {object} settings - Settings to save
 * @returns {boolean} True if saved successfully
 */
export function saveSettings(settings) {
  try {
    if (!isValidSettings(settings)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

/**
 * Apply theme variables to DOM
 * @param {string} theme - Theme name ('dark' | 'light')
 */
function applyTheme(theme) {
  if (theme === 'dark' || theme === 'light') {
    const variables = THEME_VARS[theme];
    Object.entries(variables).forEach(([property, value]) => {
      setCustomProperty(property, value);
    });
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/**
 * Set theme and persist
 * @param {string} theme - Theme to set
 * @returns {boolean} True if successful
 */
export function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') return false;
  
  const settings = { ...loadSettings(), theme };
  if (saveSettings(settings)) {
    applyTheme(theme);
    return true;
  }
  return false;
}

/**
 * Toggle between dark and light theme
 * @returns {string} New theme
 */
export function toggleTheme() {
  const currentTheme = /** @type {{ theme: string }} */ (loadSettings()).theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme system
 */
export function initializeTheme() {
  const settings = /** @type {{ theme: string }} */ (loadSettings());
  applyTheme(settings.theme);
}
