/**
 * @fileoverview Wealth Trajectory Chart Module
 * 
 * Creates interactive Canvas-based wealth trajectory charts using μPlot library.
 * Visualizes debt, savings, investments, and net wealth over time with phase transitions.
 */

import { createElement, batchDOMUpdates } from '../utils/dom-helpers.js';
import { formatMoney } from '../utils/formatting/currency.js';
import { Type } from '@sinclair/typebox';
import { validate } from '../lib/validators.js';

// Input validation schema
const SimulationDataSchema = Type.Array(
  Type.Object({
    age: Type.Number({ minimum: 18, maximum: 120 }),
    debt: Type.Number({ minimum: 0 }),
    savings: Type.Number({ minimum: 0 }),
    investments: Type.Number({ minimum: 0 }),
    phase: Type.String()
  })
);

/**
 * Transforms simulation data into uPlot format
 * @param {any[]} simulationData - Array of yearly simulation results
 * @returns {number[][]} Array of series data for uPlot
 */
export function transformDataForChart(simulationData) {
  if (!Array.isArray(simulationData) || simulationData.length === 0) {
    return [[], [], [], [], []];
  }

  const ages = simulationData.map(d => d.age);
  const debt = simulationData.map(d => d.debt);
  const savings = simulationData.map(d => d.savings);
  const investments = simulationData.map(d => d.investments);
  const wealth = simulationData.map(d => (d.savings + d.investments) - d.debt);

  return [ages, debt, savings, investments, wealth];
}

/**
 * Formats chart tooltip content
 * @param {any} data - Data point with age, debt, savings, investments, wealth, phase
 * @returns {string} HTML string for tooltip
 */
export function formatChartTooltip(data) {
  const { age, debt, savings, investments, wealth, phase } = data;
  
  return `
    <div class="chart-tooltip">
      <div class="tooltip-header">Age: ${age}</div>
      <div class="tooltip-row">Debt: ${formatMoney(debt)}</div>
      <div class="tooltip-row">Savings: ${formatMoney(savings)}</div>
      <div class="tooltip-row">Investments: ${formatMoney(investments)}</div>
      <div class="tooltip-row">Net Wealth: ${formatMoney(wealth)}</div>
      <div class="tooltip-phase">Phase: ${phase}</div>
    </div>
  `;
}

/**
 * Creates an interactive wealth trajectory chart placeholder
 * @param {any[]} simulationData - Array of yearly simulation results
 * @returns {HTMLElement} Chart container element
 */
export function createWealthChart(simulationData) {
  validate(SimulationDataSchema, simulationData);

  const container = createElement('div', { className: 'wealth-chart-container' });
  const chartElement = createElement('div', { className: 'wealth-chart' });
  
  const chartData = transformDataForChart(simulationData);
  
  batchDOMUpdates(() => {
    container.appendChild(chartElement);
    
    if (chartData && chartData[0] && chartData[0].length > 0) {
      chartElement.innerHTML = '<p>Interactive chart will be implemented with μPlot</p>';
    } else {
      chartElement.innerHTML = '<p>No data available for chart</p>';
    }
  });

  return container;
}
