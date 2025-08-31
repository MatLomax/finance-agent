/**
 * @fileoverview UI formatting utilities for financial data presentation
 * 
 * This module contains pure UI formatting functions extracted from Thailand.html
 * that handle the presentation layer of financial data. These functions transform
 * raw financial numbers into user-friendly, visually appealing displays.
 * 
 * All functions follow UI module standards with native web APIs, TypeBox validation,
 * and comprehensive educational documentation about UI/UX concepts in finance.
 */

import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Schema for currency amount formatting
 */
const CurrencyAmountSchema = Type.Object({
  amount: Type.Number(),
  currency: Type.Optional(Type.String({ minLength: 1, maxLength: 3 })),
  locale: Type.Optional(Type.String({ minLength: 2, maxLength: 10 }))
});

/**
 * Schema for growth/delta calculations and formatting
 */
const GrowthCalculationSchema = Type.Object({
  current: Type.Number(),
  previous: Type.Union([Type.Number(), Type.Null()]),
  showPercentage: Type.Optional(Type.Boolean()),
  showColors: Type.Optional(Type.Boolean())
});

/**
 * Schema for delta display options
 */
const DeltaDisplaySchema = Type.Object({
  current: Type.Number(),
  previous: Type.Union([Type.Number(), Type.Null()]),
  minThreshold: Type.Optional(Type.Number({ minimum: 0 })),
  currency: Type.Optional(Type.String({ minLength: 1, maxLength: 3 }))
});

// Note: ColorValueSchema removed temporarily - will be added when color validation is implemented

// =============================================================================
// VALIDATION HELPER
// =============================================================================

/**
 * Validates input data against a TypeBox schema
 * @param {import('@sinclair/typebox').TSchema} schema - TypeBox validation schema
 * @param {unknown} data - Data to validate
 * @throws {Error} If validation fails with detailed error message
 */
function validate(schema, data) {
  if (!Value.Check(schema, data)) {
    const errors = [...Value.Errors(schema, data)];
    const message = errors.map(e => `${e.path}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${message}`);
  }
}

// =============================================================================
// CURRENCY FORMATTING FUNCTIONS
// =============================================================================

/**
 * Formats monetary amounts with intelligent rounding and localization
 * 
 * This function implements smart rounding logic for financial displays:
 * - Large amounts (≥€10,000): Round to nearest €100 for readability
 * - Small amounts (<€10,000): Round to nearest €10 for precision
 * 
 * UX Reasoning: Large numbers are easier to scan when rounded, while
 * small amounts need more precision for accuracy in personal finance.
 * 
 * @param {number} amount - Monetary amount to format
 * @param {string} [currency='€'] - Currency symbol to display
 * @param {string} [locale='en-US'] - Locale for number formatting
 * @returns {string} Formatted currency string with localized separators
 * 
 * @example
 * const largeAmount = formatMoney(15750);
 * // Returns: "€15,800" (rounded to nearest 100)
 * 
 * const smallAmount = formatMoney(1234);
 * // Returns: "€1,230" (rounded to nearest 10)
 * 
 * const preciseAmount = formatMoney(123.45);
 * // Returns: "€120" (rounded to nearest 10)
 * 
 * @throws {Error} If input validation fails
 */
export function formatMoney(amount, currency = '€', locale = 'en-US') {
  validate(CurrencyAmountSchema, { amount, currency, locale });
  
  // Implement intelligent rounding based on amount magnitude
  // This improves readability for different scales of financial data
  let rounded;
  
  if (Math.abs(amount) >= 10000) {
    // Large amounts: Round to nearest 100 for clean display
    // Examples: €15,750 → €15,800, €125,432 → €125,400
    // UX benefit: Easier to scan in dashboards and reports
    rounded = Math.round(amount / 100) * 100;
  } else {
    // Small amounts: Round to nearest 10 for reasonable precision
    // Examples: €1,234 → €1,230, €567 → €570
    // UX benefit: Maintains useful precision for personal finance
    rounded = Math.round(amount / 10) * 10;
  }
  
  // Apply localization for thousand separators and number formatting
  // This ensures the display follows user's regional expectations
  const formattedNumber = rounded.toLocaleString(locale);
  
  // Combine currency symbol with formatted number
  // Currency symbol placement varies by locale, but € prefix is standard for this app
  return currency + formattedNumber;
}

/**
 * Formats percentage values with appropriate precision
 * 
 * Provides consistent percentage formatting for financial growth rates,
 * allocation percentages, and other ratio displays in the UI.
 * 
 * @param {number} value - Decimal value to format as percentage (0.15 = 15%)
 * @param {number} [decimalPlaces=1] - Number of decimal places to show
 * @returns {string} Formatted percentage string
 * 
 * @example
 * const growthRate = formatPercentage(0.0567);
 * // Returns: "5.7%"
 * 
 * const allocation = formatPercentage(0.3333, 0);
 * // Returns: "33%"
 * 
 * @throws {Error} If input validation fails
 */
