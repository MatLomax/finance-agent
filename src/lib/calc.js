/**
 * @fileoverview Pure mathematical functions for financial calculations
 * 
 * This module contains all pure mathematical functions extracted from the Thailand.html
 * financial simulator. Each function follows SOLID principles, includes comprehensive
 * validation, and provides educational documentation about financial concepts.
 * 
 * All functions are pure (no side effects) and include TypeBox runtime validation
 * to ensure data integrity and provide clear error messages for invalid inputs.
 */

import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Schema for currency conversion calculations
 */
const CurrencyConversionSchema = Type.Object({
  amount: Type.Number({ minimum: 0 }),
  exchangeRate: Type.Number({ exclusiveMinimum: 0 })
});

/**
 * Schema for tax calculations
 */
const TaxCalculationSchema = Type.Object({
  grossAmount: Type.Number({ minimum: 0 }),
  taxRate: Type.Number({ minimum: 0, maximum: 1 })
});

/**
 * Schema for investment income calculations
 */
const InvestmentIncomeSchema = Type.Object({
  principal: Type.Number({ minimum: 0 }),
  annualRate: Type.Number({ minimum: 0, maximum: 1 }),
  taxRate: Type.Number({ minimum: 0, maximum: 1 })
});

/**
 * Schema for retirement withdrawal calculations
 */
const RetirementWithdrawalSchema = Type.Object({
  annualExpenses: Type.Number({ minimum: 0 }),
  investmentIncome: Type.Number({ minimum: 0 }),
  totalWealth: Type.Number({ minimum: 0 }),
  yearsRemaining: Type.Integer({ minimum: 0 })
});

/**
 * Schema for allocation calculations
 */
const AllocationSchema = Type.Object({
  freeCapital: Type.Number(),
  debtAllocation: Type.Number({ minimum: 0, maximum: 1 }),
  savingsAllocation: Type.Number({ minimum: 0, maximum: 1 }),
  investmentAllocation: Type.Number({ minimum: 0, maximum: 1 })
});

/**
 * Schema for debt payment calculations
 */
const DebtPaymentSchema = Type.Object({
  currentDebt: Type.Number({ minimum: 0 }),
  availablePayment: Type.Number()
});

/**
 * Schema for percentage growth calculations
 */
const PercentageGrowthSchema = Type.Object({
  current: Type.Number(),
  previous: Type.Number()
});

// =============================================================================
// VALIDATION HELPER
// =============================================================================

/**
 * Validates input data against a TypeBox schema
 * @param {import('@sinclair/typebox').TSchema} schema - TypeBox validation schema
 * @param {unknown} data - Data to validate
 * @throws {Error} If validation fails with detailed error message
 */
function validate(schema, data) {
  if (!Value.Check(schema, data)) {
    const errors = [...Value.Errors(schema, data)];
    const message = errors.map(e => `${e.path}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${message}`);
  }
}

// =============================================================================
// CURRENCY AND CONVERSION FUNCTIONS
// =============================================================================

/**
 * Converts USD amount to EUR using exchange rate
 * 
 * This function performs basic currency conversion using the formula:
 * EUR Amount = USD Amount / Exchange Rate
 * 
 * Used in the finance agent to convert gross USD salary to EUR for
 * expense calculations and local currency planning.
 * 
 * @param {number} usdAmount - Amount in USD (must be positive)
 * @param {number} eurUsdRate - EUR/USD exchange rate (must be positive)
 * @returns {number} Equivalent amount in EUR
 * 
 * @example
 * const eurAmount = convertUsdToEur(9000, 1.17);
 * // Returns: 7692.31 (approximately)
 * // Explanation: $9000 USD ÷ 1.17 EUR/USD = €7692.31 EUR
 * 
 * @throws {Error} If input validation fails
 */
export function convertUsdToEur(usdAmount, eurUsdRate) {
  validate(CurrencyConversionSchema, { amount: usdAmount, exchangeRate: eurUsdRate });
  
  // Direct currency conversion: divide by exchange rate
  // Example: $9000 USD ÷ 1.17 EUR/USD = €7692.31 EUR
  return usdAmount / eurUsdRate;
}

