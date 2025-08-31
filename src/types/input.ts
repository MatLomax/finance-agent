import { Static, Type } from '@sinclair/typebox'

/**
 * Financial Planning Calculator Input Schema
 * Complete set of inputs for the Chiang Mai Financial Simulator
 */
export const InputSchema = Type.Object({
  // Monthly Income
  grossUsd: Type.Number({ 
    minimum: 0, 
    description: 'Gross USD Monthly Income' 
  }),
  eurUsd: Type.Number({ 
    minimum: 0, 
    description: 'Exchange Rate EUR/USD' 
  }),
  thbEur: Type.Number({ 
    minimum: 0, 
    description: 'Exchange Rate THB/EUR' 
  }),
  taxRate: Type.Number({ 
    minimum: 0, 
    maximum: 1, 
    description: 'Tax Rate After 2 Years (decimal, e.g. 0.17 for 17%)' 
  }),

  // Monthly Expenses (EUR)
  housing: Type.Number({ 
    minimum: 0, 
    description: 'Housing expenses' 
  }),
  utilities: Type.Number({ 
    minimum: 0, 
    description: 'Utilities expenses' 
  }),
  diningGroceries: Type.Number({ 
    minimum: 0, 
    description: 'Dining & Groceries expenses' 
  }),
  hiredStaff: Type.Number({ 
    minimum: 0, 
    description: 'Hired Staff expenses' 
  }),
  transportation: Type.Number({ 
    minimum: 0, 
    description: 'Transportation expenses' 
  }),
  healthInsurance: Type.Number({ 
    minimum: 0, 
    description: 'Health Insurance expenses' 
  }),
  petCare: Type.Number({ 
    minimum: 0, 
    description: 'Pet Care expenses' 
  }),
  wellness: Type.Number({ 
    minimum: 0, 
    description: 'Wellness expenses' 
  }),
  entertainment: Type.Number({ 
    minimum: 0, 
    description: 'Entertainment expenses' 
  }),
  weekendTrips: Type.Number({ 
    minimum: 0, 
    description: 'Weekend Trips expenses' 
  }),
  annualHoliday: Type.Number({ 
    minimum: 0, 
    description: 'Annual Holiday Savings' 
  }),
  discretionary: Type.Number({ 
    minimum: 0, 
    description: 'Discretionary expenses' 
  }),

  // Starting Financial Position
  currentAge: Type.Number({ 
    minimum: 0, 
    maximum: 120, 
    description: 'Current Age' 
  }),
  lifespan: Type.Number({ 
    minimum: 0, 
    maximum: 150, 
    description: 'Expected Lifespan' 
  }),
  investmentReturnRate: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Expected Annual Investment Return %' 
  }),
  totalDebt: Type.Number({ 
    minimum: 0, 
    description: 'Total Debt (EUR)' 
  }),
  totalSavings: Type.Number({ 
    minimum: 0, 
    description: 'Total Savings (EUR)' 
  }),
  totalInvestments: Type.Number({ 
    minimum: 0, 
    description: 'Total Investments (EUR)' 
  }),

  // Phase 1: Debt Elimination - Allocation percentages
  allocDebt1: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Debt Repayment % in Phase 1' 
  }),
  allocSavings1: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Savings % in Phase 1' 
  }),
  allocInvestment1: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Investment % in Phase 1' 
  }),

  // Phase 2: Emergency Fund - Allocation percentages
  allocDebt2: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Debt Repayment % in Phase 2' 
  }),
  allocSavings2: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Savings % in Phase 2' 
  }),
  allocInvestment2: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Investment % in Phase 2' 
  }),

  // Phase 3: Retirement Planning - Allocation percentages
  allocSavings3: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Savings % in Phase 3' 
  }),
  allocInvestment3: Type.Number({ 
    minimum: 0, 
    maximum: 100, 
    description: 'Investment % in Phase 3' 
  })
})

/**
 * TypeScript type inferred from the Typebox schema
 */
export type InputData = Static<typeof InputSchema>

/**
 * Default values for the financial calculator
 */
export const DEFAULT_INPUT: InputData = {
  grossUsd: 9000,
  eurUsd: 1.17,
  thbEur: 37.75,
  taxRate: 0.17,
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
  allocDebt1: 80,
  allocSavings1: 10,
  allocInvestment1: 10,
  allocDebt2: 0,
  allocSavings2: 70,
  allocInvestment2: 30,
  allocSavings3: 20,
  allocInvestment3: 80,
  currentAge: 33,
  lifespan: 90,
  investmentReturnRate: 6,
  totalDebt: 75000,
  totalSavings: 0,
  totalInvestments: 0
}
