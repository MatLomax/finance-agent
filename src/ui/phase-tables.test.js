/**
 * @fileoverview Tests for Phase Tables Module
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createPhaseTable } from './phase-tables.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

describe('createPhaseTable', () => {
  const samplePhaseData = [
    { age: 30, debt: 5000, savings: 2000, investments: 1000, yearsFromNow: 0 },
    { age: 31, debt: 3000, savings: 4000, investments: 2000, yearsFromNow: 1 },
    { age: 32, debt: 0, savings: 6000, investments: 4000, yearsFromNow: 2 }
  ];
  
  const debtPhaseConfig = {
    title: 'Debt Elimination',
    icon: '🎯',
    includeDebt: true
  };
  
  it('should create complete phase table with debt column', () => {
    const table = createPhaseTable(samplePhaseData, debtPhaseConfig);
    
    assert.strictEqual(table.className, 'phase-card');
    
    const header = table.querySelector('h3');
    assert(header.innerHTML.includes('🎯'));
    assert(header.innerHTML.includes('Debt Elimination'));
    
    const tableElement = table.querySelector('table');
    assert(tableElement);
    
    const headerRow = tableElement.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    assert.strictEqual(headerCells.length, 8); // Including debt column
    assert.strictEqual(headerCells[1].textContent, 'Remaining Debt');
  });
  
  it('should create table without debt column for non-debt phases', () => {
    const emergencyConfig = {
      title: 'Emergency Fund',
      icon: '🛡️',
      includeDebt: false
    };
    
    const table = createPhaseTable(samplePhaseData, emergencyConfig);
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    
    assert.strictEqual(headerCells.length, 7); // Without debt column
    assert.strictEqual(headerCells[1].textContent, 'Total Savings');
  });
  
  it('should mark last row as milestone', () => {
    const table = createPhaseTable(samplePhaseData, debtPhaseConfig);
    const rows = table.querySelectorAll('tbody tr');
    
    assert.strictEqual(rows.length, 3);
    assert.strictEqual(rows[2].className, 'milestone-row');
    assert.strictEqual(rows[0].className, '');
    assert.strictEqual(rows[1].className, '');
  });
  
  it('should return empty div for empty phase data', () => {
    const emptyTable = createPhaseTable([], debtPhaseConfig);
    
    assert.strictEqual(emptyTable.tagName, 'DIV');
    assert.strictEqual(emptyTable.children.length, 0);
  });
  
  it('should handle investment income calculation', () => {
    const phaseDataWithIncome = [
      { 
        age: 40, 
        debt: 0, 
        savings: 20000, 
        investments: 50000, 
        yearsFromNow: 10,
        investmentGrossIncome: 4000
      }
    ];
    
    const retirementConfig = {
      title: 'Retirement Planning',
      icon: '🏖️',
      includeDebt: false
    };
    
    const table = createPhaseTable(phaseDataWithIncome, retirementConfig, null, 0.2);
    const incomeCell = table.querySelector('tbody tr td:nth-child(6)');
    
    // Should show net income: 4000 * (1 - 0.2) = 3200
    assert(incomeCell.textContent.includes('€3,200'));
  });
  
  it('should throw error for invalid phase data', () => {
    const invalidData = [{ age: 'invalid' }];
    
    assert.throws(() => {
      createPhaseTable(invalidData, debtPhaseConfig);
    }, /Validation failed/);
  });
});
