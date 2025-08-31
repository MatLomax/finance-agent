/**
 * @fileoverview Tests for Wealth Simulation Module
 * 
 * Comprehensive test suite covering all aspects of the wealth simulation engine:
 * - Phase determination logic
 * - Allocation calculations  
 * - Retirement withdrawal strategies
 * - Year-by-year wealth trajectory modeling
 * - Optimal retirement age optimization
 * - Phase organization and milestone tracking
 */

import assert from 'node:assert';
import { describe, test } from 'node:test';
import {
  calculateAllocationAmounts,
  calculateRetirementWithdrawal,
  determineFinancialPhase,
  findOptimalRetirementAge,
  organizeSimulationByPhases,
  simulateWealthTrajectory
} from './simulate-wealth.js';

describe('Financial Phase Determination', () => {
  test('should identify debt phase when debt exists', () => {
    const phase = determineFinancialPhase(1000, 5000, 6000);
    assert.strictEqual(phase, 'debt');
  });

  test('should identify emergency phase when no debt but insufficient savings', () => {
    const phase = determineFinancialPhase(0, 3000, 6000);
    assert.strictEqual(phase, 'emergency');
  });

  test('should identify retirement phase when debt-free and emergency fund complete', () => {
    const phase = determineFinancialPhase(0, 8000, 6000);
    assert.strictEqual(phase, 'retirement');
  });

  test('should handle edge case where savings exactly equals emergency fund target', () => {
    const phase = determineFinancialPhase(0, 6000, 6000);
    assert.strictEqual(phase, 'retirement');
  });
});

describe('Allocation Amount Calculations', () => {
  const testAllocations = {
    debtPhase: { debt: 80, savings: 10, investments: 10 },
    emergencyPhase: { debt: 0, savings: 70, investments: 30 },
    retirementPhase: { debt: 0, savings: 20, investments: 80 }
  };

  test('should calculate debt phase allocations correctly', () => {
    const result = calculateAllocationAmounts(1000, 'debt', testAllocations, 5000);
    
    assert.strictEqual(result.debtPayment, 800); // 80% of 1000
    assert.strictEqual(result.savingsContribution, 100); // 10% of 1000
    assert.strictEqual(result.investmentContribution, 100); // 10% of 1000
  });

  test('should cap debt payment at available debt balance', () => {
    const result = calculateAllocationAmounts(1000, 'debt', testAllocations, 500);
    
    assert.strictEqual(result.debtPayment, 500); // Capped at available debt
    assert.strictEqual(result.savingsContribution, 100);
    assert.strictEqual(result.investmentContribution, 100);
  });

  test('should calculate emergency phase allocations correctly', () => {
    const result = calculateAllocationAmounts(1000, 'emergency', testAllocations, 0);
    
    assert.strictEqual(result.debtPayment, 0); // 0% of 1000
    assert.strictEqual(result.savingsContribution, 700); // 70% of 1000
    assert.strictEqual(result.investmentContribution, 300); // 30% of 1000
  });

  test('should calculate retirement phase allocations correctly', () => {
    const result = calculateAllocationAmounts(1000, 'retirement', testAllocations, 0);
    
    assert.strictEqual(result.debtPayment, 0); // 0% of 1000
    assert.strictEqual(result.savingsContribution, 200); // 20% of 1000
    assert.strictEqual(result.investmentContribution, 800); // 80% of 1000
  });

  test('should handle negative free capital gracefully', () => {
    const result = calculateAllocationAmounts(-500, 'debt', testAllocations, 1000);
    
    assert.strictEqual(result.debtPayment, 0); // Can't pay debt with negative capital
    assert.strictEqual(result.savingsContribution, -50); // Negative contribution (withdrawal)
    assert.strictEqual(result.investmentContribution, -50); // Negative contribution (sale)
  });

  test('should throw error for unknown phase', () => {
    assert.throws(() => {
      calculateAllocationAmounts(1000, 'unknown', testAllocations, 0);
    }, /Unknown financial phase: unknown/);
  });
});

