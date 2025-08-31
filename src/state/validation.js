/**
 * @fileoverview Financial data validation and migration functions
 * 
 * This module contains functions for validating financial data structure
 * and migrating data between schema versions. It ensures data integrity
 * and handles schema evolution over time.
 */

import { formatISO } from 'date-fns';

/**
 * Required numeric fields in financial data
 */
const REQUIRED_NUMERIC_FIELDS = [
  'grossUsd', 'eurUsd', 'thbEur', 'taxRate',
  'housing', 'utilities', 'diningGroceries', 'hiredStaff',
  'transportation', 'healthInsurance', 'petCare', 'wellness',
  'entertainment', 'weekendTrips', 'annualHoliday', 'discretionary',
  'allocDebt1', 'allocSavings1', 'allocInvestment1',
  'allocDebt2', 'allocSavings2', 'allocInvestment2',
  'allocSavings3', 'allocInvestment3',
  'currentAge', 'lifespan', 'investmentReturnRate',
  'totalDebt', 'totalSavings', 'totalInvestments'
];

/**
 * Validate numeric fields in financial data
 * 
 * @param {Record<string, any>} data - Financial data to validate
 * @returns {boolean} True if all numeric fields are valid
 */
function validateNumericFields(data) {
  for (const field of REQUIRED_NUMERIC_FIELDS) {
    if (!(field in data) || typeof data[field] !== 'number' || isNaN(data[field])) {
      console.warn(`Invalid or missing field: ${field}`);
      return false;
    }
  }
  return true;
}

/**
 * Validate age and lifespan ranges
 * 
 * @param {Record<string, any>} data - Financial data to validate
 * @returns {boolean} True if age and lifespan are within reasonable ranges
 */
function validateAgeRanges(data) {
  if (data.currentAge < 18 || data.currentAge > 100) {
    console.warn('Current age out of reasonable range');
    return false;
  }
  
  if (data.lifespan < data.currentAge || data.lifespan > 120) {
    console.warn('Lifespan out of reasonable range');
    return false;
  }
  
  return true;
}

/**
 * Validate phase allocation percentages
 * 
 * @param {Record<string, any>} data - Financial data to validate
 * @returns {boolean} True if all phase allocations sum to 100%
 */
function validatePhaseAllocations(data) {
  const phase1Total = data.allocDebt1 + data.allocSavings1 + data.allocInvestment1;
  const phase2Total = data.allocDebt2 + data.allocSavings2 + data.allocInvestment2;
  const phase3Total = data.allocSavings3 + data.allocInvestment3;
  
  if (Math.abs(phase1Total - 100) > 0.01) {
    console.warn('Phase 1 allocations do not sum to 100%');
    return false;
  }
  
  if (Math.abs(phase2Total - 100) > 0.01) {
    console.warn('Phase 2 allocations do not sum to 100%');
    return false;
  }
  
  if (Math.abs(phase3Total - 100) > 0.01) {
    console.warn('Phase 3 allocations do not sum to 100%');
    return false;
  }
  
  return true;
}

/**
 * Validate financial data structure and values
 * 
 * This function ensures that loaded data has all required fields and that
 * numeric values are within reasonable ranges. It helps prevent crashes
 * from corrupted or malicious localStorage data.
 * 
 * @param {Record<string, any>} data - Financial data to validate
 * @returns {boolean} True if data is valid, false otherwise
 */
export function validateFinancialData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  return validateNumericFields(data) && 
         validateAgeRanges(data) && 
         validatePhaseAllocations(data);
}

/**
 * Migrate financial data to current schema version
 * 
 * As the application evolves, the data structure may need to change.
 * This function handles migrating old data formats to the current version,
 * ensuring users don't lose their data when upgrading.
 * 
 * @param {Record<string, any>} data - Financial data to migrate
 * @returns {Record<string, any>} Migrated financial data
 */
export function migrateData(data) {
  if (!data.schemaVersion) {
    // Version 0 to Version 1: Add schema version and metadata
    data = {
      ...data,
      schemaVersion: 1,
      lastUpdated: formatISO(new Date()),
      version: '1.0.0'
    };
  }
  
  // Future migrations would go here
  // if (data.schemaVersion === 1) { ... }
  
  return data;
}
