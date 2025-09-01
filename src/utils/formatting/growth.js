/**
 * @fileoverview Growth and change formatting utilities
 * 
 * This module handles growth indicators, delta displays, and change visualization
 * with color coding for financial performance tracking. Essential for displaying
 * investment performance, budget variances, and financial goal progress.
 * 
 * Educational Purpose:
 * These utilities teach users about financial change visualization by:
 * - Showing both absolute and percentage changes for complete context
 * - Using visual cues (colors) to indicate positive/negative performance
 * - Filtering noise (small changes) to focus on meaningful movements
 * - Supporting multiple currencies for international financial planning
 * 
 * Financial Concepts Demonstrated:
 * - Growth calculation: (current - previous) / previous * 100
 * - Absolute vs. relative change importance in financial analysis
 * - Visual feedback importance in financial decision making
 * - Threshold-based filtering for noise reduction in financial data
 */

import { validateNumber, validateNonNegativeNumber } from '../../lib/validators.js';
import { formatMoney } from './currency.js';

/**
 * Formats growth indicators with colors and both absolute and percentage changes
 * 
 * This function creates visual growth indicators for financial data, showing both
 * absolute monetary changes and percentage growth. Essential for investment tracking,
 * portfolio performance, and financial goal progress visualization.
 * 
 * Financial Context:
 * - Positive growth (green) indicates financial progress toward goals
 * - Negative growth (red) signals areas needing attention or adjustment
 * - Combines absolute and percentage to give complete picture of change
 * 
 * UX Design:
 * - Uses color coding for immediate visual feedback
 * - Rounds large amounts to nearest €100 for better readability
 * - Responsive font sizing for different display contexts
 * 
 * @param {number} current - Current value (e.g., current portfolio value)
 * @param {number|null} previous - Previous value for comparison (null if no historical data)
 * @param {boolean} [showPercentage=true] - Whether to include percentage change
 * @param {boolean} [showColors=true] - Whether to apply color coding (false for accessibility)
 * @returns {string} HTML string with styled growth indicator, empty string if no previous value
 * 
 * @example
 * // Portfolio grew from €50,000 to €52,000
 * formatGrowth(52000, 50000) 
 * // Returns: ' <span style="color: #10b981; font-size: 0.85em;">(+€2,000 / +4.0%)</span>'
 * 
 * @example
 * // Emergency fund decreased
 * formatGrowth(8000, 10000, true, false)
 * // Returns: ' <span style="color: #6b7280; font-size: 0.85em;">(-€2,000 / -20.0%)</span>'
 */
export function formatGrowth(current, previous, showPercentage = true, showColors = true) {
  validateNumber(current, 'current');
  if (previous !== null) {
    validateNumber(previous, 'previous');
  }
  
  if (!previous || previous === 0) return '';
  
  const growth = current - previous;
  const percentage = (growth / previous) * 100;
  const sign = growth >= 0 ? '+' : '';
  const formattedGrowth = Math.round(growth / 100) * 100;
  
  let color = '#6b7280';
  if (showColors) {
    if (growth > 0) color = '#10b981';
    else if (growth < 0) color = '#ef4444';
  }
  
  const absoluteAmount = Math.abs(formattedGrowth).toLocaleString('en-US');
  const absoluteChange = growth >= 0 ? `+€${absoluteAmount}` : `-€${absoluteAmount}`;
  const percentageChange = showPercentage ? ` / ${sign}${percentage.toFixed(1)}%` : '';
  
  return ` <span style="color: ${color}; font-size: 0.85em;">(${absoluteChange}${percentageChange})</span>`;
}

/**
 * Formats delta changes for table displays with minimal styling
 * 
 * This function creates compact change indicators optimized for table cells and
 * list displays where space is limited. Ideal for financial dashboards, budget
 * tracking tables, and expense category comparisons.
 * 
 * Financial Context:
 * - Filters out insignificant changes below threshold to reduce noise
 * - Shows only meaningful financial movements that require attention
 * - Perfect for expense tracking, budget variance analysis, account balances
 * 
 * UX Design:
 * - Minimal styling to fit table layouts
 * - Threshold filtering prevents display of trivial changes (e.g., rounding differences)
 * - Consistent currency formatting maintains professional appearance
 * 
 * @param {number} current - Current monetary value
 * @param {number|null} previous - Previous value for comparison (null if no history)
 * @param {number} [minThreshold=1] - Minimum change amount to display (filters noise)
 * @param {string} [currency='€'] - Currency symbol (€, $, £, etc.)
 * @returns {string} HTML string with styled delta, empty string if below threshold or no previous value
 * 
 * @example
 * // Significant expense increase
 * formatDelta(1250, 1000, 50, '€')
 * // Returns: '<span style="color: #ef4444; font-size: 0.9em;">+ €250</span>'
 * 
 * @example
 * // Minor change below threshold (ignored)
 * formatDelta(1001, 1000, 50, '€')
 * // Returns: '' (empty string - change too small)
 * 
 * @example
 * // USD currency format
 * formatDelta(5200, 5000, 10, '$')
 * // Returns: '<span style="color: #10b981; font-size: 0.9em;">+ $200</span>'
 */
export function formatDelta(current, previous, minThreshold = 1, currency = '€') {
  validateNumber(current, 'current');
  if (previous !== null) {
    validateNumber(previous, 'previous');
  }
  validateNonNegativeNumber(minThreshold, 'minThreshold');
  
  if (!previous) return '';
  
  const delta = current - previous;
  if (Math.abs(delta) < minThreshold) return '';
  
  const sign = delta >= 0 ? '+ ' : '- ';
  const color = delta >= 0 ? '#10b981' : '#ef4444';
  const formattedDelta = formatMoney(Math.abs(delta), currency);
  
  return `<span style="color: ${color}; font-size: 0.9em;">${sign}${formattedDelta.replace(currency, currency)}</span>`;
}
