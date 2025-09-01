/**
 * @fileoverview Phase Table Row Creation Helpers
 * 
 * Helper functions for creating individual table rows and cells
 * with proper formatting and delta calculations.
 */

import { createElement } from '../utils/dom-helpers.js';
import { formatMoney } from '../utils/formatting/currency.js';
import { formatDelta } from '../utils/formatting/growth.js';

/**
 * Creates age cell with years from now indicator
 * 
 */
export function createAgeCell(yearData: any): HTMLElement {
  const ageCell = createElement('td');
  ageCell.innerHTML = `${yearData.age} <span style="color: #94a3b8; font-size: 0.85em;">(${yearData.yearsFromNow})</span>`;
  return ageCell;
}

/**
 * Creates savings cells (balance and delta)
 * 
 */
export function createSavingsCells(yearData: any, previousYearData: any | null): HTMLElement {
  const savingsCell = createElement('td', {
    textContent: formatMoney(yearData.savings)
  });
  
  const savingsDeltaCell = createElement('td');
  savingsDeltaCell.innerHTML = formatDelta(yearData.savings, previousYearData?.savings ?? null);
  
  return [savingsCell, savingsDeltaCell];
}

/**
 * Creates investment cells (balance and delta)
 * 
 */
export function createInvestmentCells(yearData: any, previousYearData: any | null): HTMLElement {
  const investmentsCell = createElement('td', {
    textContent: formatMoney(yearData.investments)
  });
  
  const investmentsDeltaCell = createElement('td');
  investmentsDeltaCell.innerHTML = formatDelta(yearData.investments, previousYearData?.investments ?? null);
  
  return [investmentsCell, investmentsDeltaCell];
}

/**
 * Creates investment income and total wealth cells
 * 
 */
export function createWealthCells(yearData: any, taxRate: number): HTMLElement {
  const investmentIncome = yearData.investmentNetIncome || 
                          (yearData.investmentGrossIncome ? yearData.investmentGrossIncome * (1 - taxRate) : 0);
  
  const incomeCell = createElement('td', {
    textContent: formatMoney(investmentIncome)
  });
  
  const totalWealth = yearData.savings + yearData.investments;
  const wealthCell = createElement('td');
  wealthCell.innerHTML = `<strong>${formatMoney(totalWealth)}</strong>`;
  
  return [incomeCell, wealthCell];
}