export function formatPercentage(value, decimalPlaces = 1) {
  if (typeof value !== 'number' || typeof decimalPlaces !== 'number') {
    throw new Error('Value and decimal places must be numbers');
  }
  
  if (decimalPlaces < 0 || decimalPlaces > 10) {
    throw new Error('Decimal places must be between 0 and 10');
  }
  
  // Convert decimal to percentage and apply rounding
  const percentage = value * 100;
  
  // Use toFixed for consistent decimal places, then remove trailing zeros if needed
  const formatted = percentage.toFixed(decimalPlaces);
  
  return formatted + '%';
}

// =============================================================================
// GROWTH AND CHANGE FORMATTING FUNCTIONS
// =============================================================================

/**
 * Formats growth indicators with colors and both absolute and percentage changes
 * 
 * This function creates rich visual indicators for financial growth/decline
 * by combining absolute changes, percentage changes, and color coding.
 * Essential for dashboards, reports, and investment tracking interfaces.
 * 
 * UX Design: Uses conventional financial colors (green=growth, red=decline)
 * and provides both absolute and relative change information for context.
 * 
 * @param {number} current - Current value
 * @param {number} previous - Previous value for comparison
 * @param {boolean} [showPercentage=true] - Whether to include percentage change
 * @param {boolean} [showColors=true] - Whether to apply color styling
 * @returns {string} HTML string with styled growth indicator
 * 
 * @example
 * const portfolioGrowth = formatGrowth(110000, 100000);
 * // Returns: ' <span style="color: #10b981; font-size: 0.85em;">(+€10,000 / +10.0%)</span>'
 * 
 * const portfolioDecline = formatGrowth(90000, 100000);
 * // Returns: ' <span style="color: #ef4444; font-size: 0.85em;">(-€10,000 / -10.0%)</span>'
 * 
 * const noChange = formatGrowth(100000, 100000);
 * // Returns: ' <span style="color: #6b7280; font-size: 0.85em;">(€0 / 0.0%)</span>'
 * 
 * @throws {Error} If input validation fails
 */
export function formatGrowth(current, previous, showPercentage = true, showColors = true) {
  validate(GrowthCalculationSchema, { current, previous, showPercentage, showColors });
  
  // Handle edge case: no previous value to compare against
  if (!previous || previous === 0) {
    return '';
  }
  
  // Calculate absolute change (difference in currency)
  const growth = current - previous;
  
  // Calculate percentage change for relative context
  const percentage = (growth / previous) * 100;
  
  // Determine sign for display (+ for positive, - handled by negative numbers)
  const sign = growth >= 0 ? '+' : '';
  
  // Apply intelligent rounding to growth amount (same logic as formatMoney)
  // This maintains consistency with other monetary displays
  const formattedGrowth = Math.round(growth / 100) * 100;
  
  // Choose color based on financial conventions
  // Green: Positive growth (good for investments, income)
  // Red: Negative growth (losses, increased expenses)
  // Gray: Neutral (no change)
  let color = '#6b7280'; // Default neutral gray
  if (showColors) {
    if (growth > 0) {
      color = '#10b981'; // Success green (from Tailwind emerald-500)
    } else if (growth < 0) {
      color = '#ef4444'; // Error red (from Tailwind red-500)
    }
  }
  
  // Build display components
  // For negative amounts, we need to ensure the negative sign is visible
  const absoluteAmount = Math.abs(formattedGrowth).toLocaleString('en-US');
  const absoluteChange = growth >= 0 ? `+€${absoluteAmount}` : `-€${absoluteAmount}`;
  const percentageChange = showPercentage ? ` / ${sign}${percentage.toFixed(1)}%` : '';
  
  // Return HTML span with inline styles for immediate visual feedback
  // Font size is smaller to indicate this is supplementary information
  return ` <span style="color: ${color}; font-size: 0.85em;">(${absoluteChange}${percentageChange})</span>`;
}

/**
 * Formats delta changes for table displays with minimal styling
 * 
 * Simpler version of formatGrowth designed for table cells and compact displays
 * where space is limited and excessive styling would be distracting.
 * 
 * @param {number} current - Current value
 * @param {number|null} previous - Previous value (can be null)
 * @param {number} [minThreshold=1] - Minimum change to display (filters noise)
 * @param {string} [currency='€'] - Currency symbol
 * @returns {string} Formatted delta string or empty if below threshold
 * 
 * @example
 * const significantChange = formatDelta(1150, 1000);
 * // Returns: '<span style="color: #10b981; font-size: 0.9em;">+ €150</span>'
 * 
 * const minorChange = formatDelta(1001, 1000, 10);
 * // Returns: '' (below 10 threshold)
 * 
 * const firstValue = formatDelta(1000, null);
 * // Returns: '' (no previous value to compare)
 * 
 * @throws {Error} If input validation fails
 */
