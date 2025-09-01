/**
 * @fileoverview Phase Tables Container Module
 * 
 * Main function for creating all phase tables from organized simulation data.
 * Handles phase coordination and provides the public API for phase table generation.
 */

import { createElement } from '../utils/dom-helpers.js';
import { createPhaseTable } from './phase-tables.js';

/**
 * Creates all phase tables from organized simulation data
 * 
 * This is the main function that creates a complete set of phase tables
 * showing the year-by-year financial progression through all phases of
 * the financial plan (debt elimination → emergency fund → retirement planning → retirement).
 * 
 * 
 * @example
 * const simulation = simulateWealthTrajectory(financialData, 55);
 * const organized = organizeSimulationByPhases(simulation, emergencyFundTarget);
 * const tablesContainer = createPhaseTables(organized.phases, 0.20);
 * document.getElementById('results').appendChild(tablesContainer);
 */
export function createPhaseTables(organizedPhases: any, taxRate: any = 0.15): HTMLElement {
  if (!organizedPhases || typeof organizedPhases !== 'object') {
    throw new Error('Organized phases must be an object with phase arrays');
  }
  
  if (typeof taxRate !== 'number' || taxRate < 0 || taxRate > 1) {
    throw new Error('Tax rate must be a number between 0 and 1');
  }
  
  const container = createElement('div', { className: 'phase-tables-container' });
  
  // Phase configurations with proper order
  const phaseConfigs = [
    { key: 'debt', title: 'Debt Elimination', icon: '🎯', includeDebt: true },
    { key: 'emergency', title: 'Emergency Fund', icon: '🛡️', includeDebt: false },
    { key: 'retirement', title: 'Retirement Planning', icon: '🏖️', includeDebt: false },
    { key: 'postRetirement', title: 'Retirement Years', icon: '💀', includeDebt: false }
  ];
  
  // Track last rows for delta continuity between phases
  const lastRowsByPhase = new Map();
  
  phaseConfigs.forEach(config => {
    const phaseData = organizedPhases[config.key];
    
    if (phaseData && phaseData.length > 0) {
      // Find previous phase's last row for delta calculations
      let previousPhaseLastRow = null;
      const currentIndex = phaseConfigs.findIndex(p => p.key === config.key);
      
      for (let i = currentIndex - 1; i >= 0; i--) {
        const prevConfig = phaseConfigs[i];
        if (prevConfig && lastRowsByPhase.has(prevConfig.key)) {
          previousPhaseLastRow = lastRowsByPhase.get(prevConfig.key);
          break;
        }
      }
      
      const phaseTable = createPhaseTable(phaseData, config, previousPhaseLastRow, taxRate);
      container.appendChild(phaseTable);
      
      // Store last row for next phase
      lastRowsByPhase.set(config.key, phaseData[phaseData.length - 1]);
    }
  });
  
  return container;
}
