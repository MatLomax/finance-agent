/**
 * @fileoverview Expense calculation and planning functions
 * 
 * This module handles all expense-related calculations including monthly totals,
 * annual projections, and emergency fund planning. Critical for budgeting
 * and financial planning in the finance agent.
 * 
 * All functions are pure with comprehensive validation and educational documentation.
 */



/**
 * Calculates total monthly expenses from individual expense categories
 * 
 * This function sums all monthly expense categories to determine
 * total cost of living. Used as the foundation for emergency fund
 * calculations and retirement planning.
 * 
 * @param {Object} expenses - Object containing all monthly expense categories
 * @returns {number} Total monthly expenses
 * 
 * @example
 * const total = calculateMonthlyExpenses(expenseCategories);
 * // Returns: sum of all expense categories
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
 * Simple multiplication: Annual = Monthly × 12
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
 * Calculates emergency fund target based on configurable months
 * Emergency fund formula: Monthly Expenses × Emergency Fund Months
 * 
 * @param {number} monthlyExpenses - Total monthly expenses (must be positive)
 * @param {number} emergencyFundMonths - Number of months of expenses to save (default: 6)
 * @returns {number} Emergency fund target amount
 * 
 * @example
 * const emergencyFund = calculateEmergencyFundTarget(4882, 6);
 * // Returns: 29292
 * // Explanation: €4882/month × 6 months = €29,292 emergency fund
 * 
 * @throws {Error} If monthly expenses or emergency fund months is negative
 */
export function calculateEmergencyFundTarget(monthlyExpenses, emergencyFundMonths = 6) {
  if (typeof monthlyExpenses !== 'number' || monthlyExpenses < 0) {
    throw new Error('Monthly expenses must be a non-negative number');
  }
  
  if (typeof emergencyFundMonths !== 'number' || emergencyFundMonths < 0) {
    throw new Error('Emergency fund months must be a non-negative number');
  }
  
  // Emergency fund calculation: configurable months of expenses
  // This provides a safety net for job loss or unexpected expenses
  // 6 months is considered conservative but provides good security
  return monthlyExpenses * emergencyFundMonths;
}