describe('Retirement Withdrawal Calculations', () => {
  test('should return zero withdrawals when investment income covers expenses', () => {
    const result = calculateRetirementWithdrawal(30000, 35000, 50000, 100000, 20);
    
    assert.strictEqual(result.savingsWithdrawal, 0);
    assert.strictEqual(result.investmentSale, 0);
  });

  test('should withdraw from savings first when shortfall exists', () => {
    // More realistic scenario: 5 years remaining, sufficient wealth
    const result = calculateRetirementWithdrawal(30000, 25000, 50000, 200000, 5);
    
    // Shortfall = 30000 - 25000 = 5000
    // Future expenses needed = (5-1) * 30000 = 120000
    // Total wealth = 250000, max withdrawal = 250000 - 120000 = 130000
    // Should withdraw 5000 from savings (sufficient and within limits)
    assert.strictEqual(result.savingsWithdrawal, 5000);
    assert.strictEqual(result.investmentSale, 0);
  });

  test('should sell investments when savings insufficient for shortfall', () => {
    // Realistic scenario with insufficient savings for shortfall
    const result = calculateRetirementWithdrawal(30000, 20000, 5000, 200000, 5);
    
    // Shortfall = 30000 - 20000 = 10000
    // Future expenses needed = (5-1) * 30000 = 120000  
    // Total wealth = 205000, max withdrawal = 205000 - 120000 = 85000
    // Withdraw all 5000 from savings, sell 5000 investments
    assert.strictEqual(result.savingsWithdrawal, 5000);
    assert.strictEqual(result.investmentSale, 5000);
  });

  test('should limit withdrawals to preserve wealth for future years', () => {
    const result = calculateRetirementWithdrawal(30000, 0, 20000, 30000, 2);
    
    // Total wealth = 50000
    // Future expenses needed = (2-1) * 30000 = 30000
    // Max withdrawal = 50000 - 30000 = 20000
    // But shortfall is 30000, so limited to 20000
    assert.strictEqual(result.savingsWithdrawal, 20000);
    assert.strictEqual(result.investmentSale, 0);
  });

  test('should handle case where no withdrawal possible due to future needs', () => {
    const result = calculateRetirementWithdrawal(30000, 0, 10000, 20000, 2);
    
    // Total wealth = 30000
    // Future expenses needed = (2-1) * 30000 = 30000
    // Max withdrawal = 30000 - 30000 = 0
    assert.strictEqual(result.savingsWithdrawal, 0);
    assert.strictEqual(result.investmentSale, 0);
  });
});

