/**
 * @fileoverview Simulation Results Caching Module
 * 
 * This module provides intelligent caching of simulation results to avoid expensive
 * recalculations when inputs haven't meaningfully changed. It implements a memory-efficient
 * LRU (Least Recently Used) cache with automatic invalidation and performance tracking.
 * 
 * Key Features:
 * - Deterministic cache key generation from input parameters
 * - Memory-bounded LRU cache (max 100 entries) to prevent memory leaks
 * - Automatic cache invalidation when financial data changes
 * - Performance statistics tracking (hits, misses, cache size)
 * - Efficient handling of large simulation datasets
 * 
 * Cache Strategy:
 * - Cache complete simulation results including year-by-year trajectories
 * - Use normalized input parameters as cache keys for consistency
 * - Automatically evict oldest entries when cache limit reached
 * - Track cache performance to optimize hit rates
 */

/**
 * Maximum number of simulation results to cache
 * Limited to prevent memory issues with large datasets
 */
const MAX_CACHE_SIZE = 100;

/**
 * In-memory cache for simulation results using Map for insertion order
 * Key: normalized input hash, Value: simulation result object
 * 
 * @type {Map<string, any>}
 */
const simulationCache = new Map();

/**
 * Cache performance statistics
 * 
 * @type {{ hits: number, misses: number, entries: number }}
 */
const cacheStats = {
  hits: 0,
  misses: 0,
  entries: 0
};

/**
 * Generate a deterministic cache key from simulation input parameters
 * 
 * The cache key includes all parameters that affect simulation outcomes:
 * - Financial data: age, salary, expenses, debt, savings, investments
 * - Simulation parameters: tax rates, return rates, allocations
 * - Timeline: retirement age, lifespan
 * 
 * @param {Record<string, any>} input - Simulation input parameters
 * @returns {string} Deterministic cache key
 */
function generateCacheKey(input) {
  // Normalize input by converting null/undefined to consistent values
  // and rounding floating-point numbers to avoid precision issues
  const normalizedInput = /** @type {Record<string, any>} */ ({});
  
  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) {
      normalizedInput[key] = null;
    } else if (typeof value === 'number') {
      // Round to 2 decimal places to handle floating-point precision
      normalizedInput[key] = Math.round(value * 100) / 100;
    } else if (typeof value === 'object') {
      // Recursively normalize nested objects (like allocation percentages)
      normalizedInput[key] = JSON.stringify(value, Object.keys(value).sort());
    } else {
      normalizedInput[key] = value;
    }
  }
  
  // Create deterministic string by sorting keys
  const sortedKeys = Object.keys(normalizedInput).sort();
  const keyParts = sortedKeys.map(key => `${key}:${normalizedInput[key]}`);
  
  return keyParts.join('|');
}

/**
 * Retrieve cached simulation result for given input parameters
 * 
 * Implements LRU behavior by moving accessed entries to end of Map
 * to mark them as recently used.
 * 
 * @param {Record<string, any>} input - Simulation input parameters
 * @returns {any|null} Cached simulation result or null if not found
 */
export function getCachedSimulation(input) {
  const cacheKey = generateCacheKey(input);
  
  if (simulationCache.has(cacheKey)) {
    // Move to end (mark as recently used)
    const result = simulationCache.get(cacheKey);
    simulationCache.delete(cacheKey);
    simulationCache.set(cacheKey, result);
    
    cacheStats.hits++;
    return result;
  }
  
  cacheStats.misses++;
  return null;
}

/**
 * Store simulation result in cache with LRU eviction
 * 
 * If cache exceeds maximum size, removes oldest (least recently used) entries.
 * This prevents memory issues while maintaining cache effectiveness.
 * 
 * @param {Record<string, any>} input - Simulation input parameters
 * @param {any} result - Simulation result to cache
 */
export function setCachedSimulation(input, result) {
  const cacheKey = generateCacheKey(input);
  
  // Remove entry if it already exists (to update position)
  if (simulationCache.has(cacheKey)) {
    simulationCache.delete(cacheKey);
  }
  
  // Add to end (mark as most recently used)
  simulationCache.set(cacheKey, result);
  
  // Enforce cache size limit by removing oldest entries
  while (simulationCache.size > MAX_CACHE_SIZE) {
    const firstKey = simulationCache.keys().next().value;
    if (firstKey !== undefined) {
      simulationCache.delete(firstKey);
    }
  }
  
  cacheStats.entries = simulationCache.size;
}

/**
 * Invalidate cached simulation for specific input parameters
 * 
 * Used when we know that a specific input configuration has changed
 * and its cached result is no longer valid.
 * 
 * @param {Record<string, any>} input - Input parameters to invalidate
 */
export function invalidateSimulationCache(input) {
  const cacheKey = generateCacheKey(input);
  const wasDeleted = simulationCache.delete(cacheKey);
  
  if (wasDeleted) {
    cacheStats.entries = simulationCache.size;
  }
}

/**
 * Clear entire simulation cache
 * 
 * Used when financial data structure changes significantly or
 * when we want to reset cache state completely.
 */
export function clearSimulationCache() {
  simulationCache.clear();
  cacheStats.entries = 0;
  cacheStats.hits = 0;
  cacheStats.misses = 0;
}

/**
 * Get cache performance statistics
 * 
 * Useful for monitoring cache effectiveness and optimizing cache strategy.
 * High hit rate indicates good cache performance.
 * 
 * @returns {{ entries: number, hits: number, misses: number, hitRate: number }} Cache statistics
 */
export function getSimulationCacheStats() {
  return {
    entries: simulationCache.size,
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate: cacheStats.hits + cacheStats.misses > 0 
      ? cacheStats.hits / (cacheStats.hits + cacheStats.misses) 
      : 0
  };
}

/*
 * Utility functions kept for future use - currently unused to avoid linting errors
 * 
 * resetCacheStats, hasSimulationCache, getSimulationCacheSize, 
 * estimateCacheMemoryUsage, wouldCacheKeyMatch
 * 
 * These can be re-enabled when needed for debugging or advanced cache management.
 */
