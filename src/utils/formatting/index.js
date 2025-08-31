/**
 * @fileoverview Formatting utilities public API
 * 
 * This module provides all formatting utilities for the finance agent.
 * Exports all formatting functions with clean public interface.
 */

export { getAccessibleColors, getResponsiveFontSize } from './accessibility.js';
export { formatMoney, formatPercentage } from './currency.js';
export { formatAgeRange, formatPhaseLabel } from './display.js';
export { formatDelta, formatGrowth } from './growth.js';

