/**
 * @fileoverview Summary Cards Module
 * 
 * Creates overview cards displaying key financial metrics and milestones.
 * This module provides a clear summary of income, expenses, emergency fund targets,
 * and major financial milestones (debt-free date, retirement age, final wealth).
 */

import { createElement, batchDOMUpdates } from '../utils/dom-helpers.js';
import { formatMoney } from '../utils/formatting/currency.js';

/**
 * Create income section for overview card
 * 
 * @param {any} summaryData - Financial summary data
 * @returns {HTMLElement} Income section element
 */
function createIncomeSection(summaryData) {
  const { grossSalaryMonthly, netSalaryMonthly0, netSalaryMonthly1, taxRate } = summaryData;
  const incomeSection = createElement('div', { className: 'overview-section' });
  
  const grossIncomeItem = createElement('p', { className: 'overview-item' });
  grossIncomeItem.innerHTML = `<strong>Gross Salary Income (Monthly):</strong> ${formatMoney(grossSalaryMonthly)}`;
  
  const netIncome0Item = createElement('p', { className: 'overview-item' });
  netIncome0Item.innerHTML = `<strong>Net Salary Income (Years 1-2, Tax-Free):</strong> ${formatMoney(netSalaryMonthly0)}`;
  
  const netIncome1Item = createElement('p', { className: 'overview-item' });
  netIncome1Item.innerHTML = `<strong>Net Salary Income (After 2 Years, ${Math.round(taxRate * 100)}% Tax):</strong> ${formatMoney(netSalaryMonthly1)}`;
  
  incomeSection.appendChild(grossIncomeItem);
  incomeSection.appendChild(netIncome0Item);
  incomeSection.appendChild(netIncome1Item);
  
  return incomeSection;
}

/**
 * Create expenses section for overview card
 * 
 * @param {any} summaryData - Financial summary data
 * @returns {HTMLElement} Expenses section element
 */
function createExpensesSection(summaryData) {
  const { monthlyExpenses, emergencyFundTarget } = summaryData;
  const expensesSection = createElement('div', { className: 'overview-section' });
  
  const expensesItem = createElement('p', { className: 'overview-item' });
  expensesItem.innerHTML = `<strong>Total Monthly Expenses:</strong> ${formatMoney(monthlyExpenses)}`;
  
  const emergencyFundItem = createElement('p', { className: 'overview-item' });
  emergencyFundItem.innerHTML = `<strong>Emergency Fund Target:</strong> ${formatMoney(emergencyFundTarget)}`;
  
  expensesSection.appendChild(expensesItem);
  expensesSection.appendChild(emergencyFundItem);
  
  return expensesSection;
}

/**
 * Create financial overview card showing income, expenses, and emergency fund target
 * 
 * @param {any} summaryData - Financial summary data
 * @returns {HTMLElement} Overview card element
 */
export function createOverviewCard(summaryData) {
  // Basic validation - ensure we have the required object
  if (!summaryData || typeof summaryData !== 'object') {
    throw new Error('summaryData must be an object');
  }
  
  const card = createElement('div', { className: 'summary-card overview-card' });
  const header = createElement('h2', { 
    textContent: 'Financial Plan Overview',
    className: 'summary-card-title'
  });
  const content = createElement('div', { className: 'overview-content' });
  
  content.appendChild(createIncomeSection(summaryData));
  content.appendChild(createExpensesSection(summaryData));
  
  card.appendChild(header);
  card.appendChild(content);
  
  return card;
}

/**
 * Create complete summary cards container
 * 
 * @param {any} summaryData - Financial summary data
 * @param {any} _milestones - Milestone data (unused in basic implementation)
 * @returns {HTMLElement} Container with summary cards
 */
export function createSummaryCards(summaryData, _milestones) {
  const container = createElement('div', { className: 'summary-cards-container' });
  const overviewCard = createOverviewCard(summaryData);
  
  batchDOMUpdates(() => {
    container.appendChild(overviewCard);
  });
  
  return container;
}
