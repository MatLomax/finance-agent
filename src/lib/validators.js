/**
 * @fileoverview Shared validation utilities for financial calculations
 * 
 * This module provides common validation schemas and helper functions used
 * across all financial calculation modules. Centralizes TypeBox validation
 * to ensure consistency and reduce code duplication.
 */

import { Value } from '@sinclair/typebox/value';

/**
 * Validates input data against a TypeBox schema
 * @param {import('@sinclair/typebox').TSchema} schema - TypeBox validation schema
 * @param {unknown} data - Data to validate
 * @throws {Error} If validation fails with detailed error message
 */
export function validate(schema, data) {
  if (!Value.Check(schema, data)) {
    const errors = [...Value.Errors(schema, data)];
    const message = errors.map(e => `${e.path}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${message}`);
  }
}
