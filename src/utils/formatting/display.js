/**
 * @fileoverview Display state and UI element formatting utilities
 * 
 * This module handles phase labels, age ranges, and other UI state displays
 * for the financial planning interface.
 */



/**
 * Formats financial phase or state labels with appropriate styling
 * 
 * @param {string} phase - Phase name ('debtFree', 'emergencyFund', 'retirement', 'death')
 * @param {boolean} [isActive=false] - Whether this phase is currently active
 * @returns {string} HTML string with formatted phase label
 */
export function formatPhaseLabel(phase, isActive = false) {
  if (typeof phase !== 'string' || typeof isActive !== 'boolean') {
    throw new Error('Phase must be string and isActive must be boolean');
  }
  
  const phaseConfig = {
    debtFree: { 
      label: 'Debt Elimination', 
      icon: '🎯', 
      color: '#dc2626',
      activeColor: '#b91c1c'
    },
    emergencyFund: { 
      label: 'Emergency Fund', 
      icon: '🛡️', 
      color: '#ca8a04',
      activeColor: '#a16207'
    },
    retirement: { 
      label: 'Retirement Planning', 
      icon: '🏖️', 
      color: '#2563eb',
      activeColor: '#1d4ed8'
    },
    death: { 
      label: 'Retirement Years', 
      icon: '💀', 
      color: '#7c3aed',
      activeColor: '#6d28d9'
    }
  };
  
  if (!Object.prototype.hasOwnProperty.call(phaseConfig, phase)) {
    throw new Error(`Unknown phase: ${phase}. Valid phases: ${Object.keys(phaseConfig).join(', ')}`);
  }
  // @ts-ignore - Dynamic property access is validated above
  const config = phaseConfig[phase];
  
  const color = isActive ? config.activeColor : config.color;
  const fontWeight = isActive ? 'bold' : 'normal';
  
  return `<span style="color: ${color}; font-weight: ${fontWeight};">${config.icon} ${config.label}</span>`;
}

/**
 * Formats age ranges for financial planning displays
 * 
 * @param {number} startAge - Starting age of the range
 * @param {number} endAge - Ending age of the range
 * @param {boolean} [isCurrentAge=false] - Whether this is the current age range
 * @returns {string} Formatted age range string
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
  
  const baseRange = `${startAge} - ${endAge}`;
  const currentIndicator = isCurrentAge ? ' (current)' : '';
  
  return baseRange + currentIndicator;
}
