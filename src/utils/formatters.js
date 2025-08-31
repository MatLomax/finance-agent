/**
 * @fileoverview Backward compatibility layer for split formatting modules
 * 
 * This file maintains compatibility with existing imports while providing
 * access to the new modular structure. All functions are now organized
 * into focused feature modules for better maintainability.
 */

// Re-export all functions for backward compatibility
export {
  formatAgeRange, formatDelta, formatGrowth, formatMoney,
  formatPercentage, formatPhaseLabel, getAccessibleColors,
  getResponsiveFontSize
} from './formatting/index.js';