/**
 * Converts EUR amount to THB using exchange rate
 * 
 * This function performs currency conversion using the formula:
 * THB Amount = EUR Amount × Exchange Rate
 * 
 * Used for converting European expenses to Thai Baht for local
 * cost-of-living calculations in Chiang Mai.
 * 
 * @param {number} eurAmount - Amount in EUR (must be positive)
 * @param {number} thbEurRate - THB/EUR exchange rate (must be positive)
 * @returns {number} Equivalent amount in THB
 * 
 * @example
 * const thbAmount = convertEurToThb(1000, 37.75);
 * // Returns: 37750
 * // Explanation: €1000 EUR × 37.75 THB/EUR = ฿37,750 THB
 * 
 * @throws {Error} If input validation fails
 */
export function convertEurToThb(eurAmount, thbEurRate) {
  validate(CurrencyConversionSchema, { amount: eurAmount, exchangeRate: thbEurRate });
  
  // Direct currency conversion: multiply by exchange rate
  // Example: €1000 EUR × 37.75 THB/EUR = ฿37,750 THB
  return eurAmount * thbEurRate;
}

// =============================================================================
// TAX CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculates net salary after tax deduction
 * 
 * Uses the formula: Net Salary = Gross Salary × (1 - Tax Rate)
 * This is the standard after-tax income calculation used globally.
 * 
 * In the Thailand scenario, expats are tax-free for the first 2 years,
 * then subject to local tax rates (typically 17% for this income level).
 * 
 * @param {number} grossSalary - Gross salary amount (must be positive)
 * @param {number} taxRate - Tax rate as decimal (0.17 = 17%, must be 0-1)
 * @returns {number} Net salary after tax deduction
 * 
 * @example
 * const netSalary = calculateNetSalary(7692.31, 0.17);
 * // Returns: 6384.62 (approximately)
 * // Explanation: €7692.31 × (1 - 0.17) = €7692.31 × 0.83 = €6384.62
 * 
 * @throws {Error} If input validation fails
 */
export function calculateNetSalary(grossSalary, taxRate) {
  validate(TaxCalculationSchema, { grossAmount: grossSalary, taxRate });
  
  // Calculate tax multiplier: (1 - tax rate)
  // This represents the percentage of income you keep after taxes
  // Example: 1 - 0.17 = 0.83 (keep 83% of gross income)
  const afterTaxMultiplier = 1 - taxRate;
  
  // Apply tax multiplier to gross salary
  // Example: €7692.31 × 0.83 = €6384.62 net salary
  return grossSalary * afterTaxMultiplier;
}

// =============================================================================
// EXPENSE CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculates total monthly expenses from individual expense categories
 * 
 * This function sums all monthly expense categories to determine
 * total cost of living. Used as the foundation for emergency fund
 * calculations and retirement planning.
 * 
 * @param {Object} expenses - Object containing all expense categories
 * @param {number} expenses.housing - Monthly housing costs
 * @param {number} expenses.utilities - Monthly utility costs
 * @param {number} expenses.diningGroceries - Monthly food costs
 * @param {number} expenses.hiredStaff - Monthly staff costs
 * @param {number} expenses.transportation - Monthly transport costs
 * @param {number} expenses.healthInsurance - Monthly health insurance
 * @param {number} expenses.petCare - Monthly pet care costs
 * @param {number} expenses.wellness - Monthly wellness costs
 * @param {number} expenses.entertainment - Monthly entertainment costs
 * @param {number} expenses.weekendTrips - Monthly weekend trip budget
 * @param {number} expenses.annualHoliday - Monthly holiday savings
 * @param {number} expenses.discretionary - Monthly discretionary spending
 * @returns {number} Total monthly expenses
 * 
 * @example
 * const expenses = {
 *   housing: 1400, utilities: 200, diningGroceries: 750,
 *   hiredStaff: 340, transportation: 100, healthInsurance: 550,
 *   petCare: 120, wellness: 605, entertainment: 150,
 *   weekendTrips: 167, annualHoliday: 750, discretionary: 350
 * };
 * const total = calculateMonthlyExpenses(expenses);
 * // Returns: 4882
 * // Explanation: Sum of all monthly expense categories
 * 
 * @throws {Error} If any expense value is negative
 */
