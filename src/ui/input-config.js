/**
 * @fileoverview Input field configuration data
 * 
 * This module contains the configuration for all financial input sections.
 * Organized by logical groupings with educational descriptions and validation rules.
 */

/**
 * Financial input sections configuration
 * Each section contains related financial inputs with educational descriptions
 */
export const INPUT_SECTIONS = [
  {
    title: 'Income Parameters',
    description: 'Configure your salary and currency conversion rates. The system converts USD salary to EUR for expense tracking, then to THB for Thai cost-of-living context.',
    inputs: [
      {
        id: 'grossUsd',
        label: 'Monthly Gross Salary (USD)',
        type: 'number',
        value: 9000,
        min: 1000,
        max: 50000,
        step: 100,
        unit: '$',
        helpText: 'Your gross monthly salary before taxes in US dollars'
      },
      {
        id: 'eurUsd',
        label: 'EUR/USD Exchange Rate',
        type: 'number',
        value: 1.17,
        min: 0.5,
        max: 2.0,
        step: 0.01,
        helpText: 'Current exchange rate from USD to EUR for expense tracking'
      },
      {
        id: 'thbEur',
        label: 'THB/EUR Exchange Rate',
        type: 'number',
        value: 37.75,
        min: 20,
        max: 60,
        step: 0.25,
        helpText: 'Exchange rate from EUR to Thai Baht for cost-of-living context'
      },
      {
        id: 'taxRate',
        label: 'Tax Rate',
        type: 'range',
        value: 0.17,
        min: 0,
        max: 0.5,
        step: 0.01,
        unit: '%',
        helpText: 'Your effective tax rate (17% is typical Thai rate after 2-year exemption)'
      }
    ]
  },
  {
    title: 'Monthly Expenses (EUR)',
    description: 'Track your monthly living expenses in euros. These amounts reflect comfortable expat living in Thailand.',
    inputs: [
      {
        id: 'housing',
        label: 'Housing & Rent',
        type: 'number',
        value: 1400,
        min: 200,
        max: 5000,
        step: 50,
        unit: '€',
        helpText: 'Monthly rent for quality 1-2BR condo in central location'
      },
      {
        id: 'utilities',
        label: 'Utilities & Internet',
        type: 'number',
        value: 200,
        min: 50,
        max: 500,
        step: 10,
        unit: '€',
        helpText: 'Electricity, water, internet, and essential services'
      },
      {
        id: 'diningGroceries',
        label: 'Food & Dining',
        type: 'number',
        value: 750,
        min: 200,
        max: 2000,
        step: 25,
        unit: '€',
        helpText: 'Mix of local street food, restaurants, and grocery shopping'
      },
      {
        id: 'hiredStaff',
        label: 'Hired Staff',
        type: 'number',
        value: 340,
        min: 0,
        max: 1000,
        step: 20,
        unit: '€',
        helpText: 'Cleaning service, laundry, and household assistance'
      }
    ]
  }
];
