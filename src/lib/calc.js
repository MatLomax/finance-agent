// ============================================================================
// CONSTANTS
// ============================================================================

/** Standard emergency fund duration in months */
export const EMERGENCY_FUND_MONTHS = 6;

/** Tax-free period duration in years for new residents */
export const TAX_FREE_PERIOD_YEARS = 2;

/** Months per year constant */
export const MONTHS_PER_YEAR = 12;

/** Minimum retirement buffer in years (safety margin) */
export const MIN_RETIREMENT_BUFFER_YEARS = 5;

/** Minimum acceptable final wealth (allows small negative within tolerance) */
export const MIN_FINAL_WEALTH_TOLERANCE = -5000;

/** Minimum retirement wealth requirement (multiple of annual expenses) */
export const MIN_RETIREMENT_WEALTH_MULTIPLIER = 2;

// ============================================================================
// CURRENCY CONVERSION FUNCTIONS
// ============================================================================

/**
 * Converts USD amount to EUR using exchange rate
 * 
 * This function performs simple currency conversion needed to standardize
 * the income calculation from USD to EUR for consistent financial planning.
 * 
 * @param {number} usdAmount - Amount in USD
 * @param {number} eurUsdRate - EUR/USD exchange rate
 * @returns {number} Amount in EUR
 */
export function convertUsdToEur(usdAmount, eurUsdRate) {
  return usdAmount / eurUsdRate;
}

// ============================================================================
// SALARY CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates net monthly salary considering tax implications
 * 
 * The function handles the tax-free period for new residents (first 2 years)
 * and applies appropriate tax rates afterwards. This reflects the Thai tax
 * system for foreign residents.
 * 
 * @param {number} grossMonthly - Gross monthly salary in EUR
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.17 for 17%)
 * @param {boolean} isTaxFree - Whether salary is in tax-free period
 * @returns {number} Net monthly salary in EUR
 */
export function calculateNetSalaryMonthly(grossMonthly, taxRate, isTaxFree = false) {
  if (isTaxFree) {
    return grossMonthly;
  }
  return grossMonthly * (1 - taxRate);
}

/**
 * Converts monthly salary to annual equivalent
 * 
 * Simple multiplication function separated for clarity and testability.
 * Used throughout the financial planning calculations.
 * 
 * @param {number} monthlyAmount - Monthly amount in EUR
 * @returns {number} Annual amount in EUR
 */
export function convertMonthlyToAnnual(monthlyAmount) {
  return monthlyAmount * MONTHS_PER_YEAR;
}

// ============================================================================
// EXPENSE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates total monthly expenses from all expense categories
 * 
 * Sums all living expense categories to get total monthly burn rate.
 * This is fundamental for determining how much income is needed and
 * how much can be allocated to financial goals.
 * 
 * @param {Object} expenses - Object containing all expense categories
 * @param {number} expenses.housing - Housing costs
 * @param {number} expenses.utilities - Utility bills
 * @param {number} expenses.diningGroceries - Food and dining expenses
 * @param {number} expenses.hiredStaff - Domestic staff costs
 * @param {number} expenses.transportation - Transport costs
 * @param {number} expenses.healthInsurance - Health insurance premiums
 * @param {number} expenses.petCare - Pet-related expenses
 * @param {number} expenses.wellness - Health and wellness expenses
 * @param {number} expenses.entertainment - Entertainment budget
 * @param {number} expenses.weekendTrips - Weekend travel budget
 * @param {number} expenses.annualHoliday - Annual vacation savings
 * @param {number} expenses.discretionary - Miscellaneous discretionary spending
 * @returns {number} Total monthly expenses in EUR
 */
export function calculateTotalMonthlyExpenses(expenses) {
  return expenses.housing +
         expenses.utilities +
         expenses.diningGroceries +
         expenses.hiredStaff +
         expenses.transportation +
         expenses.healthInsurance +
         expenses.petCare +
         expenses.wellness +
         expenses.entertainment +
         expenses.weekendTrips +
         expenses.annualHoliday +
         expenses.discretionary;
}

// ============================================================================
// EMERGENCY FUND FUNCTIONS
// ============================================================================

/**
 * Calculates emergency fund target based on monthly expenses
 * 
 * Standard financial planning recommendation is 6 months of living expenses
 * as an emergency buffer. This provides financial security before investing
 * in growth assets.
 * 
 * @param {number} monthlyExpenses - Total monthly expenses in EUR
 * @param {number} months - Number of months to cover (default: 6)
 * @returns {number} Emergency fund target in EUR
 */
export function calculateEmergencyFundTarget(monthlyExpenses, months = EMERGENCY_FUND_MONTHS) {
  return monthlyExpenses * months;
}

// ============================================================================
// INVESTMENT CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates gross annual investment returns
 * 
 * Computes expected investment income before taxes based on portfolio
 * balance and expected return rate. This is used to project future
 * investment growth and income during retirement.
 * 
 * @param {number} investmentBalance - Current investment balance in EUR
 * @param {number} returnRatePercent - Annual return rate as percentage (e.g., 6 for 6%)
 * @returns {number} Gross annual investment income in EUR
 */