export function formatDelta(current, previous, minThreshold = 1, currency = '€') {
  validate(DeltaDisplaySchema, { current, previous, minThreshold, currency });
  
  // No previous value means no delta to display
  if (!previous) {
    return '';
  }
  
  // Calculate absolute change
  const delta = current - previous;
  
  // Filter out insignificant changes to reduce visual noise
  // This is especially important in tables with many small fluctuations
  if (Math.abs(delta) < minThreshold) {
    return '';
  }
  
  // Determine sign and color for display
  const sign = delta >= 0 ? '+ ' : ''; // Negative sign is automatic
  const color = delta >= 0 ? '#10b981' : '#ef4444';
  
  // Format the delta amount with appropriate currency formatting
  const formattedDelta = formatMoney(Math.abs(delta), currency);
  
  // Return compact span with color indicator
  // Slightly larger font than growth indicators for table readability
  return `<span style="color: ${color}; font-size: 0.9em;">${sign}${formattedDelta.replace(currency, currency)}</span>`;
}

// =============================================================================
// DISPLAY STATE FORMATTING FUNCTIONS
// =============================================================================

/**
 * Formats financial phase or state labels with appropriate styling
 * 
 * Creates consistent labeling for different phases of financial planning:
 * debt elimination, emergency fund building, retirement planning, etc.
 * 
 * @param {string} phase - Phase identifier ('debtFree', 'emergencyFund', 'retirement', 'death')
 * @param {boolean} [isActive=false] - Whether this phase is currently active
 * @returns {string} Formatted phase label with appropriate styling
 * 
 * @example
 * const currentPhase = formatPhaseLabel('debtFree', true);
 * // Returns styled HTML for active debt elimination phase
 * 
 * const futurePhase = formatPhaseLabel('retirement', false);
 * // Returns styled HTML for future retirement phase
 * 
 * @throws {Error} If phase is not recognized
 */
export function formatPhaseLabel(phase, isActive = false) {
  if (typeof phase !== 'string' || typeof isActive !== 'boolean') {
    throw new Error('Phase must be string and isActive must be boolean');
  }
  
  // Define phase display mappings with icons and colors
  const phaseConfig = {
    debtFree: { 
      label: 'Debt Elimination', 
      icon: '🎯', 
      color: '#dc2626', // Red for urgency
      activeColor: '#b91c1c'
    },
    emergencyFund: { 
      label: 'Emergency Fund', 
      icon: '🛡️', 
      color: '#ca8a04', // Yellow/orange for caution
      activeColor: '#a16207'
    },
    retirement: { 
      label: 'Retirement Planning', 
      icon: '🏖️', 
      color: '#2563eb', // Blue for stability
      activeColor: '#1d4ed8'
    },
    death: { 
      label: 'Retirement Years', 
      icon: '💀', 
      color: '#7c3aed', // Purple for final phase
      activeColor: '#6d28d9'
    }
  };
  
  const config = /** @type {typeof phaseConfig[keyof typeof phaseConfig]} */ (phaseConfig[/** @type {keyof typeof phaseConfig} */ (phase)]);
  if (!config) {
    throw new Error(`Unknown phase: ${phase}. Valid phases: ${Object.keys(phaseConfig).join(', ')}`);
  }
  
  // Choose color based on active state
  const color = isActive ? config.activeColor : config.color;
  const fontWeight = isActive ? 'bold' : 'normal';
  
  // Return formatted phase label with icon and styling
  return `<span style="color: ${color}; font-weight: ${fontWeight};">${config.icon} ${config.label}</span>`;
}

/**
 * Formats age ranges for phase displays
 * 
 * Creates readable age range displays for financial planning phases,
 * helping users understand timeline context.
 * 
 * @param {number} startAge - Starting age for the phase
 * @param {number} endAge - Ending age for the phase
 * @param {boolean} [isCurrentAge=false] - Whether this includes current age
 * @returns {string} Formatted age range string
 * 
 * @example
 * const phaseRange = formatAgeRange(33, 45);
 * // Returns: "33 - 45"
 * 
 * const currentPhaseRange = formatAgeRange(33, 45, true);
 * // Returns: "33 - 45 (current)"
 * 
 * @throws {Error} If ages are invalid
 */
export function formatAgeRange(startAge, endAge, isCurrentAge = false) {
  if (typeof startAge !== 'number' || typeof endAge !== 'number' || typeof isCurrentAge !== 'boolean') {
    throw new Error('Ages must be numbers and isCurrentAge must be boolean');
  }
  
  if (startAge < 0 || endAge < 0) {
    throw new Error('Ages must be non-negative');
  }
  
  if (startAge > endAge) {
    throw new Error('Start age cannot be greater than end age');
  }
  
  // Build base age range string
  const baseRange = `${startAge} - ${endAge}`;
  
  // Add current indicator if applicable
  const currentIndicator = isCurrentAge ? ' (current)' : '';
  
  return baseRange + currentIndicator;
}

