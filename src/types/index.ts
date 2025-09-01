/**
 * @fileoverview TypeScript type definitions for Finance Agent
 * 
 * Core type definitions that ensure type safety across the entire application.
 * These types prevent the kind of runtime errors we just encountered.
 */

// ==================== CORE FINANCIAL DATA TYPES ====================

export type PhaseAllocation = {
  readonly debt: number;
  readonly savings: number;
  readonly investments: number;
}

export type FinancialAllocations = {
  readonly debtPhase: PhaseAllocation;
  readonly emergencyPhase: PhaseAllocation;
  readonly retirementPhase: PhaseAllocation;
}

export type FinancialInputData = {
  // Schema information
  readonly schemaVersion: number;
  readonly lastUpdated: string;
  readonly version: string;
  
  // Income parameters (USD/EUR amounts)
  readonly grossUsd: number;
  readonly eurUsd: number;
  readonly thbEur: number;
  readonly taxRate: number;
  
  // Monthly expenses (EUR amounts)
  readonly housing: number;
  readonly utilities: number;
  readonly diningGroceries: number;
  readonly hiredStaff: number;
  readonly transportation: number;
  readonly healthInsurance: number;
  readonly petCare: number;
  readonly wellness: number;
  readonly entertainment: number;
  readonly weekendTrips: number;
  readonly annualHoliday: number;
  readonly discretionary: number;
  
  // Legacy allocation percentages (for backwards compatibility)
  readonly allocDebt1: number;
  readonly allocSavings1: number;
  readonly allocInvestment1: number;
  readonly allocDebt2: number;
  readonly allocSavings2: number;
  readonly allocInvestment2: number;
  readonly allocSavings3: number;
  readonly allocInvestment3: number;
  
  // Personal and investment parameters
  readonly currentAge: number;
  readonly lifespan: number;
  readonly investmentReturnRate: number;
  readonly totalDebt: number;
  readonly totalSavings: number;
  readonly totalInvestments: number;
  
  // Financial planning parameters
  readonly emergencyFundMonths: number;
  readonly defaultRetirementAge: number;
  readonly retirementTestBuffer: number;
  readonly retirementSafetyBuffer: number;
}

// ==================== SIMULATION TYPES ====================

export type FinancialPhase = 'debt' | 'emergency' | 'retirement';

export type AllocationAmounts = {
  readonly debtPayment: number;
  readonly savingsContribution: number;
  readonly investmentContribution: number;
}

export type SimulationYearParams = {
  readonly age: number;
  readonly currentAge: number;
  readonly retirementAge: number;
  readonly debt: number;
  readonly savings: number;
  readonly investments: number;
  readonly annualExpenses: number;
  readonly emergencyFundTarget: number;
  readonly netSalaryMonthly0: number;
  readonly netSalaryMonthly1: number;
  readonly investmentReturnRate: number;
  readonly taxRate: number;
  readonly lifespan: number;
  readonly allocations: FinancialAllocations;
}

export type SimulationYearResult = {
  readonly age: number;
  readonly debt: number;
  readonly savings: number;
  readonly investments: number;
  readonly isRetired: boolean;
  readonly freeCapital: number;
  readonly investmentGrossIncome: number;
  readonly investmentNetIncome: number;
  readonly savingsWithdrawal: number;
  readonly investmentSale: number;
  readonly phase: FinancialPhase;
}

export type RetirementWithdrawal = {
  readonly savingsWithdrawal: number;
  readonly investmentSale: number;
}

export type YearlySimulationData = {
  readonly age: number;
  readonly yearsFromNow: number;
  readonly grossIncome: number;
  readonly netIncome: number;
  readonly expenses: number;
  readonly freeCapital: number;
  readonly debt: number;
  readonly savings: number;
  readonly investments: number;
  readonly debtPayment: number;
  readonly savingsContribution: number;
  readonly investmentContribution: number;
  readonly phase: FinancialPhase;
}

export type SimulationPhases = {
  readonly debt: readonly YearlySimulationData[];
  readonly emergency: readonly YearlySimulationData[];
  readonly retirement: readonly YearlySimulationData[];
}

export type WealthSimulationResult = {
  readonly yearlyData: readonly YearlySimulationData[];
  readonly phases: SimulationPhases;
  readonly finalWealth: number;
  readonly retirementAge: number;
  readonly totalYears: number;
}

// ==================== ENHANCED SIMULATION INPUT ====================

export type SimulationInput = FinancialInputData & {
  readonly grossSalaryMonthly: number; // Derived from grossUsd * eurUsd
  readonly allocations: FinancialAllocations; // Structured allocations
}

// ==================== CALCULATION RESULT TYPES ====================

export type CalculationResult = {
  readonly success: boolean;
  readonly data?: WealthSimulationResult;
  readonly error?: string;
  readonly fromCache?: boolean;
}

export type CalculationEvent = {
  readonly type: 'calculation-start' | 'calculation-complete';
  readonly results?: WealthSimulationResult;
}

// ==================== UI COMPONENT TYPES ====================

export type FinancialSummaryData = {
  readonly grossSalaryMonthly: number;
  readonly netSalaryMonthly0: number;
  readonly netSalaryMonthly1: number;
  readonly monthlyExpenses: number;
  readonly emergencyFundTarget: number;
  readonly taxRate: number;
  readonly currentAge: number;
}

export type InputFieldProps = {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly step?: string;
  readonly isPercentage?: boolean;
}

// ==================== CACHE TYPES ====================

export type CacheEntry<T> = {
  readonly data: T;
  readonly timestamp: number;
  readonly accessCount: number;
}

export type CacheStats = {
  readonly entries: number;
  readonly hits: number;
  readonly misses: number;
  readonly hitRate: number;
}

// ==================== ERROR TYPES ====================

export type ValidationError = {
  readonly field: string;
  readonly message: string;
  readonly value: unknown;
}

export type AppError = {
  readonly error: Error;
  readonly context: string;
  readonly timestamp: number;
}

// ==================== UTILITY TYPES ====================

export type ThemeName = 'light' | 'dark';

export type EventDelegatorConfig = {
  readonly [selector: string]: (event: Event, element: HTMLElement) => void;
}

// ==================== TYPE GUARDS ====================

export function isValidPhase(phase: string): phase is FinancialPhase {
  return ['debt', 'emergency', 'retirement'].includes(phase);
}

export function isFinancialInputData(data: unknown): data is FinancialInputData {
  return typeof data === 'object' && 
         data !== null && 
         'grossUsd' in data && 
         'currentAge' in data &&
         'schemaVersion' in data;
}

// ==================== TRANSFORMATION UTILITIES ====================

/**
 * Transform legacy allocation format to structured allocations
 */
export function transformAllocations(input: FinancialInputData): FinancialAllocations {
  return {
    debtPhase: {
      debt: input.allocDebt1,
      savings: input.allocSavings1,
      investments: input.allocInvestment1
    },
    emergencyPhase: {
      debt: input.allocDebt2,
      savings: input.allocSavings2,
      investments: input.allocInvestment2
    },
    retirementPhase: {
      debt: 0, // Always 0 in retirement phase
      savings: input.allocSavings3,
      investments: input.allocInvestment3
    }
  };
}

/**
 * Transform financial input data to simulation input
 */
export function createSimulationInput(
  input: FinancialInputData,
  grossSalaryMonthly: number
): SimulationInput {
  return {
    ...input,
    grossSalaryMonthly,
    allocations: transformAllocations(input)
  };
}
