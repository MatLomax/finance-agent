/**
 * @fileoverview Phase Tables Module
 * 
 * Creates dynamic table generation for each financial phase with year-by-year breakdown,
 * formatted numbers, delta calculations, and milestone highlighting.
 */

import { createElement } from '../utils/dom-helpers.js';
import { formatMoney } from '../utils/formatting/currency.js';
import { createAgeCell, createSavingsCells, createInvestmentCells, createWealthCells } from './phase-table-helpers.js';

/**
 * Creates table header with appropriate columns
 * 
 */
function createTableHeader(includeDebt: boolean): HTMLElement {
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
 */
function createTableRow(yearData: any, previousYearData: any | null, includeDebt: boolean, isLastYear: boolean, taxRate: number): HTMLElement {
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
 */
export function createPhaseTable(phaseData: any[], phaseConfig: any, previousPhaseLastRow: any | null = null, taxRate: number = 0.15): HTMLElement {
  // Basic validation - ensure we have an array
  if (!Array.isArray(phaseData)) {
    throw new Error('phaseData must be an array');
  }
  
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