// =============================================================================
// ACCESSIBILITY AND RESPONSIVE HELPERS
// =============================================================================

/**
 * Creates accessible color combinations for financial data
 * 
 * Ensures color choices meet WCAG accessibility guidelines while
 * maintaining the conventional financial color meanings.
 * 
 * @param {string} type - Color type ('positive', 'negative', 'neutral')
 * @param {boolean} [highContrast=false] - Whether to use high contrast variant
 * @returns {Object} Color configuration with hex values and accessibility info
 * 
 * @example
 * const positiveColors = getAccessibleColors('positive');
 * // Returns: { primary: '#059669', background: '#d1fae5', contrast: 'AA' }
 * 
 * const highContrastNegative = getAccessibleColors('negative', true);
 * // Returns: { primary: '#dc2626', background: '#fee2e2', contrast: 'AAA' }
 * 
 * @throws {Error} If color type is not recognized
 */
export function getAccessibleColors(type, highContrast = false) {
  if (typeof type !== 'string' || typeof highContrast !== 'boolean') {
    throw new Error('Type must be string and highContrast must be boolean');
  }
  
  // WCAG AA compliant color combinations
  const colorSets = {
    positive: {
      normal: { primary: '#059669', background: '#d1fae5', contrast: 'AA' },
      high: { primary: '#065f46', background: '#ecfdf5', contrast: 'AAA' }
    },
    negative: {
      normal: { primary: '#dc2626', background: '#fee2e2', contrast: 'AA' },
      high: { primary: '#991b1b', background: '#fef2f2', contrast: 'AAA' }
    },
    neutral: {
      normal: { primary: '#6b7280', background: '#f9fafb', contrast: 'AA' },
      high: { primary: '#374151', background: '#ffffff', contrast: 'AAA' }
    }
  };
  
  const colorSet = /** @type {typeof colorSets[keyof typeof colorSets]} */ (colorSets[/** @type {keyof typeof colorSets} */ (type)]);
  if (!colorSet) {
    throw new Error(`Unknown color type: ${type}. Valid types: ${Object.keys(colorSets).join(', ')}`);
  }
  
  return highContrast ? colorSet.high : colorSet.normal;
}

/**
 * Generates responsive font size CSS based on content importance
 * 
 * Provides consistent font sizing that adapts to different viewport sizes
 * while maintaining information hierarchy in financial displays.
 * 
 * @param {'primary'|'secondary'|'caption'|'label'} importance - Content importance level
 * @param {boolean} [isMobile=false] - Whether to optimize for mobile display
 * @returns {string} CSS font-size value with responsive units
 * 
 * @example
 * const primarySize = getResponsiveFontSize('primary');
 * // Returns: "clamp(1.25rem, 2.5vw, 2rem)"
 * 
 * const mobileCaption = getResponsiveFontSize('caption', true);
 * // Returns: "clamp(0.75rem, 2vw, 0.875rem)"
 * 
 * @throws {Error} If importance level is not recognized
 */
export function getResponsiveFontSize(importance, isMobile = false) {
  if (typeof importance !== 'string' || typeof isMobile !== 'boolean') {
    throw new Error('Importance must be string and isMobile must be boolean');
  }
  
  // Responsive font size configurations using clamp() for fluid scaling
  const fontSizes = {
    primary: {
      desktop: 'clamp(1.25rem, 2.5vw, 2rem)',
      mobile: 'clamp(1.125rem, 4vw, 1.5rem)'
    },
    secondary: {
      desktop: 'clamp(1rem, 2vw, 1.25rem)', 
      mobile: 'clamp(0.875rem, 3.5vw, 1.125rem)'
    },
    caption: {
      desktop: 'clamp(0.875rem, 1.5vw, 1rem)',
      mobile: 'clamp(0.75rem, 2vw, 0.875rem)'
    },
    label: {
      desktop: 'clamp(0.75rem, 1.25vw, 0.875rem)',
      mobile: 'clamp(0.6875rem, 1.8vw, 0.8rem)'
    }
  };
  
  const sizeConfig = /** @type {typeof fontSizes[keyof typeof fontSizes]} */ (fontSizes[/** @type {keyof typeof fontSizes} */ (importance)]);
  if (!sizeConfig) {
    throw new Error(`Unknown importance level: ${importance}. Valid levels: ${Object.keys(fontSizes).join(', ')}`);
  }
  
  return isMobile ? sizeConfig.mobile : sizeConfig.desktop;
}
