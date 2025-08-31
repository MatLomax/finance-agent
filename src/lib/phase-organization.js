/**
 * @fileoverview Phase Organization for Simulation Results
 * 
 * Functions for organizing simulation results into meaningful phases
 * and tracking milestone achievements.
 */

/**
 * @typedef {Object} EnhancedYearResult
 * @property {number} age - Age for this year
 * @property {number} debt - Debt balance at end of year
 * @property {number} savings - Savings balance at end of year
 * @property {number} investments - Investment balance at end of year
 * @property {boolean} isRetired - Whether person is retired this year
 * @property {number} freeCapital - Available capital for allocation
 * @property {number} investmentGrossIncome - Gross investment income
 * @property {number} investmentNetIncome - Net investment income after tax
 * @property {number} savingsWithdrawal - Amount withdrawn from savings
 * @property {number} investmentSale - Amount of investments sold
 * @property {string} phase - Current financial phase
 * @property {number} yearsFromNow - Years from simulation start
 * @property {number} debtPayment - Debt payment for this year
 * @property {number} savingsContribution - Savings contribution for this year
 * @property {number} investmentContribution - Investment contribution
 */

/**
 * @typedef {Object} PhaseData
 * @property {EnhancedYearResult[]} debt - Years in debt elimination phase
 * @property {EnhancedYearResult[]} emergency - Years in emergency fund phase
 * @property {EnhancedYearResult[]} retirement - Years in retirement planning
 * @property {EnhancedYearResult[]} postRetirement - Years in retirement
 */

/**
 * @typedef {Object} MilestoneData
 * @property {number|null} debtFreeAge - Age when debt-free
 * @property {number|null} emergencyFundAge - Age when emergency fund complete
 */

/**
 * @typedef {Object} PhaseOrganization
 * @property {PhaseData} phases - Organized phase data
 * @property {MilestoneData} milestones - Important milestone ages
 */

/**
 * Organizes simulation results into financial phases for display
 * 
 * @param {any[]} simulation - Year-by-year simulation results
 * @param {number} emergencyFundTarget - Target emergency fund amount
 * @returns {PhaseOrganization} Organized phase data with milestones
 */
export function organizeSimulationByPhases(simulation, emergencyFundTarget) {
  const phases = { debt: [], emergency: [], retirement: [], postRetirement: [] };
  const milestones = { debtFreeAge: null, emergencyFundAge: null };
  
  if (simulation.length === 0) return { phases, milestones };
  
  const firstYear = simulation[0];
  if (!firstYear) return { phases, milestones };
  
  simulation.forEach((yearData, index) => {
    const enhancedYearData = processYearForPhases(
      yearData, index, simulation, emergencyFundTarget, milestones
    );
    assignToPhase(phases, enhancedYearData, emergencyFundTarget);
  });
  
  return { phases, milestones };
}

/**
 * Processes a year for phase organization
 * @param {any} yearData
 * @param {number} index
 * @param {any[]} simulation
 * @param {number} emergencyFundTarget
 * @param {any} milestones
 */
function processYearForPhases(yearData, index, simulation, emergencyFundTarget, milestones) {
  const firstYear = simulation[0];
  const yearsFromStart = yearData.age - firstYear.age;
  const prevYear = index > 0 ? simulation[index - 1] : null;
  
  // Track milestone ages (skip Year 0)
  if (yearsFromStart > 0) {
    if (yearData.debt <= 0 && milestones.debtFreeAge === null) {
      milestones.debtFreeAge = yearData.age;
    }
    if (yearData.savings >= emergencyFundTarget && milestones.emergencyFundAge === null) {
      milestones.emergencyFundAge = yearData.age;
    }
  }
  
  const changes = calculateYearChanges(yearsFromStart, prevYear, yearData);
  
  return { 
    ...yearData, 
    yearsFromNow: yearsFromStart, 
    ...changes 
  };
}

/**
 * Calculates year-over-year financial changes
 * @param {number} yearsFromStart
 * @param {any} prevYear
 * @param {any} yearData
 */
function calculateYearChanges(yearsFromStart, prevYear, yearData) {
  if (yearsFromStart === 0 || !prevYear) {
    return { debtPayment: 0, savingsContribution: 0, investmentContribution: 0 };
  }
  
  return {
    debtPayment: Math.max(0, prevYear.debt - yearData.debt),
    savingsContribution: yearData.savings - prevYear.savings,
    investmentContribution: yearData.investments - prevYear.investments
  };
}

/**
 * Assigns year data to appropriate phase
 * @param {any} phases
 * @param {any} yearData
 * @param {number} emergencyFundTarget
 */
function assignToPhase(phases, yearData, emergencyFundTarget) {
  if (yearData.isRetired) {
    phases.postRetirement.push(yearData);
  } else if (yearData.debt > 0) {
    phases.debt.push(yearData);
  } else if (yearData.savings < emergencyFundTarget) {
    phases.emergency.push(yearData);
  } else {
    phases.retirement.push(yearData);
  }
}