export function calculateInvestmentGrossIncome(investmentBalance, returnRatePercent) {
  return investmentBalance * (returnRatePercent / 100);
}

/**
 * Calculates net investment income after tax
 * 
 * Applies tax rate to investment returns to get after-tax income.
 * This is the actual spendable income from investments during retirement.
 * 
 * @param {number} grossIncome - Gross investment income in EUR
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.17 for 17%)
 * @returns {number} Net investment income after tax in EUR
 */
export function calculateInvestmentNetIncome(grossIncome, taxRate) {
  return grossIncome * (1 - taxRate);
}

// ============================================================================
// FREE CAPITAL CALCULATION
// ============================================================================

/**
 * Calculates free capital available for financial goal allocation
 * 
 * Free capital is the amount available after covering living expenses
 * and including investment income. This is what can be allocated toward
 * debt repayment, savings, and additional investments.
 * 
 * Formula: Net Salary + Investment Income - Living Expenses
 * 
 * @param {number} netSalaryAnnual - Annual net salary income in EUR
 * @param {number} annualExpenses - Total annual living expenses in EUR
 * @param {number} investmentNetIncome - Net income from investments in EUR
 * @returns {number} Free capital available for allocation in EUR
 */
export function calculateFreeCapital(netSalaryAnnual, annualExpenses, investmentNetIncome) {
  return netSalaryAnnual + investmentNetIncome - annualExpenses;
}

// ============================================================================
// FINANCIAL PHASE DETERMINATION
// ============================================================================

/**
 * Determines current financial planning phase based on debt and savings status
 * 
 * The financial planning strategy follows a phased approach:
 * 1. Debt elimination (highest priority)
 * 2. Emergency fund building (safety net)
 * 3. Retirement/wealth building (growth phase)
 * 
 * Each phase has different allocation strategies for optimal financial outcomes.
 * 
 * @param {number} debtBalance - Current debt balance in EUR
 * @param {number} savingsBalance - Current savings balance in EUR
 * @param {number} emergencyTarget - Emergency fund target in EUR
 * @returns {'debtFree'|'emergencyFund'|'retirement'} Current financial phase
 */
export function determineFinancialPhase(debtBalance, savingsBalance, emergencyTarget) {
  if (debtBalance > 0) {
    return 'debtFree';
  } else if (savingsBalance < emergencyTarget) {
    return 'emergencyFund';
  } else {
    return 'retirement';
  }
}

// ============================================================================
// ALLOCATION CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates maximum debt payment without exceeding available capital or debt balance
 * 
 * Ensures debt payments don't exceed available free capital or remaining debt.
 * This prevents over-allocation and maintains cash flow balance.
 * 
 * @param {number} freeCapital - Available free capital in EUR
 * @param {number} allocationPercent - Percentage to allocate to debt (0-100)
 * @param {number} currentDebt - Current debt balance in EUR
 * @returns {number} Actual debt payment amount in EUR
 */
export function calculateDebtPayment(freeCapital, allocationPercent, currentDebt) {
  const targetPayment = Math.max(0, freeCapital * (allocationPercent / 100));
  return Math.min(currentDebt, targetPayment);
}

/**
 * Calculates savings contribution based on allocation percentage
 * 
 * Simple percentage-based allocation of free capital to savings.
 * Savings provide liquidity and safety before investing in growth assets.
 * 
 * @param {number} freeCapital - Available free capital in EUR
 * @param {number} allocationPercent - Percentage to allocate to savings (0-100)
 * @returns {number} Savings contribution amount in EUR
 */
export function calculateSavingsContribution(freeCapital, allocationPercent) {
  return freeCapital * (allocationPercent / 100);
}

/**
 * Calculates investment contribution based on allocation percentage
 * 
 * Allocates portion of free capital to growth investments for long-term
 * wealth building and retirement funding.
 * 
 * @param {number} freeCapital - Available free capital in EUR
 * @param {number} allocationPercent - Percentage to allocate to investments (0-100)
 * @returns {number} Investment contribution amount in EUR
 */
export function calculateInvestmentContribution(freeCapital, allocationPercent) {
  return freeCapital * (allocationPercent / 100);
}

// ============================================================================
// RETIREMENT WITHDRAWAL FUNCTIONS
// ============================================================================

/**
 * Calculates optimal withdrawal strategy during retirement years
 * 
 * Determines how much to withdraw from savings vs. selling investments
 * to cover living expenses while preserving capital for remaining lifespan.
 * 
 * Strategy:
 * 1. First use investment income to cover expenses
 * 2. If insufficient, withdraw from savings first (more liquid)
 * 3. Then sell investments if needed
 * 4. Always preserve enough capital for future years
 * 
 * @param {number} annualExpenses - Annual living expenses in EUR
 * @param {number} investmentNetIncome - Net income from investments in EUR
 * @param {number} savingsBalance - Current savings balance in EUR
 * @param {number} investmentBalance - Current investment balance in EUR
 * @param {number} yearsRemaining - Years remaining until expected death
 * @returns {Object} Withdrawal details {savingsWithdrawal, investmentSale, totalWithdrawal}
 */
