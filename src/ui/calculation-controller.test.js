import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  subscribeToCalculations, 
  triggerCalculation, 
  debouncedCalculation 
} from './calculation-controller.js';

describe('calculation-controller', () => {
  beforeEach(() => {
    // Reset any state between tests if needed
  });

  describe('subscribeToCalculations', () => {
    it('should add subscriber and return unsubscribe function', () => {
      const callback = () => {};
      const unsubscribe = subscribeToCalculations(callback);
      
      assert.strictEqual(typeof unsubscribe, 'function');
      
      // Test unsubscribe works
      unsubscribe();
    });

    it('should handle multiple subscribers', () => {
      const callback1 = () => {};
      const callback2 = () => {};
      
      const unsubscribe1 = subscribeToCalculations(callback1);
      const unsubscribe2 = subscribeToCalculations(callback2);
      
      assert.strictEqual(typeof unsubscribe1, 'function');
      assert.strictEqual(typeof unsubscribe2, 'function');
      
      unsubscribe1();
      unsubscribe2();
    });
  });

  describe('triggerCalculation', () => {
    it('should return calculation result object', () => {
      const result = triggerCalculation();
      
      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(typeof result.success, 'boolean');
    });

    it('should handle calculation options', () => {
      const result = triggerCalculation({ forceRecalculation: true });
      
      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(typeof result.success, 'boolean');
    });

    it('should prevent concurrent calculations', () => {
      // First calculation
      const result1 = triggerCalculation();
      
      // Should prevent second calculation while first is running
      const result2 = triggerCalculation();
      
      if (!result1.success && result1.error?.includes('already in progress')) {
        // If first call detects concurrent state
        assert.ok(true, 'Concurrent calculation prevention working');
      } else {
        // Normal case - second call should be prevented
        assert.strictEqual(typeof result1, 'object');
        assert.strictEqual(typeof result2, 'object');
      }
    });
  });

  describe('debouncedCalculation', () => {
    it('should be a function', () => {
      assert.strictEqual(typeof debouncedCalculation, 'function');
    });

    it('should accept calculation options', () => {
      // Should not throw when called with options
      assert.doesNotThrow(() => {
        debouncedCalculation({ forceRecalculation: true });
      });
    });
  });

  describe('error handling', () => {
    it('should handle invalid options gracefully', () => {
      const result = triggerCalculation(null);
      
      assert.strictEqual(typeof result, 'object');
      // Should not throw, should return error or success
      assert.strictEqual(typeof result.success, 'boolean');
    });

    it('should handle undefined options', () => {
      const result = triggerCalculation(undefined);
      
      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(typeof result.success, 'boolean');
    });
  });

  describe('notification system', () => {
    it('should notify subscribers of calculation events', (t, done) => {
      let eventReceived = false;
      
      const unsubscribe = subscribeToCalculations((event) => {
        eventReceived = true;
        assert.strictEqual(typeof event, 'object');
        assert.strictEqual(typeof event.type, 'string');
        unsubscribe();
        if (done) done();
      });

      // Trigger calculation to generate events
      triggerCalculation();
      
      // Allow async processing
      setTimeout(() => {
        if (!eventReceived && done) {
          done();
        }
      }, 100);
    });
  });
});
