/**
 * @fileoverview Theme and settings management module
 * 
 * Provides theme switching (dark/light mode) and settings persistence.
 */

import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { setCustomProperty } from '../utils/dom-helpers.js';

// Validation schemas
const ThemeSchema = Type.Union([Type.Literal('dark'), Type.Literal('light')]);
const SettingsSchema = Type.Object({
  theme: ThemeSchema,
  preferredCurrency: Type.String(),
  schemaVersion: Type.Number(),
  lastUpdated: Type.String()
});

const STORAGE_KEY = 'finance-agent-settings';
const DEFAULT_SETTINGS = {
  theme: 'dark',
  preferredCurrency: 'EUR',
  schemaVersion: 1,
  lastUpdated: new Date().toISOString()
};

const THEME_VARIABLES = {
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
 * Load settings from localStorage with fallback to defaults
 * 
 * @returns {{theme: string, preferredCurrency: string, schemaVersion: number, lastUpdated: string}} Settings object
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS };
    
    const parsed = JSON.parse(stored);
    return Value.Check(SettingsSchema, parsed) ? parsed : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save settings to localStorage
 * 
 * @param {{theme: string, preferredCurrency: string, schemaVersion: number, lastUpdated: string}} settings - Settings to save
 * @returns {boolean} Success status
 */
export function saveSettings(settings) {
  try {
    if (!Value.Check(SettingsSchema, settings)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

/**
 * Apply theme CSS variables to document root
 * 
 * @param {string} theme - Theme name
 */
function applyTheme(theme) {
  const variables = THEME_VARIABLES[/** @type {'dark' | 'light'} */ (theme)];
  if (!variables) return;
  
  Object.entries(variables).forEach(([prop, value]) => {
    setCustomProperty(prop, value);
  });
  
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Set theme and persist preference
 * 
 * @param {string} theme - Theme name ('dark' or 'light')
 * @returns {boolean} Success status
 */
export function setTheme(theme) {
  if (!Value.Check(ThemeSchema, theme)) return false;
  
  const settings = loadSettings();
  const updated = { ...settings, theme };
  
  if (saveSettings(updated)) {
    applyTheme(theme);
    return true;
  }
  return false;
}

/**
 * Toggle between dark and light themes
 * 
 * @returns {string} New theme name
 */
export function toggleTheme() {
  const settings = loadSettings();
  const currentTheme = /** @type {string} */ (settings.theme);
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme on app startup
 */
export function initializeTheme() {
  const settings = loadSettings();
  const theme = /** @type {string} */ (settings.theme);
  applyTheme(theme);
}
