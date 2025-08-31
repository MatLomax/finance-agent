/**
 * @fileoverview Tests for phase organization functionality
 * 
 * Tests the functions that organize simulation results into meaningful
 * financial phases and track milestone achievements.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { organizeSimulationByPhases } from './phase-organization.js';

describe('organizeSimulationByPhases', () => {
  const emergencyFundTarget = 25000;
  
  it('should handle empty simulation', () => {
    const result = organizeSimulationByPhases([], emergencyFundTarget);
    
    assert.deepStrictEqual(result.phases.debt, []);
    assert.deepStrictEqual(result.phases.emergency, []);
    assert.deepStrictEqual(result.phases.retirement, []);
    assert.deepStrictEqual(result.phases.postRetirement, []);
    assert.strictEqual(result.milestones.debtFreeAge, null);
    assert.strictEqual(result.milestones.emergencyFundAge, null);
  });
  
  it('should organize debt elimination phase correctly', () => {
    const simulation = [
      { age: 30, debt: 50000, savings: 5000, investments: 1000, isRetired: false, phase: 'debt' },
      { age: 31, debt: 40000, savings: 6000, investments: 2000, isRetired: false, phase: 'debt' },
      { age: 32, debt: 30000, savings: 7000, investments: 3000, isRetired: false, phase: 'debt' },
      { age: 33, debt: 0, savings: 10000, investments: 5000, isRetired: false, phase: 'emergency' }
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.debt.length, 3);
    assert.strictEqual(result.phases.debt[0].age, 30);
    assert.strictEqual(result.phases.debt[1].age, 31);
    assert.strictEqual(result.phases.debt[2].age, 32);
    
    // Should track debt payment amounts
    assert.strictEqual(result.phases.debt[1].debtPayment, 10000); // 50000 - 40000
    assert.strictEqual(result.phases.debt[2].debtPayment, 10000); // 40000 - 30000
  });
  
  it('should organize emergency fund phase correctly', () => {
    const simulation = [
      { age: 30, debt: 0, savings: 10000, investments: 5000, isRetired: false, phase: 'emergency' },
      { age: 31, debt: 0, savings: 15000, investments: 8000, isRetired: false, phase: 'emergency' },
      { age: 32, debt: 0, savings: 25000, investments: 12000, isRetired: false, phase: 'retirement' }
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.emergency.length, 2);
    assert.strictEqual(result.phases.emergency[0].age, 30);
    assert.strictEqual(result.phases.emergency[1].age, 31);
    
    // Should track savings contributions
    assert.strictEqual(result.phases.emergency[1].savingsContribution, 5000); // 15000 - 10000
  });
  
  it('should organize retirement planning phase correctly', () => {
    const simulation = [
      { age: 35, debt: 0, savings: 30000, investments: 50000, isRetired: false, phase: 'retirement' },
      { age: 36, debt: 0, savings: 32000, investments: 60000, isRetired: false, phase: 'retirement' },
      { age: 37, debt: 0, savings: 34000, investments: 75000, isRetired: false, phase: 'retirement' }
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.retirement.length, 3);
    assert.strictEqual(result.phases.retirement[0].age, 35);
    assert.strictEqual(result.phases.retirement[2].age, 37);
    
    // Should track investment contributions
    assert.strictEqual(result.phases.retirement[1].investmentContribution, 10000); // 60000 - 50000
    assert.strictEqual(result.phases.retirement[2].investmentContribution, 15000); // 75000 - 60000
  });
  
  it('should organize post-retirement phase correctly', () => {
    const simulation = [
      { age: 65, debt: 0, savings: 200000, investments: 800000, isRetired: true, 
        savingsWithdrawal: 5000, investmentSale: 10000 },
      { age: 66, debt: 0, savings: 195000, investments: 790000, isRetired: true,
        savingsWithdrawal: 3000, investmentSale: 12000 }
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.postRetirement.length, 2);
    assert.strictEqual(result.phases.postRetirement[0].age, 65);
    assert.strictEqual(result.phases.postRetirement[1].age, 66);
    
    // Should preserve withdrawal information
    assert.strictEqual(result.phases.postRetirement[0].savingsWithdrawal, 5000);
    assert.strictEqual(result.phases.postRetirement[0].investmentSale, 10000);
  });
  
  it('should track milestone ages correctly', () => {
    const simulation = [
      { age: 30, debt: 50000, savings: 5000, investments: 1000, isRetired: false },
      { age: 31, debt: 40000, savings: 8000, investments: 2000, isRetired: false },
      { age: 32, debt: 0, savings: 12000, investments: 5000, isRetired: false }, // Debt-free
      { age: 33, debt: 0, savings: 20000, investments: 8000, isRetired: false },
      { age: 34, debt: 0, savings: 25000, investments: 12000, isRetired: false } // Emergency fund complete
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.milestones.debtFreeAge, 32);
    assert.strictEqual(result.milestones.emergencyFundAge, 34);
  });
  
  it('should handle case where milestones are never reached', () => {
    const simulation = [
      { age: 30, debt: 50000, savings: 5000, investments: 1000, isRetired: false },
      { age: 31, debt: 45000, savings: 6000, investments: 2000, isRetired: false },
      { age: 32, debt: 40000, savings: 7000, investments: 3000, isRetired: false }
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.milestones.debtFreeAge, null);
    assert.strictEqual(result.milestones.emergencyFundAge, null);
  });
  
  it('should calculate years from start correctly', () => {
    const simulation = [
      { age: 30, debt: 50000, savings: 5000, investments: 1000, isRetired: false },
      { age: 31, debt: 40000, savings: 6000, investments: 2000, isRetired: false },
      { age: 32, debt: 30000, savings: 7000, investments: 3000, isRetired: false }
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.debt[0].yearsFromNow, 0);
    assert.strictEqual(result.phases.debt[1].yearsFromNow, 1);
    assert.strictEqual(result.phases.debt[2].yearsFromNow, 2);
  });
  
  it('should handle mixed phases in simulation', () => {
    const simulation = [
      { age: 30, debt: 10000, savings: 5000, investments: 1000, isRetired: false }, // Debt phase
      { age: 31, debt: 0, savings: 15000, investments: 5000, isRetired: false }, // Emergency phase
      { age: 32, debt: 0, savings: 30000, investments: 20000, isRetired: false }, // Retirement phase
      { age: 65, debt: 0, savings: 100000, investments: 500000, isRetired: true } // Post-retirement
    ];
    
    const result = organizeSimulationByPhases(simulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.debt.length, 1);
    assert.strictEqual(result.phases.emergency.length, 1);
    assert.strictEqual(result.phases.retirement.length, 1);
    assert.strictEqual(result.phases.postRetirement.length, 1);
    
    assert.strictEqual(result.milestones.debtFreeAge, 31);
    assert.strictEqual(result.milestones.emergencyFundAge, 32);
  });
});