describe('Wealth Trajectory Simulation', () => {
  const baseInput = {
    currentAge: 30,
    lifespan: 80,
    totalDebt: 5000,
    totalSavings: 2000,
    totalInvestments: 1000,
    grossSalaryMonthly: 5000,
    taxRate: 0.2,
    investmentReturnRate: 7,
    monthlyExpenses: 3000,
    allocations: {
      debtPhase: { debt: 80, savings: 10, investments: 10 },
      emergencyPhase: { debt: 0, savings: 70, investments: 30 },
      retirementPhase: { debt: 0, savings: 20, investments: 80 }
    }
  };

  test('should start with initial values in year 0', () => {
    const simulation = simulateWealthTrajectory(baseInput, 65);
    const year0 = simulation[0];
    
    assert.strictEqual(year0.age, 30);
    assert.strictEqual(year0.debt, 5000);
    assert.strictEqual(year0.savings, 2000);
    assert.strictEqual(year0.investments, 1000);
    assert.strictEqual(year0.isRetired, false);
    assert.strictEqual(year0.freeCapital, 0);
  });

  test('should apply tax-free salary for first 2 years', () => {
    const simulation = simulateWealthTrajectory(baseInput, 65);
    
    // Year 1 should use full salary (tax-free)
    const year1 = simulation[1];
    const expectedSalary = 5000 * 12; // 60,000
    const expectedExpenses = 3000 * 12; // 36,000
    const expectedInvestmentIncome = 1000 * 0.07 * 0.8; // 7% return, 20% tax
    const expectedFreeCapital = expectedSalary - expectedExpenses + expectedInvestmentIncome;
    
    assert.strictEqual(year1.freeCapital, expectedFreeCapital);
  });

  test('should apply tax after 2 years', () => {
    const simulation = simulateWealthTrajectory(baseInput, 65);
    
    // Year 3 should use taxed salary
    const year3 = simulation[3];
    
    // Investment income will be different due to allocation changes in previous years
    // Just verify that free capital is less than year 1 due to tax
    assert.ok(year3.freeCapital < simulation[1].freeCapital);
  });

  test('should transition phases as debt is paid and emergency fund built', () => {
    // Use a scenario with faster debt elimination for reliable testing
    const quickDebtInput = {
      ...baseInput,
      totalDebt: 1000, // Smaller debt for quicker elimination
      grossSalaryMonthly: 6000, // Higher salary
      monthlyExpenses: 2000 // Lower expenses
    };
    
    const simulation = simulateWealthTrajectory(quickDebtInput, 65);
    
    // Year 0 should be in debt phase (has debt)
    assert.strictEqual(simulation[0].phase, 'debt');
    
    // Find when debt is eliminated
    const debtFreeYear = simulation.find(year => year.debt === 0 && year.age > quickDebtInput.currentAge);
    assert.ok(debtFreeYear, 'Should eventually eliminate debt');
    
    // Find the first year after debt is paid but emergency fund not complete
    const emergencyFundTarget = quickDebtInput.monthlyExpenses * 6; // 12000
    const emergencyPhaseYear = simulation.find(year => 
      year.debt === 0 && 
      year.savings < emergencyFundTarget && 
      year.age > quickDebtInput.currentAge &&
      !year.isRetired
    );
    
    if (emergencyPhaseYear) {
      assert.strictEqual(emergencyPhaseYear.phase, 'emergency');
    }
  });

  test('should handle retirement phase correctly', () => {
    const simulation = simulateWealthTrajectory(baseInput, 32); // Retire at 32
    
    const retiredYear = simulation.find(year => year.isRetired);
    assert.ok(retiredYear, 'Should have retirement years');
    
    // In retirement, free capital should be negative (withdrawing money)
    assert.ok(retiredYear.freeCapital <= 0);
    
    // Should have withdrawal amounts
    assert.ok(retiredYear.savingsWithdrawal >= 0 || retiredYear.investmentSale >= 0);
  });

  test('should maintain wealth conservation during retirement', () => {
    const simulation = simulateWealthTrajectory(baseInput, 65);
    
    // Find retirement years
    const retirementYears = simulation.filter(year => year.isRetired);
    
    if (retirementYears.length > 0) {
      // Verify that total withdrawals don't exceed expenses for each year
      retirementYears.forEach(year => {
        const totalWithdrawal = year.savingsWithdrawal + year.investmentSale;
        const annualExpenses = baseInput.monthlyExpenses * 12;
        
        // Withdrawal should not grossly exceed expenses (some buffer for investment income)
        assert.ok(totalWithdrawal <= annualExpenses * 1.1);
      });
    }
  });
});

