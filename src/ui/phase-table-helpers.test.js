/**
 * @fileoverview Tests for Phase Table Helper Functions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createAgeCell, createSavingsCells, createInvestmentCells, createWealthCells } from './phase-table-helpers.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

describe('createAgeCell', () => {
  it('should create age cell with years from now indicator', () => {
    const yearData = { age: 35, yearsFromNow: 5 };
    const cell = createAgeCell(yearData);
    
    assert.strictEqual(cell.tagName, 'TD');
    assert(cell.innerHTML.includes('35'));
    assert(cell.innerHTML.includes('(5)'));
    assert(cell.innerHTML.includes('color: #94a3b8'));
  });
  
  it('should handle year 0 correctly', () => {
    const yearData = { age: 30, yearsFromNow: 0 };
    const cell = createAgeCell(yearData);
    
    assert(cell.innerHTML.includes('30'));
    assert(cell.innerHTML.includes('(0)'));
  });
});

describe('createSavingsCells', () => {
  it('should create savings and delta cells', () => {
    const yearData = { savings: 15000 };
    const previousData = { savings: 12000 };
    const [savingsCell, deltaCell] = createSavingsCells(yearData, previousData);
    
    assert.strictEqual(savingsCell.tagName, 'TD');
    assert.strictEqual(deltaCell.tagName, 'TD');
    assert(savingsCell.textContent.includes('€15,000'));
    assert(deltaCell.innerHTML.includes('+ €3,000'));
  });
  
  it('should handle no previous data', () => {
    const yearData = { savings: 15000 };
    const [savingsCell, deltaCell] = createSavingsCells(yearData, null);
    
    assert(savingsCell.textContent.includes('€15,000'));
    assert.strictEqual(deltaCell.innerHTML, '');
  });
});

describe('createInvestmentCells', () => {
  it('should create investment and delta cells', () => {
    const yearData = { investments: 25000 };
    const previousData = { investments: 20000 };
    const [investmentsCell, deltaCell] = createInvestmentCells(yearData, previousData);
    
    assert.strictEqual(investmentsCell.tagName, 'TD');
    assert.strictEqual(deltaCell.tagName, 'TD');
    assert(investmentsCell.textContent.includes('€25,000'));
    assert(deltaCell.innerHTML.includes('+ €5,000'));
  });
  
  it('should handle negative delta', () => {
    const yearData = { investments: 18000 };
    const previousData = { investments: 20000 };
    const [, deltaCell] = createInvestmentCells(yearData, previousData);
    
    assert(deltaCell.innerHTML.includes('- €2,000'));
    assert(deltaCell.innerHTML.includes('#ef4444'));
  });
});

describe('createWealthCells', () => {
  it('should create income and wealth cells with net income', () => {
    const yearData = { 
      savings: 15000, 
      investments: 25000, 
      investmentNetIncome: 1500 
    };
    const [incomeCell, wealthCell] = createWealthCells(yearData, 0.2);
    
    assert.strictEqual(incomeCell.tagName, 'TD');
    assert.strictEqual(wealthCell.tagName, 'TD');
    assert(incomeCell.textContent.includes('€1,500'));
    assert(wealthCell.innerHTML.includes('€40,000'));
    assert(wealthCell.innerHTML.includes('<strong>'));
  });
  
  it('should calculate net income from gross', () => {
    const yearData = { 
      savings: 10000, 
      investments: 20000, 
      investmentGrossIncome: 2000 
    };
    const [incomeCell] = createWealthCells(yearData, 0.25);
    
    assert(incomeCell.textContent.includes('€1,500')); // 2000 * (1 - 0.25)
  });
  
  it('should handle zero investment income', () => {
    const yearData = { savings: 5000, investments: 0 };
    const [incomeCell, wealthCell] = createWealthCells(yearData, 0.2);
    
    assert(incomeCell.textContent.includes('€0'));
    assert(wealthCell.innerHTML.includes('€5,000'));
  });
});
