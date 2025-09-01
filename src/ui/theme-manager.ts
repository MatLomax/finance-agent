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
 */
export function loadSettings(): any {
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
 */
function isValidSettings(settings: object): any {
  return settings &&
         typeof settings === 'object' &&
         (settings.theme === 'dark' || settings.theme === 'light') &&
         typeof settings.preferredCurrency === 'string' &&
         typeof settings.schemaVersion === 'number';
}

/**
 * Save settings to storage
 */
export function saveSettings(settings: object): any {
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
 */
function applyTheme(theme: string): any {
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
 */
export function setTheme(theme: string): any {
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
 */
export function toggleTheme(): any {
  const currentTheme = /** @type {{ theme: string }} */ (loadSettings()).theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme system
 */
export function initializeTheme(): any {
  const settings = /** @type {{ theme: string }} */ (loadSettings());
  applyTheme(settings.theme);
}
