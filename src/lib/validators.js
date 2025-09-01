/**
 * @fileoverview Shared validation utilities for financial calculations
 * 
 * This module provides common validation functions used across all financial 
 * calculation modules. Ensures type safety through TypeScript design-time checks 
 * and basic runtime parameter validation for critical edge cases.
 */

/**
 * Validates that a value is a finite number (not NaN, Infinity, or non-numeric)
 * @param {unknown} value - Value to validate
 * @param {string} name - Parameter name for error messages
 * @throws {Error} If value is not a finite number
 */
export function validateNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number, got: ${typeof value} ${value}`);
  }
}

/**
 * Validates that a value is a positive number (> 0)
 * @param {unknown} value - Value to validate
 * @param {string} name - Parameter name for error messages
 * @throws {Error} If value is not a positive number
 */
export function validatePositiveNumber(value, name) {
  validateNumber(value, name);
  const num = /** @type {number} */ (value);
  if (num <= 0) {
    throw new Error(`${name} must be positive, got: ${num}`);
  }
}

/**
 * Validates that a value is a non-negative number (>= 0)
 * @param {unknown} value - Value to validate
 * @param {string} name - Parameter name for error messages
 * @throws {Error} If value is negative
 */
export function validateNonNegativeNumber(value, name) {
  validateNumber(value, name);
  const num = /** @type {number} */ (value);
  if (num < 0) {
    throw new Error(`${name} cannot be negative, got: ${num}`);
  }
}

/**
 * Validates that a value is a percentage (0-1)
 * @param {unknown} value - Value to validate
 * @param {string} name - Parameter name for error messages
 * @throws {Error} If value is not between 0 and 1
 */
export function validatePercentage(value, name) {
  validateNumber(value, name);
  const num = /** @type {number} */ (value);
  if (num < 0 || num > 1) {
    throw new Error(`${name} must be between 0 and 1, got: ${num}`);
  }
}

/**
 * Validates that a string is not empty
 * @param {unknown} value - Value to validate
 * @param {string} name - Parameter name for error messages
 * @throws {Error} If value is not a non-empty string
 */
export function validateString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} must be a non-empty string, got: ${typeof value} ${value}`);
  }
}

/**
 * Validates that a value is within a numeric range
 * @param {unknown} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {string} name - Parameter name for error messages
 * @throws {Error} If value is outside the specified range
 */
export function validateRange(value, min, max, name) {
  validateNumber(value, name);
  const num = /** @type {number} */ (value);
  if (num < min || num > max) {
    throw new Error(`${name} must be between ${min} and ${max}, got: ${num}`);
  }
}
