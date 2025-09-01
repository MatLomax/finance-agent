/**
 * @fileoverview Tests for simulation results caching module
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  clearSimulationCache,
  getCachedSimulation,
  setCachedSimulation,
  invalidateSimulationCache,
  getSimulationCacheStats
} from './simulation-results.js';

describe('simulation-results', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearSimulationCache();
  });

  describe('cache storage and retrieval', () => {
    it('should store and retrieve simulation results', () => {
      const input = {
        currentAge: 30,
        grossSalaryMonthly: 5000,
        monthlyExpenses: 2000,
        totalDebt: 10000,
        totalSavings: 5000,
        totalInvestments: 15000
      };
      
      const simulationResult = {
        age: 60,
        simulation: [
          { age: 30, savings: 5000, investments: 15000, debt: 10000 },
          { age: 31, savings: 6000, investments: 18000, debt: 5000 }
        ],
        finalWealth: 150000
      };

      // Cache should be empty initially
      const cached = getCachedSimulation(input);
      assert.strictEqual(cached, null);

      // Store simulation result
      setCachedSimulation(input, simulationResult);

      // Should retrieve cached result
      const retrieved = getCachedSimulation(input);
      assert.deepStrictEqual(retrieved, simulationResult);
    });

    it('should return null for non-existent cache entries', () => {
      const input = {
        currentAge: 25,
        grossSalaryMonthly: 3000,
        monthlyExpenses: 1500,
        totalDebt: 5000,
        totalSavings: 2000,
        totalInvestments: 8000
      };

      const result = getCachedSimulation(input);
      assert.strictEqual(result, null);
    });

    it('should handle different input parameters separately', () => {
      const input1 = { currentAge: 30, grossSalaryMonthly: 5000 };
      const input2 = { currentAge: 30, grossSalaryMonthly: 6000 };
      
      const result1 = { finalWealth: 100000 };
      const result2 = { finalWealth: 120000 };

      setCachedSimulation(input1, result1);
      setCachedSimulation(input2, result2);

      assert.deepStrictEqual(getCachedSimulation(input1), result1);
      assert.deepStrictEqual(getCachedSimulation(input2), result2);
    });
  });

  describe('cache invalidation', () => {
    it('should clear entire cache', () => {
      const input = { currentAge: 30, grossSalaryMonthly: 5000 };
      const result = { finalWealth: 100000 };

      setCachedSimulation(input, result);
      assert.deepStrictEqual(getCachedSimulation(input), result);

      clearSimulationCache();
      assert.strictEqual(getCachedSimulation(input), null);
    });

    it('should invalidate cache when specific input changes', () => {
      const input = { currentAge: 30, grossSalaryMonthly: 5000 };
      const result = { finalWealth: 100000 };

      setCachedSimulation(input, result);
      assert.deepStrictEqual(getCachedSimulation(input), result);

      invalidateSimulationCache(input);
      assert.strictEqual(getCachedSimulation(input), null);
    });

    it('should only invalidate matching cache entries', () => {
      const input1 = { currentAge: 30, grossSalaryMonthly: 5000 };
      const input2 = { currentAge: 30, grossSalaryMonthly: 6000 };
      
      const result1 = { finalWealth: 100000 };
      const result2 = { finalWealth: 120000 };

      setCachedSimulation(input1, result1);
      setCachedSimulation(input2, result2);

      invalidateSimulationCache(input1);

      assert.strictEqual(getCachedSimulation(input1), null);
      assert.deepStrictEqual(getCachedSimulation(input2), result2);
    });
  });

  describe('cache key generation', () => {
    it('should generate same cache key for equivalent inputs', () => {
      const input1 = { currentAge: 30, grossSalaryMonthly: 5000, monthlyExpenses: 2000 };
      const input2 = { currentAge: 30, grossSalaryMonthly: 5000, monthlyExpenses: 2000 };
      
      const result = { finalWealth: 100000 };

      setCachedSimulation(input1, result);
      assert.deepStrictEqual(getCachedSimulation(input2), result);
    });

    it('should handle null and undefined values consistently', () => {
      const input1 = { currentAge: 30, grossSalaryMonthly: 5000, totalDebt: null };
      const input2 = { currentAge: 30, grossSalaryMonthly: 5000, totalDebt: undefined };
      
      const result = { finalWealth: 100000 };

      setCachedSimulation(input1, result);
      // Should treat null and undefined as equivalent for caching
      assert.deepStrictEqual(getCachedSimulation(input2), result);
    });

    it('should be sensitive to numerical precision', () => {
      const input1 = { grossSalaryMonthly: 5000.00 };
      const input2 = { grossSalaryMonthly: 5000.01 };
      
      const result1 = { finalWealth: 100000 };
      const result2 = { finalWealth: 100001 };

      setCachedSimulation(input1, result1);
      setCachedSimulation(input2, result2);

      assert.deepStrictEqual(getCachedSimulation(input1), result1);
      assert.deepStrictEqual(getCachedSimulation(input2), result2);
    });
  });

  describe('cache performance and stats', () => {
    it('should track cache statistics', () => {
      const input = { currentAge: 30, grossSalaryMonthly: 5000 };
      const result = { finalWealth: 100000 };

      // Initial stats
      let stats = getSimulationCacheStats();
      assert.strictEqual(stats.entries, 0);
      assert.strictEqual(stats.hits, 0);
      assert.strictEqual(stats.misses, 0);

      // Cache miss
      getCachedSimulation(input);
      stats = getSimulationCacheStats();
      assert.strictEqual(stats.misses, 1);

      // Cache set
      setCachedSimulation(input, result);
      stats = getSimulationCacheStats();
      assert.strictEqual(stats.entries, 1);

      // Cache hit
      getCachedSimulation(input);
      stats = getSimulationCacheStats();
      assert.strictEqual(stats.hits, 1);
    });

    it('should limit cache size to prevent memory issues', () => {
      // Create many cache entries to test size limits
      for (let i = 0; i < 150; i++) {
        const input = { currentAge: 30 + i, grossSalaryMonthly: 5000 };
        const result = { finalWealth: 100000 + i * 1000 };
        setCachedSimulation(input, result);
      }

      const stats = getSimulationCacheStats();
      // Should not exceed maximum cache size (100 entries)
      assert.ok(stats.entries <= 100);
    });

    it('should evict oldest entries when cache limit reached', () => {
      // Fill cache to limit
      for (let i = 0; i < 100; i++) {
        const input = { currentAge: 30 + i, grossSalaryMonthly: 5000 };
        const result = { finalWealth: 100000 + i * 1000 };
        setCachedSimulation(input, result);
      }

      // Cache should be at limit
      let stats = getSimulationCacheStats();
      assert.strictEqual(stats.entries, 100);

      // Add one more entry to trigger eviction
      const newInput = { currentAge: 130, grossSalaryMonthly: 5000 };
      const newResult = { finalWealth: 200000 };
      setCachedSimulation(newInput, newResult);

      // Cache should still be at limit (evicted one, added one)
      stats = getSimulationCacheStats();
      assert.strictEqual(stats.entries, 100);

      // First entry should now be evicted
      const firstInput = { currentAge: 30, grossSalaryMonthly: 5000 };
      assert.strictEqual(getCachedSimulation(firstInput), null);
      // New entry should be cached
      assert.deepStrictEqual(getCachedSimulation(newInput), newResult);
    });
  });

  describe('memory management', () => {
    it('should handle large simulation datasets efficiently', () => {
      const input = { currentAge: 30, grossSalaryMonthly: 5000 };
      
      // Create large simulation result (50 years of data)
      const simulation: any[] = [];
      for (let age = 30; age <= 80; age++) {
        simulation.push({
          age,
          savings: age * 1000,
          investments: age * 2000,
          debt: Math.max(0, 10000 - (age - 30) * 500),
          phase: age < 40 ? 'debt' : age < 50 ? 'emergency' : 'retirement'
        });
      }
      
      const result = { 
        age: 65, 
        simulation, 
        finalWealth: simulation[simulation.length - 1].savings + simulation[simulation.length - 1].investments 
      };

      // Should handle large datasets without throwing
      assert.doesNotThrow(() => {
        setCachedSimulation(input, result);
        const retrieved = getCachedSimulation(input);
        assert.deepStrictEqual(retrieved, result);
      });
    });
  });
});