export function calculateMonthlyExpenses(expenses) {
  // Validate all expense values are non-negative
  const expenseValues = Object.values(expenses);
  for (const value of expenseValues) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('All expense values must be non-negative numbers');
    }
  }
  
  // Sum all expense categories
  // This gives us the total monthly cost of living
  return expenseValues.reduce((total, expense) => total + expense, 0);
}

/**
 * Calculates annual expenses from monthly expenses
 * 
 * Simple multiplication: Annual = Monthly × 12
 * Used for retirement planning and annual budgeting calculations.
 * 
 * @param {number} monthlyExpenses - Total monthly expenses (must be positive)
 * @returns {number} Total annual expenses
 * 
 * @example
 * const annualExpenses = calculateAnnualExpenses(4882);
 * // Returns: 58584
 * // Explanation: €4882/month × 12 months = €58,584/year
 * 
 * @throws {Error} If monthly expenses is negative
 */
export function calculateAnnualExpenses(monthlyExpenses) {
  if (typeof monthlyExpenses !== 'number' || monthlyExpenses < 0) {
    throw new Error('Monthly expenses must be a non-negative number');
  }
  
  // Convert monthly to annual: multiply by 12 months
  // This is the standard calculation for annual budgeting
  return monthlyExpenses * 12;
}

/**
 * Calculates emergency fund target (6 months of expenses)
 * 
 * Emergency fund formula: Monthly Expenses × 6
 * Financial advisors typically recommend 3-6 months of expenses.
 * This calculator uses 6 months for conservative planning.
 * 
 * @param {number} monthlyExpenses - Total monthly expenses (must be positive)
 * @returns {number} Emergency fund target amount
 * 
 * @example
 * const emergencyFund = calculateEmergencyFundTarget(4882);
 * // Returns: 29292
 * // Explanation: €4882/month × 6 months = €29,292 emergency fund
 * 
 * @throws {Error} If monthly expenses is negative
 */
export function calculateEmergencyFundTarget(monthlyExpenses) {
  if (typeof monthlyExpenses !== 'number' || monthlyExpenses < 0) {
    throw new Error('Monthly expenses must be a non-negative number');
  }
  
  // Emergency fund calculation: 6 months of expenses
  // This provides a safety net for job loss or unexpected expenses
  // 6 months is considered conservative but provides good security
  const emergencyFundMonths = 6;
  return monthlyExpenses * emergencyFundMonths;
}

// =============================================================================
// INVESTMENT CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculates gross investment income from principal and annual rate
 * 
 * Uses the formula: Gross Income = Principal × Annual Rate
 * This is simple interest calculation for annual investment returns.
 * 
 * @param {number} principal - Investment principal amount (must be positive)
 * @param {number} annualRate - Annual return rate as decimal (0.06 = 6%)
 * @returns {number} Gross annual investment income
 * 
 * @example
 * const grossIncome = calculateInvestmentGrossIncome(100000, 0.06);
 * // Returns: 6000
 * // Explanation: €100,000 × 6% = €6,000 annual gross income
 * 
 * @throws {Error} If input validation fails
 */
export function calculateInvestmentGrossIncome(principal, annualRate) {
  validate(InvestmentIncomeSchema, { principal, annualRate, taxRate: 0 });
  
  // Simple interest calculation: Principal × Rate
  // This assumes annual compounding and represents gross income before taxes
  return principal * annualRate;
}

/**
 * Calculates net investment income after taxes
 * 
 * Uses the formula: Net Income = Gross Income × Tax Rate
 * Note: In the original code, this appears to be calculating the tax amount,
 * not the net income. Preserving original logic for compatibility.
 * 
 * @param {number} grossIncome - Gross investment income (must be positive)
 * @param {number} taxRate - Tax rate as decimal (0.17 = 17%)
 * @returns {number} Tax amount on investment income
 * 
 * @example
 * const taxAmount = calculateInvestmentNetIncome(6000, 0.17);
 * // Returns: 1020
 * // Explanation: €6,000 × 17% = €1,020 tax on investment income
 * 
 * @throws {Error} If input validation fails
 */