export function calculateRetirementWithdrawals(
  annualExpenses,
  investmentNetIncome,
  savingsBalance,
  investmentBalance,
  yearsRemaining
) {
  // Calculate expense shortfall after investment income
  const shortfall = annualExpenses - investmentNetIncome;
  
  // If investment income covers all expenses, no withdrawals needed
  if (shortfall <= 0) {
    return {
      savingsWithdrawal: 0,
      investmentSale: 0,
      totalWithdrawal: 0
    };
  }
  
  // Calculate future expense requirements for remaining years
  const futureYearsRemaining = Math.max(0, yearsRemaining - 1);
  const futureExpensesNeeded = futureYearsRemaining * annualExpenses;
  const totalCurrentWealth = savingsBalance + investmentBalance;
  
  // Don't withdraw more than we can afford for future years
  const maxWithdrawal = Math.max(0, totalCurrentWealth - futureExpensesNeeded);
  const actualWithdrawal = Math.min(shortfall, maxWithdrawal);
  
  // Prefer withdrawing from savings first (more liquid), then investments
  const savingsWithdrawal = Math.min(savingsBalance, actualWithdrawal);
  const investmentSale = Math.max(0, actualWithdrawal - savingsWithdrawal);
  
  return {
    savingsWithdrawal,
    investmentSale,
    totalWithdrawal: savingsWithdrawal + investmentSale
  };
}

// ============================================================================
// YEAR-OVER-YEAR CALCULATIONS
// ============================================================================

/**
 * Determines if a given year falls within the tax-free period
 * 
 * New residents in Thailand often get a tax-free period for their first
 * few years. This function determines if taxes apply based on years since start.
 * 
 * @param {number} yearsFromStart - Years elapsed since starting the plan
 * @returns {boolean} True if within tax-free period
 */
export function isWithinTaxFreePeriod(yearsFromStart) {
  return yearsFromStart <= TAX_FREE_PERIOD_YEARS;
}

/**
 * Updates financial balances based on contributions and withdrawals
 * 
 * Pure function that calculates new balances without side effects.
 * Takes current balances and changes, returns new balances.
 * 
 * @param {Object} currentBalances - Current financial balances
 * @param {number} currentBalances.debt - Current debt balance
 * @param {number} currentBalances.savings - Current savings balance  
 * @param {number} currentBalances.investments - Current investment balance
 * @param {Object} changes - Changes to apply
 * @param {number} changes.debtPayment - Amount paid toward debt
 * @param {number} changes.savingsContribution - Amount added to savings
 * @param {number} changes.investmentContribution - Amount added to investments
 * @param {number} changes.savingsWithdrawal - Amount withdrawn from savings (retirement)
 * @param {number} changes.investmentSale - Amount sold from investments (retirement)
 * @returns {Object} New balances after applying changes
 */
export function updateFinancialBalances(currentBalances, changes) {
  return {
    debt: Math.max(0, currentBalances.debt - changes.debtPayment),
    savings: currentBalances.savings + changes.savingsContribution - changes.savingsWithdrawal,
    investments: currentBalances.investments + changes.investmentContribution - changes.investmentSale
  };
}

// ============================================================================
// OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Evaluates retirement feasibility for a given retirement age
 * 
 * Checks if retiring at a specific age would result in acceptable final
 * wealth (not running out of money before death). Used by optimization
 * algorithms to find the ideal retirement age.
 * 
 * @param {number} finalWealth - Projected wealth at end of life in EUR
 * @param {number} retirementWealth - Wealth at retirement age in EUR
 * @param {number} annualExpenses - Annual living expenses in EUR
 * @returns {boolean} True if retirement at this age is financially viable
 */
export function isRetirementViable(finalWealth, retirementWealth, annualExpenses) {
  const hasMinimumRetirementWealth = retirementWealth > (annualExpenses * MIN_RETIREMENT_WEALTH_MULTIPLIER);
  const hasAcceptableFinalWealth = finalWealth >= MIN_FINAL_WEALTH_TOLERANCE;
  
  return hasMinimumRetirementWealth && hasAcceptableFinalWealth;
}

/**
 * Calculates distance from ideal final wealth (close to zero)
 * 
 * The optimal financial plan should end with wealth close to zero at death
 * (neither running out too early nor leaving excessive unused wealth).
 * This function measures how close a scenario comes to that ideal.
 * 
 * @param {number} finalWealth - Projected final wealth in EUR
 * @returns {number} Distance from ideal (absolute value)
 */
export function calculateOptimalityScore(finalWealth) {
  return Math.abs(finalWealth);
}
