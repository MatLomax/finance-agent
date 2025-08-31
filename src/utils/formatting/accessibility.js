/**
 * @fileoverview Accessibility and responsive design utilities
 * 
 * This module provides WCAG-compliant color schemes and responsive font sizing
 * for accessible financial data presentation.
 */



/**
 * Creates accessible color combinations for financial data
 * 
 * @param {string} type - Color type ('positive', 'negative', 'neutral')
 * @param {boolean} [highContrast=false] - Whether to use high contrast colors
 * @returns {object} Color scheme with primary, background, and contrast colors
 */
export function getAccessibleColors(type, highContrast = false) {
  if (typeof type !== 'string' || typeof highContrast !== 'boolean') {
    throw new Error('Type must be string and highContrast must be boolean');
  }
  
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
  
  if (!Object.prototype.hasOwnProperty.call(colorSets, type)) {
    throw new Error(`Unknown color type: ${type}. Valid types: ${Object.keys(colorSets).join(', ')}`);
  }
  // @ts-ignore - Dynamic property access is validated above
  const colorSet = colorSets[type];
  
  return highContrast ? colorSet.high : colorSet.normal;
}

/**
 * Provides responsive font sizes for different screen sizes and importance levels
 * 
 * @param {string} importance - Font importance level ('primary', 'secondary', 'caption', 'label')
 * @param {boolean} [isMobile=false] - Whether the display is mobile
 * @returns {string} CSS font size value
 */
export function getResponsiveFontSize(importance, isMobile = false) {
  if (typeof importance !== 'string' || typeof isMobile !== 'boolean') {
    throw new Error('Importance must be string and isMobile must be boolean');
  }
  
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
  
  if (!Object.prototype.hasOwnProperty.call(fontSizes, importance)) {
    throw new Error(`Unknown importance level: ${importance}. Valid levels: ${Object.keys(fontSizes).join(', ')}`);
  }
  // @ts-ignore - Dynamic property access is validated above
  const sizeConfig = fontSizes[importance];
  
  return isMobile ? sizeConfig.mobile : sizeConfig.desktop;
}