export function calculateInvestmentNetIncome(grossIncome, taxRate) {
  validate(InvestmentIncomeSchema, { principal: grossIncome, annualRate: 1, taxRate });
  
  // Calculate tax on investment income
  // Note: Original code calculates tax amount, not net income
  // This represents the tax liability on investment gains
  return grossIncome * taxRate;
}

// =============================================================================
// RETIREMENT CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculates retirement expense shortfall
 * 
 * Shortfall = Annual Expenses - Investment Income
 * This determines how much additional money needs to be withdrawn
 * from savings/investments to cover living expenses in retirement.
 * 
 * @param {number} annualExpenses - Annual living expenses (must be positive)
 * @param {number} investmentIncome - Annual investment income (must be positive)
 * @returns {number} Shortfall amount (can be negative if income exceeds expenses)
 * 
 * @example
 * const shortfall = calculateRetirementShortfall(58584, 6000);
 * // Returns: 52584
 * // Explanation: €58,584 expenses - €6,000 income = €52,584 shortfall
 * 
 * @throws {Error} If input validation fails
 */
export function calculateRetirementShortfall(annualExpenses, investmentIncome) {
  validate(RetirementWithdrawalSchema, { 
    annualExpenses, 
    investmentIncome, 
    totalWealth: 0, 
    yearsRemaining: 1 
  });
  
  // Calculate the gap between expenses and passive income
  // Positive result means you need to withdraw additional funds
  // Negative result means your investment income exceeds expenses
  return annualExpenses - investmentIncome;
}

/**
 * Calculates maximum safe withdrawal amount for retirement
 * 
 * This function ensures retirees don't deplete their wealth too quickly
 * by calculating the maximum they can withdraw while preserving enough
 * for future years.
 * 
 * Formula: Max Withdrawal = min(Shortfall, Total Wealth - Future Needs)
 * Where Future Needs = (Years Remaining - 1) × Annual Expenses
 * 
 * @param {number} annualExpenses - Annual living expenses
 * @param {number} investmentIncome - Annual investment income  
 * @param {number} totalWealth - Current total wealth (savings + investments)
 * @param {number} yearsRemaining - Years remaining in retirement
 * @returns {number} Maximum safe withdrawal amount
 * 
 * @example
 * const maxWithdrawal = calculateMaxWithdrawal(58584, 6000, 800000, 20);
 * // Shortfall: €58,584 - €6,000 = €52,584
 * // Future needs: (20-1) × €58,584 = €1,113,096
 * // Available: €800,000 - €1,113,096 = -€313,096 (insufficient funds)
 * // Returns: 0 (cannot withdraw safely)
 * 
 * @throws {Error} If input validation fails
 */
export function calculateMaxWithdrawal(annualExpenses, investmentIncome, totalWealth, yearsRemaining) {
  validate(RetirementWithdrawalSchema, { 
    annualExpenses, 
    investmentIncome, 
    totalWealth, 
    yearsRemaining 
  });
  
  // Step 1: Calculate how much additional money is needed this year
  const shortfall = calculateRetirementShortfall(annualExpenses, investmentIncome);
  
  // Step 2: Calculate future expense needs
  // We subtract 1 because we're calculating needs for FUTURE years
  // (current year shortfall is handled separately)
  const futureYears = yearsRemaining - 1;
  const futureExpenseNeeds = futureYears * annualExpenses;
  
  // Step 3: Calculate wealth available for withdrawal
  // This is total wealth minus what we need to preserve for future years
  const availableForWithdrawal = totalWealth - futureExpenseNeeds;
  
  // Step 4: Take the minimum of what we need and what we can safely withdraw
  // This prevents over-withdrawal that would jeopardize future years
  const maxSafeWithdrawal = Math.max(0, availableForWithdrawal);
  
  // If shortfall is negative (income exceeds expenses), no withdrawal needed
  if (shortfall <= 0) {
    return 0;
  }
  
  return Math.min(shortfall, maxSafeWithdrawal);
}

// =============================================================================
// ALLOCATION AND PAYMENT FUNCTIONS
// =============================================================================

