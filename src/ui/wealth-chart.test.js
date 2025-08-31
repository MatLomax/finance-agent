/**
 * @fileoverview Tests for Wealth Chart Module
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createWealthChart, transformDataForChart, formatChartTooltip } from './wealth-chart.js';

// Test environment setup
let dom, document, window, uplot;

beforeEach(() => {
  dom = new JSDOM('<!DOCTYPE html><html><body><div id="chart-container"></div></body></html>');
  document = dom.window.document;
  window = dom.window;
  global.document = document;
  global.window = window;
  global.HTMLElement = window.HTMLElement;
  global.Element = window.Element;
  
  // Mock requestAnimationFrame for DOM batch updates
  global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 0);
  };
  global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
  
  // Mock uPlot for testing
  uplot = class MockUPlot {
    constructor(opts, data, target) {
      this.opts = opts;
      this.data = data;
      this.target = target;
      this.destroyed = false;
    }
    
    destroy() {
      this.destroyed = true;
    }
    
    setData(data) {
      this.data = data;
    }
  };
  global.uPlot = uplot;
});

afterEach(() => {
  delete global.document;
  delete global.window;
  delete global.HTMLElement;
  delete global.Element;
  delete global.uPlot;
  delete global.requestAnimationFrame;
  delete global.cancelAnimationFrame;
});

describe('transformDataForChart', () => {
  it('should transform simulation data into uPlot format', () => {
    const simulationData = [
      { age: 30, debt: 50000, savings: 10000, investments: 5000, phase: 'debt' },
      { age: 31, debt: 40000, savings: 15000, investments: 8000, phase: 'debt' },
      { age: 32, debt: 0, savings: 20000, investments: 12000, phase: 'emergency' },
      { age: 33, debt: 0, savings: 25000, investments: 18000, phase: 'retirement' }
    ];

    const result = transformDataForChart(simulationData);

    assert.ok(Array.isArray(result), 'Result should be an array');
    assert.strictEqual(result.length, 5, 'Should have 5 series: age, debt, savings, investments, wealth');
    assert.deepStrictEqual(result[0], [30, 31, 32, 33], 'First series should be ages');
    assert.deepStrictEqual(result[1], [50000, 40000, 0, 0], 'Second series should be debt');
    assert.deepStrictEqual(result[2], [10000, 15000, 20000, 25000], 'Third series should be savings');
    assert.deepStrictEqual(result[3], [5000, 8000, 12000, 18000], 'Fourth series should be investments');
    assert.deepStrictEqual(result[4], [-35000, -17000, 32000, 43000], 'Fifth series should be net wealth');
  });

  it('should handle empty simulation data', () => {
    const result = transformDataForChart([]);
    assert.deepStrictEqual(result, [[], [], [], [], []], 'Should return empty arrays for all series');
  });
});

describe('formatChartTooltip', () => {
  it('should format tooltip with all series data', () => {
    const result = formatChartTooltip({
      age: 30,
      debt: 50000,
      savings: 10000,
      investments: 5000,
      wealth: -35000,
      phase: 'debt'
    });

    assert.ok(result.includes('Age: 30'), 'Should include age');
    assert.ok(result.includes('€50,000'), 'Should include formatted debt');
    assert.ok(result.includes('€10,000'), 'Should include formatted savings');
    assert.ok(result.includes('€5,000'), 'Should include formatted investments');
    assert.ok(result.includes('€-35,000'), 'Should include formatted wealth');
    assert.ok(result.includes('debt'), 'Should include phase information');
  });

  it('should handle positive wealth values', () => {
    const result = formatChartTooltip({
      age: 35,
      debt: 0,
      savings: 30000,
      investments: 25000,
      wealth: 55000,
      phase: 'retirement'
    });

    assert.ok(result.includes('€55,000'), 'Should format positive wealth correctly');
    assert.ok(result.includes('retirement'), 'Should show retirement phase');
  });
});

describe('createWealthChart', () => {
  it('should create a chart container with proper structure', async () => {
    const simulationData = [
      { age: 30, debt: 50000, savings: 10000, investments: 5000, phase: 'debt' },
      { age: 31, debt: 40000, savings: 15000, investments: 8000, phase: 'debt' }
    ];

    const container = createWealthChart(simulationData);

    assert.ok(container instanceof window.HTMLElement, 'Should return an HTMLElement');
    assert.strictEqual(container.className, 'wealth-chart-container', 'Should have correct CSS class');
    
    // Wait for batch DOM updates to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // The chart element should be inside the container
    const chartElement = container.querySelector('.wealth-chart');
    assert.ok(chartElement, 'Should contain chart element');
  });

  it('should handle empty simulation data gracefully', async () => {
    const container = createWealthChart([]);
    
    // Wait for batch DOM updates to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    
    assert.ok(container instanceof window.HTMLElement, 'Should return an HTMLElement even with empty data');
  });

  it('should throw error for invalid input', () => {
    assert.throws(
      () => createWealthChart(null),
      /Validation failed/,
      'Should throw validation error for null input'
    );

    assert.throws(
      () => createWealthChart('invalid'),
      /Validation failed/,
      'Should throw validation error for non-array input'
    );
  });
});