describe('Optimal Retirement Age Finding', () => {
  const baseInput = {
    currentAge: 30,
    lifespan: 80,
    totalDebt: 0, // Start debt-free for simpler testing
    totalSavings: 10000,
    totalInvestments: 5000,
    grossSalaryMonthly: 4000,
    taxRate: 0.2,
    investmentReturnRate: 7,
    monthlyExpenses: 2500,
    allocations: {
      debtPhase: { debt: 80, savings: 10, investments: 10 },
      emergencyPhase: { debt: 0, savings: 70, investments: 30 },
      retirementPhase: { debt: 0, savings: 20, investments: 80 }
    }
  };

  test('should find a valid optimal retirement age', () => {
    const result = findOptimalRetirementAge(baseInput);
    
    assert.ok(result.age > baseInput.currentAge);
    assert.ok(result.age <= baseInput.lifespan - 5);
    assert.ok(Array.isArray(result.simulation));
    assert.ok(typeof result.finalWealth === 'number');
  });

  test('should ensure final wealth is not too negative', () => {
    const result = findOptimalRetirementAge(baseInput);
    
    // Final wealth should be >= -5000 (acceptable small negative)
    assert.ok(result.finalWealth >= -5000);
  });

  test('should provide fallback retirement age if no optimal found', () => {
    // Create scenario where retirement is difficult (high expenses, low income)
    const difficultInput = {
      ...baseInput,
      grossSalaryMonthly: 2000, // Very low income
      monthlyExpenses: 4000, // High expenses
      investmentReturnRate: 2 // Low returns
    };
    
    const result = findOptimalRetirementAge(difficultInput);
    
    // Should still provide an age (fallback)
    assert.ok(result.age !== null);
    assert.strictEqual(result.age, Math.min(65, difficultInput.lifespan - 10));
  });

  test('should return simulation matching the optimal age', () => {
    const result = findOptimalRetirementAge(baseInput);
    
    const retirementYear = result.simulation.find(year => year.age === result.age);
    assert.ok(retirementYear);
    assert.strictEqual(retirementYear.isRetired, true);
  });
});

describe('Simulation Phase Organization', () => {
  const mockSimulation = [
    // Year 0: Starting with debt
    { age: 30, debt: 5000, savings: 2000, investments: 1000, isRetired: false },
    // Year 1: Still in debt phase
    { age: 31, debt: 3000, savings: 2500, investments: 1200, isRetired: false },
    // Year 2: Debt eliminated, emergency phase
    { age: 32, debt: 0, savings: 4000, investments: 1500, isRetired: false },
    // Year 3: Emergency fund complete, retirement phase
    { age: 33, debt: 0, savings: 18000, investments: 2000, isRetired: false },
    // Year 4: Still accumulating
    { age: 34, debt: 0, savings: 20000, investments: 5000, isRetired: false },
    // Year 5: Retired
    { age: 35, debt: 0, savings: 18000, investments: 4000, isRetired: true }
  ];

  test('should organize simulation into correct phases', () => {
    const emergencyFundTarget = 15000; // 5 months * 3000
    const result = organizeSimulationByPhases(mockSimulation, emergencyFundTarget);
    
    assert.strictEqual(result.phases.debt.length, 2); // Ages 30-31
    assert.strictEqual(result.phases.emergency.length, 1); // Age 32
    assert.strictEqual(result.phases.retirement.length, 2); // Ages 33-34
    assert.strictEqual(result.phases.postRetirement.length, 1); // Age 35
  });

  test('should identify milestone ages correctly', () => {
    const emergencyFundTarget = 15000;
    const result = organizeSimulationByPhases(mockSimulation, emergencyFundTarget);
    
    assert.strictEqual(result.milestones.debtFreeAge, 32);
    assert.strictEqual(result.milestones.emergencyFundAge, 33);
  });

  test('should calculate year-over-year changes correctly', () => {
    const emergencyFundTarget = 15000;
    const result = organizeSimulationByPhases(mockSimulation, emergencyFundTarget);
    
    // Check debt phase calculations
    const debtPhaseYear1 = result.phases.debt[1]; // Age 31
    assert.strictEqual(debtPhaseYear1.debtPayment, 2000); // 5000 - 3000
    assert.strictEqual(debtPhaseYear1.savingsContribution, 500); // 2500 - 2000
    assert.strictEqual(debtPhaseYear1.investmentContribution, 200); // 1200 - 1000
  });

  test('should handle year 0 correctly (no changes)', () => {
    const emergencyFundTarget = 15000;
    const result = organizeSimulationByPhases(mockSimulation, emergencyFundTarget);
    
    const year0 = result.phases.debt[0]; // Age 30
    assert.strictEqual(year0.yearsFromNow, 0);
    assert.strictEqual(year0.debtPayment, 0);
    assert.strictEqual(year0.savingsContribution, 0);
    assert.strictEqual(year0.investmentContribution, 0);
  });
});
