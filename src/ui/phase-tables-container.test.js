/**
 * @fileoverview Tests for Phase Tables Container Module
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createPhaseTables } from './phase-tables-container.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

describe('createPhaseTables', () => {
  const sampleOrganizedPhases = {
    debt: [
      { age: 30, debt: 5000, savings: 1000, investments: 0, yearsFromNow: 0 },
      { age: 31, debt: 0, savings: 3000, investments: 1000, yearsFromNow: 1 }
    ],
    emergency: [
      { age: 32, debt: 0, savings: 8000, investments: 2000, yearsFromNow: 2 },
      { age: 33, debt: 0, savings: 12000, investments: 3000, yearsFromNow: 3 }
    ],
    retirement: [
      { age: 34, debt: 0, savings: 15000, investments: 8000, yearsFromNow: 4 }
    ],
    postRetirement: []
  };
  
  it('should create container with all non-empty phases', () => {
    const container = createPhaseTables(sampleOrganizedPhases);
    
    assert.strictEqual(container.className, 'phase-tables-container');
    
    const phaseCards = container.querySelectorAll('.phase-card');
    assert.strictEqual(phaseCards.length, 3); // debt, emergency, retirement (postRetirement is empty)
    
    const titles = container.querySelectorAll('h3');
    assert(titles[0].textContent.includes('Debt Elimination'));
    assert(titles[1].textContent.includes('Emergency Fund'));
    assert(titles[2].textContent.includes('Retirement Planning'));
  });
  
  it('should include debt column only for debt phase', () => {
    const container = createPhaseTables(sampleOrganizedPhases);
    
    const debtTable = container.querySelector('.phase-card:first-child table');
    const debtHeaders = debtTable.querySelectorAll('thead th');
    assert.strictEqual(debtHeaders.length, 8); // With debt column
    
    const emergencyTable = container.querySelector('.phase-card:nth-child(2) table');
    const emergencyHeaders = emergencyTable.querySelectorAll('thead th');
    assert.strictEqual(emergencyHeaders.length, 7); // Without debt column
  });
  
  it('should handle empty phases object', () => {
    const emptyPhases = { debt: [], emergency: [], retirement: [], postRetirement: [] };
    const container = createPhaseTables(emptyPhases);
    
    assert.strictEqual(container.className, 'phase-tables-container');
    assert.strictEqual(container.children.length, 0);
  });
  
  it('should throw error for invalid input', () => {
    assert.throws(() => {
      createPhaseTables(null);
    }, /Organized phases must be an object/);
    
    assert.throws(() => {
      createPhaseTables(sampleOrganizedPhases, -0.1);
    }, /Tax rate must be a number between 0 and 1/);
    
    assert.throws(() => {
      createPhaseTables(sampleOrganizedPhases, 1.5);
    }, /Tax rate must be a number between 0 and 1/);
  });
  
  it('should pass tax rate to phase tables', () => {
    const phasesWithIncome = {
      retirement: [
        { 
          age: 40, 
          debt: 0, 
          savings: 20000, 
          investments: 50000, 
          yearsFromNow: 10,
          investmentGrossIncome: 2000
        }
      ],
      debt: [],
      emergency: [],
      postRetirement: []
    };
    
    const container = createPhaseTables(phasesWithIncome, 0.3);
    const incomeCell = container.querySelector('tbody tr td:nth-child(6)');
    
    // Should calculate with 30% tax rate: 2000 * (1 - 0.3) = 1400
    assert(incomeCell.textContent.includes('€1,400'));
  });
  
  it('should maintain phase order', () => {
    const container = createPhaseTables(sampleOrganizedPhases);
    const titles = Array.from(container.querySelectorAll('h3')).map(h => h.textContent);
    
    assert(titles[0].includes('Debt Elimination'));
    assert(titles[1].includes('Emergency Fund'));
    assert(titles[2].includes('Retirement Planning'));
  });
});
