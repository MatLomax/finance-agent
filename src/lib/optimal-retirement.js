/**
 * @fileoverview Optimal Retirement Age Calculation
 * 
 * Contains functions for finding the optimal retirement age by testing
 * different scenarios and optimizing for wealth at end of life.
 */

import { simulateWealthTrajectory } from './simulate-wealth.js';

/**
 * @typedef {Object} OptimalRetirementResult
 * @property {number} age - Optimal retirement age
 * @property {any[]} simulation - Full simulation results
 * @property {number} finalWealth - Final wealth at end of life
 */

/**
 * Finds optimal retirement age by testing different scenarios
 * 
 * @param {any} input - Simulation input parameters
 * @returns {OptimalRetirementResult} Optimal retirement result
 */
export function findOptimalRetirementAge(input) {
  const { 
    currentAge, 
    lifespan, 
    monthlyExpenses,
    defaultRetirementAge = 65,
    retirementTestBuffer = 5,
    retirementSafetyBuffer = 10
  } = input;
  
  const annualExpenses = monthlyExpenses * 12;
  
  let optimalAge = null;
  let bestSimulation = null;
  let closestToZero = Infinity;
  
  // Test retirement ages from next year to retirementTestBuffer years before death
  for (let testAge = currentAge + 1; testAge <= lifespan - retirementTestBuffer; testAge++) {
    const result = evaluateRetirementAge(input, testAge, annualExpenses, closestToZero);
    if (result.isOptimal) {
      closestToZero = result.distanceFromZero;
      optimalAge = testAge;
      bestSimulation = result.simulation;
    }
  }
  
  // Fallback if no valid retirement found
  if (!optimalAge || !bestSimulation) {
    optimalAge = Math.min(defaultRetirementAge, lifespan - retirementSafetyBuffer);
    bestSimulation = simulateWealthTrajectory(input, optimalAge);
  }
  
  const finalYear = bestSimulation[bestSimulation.length - 1];
  const finalWealth = finalYear ? finalYear.savings + finalYear.investments : 0;
  
  return { age: optimalAge, simulation: bestSimulation, finalWealth };
}

/**
 * Evaluates a specific retirement age for optimality
 * @param {any} input
 * @param {number} testAge  
 * @param {number} annualExpenses
 * @param {number} currentBest
 */
function evaluateRetirementAge(input, testAge, annualExpenses, currentBest) {
  const simulation = simulateWealthTrajectory(input, testAge);
  const finalYear = simulation[simulation.length - 1];
  const finalWealth = finalYear ? finalYear.savings + finalYear.investments : 0;
  const distanceFromZero = Math.abs(finalWealth);
  
  const retirementYear = simulation.find(year => year.age === testAge);
  const retirementWealth = retirementYear ? 
    retirementYear.savings + retirementYear.investments : 0;
  
  const isValidRetirement = finalWealth >= -5000 && 
    retirementWealth > annualExpenses * 2;
  const isOptimal = isValidRetirement && distanceFromZero < currentBest;
  
  return { simulation, distanceFromZero, isOptimal };
}
