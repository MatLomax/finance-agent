/**
 * @fileoverview Default financial data values
 * 
 * This module contains the default financial data structure that matches
 * the Thailand.html behavior. These values represent a reasonable starting
 * point for a software engineer relocating to Thailand.
 */

/**
 * Current data schema version for migration handling
 */
const SCHEMA_VERSION = 1;

/**
 * Default financial data values matching Thailand.html behavior
 * These represent a reasonable starting point for a software engineer
 * relocating to Thailand with standard expenses and financial goals.
 * 
 * Income Structure:
 * - $9,000 USD gross monthly salary (common for senior developers)
 * - 1.17 EUR/USD exchange rate (approximate historical average)
 * - 37.75 THB/EUR exchange rate (approximate for Chiang Mai)
 * - 17% tax rate (Thai tax rate after 2-year tax exemption expires)
 * 
 * Expense Categories (monthly THB amounts):
 * - Housing: Quality 1-2BR condo in central Chiang Mai
 * - Utilities: AC, internet, electricity for comfortable living
 * - Food: Mix of local and international dining plus groceries
 * - Staff: Part-time cleaning service (common for expats)
 * - Transport: Scooter/car expenses for local travel
 * - Healthcare: International insurance for comprehensive coverage
 * - Pet care: Dog/cat expenses including vet and boarding
 * - Wellness: Gym, spa, massage, personal development
 * - Entertainment: Movies, events, social activities
 * - Weekend trips: Domestic travel within Thailand
 * - Annual holiday: International vacation budget (divided monthly)
 * - Discretionary: Shopping, unexpected expenses, buffer
 * 
 * Financial Position:
 * - Starting age 33 (mid-career professional)
 * - $75,000 debt (student loans, credit cards from home country)
 * - No initial savings (common when relocating internationally)
 * - No initial investments (building from scratch)
 * - 6% investment return rate (conservative long-term estimate)
 * 
 * Phase Allocations:
 * Phase 1 (Debt elimination): 80% debt, 10% savings, 10% investments
 * Phase 2 (Emergency fund): 0% debt, 70% savings, 30% investments  
 * Phase 3 (Wealth building): 0% debt, 20% savings, 80% investments
 */
const DEFAULT_FINANCIAL_DATA = {
  // Schema information
  schemaVersion: SCHEMA_VERSION,
  
  // Income parameters (USD/EUR amounts)
  grossUsd: 9000,
  eurUsd: 1.17,
  thbEur: 37.75,
  taxRate: 0.17,
  
  // Monthly expenses (THB amounts)
  housing: 1400,
  utilities: 200,
  diningGroceries: 750,
  hiredStaff: 340,
  transportation: 100,
  healthInsurance: 550,
  petCare: 120,
  wellness: 605,
  entertainment: 150,
  weekendTrips: 167,
  annualHoliday: 750,
  discretionary: 350,
  
  // Phase allocation percentages
  allocDebt1: 80,
  allocSavings1: 10,
  allocInvestment1: 10,
  allocDebt2: 0,
  allocSavings2: 70,
  allocInvestment2: 30,
  allocSavings3: 20,
  allocInvestment3: 80,
  
  // Personal and investment parameters
  currentAge: 33,
  lifespan: 90,
  investmentReturnRate: 6,
  totalDebt: 75000,
  totalSavings: 0,
  totalInvestments: 0,
  
  // Metadata
  lastUpdated: new Date().toISOString(),
  version: '1.0.0'
};

/**
 * Get default financial data values
 * 
 * Returns a copy of the default financial data object.
 * Useful for UI components that need to show default values.
 * 
 * @returns {Record<string, any>} Copy of default financial data
 */
export function getDefaultFinancialData() {
  return { ...DEFAULT_FINANCIAL_DATA };
}
