/**
 * @fileoverview Phase Tables Module
 * 
 * Creates dynamic table generation for each financial phase with year-by-year breakdown,
 * formatted numbers, delta calculations, and milestone highlighting.
 */

import { createElement } from '../utils/dom-helpers.js';
import { formatMoney } from '../utils/formatting/currency.js';
import { createAgeCell, createSavingsCells, createInvestmentCells, createWealthCells } from './phase-table-helpers.js';
import { Type } from '@sinclair/typebox';
import { validate } from '../lib/validators.js';

const PhaseDataSchema = Type.Array(Type.Object({
  age: Type.Number({ minimum: 18, maximum: 120 }),
  debt: Type.Number({ minimum: 0 }),
  savings: Type.Number({ minimum: 0 }),
  investments: Type.Number({ minimum: 0 }),
  yearsFromNow: Type.Number({ minimum: 0 })
}));

/**
 * Creates table header with appropriate columns
 * 
 * @param {boolean} includeDebt - Whether to include debt column
 * @returns {HTMLElement} Table header element
 */
function createTableHeader(includeDebt) {
  const thead = createElement('thead');
  const headerRow = createElement('tr');
  
  const columns = [
    'Age',
    ...(includeDebt ? ['Remaining Debt'] : []),
    'Total Savings', 'Savings Δ', 'Total Investments', 'Investments Δ', 'Investment Net Income', 'Total Wealth'
  ];
  
  columns.forEach(text => {
    const th = createElement('th', { textContent: text });
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  return thead;
}

/**
 * Creates a single table row
 * 
 * @param {any} yearData - Year data object
 * @param {any|null} previousYearData - Previous year for deltas
 * @param {boolean} includeDebt - Whether to include debt column
 * @param {boolean} isLastYear - Whether this is milestone row
 * @param {number} taxRate - Tax rate for calculations
 * @returns {HTMLElement} Table row element
 */
function createTableRow(yearData, previousYearData, includeDebt, isLastYear, taxRate) {
  const row = createElement('tr', { className: isLastYear ? 'milestone-row' : '' });
  
  row.appendChild(createAgeCell(yearData));
  
  if (includeDebt) {
    const debtCell = createElement('td', { textContent: formatMoney(yearData.debt) });
    row.appendChild(debtCell);
  }
  
  const [savingsCell, savingsDeltaCell] = createSavingsCells(yearData, previousYearData);
  const [investmentsCell, investmentsDeltaCell] = createInvestmentCells(yearData, previousYearData);
  const [incomeCell, wealthCell] = createWealthCells(yearData, taxRate);
  
  row.appendChild(savingsCell);
  row.appendChild(savingsDeltaCell);
  row.appendChild(investmentsCell);
  row.appendChild(investmentsDeltaCell);
  row.appendChild(incomeCell);
  row.appendChild(wealthCell);
  
  return row;
}

/**
 * Creates a complete phase table
 * 
 * @param {any[]} phaseData - Array of year data
 * @param {any} phaseConfig - Phase configuration
 * @param {any|null} previousPhaseLastRow - Last row from previous phase
 * @param {number} taxRate - Tax rate for calculations
 * @returns {HTMLElement} Complete phase card with table
 */
export function createPhaseTable(phaseData, phaseConfig, previousPhaseLastRow = null, taxRate = 0.15) {
  validate(PhaseDataSchema, phaseData);
  
  if (phaseData.length === 0) return createElement('div');
  
  const phaseCard = createElement('div', { className: 'phase-card' });
  const header = createElement('div', { className: 'phase-card-header' });
  const title = createElement('h3');
  title.innerHTML = `${phaseConfig.icon} ${phaseConfig.title}`;
  header.appendChild(title);
  phaseCard.appendChild(header);
  
  const table = createElement('table');
  table.appendChild(createTableHeader(phaseConfig.includeDebt));
  
  const tbody = createElement('tbody');
  phaseData.forEach((yearData, index) => {
    const previousYear = index === 0 ? previousPhaseLastRow : phaseData[index - 1];
    const isLastYear = index === phaseData.length - 1;
    const row = createTableRow(yearData, previousYear, phaseConfig.includeDebt, isLastYear, taxRate);
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  phaseCard.appendChild(table);
  return phaseCard;
}
