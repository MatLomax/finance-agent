/**
 * @fileoverview Tests for observer pattern implementation
 * 
 * Tests the observer pattern used for state change notifications
 * to enable loose coupling between data and UI layers.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { addObserver, removeObserver, notifyObservers } from './observers.js';

describe('Observer Pattern', () => {
  // Test helper to track observer calls
  let observerCalls = [];
  
  function testObserver(data: any, previous: any) {
    observerCalls.push({ data, previous });
  }
  
  function anotherObserver(data: any) {
    observerCalls.push({ data, source: 'another' });
  }
  
  // Reset before each test
  function resetObservers() {
    observerCalls = [];
    // Remove any existing observers by testing removal until it returns false
    while (removeObserver(testObserver)) { /* remove all instances */ }
    while (removeObserver(anotherObserver)) { /* remove all instances */ }
  }
  
  describe('addObserver', () => {
    it('should add observer function', () => {
      resetObservers();
      
      addObserver(testObserver);
      
      notifyObservers({ balance: 1000 });
      assert.strictEqual(observerCalls.length, 1);
      assert.deepStrictEqual(observerCalls[0]?.data, { balance: 1000 });
    });
    
    it('should throw error for non-function parameter', () => {
      assert.throws(() => {
        addObserver('not a function');
      }, TypeError);
      
      assert.throws(() => {
        addObserver(null);
      }, TypeError);
      
      assert.throws(() => {
        addObserver(123);
      }, TypeError);
    });
    
    it('should allow multiple observers', () => {
      resetObservers();
      
      addObserver(testObserver);
      addObserver(anotherObserver);
      
      notifyObservers({ balance: 2000 });
      
      assert.strictEqual(observerCalls.length, 2);
      assert.deepStrictEqual(observerCalls[0]?.data, { balance: 2000 });
      assert.deepStrictEqual(observerCalls[1]?.data, { balance: 2000 });
      assert.strictEqual(observerCalls[1]?.source, 'another');
    });
  });
  
  describe('removeObserver', () => {
    it('should remove existing observer', () => {
      resetObservers();
      
      addObserver(testObserver);
      const removed = removeObserver(testObserver);
      
      assert.strictEqual(removed, true);
      
      notifyObservers({ balance: 3000 });
      assert.strictEqual(observerCalls.length, 0);
    });
    
    it('should return false for non-existent observer', () => {
      resetObservers();
      
      const removed = removeObserver(testObserver);
      assert.strictEqual(removed, false);
    });
    
    it('should only remove specified observer', () => {
      resetObservers();
      
      addObserver(testObserver);
      addObserver(anotherObserver);
      
      const removed = removeObserver(testObserver);
      assert.strictEqual(removed, true);
      
      notifyObservers({ balance: 4000 });
      assert.strictEqual(observerCalls.length, 1);
      assert.strictEqual(observerCalls[0]?.source, 'another');
    });
  });
  
  describe('notifyObservers', () => {
    it('should notify all observers with data', () => {
      resetObservers();
      
      addObserver(testObserver);
      addObserver(anotherObserver);
      
      const data = { balance: 5000, debt: 2000 };
      notifyObservers(data);
      
      assert.strictEqual(observerCalls.length, 2);
      assert.deepStrictEqual(observerCalls[0]?.data, data);
      assert.deepStrictEqual(observerCalls[1]?.data, data);
    });
    
    it('should pass previous data to observers', () => {
      resetObservers();
      
      addObserver(testObserver);
      
      const newData = { balance: 6000 };
      const previousData = { balance: 5000 };
      notifyObservers(newData, previousData);
      
      assert.strictEqual(observerCalls.length, 1);
      assert.deepStrictEqual(observerCalls[0]?.data, newData);
      assert.deepStrictEqual(observerCalls[0]?.previous, previousData);
    });
    
    it('should handle observer errors gracefully', () => {
      resetObservers();
      
      // Add an observer that throws an error
      function errorObserver() {
        throw new Error('Observer error');
      }
      
      addObserver(errorObserver);
      addObserver(testObserver);
      
      // Should not throw and should still notify good observers
      assert.doesNotThrow(() => {
        notifyObservers({ balance: 7000 });
      });
      
      assert.strictEqual(observerCalls.length, 1);
      assert.deepStrictEqual(observerCalls[0]?.data, { balance: 7000 });
    });
    
    it('should work with no observers', () => {
      resetObservers();
      
      assert.doesNotThrow(() => {
        notifyObservers({ balance: 8000 });
      });
    });
    
    it('should handle complex data structures', () => {
      resetObservers();
      
      addObserver(testObserver);
      
      const complexData = {
        user: { age: 30, income: 50000 },
        accounts: [
          { type: 'savings', balance: 10000 },
          { type: 'investment', balance: 25000 }
        ],
        goals: { retirement: { target: 1000000, timeline: 35 } }
      };
      
      notifyObservers(complexData);
      
      assert.strictEqual(observerCalls.length, 1);
      assert.deepStrictEqual(observerCalls[0]?.data, complexData);
    });
  });
});
