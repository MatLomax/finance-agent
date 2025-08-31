/**
 * @fileoverview Tests for Summary Cards Module
 * 
 * Tests for the UI components that display financial overview and milestone cards.
 * Covers DOM structure creation, data formatting, and edge cases.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { createOverviewCard, createSummaryCards } from './summary-cards.js';

// Setup JSDOM environment for DOM manipulation tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

// Mock requestAnimationFrame for Node.js test environment
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

describe('Summary Cards Module', () => {
  const mockSummaryData = {
    grossSalaryMonthly: 10530,
    netSalaryMonthly0: 10530,
    netSalaryMonthly1: 8740,
    monthlyExpenses: 5482,
    emergencyFundTarget: 32892,
    taxRate: 0.17,
    currentAge: 33
  };

  describe('createOverviewCard', () => {
    it('should create overview card with proper structure', () => {
      const card = createOverviewCard(mockSummaryData);
      
      assert.strictEqual(card.className, 'summary-card overview-card');
      assert.strictEqual(card.querySelector('.summary-card-title').textContent, 'Financial Plan Overview');
      assert.ok(card.querySelector('.overview-content'));
    });

    it('should display income information correctly', () => {
      const card = createOverviewCard(mockSummaryData);
      const incomeItems = card.querySelectorAll('.overview-item');
      
      // Check for rounded amounts that match formatMoney behavior
      assert.ok(incomeItems[0].innerHTML.includes('€10,500')); // Rounded from 10530
      assert.ok(incomeItems[1].innerHTML.includes('Tax-Free'));
      assert.ok(incomeItems[2].innerHTML.includes('17% Tax'));
    });

    it('should display expenses and emergency fund', () => {
      const card = createOverviewCard(mockSummaryData);
      const content = card.innerHTML;
      
      // Check for rounded amounts that match formatMoney behavior
      assert.ok(content.includes('€5,480')); // Rounded from 5482
      assert.ok(content.includes('€32,900')); // Rounded from 32892
    });

    it('should throw error for invalid data', () => {
      const invalidData = { grossSalaryMonthly: -1000 };
      
      assert.throws(() => createOverviewCard(invalidData), /Validation failed/);
    });
  });

  describe('createSummaryCards', () => {
    it('should create container with overview card', async () => {
      const mockMilestones = {
        debtFreeAge: 40,
        emergencyFundAge: 35,
        optimalRetirementAge: 55,
        finalWealth: 2500000
      };
      
      const container = createSummaryCards(mockSummaryData, mockMilestones);
      
      // Wait for batched DOM updates to complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      assert.strictEqual(container.className, 'summary-cards-container');
      assert.ok(container.querySelector('.overview-card'));
    });

    it('should handle empty milestones data', async () => {
      const emptyMilestones = {
        debtFreeAge: null,
        emergencyFundAge: null,
        optimalRetirementAge: null,
        finalWealth: null
      };
      
      const container = createSummaryCards(mockSummaryData, emptyMilestones);
      
      // Wait for batched DOM updates to complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      assert.ok(container);
      assert.strictEqual(container.children.length, 1);
    });
  });
});