/**
 * Calculates optimal debt payment amount
 * 
 * Debt payment is the minimum of:
 * 1. Current debt balance (can't pay more than you owe)
 * 2. Available payment amount (can't pay more than you have)
 * 
 * @param {number} currentDebt - Current debt balance (must be positive)
 * @param {number} availablePayment - Available payment amount (must be positive)
 * @returns {number} Optimal debt payment amount
 * 
 * @example
 * const payment = calculateDebtPayment(5000, 8000);
 * // Returns: 5000
 * // Explanation: Can pay off entire €5,000 debt with €8,000 available
 * 
 * @throws {Error} If input validation fails
 */
export function calculateDebtPayment(currentDebt, availablePayment) {
  validate(DebtPaymentSchema, { currentDebt, availablePayment });
  
  // Take the minimum of debt owed and payment available
  // This ensures we never overpay (pay more than debt balance)
  // and never pay more than we have available
  return Math.min(currentDebt, Math.max(0, availablePayment));
}

/**
 * Calculates allocation amounts from free capital
 * 
 * Applies percentage allocations to free capital to determine
 * how much goes to debt payment, savings, and investments.
 * 
 * @param {number} freeCapital - Available free capital for allocation
 * @param {number} debtAllocation - Debt allocation percentage (0-1)
 * @param {number} savingsAllocation - Savings allocation percentage (0-1)  
 * @param {number} investmentAllocation - Investment allocation percentage (0-1)
 * @returns {Object} Allocation amounts for each category
 * 
 * @example
 * const allocations = calculateAllocationAmounts(10000, 0.8, 0.1, 0.1);
 * // Returns: { debt: 8000, savings: 1000, investment: 1000 }
 * // Explanation: €10,000 × 80% = €8,000 to debt, etc.
 * 
 * @throws {Error} If input validation fails
 */
export function calculateAllocationAmounts(freeCapital, debtAllocation, savingsAllocation, investmentAllocation) {
  validate(AllocationSchema, { 
    freeCapital, 
    debtAllocation, 
    savingsAllocation, 
    investmentAllocation 
  });
  
  // Apply percentage allocations to free capital
  // Each allocation represents how much of free capital goes to each category
  return {
    debt: freeCapital * debtAllocation,
    savings: freeCapital * savingsAllocation,
    investment: freeCapital * investmentAllocation
  };
}

// =============================================================================
// PERCENTAGE AND GROWTH FUNCTIONS
// =============================================================================

/**
 * Calculates percentage growth between two values
 * 
 * Uses the formula: Growth % = ((Current - Previous) / Previous) × 100
 * This is the standard percentage change calculation used in finance.
 * 
 * @param {number} current - Current value
 * @param {number} previous - Previous value (must not be zero)
 * @returns {number} Percentage growth (positive for growth, negative for decline)
 * 
 * @example
 * const growth = calculatePercentageGrowth(110000, 100000);
 * // Returns: 10
 * // Explanation: ((€110,000 - €100,000) / €100,000) × 100 = 10%
 * 
 * @throws {Error} If previous value is zero or validation fails
 */
export function calculatePercentageGrowth(current, previous) {
  validate(PercentageGrowthSchema, { current, previous });
  
  if (previous === 0) {
    throw new Error('Previous value cannot be zero for percentage calculation');
  }
  
  // Calculate the change amount
  const change = current - previous;
  
  // Calculate percentage change: (change / original) × 100
  // This gives us the percentage increase or decrease
  const percentageChange = (change / previous) * 100;
  
  return percentageChange;
}

/**
 * Calculates absolute growth between two values
 * 
 * Simple subtraction: Growth = Current - Previous
 * Used to show absolute change in monetary amounts.
 * 
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Absolute growth (positive for growth, negative for decline)
 * 
 * @example
 * const growth = calculateAbsoluteGrowth(110000, 100000);
 * // Returns: 10000
 * // Explanation: €110,000 - €100,000 = €10,000 absolute growth
 * 
 * @throws {Error} If input validation fails
 */
export function calculateAbsoluteGrowth(current, previous) {
  validate(PercentageGrowthSchema, { current, previous });
  
  // Simple subtraction to get absolute change
  // Positive result indicates growth, negative indicates decline
  return current - previous;
}
