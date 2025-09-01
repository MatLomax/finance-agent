# Finance Agent Architecture Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Business Logic Layer](#business-logic-layer)
3. [UI Layer](#ui-layer)
4. [State Management Layer](#state-management-layer)
5. [Utilities Layer](#utilities-layer)
6. [Data Flow](#data-flow)
7. [Performance Architecture](#performance-architecture)
8. [Testing Architecture](#testing-architecture)

## Architecture Overview

The Finance Agent follows a layered architecture with clear separation of concerns:

```
UI Layer (src/ui/) → State Management (src/state/) → Business Logic (src/lib/) → Utilities (src/utils/)
```

### Core Principles

1. **Pure Functions**: All business logic functions have no side effects
2. **Immutable Data**: State changes create new objects, never mutate existing ones
3. **Observable State**: UI automatically updates when state changes through observer pattern
4. **Educational Code**: Every financial function includes step-by-step formula explanations
5. **Performance First**: Intelligent caching, lazy loading, and minimal bundle size

## Business Logic Layer

### Core Simulation Engine

#### `src/lib/simulate-wealth.js`

**Purpose**: Primary wealth simulation engine that orchestrates multi-phase financial planning.

**Key Functions**:

```javascript
/**
 * Simulates wealth accumulation across debt elimination, emergency fund, and retirement phases
 * @param {Object} input - Financial input data
 * @param {number} input.monthlyIncome - Net monthly income in EUR
 * @param {number} input.monthlyExpenses - Total monthly expenses in EUR
 * @param {number} input.currentAge - Current age in years
 * @param {number} input.startingDebt - Current debt amount in EUR
 * @param {number} input.startingSavings - Current savings in EUR
 * @param {number} input.startingInvestments - Current investments in EUR
 * @param {Array} input.phases - Array of phase allocation percentages
 * @returns {Array} Year-by-year wealth simulation results
 */
function simulateWealth(input)
```

**Educational Features**:
- Step-by-step compound interest calculations
- Phase transition logic explanation
- Real-world financial planning concepts

#### `src/lib/phase-organization.js`

**Purpose**: Manages the three-phase financial planning strategy.

**Phase Logic**:
1. **Debt Elimination**: All surplus income goes to debt until debt = 0
2. **Emergency Fund**: Build 6 months of expenses in liquid savings
3. **Retirement**: Invest surplus for long-term wealth building

**Key Functions**:

```javascript
/**
 * Determines current financial phase based on debt and emergency fund status
 * @param {number} debt - Current debt amount
 * @param {number} savings - Current savings amount
 * @param {number} emergencyTarget - Target emergency fund amount
 * @returns {'debt'|'emergency'|'retirement'} Current phase
 */
function determinePhase(debt, savings, emergencyTarget)

/**
 * Calculates allocation percentages for debt payment, savings, and investments
 * @param {string} phase - Current financial phase
 * @param {Array} phaseAllocations - User-defined allocation preferences
 * @returns {Object} Allocation percentages for each category
 */
function calculateAllocations(phase, phaseAllocations)
```

#### `src/lib/optimal-retirement.js`

**Purpose**: Calculates optimal retirement age based on financial goals and constraints.

**Algorithm Features**:
- Binary search for efficient optimization
- Configurable retirement income targets
- Multiple constraint validation

**Key Functions**:

```javascript
/**
 * Finds optimal retirement age using binary search algorithm
 * @param {Object} input - Financial input data
 * @param {number} targetRetirementIncome - Desired annual retirement income
 * @param {number} maxAge - Maximum age to consider for retirement
 * @returns {number|null} Optimal retirement age or null if not achievable
 */
function findOptimalRetirementAge(input, targetRetirementIncome = 40000, maxAge = 80)
```

### Financial Calculations

#### `src/lib/investments.js`

**Purpose**: Investment growth calculations with compound interest.

**Key Functions**:

```javascript
/**
 * Calculates investment value after compound growth
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual growth rate (as decimal, e.g., 0.07 for 7%)
 * @param {number} years - Number of years
 * @returns {number} Final investment value
 */
function calculateCompoundGrowth(principal, rate, years)

/**
 * Calculates investment returns for a given year with contributions
 * @param {number} currentValue - Current investment value
 * @param {number} annualContribution - Annual contribution amount
 * @param {number} growthRate - Annual growth rate
 * @returns {number} New investment value after growth and contributions
 */
function calculateInvestmentReturns(currentValue, annualContribution, growthRate)
```

#### `src/lib/currency.js`

**Purpose**: Multi-currency conversion for international cost-of-living calculations.

**Conversion Chain**: USD salary → EUR expenses → THB cost-of-living

**Key Functions**:

```javascript
/**
 * Converts USD salary to EUR using current exchange rate
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - USD to EUR exchange rate
 * @returns {number} Amount in EUR
 */
function convertUSDToEUR(usdAmount, exchangeRate)

/**
 * Converts EUR expenses to THB for cost-of-living display
 * @param {number} eurAmount - Amount in EUR
 * @param {number} exchangeRate - EUR to THB exchange rate
 * @returns {number} Amount in THB
 */
function convertEURToTHB(eurAmount, exchangeRate)
```

#### `src/lib/tax.js`

**Purpose**: Tax calculations with multi-year progression support.

**Features**:
- Progressive tax brackets
- Tax-free period modeling
- Annual tax calculation with educational explanations

**Key Functions**:

```javascript
/**
 * Calculates annual tax based on gross income and tax rate
 * @param {number} grossIncome - Annual gross income
 * @param {number} taxRate - Tax rate as percentage (0-100)
 * @returns {number} Annual tax amount
 */
function calculateAnnualTax(grossIncome, taxRate)

/**
 * Determines if current year is tax-free based on year and tax-free period
 * @param {number} currentYear - Current simulation year
 * @param {number} taxFreeYears - Number of initial tax-free years
 * @returns {boolean} True if current year is tax-free
 */
function isTaxFreeYear(currentYear, taxFreeYears)
```

### Data Validation

#### `src/lib/validators.js`

**Purpose**: TypeBox validation schemas for all financial data.

**Schema Types**:
- Financial input validation
- Simulation result validation
- User preference validation

**Key Schemas**:

```javascript
/**
 * Financial input data schema
 */
const FinancialInputSchema = Type.Object({
  monthlyIncome: Type.Number({ minimum: 0 }),
  monthlyExpenses: Type.Number({ minimum: 0 }),
  currentAge: Type.Number({ minimum: 18, maximum: 100 }),
  startingDebt: Type.Number({ minimum: 0 }),
  startingSavings: Type.Number({ minimum: 0 }),
  startingInvestments: Type.Number({ minimum: 0 })
})

/**
 * Validates financial input data
 * @param {Object} data - Financial input data
 * @returns {boolean} True if valid
 * @throws {Error} Detailed validation error message
 */
function validateFinancialInput(data)
```

## UI Layer

### Input Components

#### `src/ui/financial-inputs.js`

**Purpose**: Dynamic form generation with auto-save and real-time validation.

**Features**:
- Automatic localStorage persistence
- Debounced input handling
- Real-time validation feedback
- Observer pattern notifications

**Key Functions**:

```javascript
/**
 * Creates and renders financial input form
 * @param {HTMLElement} container - Container element for form
 * @param {Object} initialData - Initial form data
 * @returns {HTMLElement} Generated form element
 */
function createFinancialInputs(container, initialData)

/**
 * Handles input change events with debouncing
 * @param {Event} event - Input change event
 * @param {Function} onUpdate - Callback for data updates
 */
function handleInputChange(event, onUpdate)
```

#### `src/ui/summary-cards.js`

**Purpose**: Financial overview cards with milestone summaries.

**Card Types**:
- Income overview with tax calculations
- Expense breakdown with emergency fund targets
- Milestone summary with key ages

**Key Functions**:

```javascript
/**
 * Creates financial overview summary cards
 * @param {Object} financialData - Current financial input data
 * @param {Object} simulationResults - Simulation calculation results
 * @returns {HTMLElement} Summary cards container
 */
function createSummaryCards(financialData, simulationResults)
```

### Data Visualization

#### `src/ui/wealth-chart.js`

**Purpose**: Interactive wealth trajectory visualization with μPlot.

**Features**:
- High-performance canvas rendering
- Phase transition markers
- Interactive hover details
- Responsive design for mobile
- Lazy loading for performance

**Key Functions**:

```javascript
/**
 * Creates interactive wealth chart with phase visualizations
 * @param {HTMLElement} container - Chart container element
 * @param {Array} simulationData - Year-by-year wealth data
 * @returns {Object} μPlot chart instance
 */
function createWealthChart(container, simulationData)

/**
 * Lazily loads chart module when needed
 * @returns {Promise} Chart module import
 */
async function loadChartModule()
```

#### `src/ui/phase-tables.js`

**Purpose**: Year-by-year breakdown tables with delta calculations.

**Features**:
- Dynamic table generation for each phase
- Color-coded delta calculations
- Milestone row highlighting
- Responsive design with horizontal scrolling

**Key Functions**:

```javascript
/**
 * Creates phase breakdown tables
 * @param {Array} simulationData - Simulation results data
 * @param {Object} phases - Phase boundary information
 * @returns {HTMLElement} Tables container element
 */
function createPhaseTables(simulationData, phases)
```

### Application Control

#### `src/ui/calculation-controller.js`

**Purpose**: Orchestrates calculation triggers with performance optimization.

**Features**:
- Debounced calculation triggers (300ms)
- Loading state management
- Error handling and recovery
- Observer pattern for state changes

**Key Functions**:

```javascript
/**
 * Controls when financial calculations are triggered
 * @param {Object} dependencies - Required calculation dependencies
 * @returns {Object} Controller instance with public methods
 */
function createCalculationController(dependencies)

/**
 * Triggers recalculation with debouncing
 * @param {Object} newData - Updated financial data
 */
function triggerCalculation(newData)
```

#### `src/ui/theme-manager.js`

**Purpose**: Dark/light theme management with CSS custom properties.

**Features**:
- CSS custom property updates
- localStorage theme persistence
- Smooth theme transitions
- System preference detection

**Key Functions**:

```javascript
/**
 * Initializes theme system and applies saved preferences
 * @param {string} defaultTheme - Default theme ('light' or 'dark')
 */
function initializeTheme(defaultTheme = 'dark')

/**
 * Toggles between light and dark themes
 */
function toggleTheme()

/**
 * Applies theme by updating CSS custom properties
 * @param {string} theme - Theme name to apply
 */
function applyTheme(theme)
```

## State Management Layer

### Data Persistence

#### `src/state/financial-data.js`

**Purpose**: User input persistence with localStorage and observer notifications.

**Features**:
- Automatic localStorage sync
- Default value management
- Observer pattern for change notifications
- Data migration for schema changes

**Key Functions**:

```javascript
/**
 * Saves financial data to localStorage
 * @param {Object} data - Financial data to save
 */
function saveFinancialData(data)

/**
 * Loads financial data from localStorage with defaults
 * @returns {Object} Financial data with defaults applied
 */
function loadFinancialData()

/**
 * Subscribes to financial data changes
 * @param {Function} callback - Callback for data change notifications
 */
function subscribeToFinancialData(callback)
```

#### `src/state/simulation-results.js`

**Purpose**: Intelligent LRU cache for expensive simulation results.

**Features**:
- LRU eviction strategy (max 100 entries)
- Deterministic cache key generation
- Performance tracking with hit/miss statistics
- Memory management with automatic cleanup

**Key Functions**:

```javascript
/**
 * Gets cached simulation result or calculates new one
 * @param {Object} input - Financial input data
 * @param {Function} calculator - Simulation calculation function
 * @returns {Array} Simulation results (cached or calculated)
 */
function getCachedSimulationResult(input, calculator)

/**
 * Generates deterministic cache key from input data
 * @param {Object} input - Financial input data
 * @returns {string} Unique cache key
 */
function generateCacheKey(input)

/**
 * Gets cache performance statistics
 * @returns {Object} Cache hit/miss statistics and memory usage
 */
function getCacheStats()
```

### Observer Pattern

#### `src/state/observers.js`

**Purpose**: Publisher-subscriber pattern for state change notifications.

**Features**:
- Multiple subscription support
- Automatic cleanup prevention of memory leaks
- Error boundary for subscriber exceptions

**Key Functions**:

```javascript
/**
 * Creates observer instance for state change notifications
 * @returns {Object} Observer with subscribe/notify/unsubscribe methods
 */
function createObserver()

/**
 * Subscribes to state changes
 * @param {Function} callback - Callback function for notifications
 * @returns {Function} Unsubscribe function
 */
function subscribe(callback)

/**
 * Notifies all subscribers of state change
 * @param {*} data - Data to send to subscribers
 */
function notify(data)
```

## Utilities Layer

### DOM Manipulation

#### `src/utils/dom-helpers.js`

**Purpose**: Performance-optimized DOM manipulation utilities.

**Features**:
- Batched DOM updates with requestAnimationFrame
- Memory-efficient event listener management
- CSS custom property manipulation
- Element creation with performance optimization

**Key Functions**:

```javascript
/**
 * Creates DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attributes = {}, children = [])

/**
 * Batches DOM updates using requestAnimationFrame
 * @param {Function} updateFunction - Function containing DOM updates
 */
function batchDOMUpdates(updateFunction)

/**
 * Adds event listener with automatic cleanup tracking
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @returns {Function} Cleanup function
 */
function addEventListenerWithCleanup(element, event, handler)
```

### Formatting Utilities

#### `src/utils/formatting/currency.js`

**Purpose**: Currency formatting with locale support.

**Features**:
- Multiple currency support (EUR, USD, THB)
- Locale-aware formatting
- Precision control for different currencies

**Key Functions**:

```javascript
/**
 * Formats currency amount with proper locale and symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (EUR, USD, THB)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'EUR', locale = 'en-EU')
```

#### `src/utils/formatting/display.js`

**Purpose**: General display formatting utilities.

**Features**:
- Number formatting with appropriate precision
- Percentage formatting
- Delta formatting with color coding

**Key Functions**:

```javascript
/**
 * Formats number for display with appropriate precision
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
function formatNumber(value, decimals = 0)

/**
 * Formats percentage with symbol and color coding
 * @param {number} value - Percentage value (0-100)
 * @param {boolean} showSign - Whether to show +/- sign
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, showSign = false)
```

## Data Flow

### Input Processing Flow

1. **User Input** → `financial-inputs.js` captures form changes
2. **Validation** → `validators.js` validates input data with TypeBox schemas
3. **Persistence** → `financial-data.js` saves to localStorage
4. **Notification** → `observers.js` notifies subscribers of changes
5. **Calculation Trigger** → `calculation-controller.js` debounces and triggers calculations

### Calculation Flow

1. **Cache Check** → `simulation-results.js` checks LRU cache for existing results
2. **Business Logic** → `simulate-wealth.js` orchestrates financial calculations
3. **Phase Logic** → `phase-organization.js` determines current financial phase
4. **Investment Calculations** → `investments.js` calculates compound growth
5. **Result Caching** → `simulation-results.js` caches results for future use

### Display Flow

1. **Result Processing** → Calculation results processed by UI modules
2. **Summary Cards** → `summary-cards.js` displays financial overview
3. **Phase Tables** → `phase-tables.js` shows year-by-year breakdown
4. **Chart Visualization** → `wealth-chart.js` renders interactive charts (lazy loaded)
5. **Formatting** → `formatting/` utilities format all displayed values

## Performance Architecture

### Bundle Optimization

- **Tree Shaking**: Only used functions included in production bundle
- **Code Splitting**: Chart module loaded lazily when needed
- **Minification**: esbuild optimizes and compresses production code
- **External Dependencies**: Large libraries loaded from CDN to reduce bundle size

### Runtime Performance

- **LRU Caching**: Simulation results cached to prevent expensive recalculations
- **Debounced Input**: 300ms delay aggregates rapid user input changes
- **Batched DOM Updates**: DOM manipulations batched with requestAnimationFrame
- **Memory Management**: Event listeners and observers cleaned up automatically

### Performance Monitoring

- **Bundle Size Validation**: Automated checks ensure bundle stays under 25KB
- **Performance Budgets**: Time to Interactive must stay under 300ms
- **Cache Performance**: Hit/miss ratios tracked for optimization insights
- **Test Performance**: Test suite must complete in under 2 seconds

## Testing Architecture

### Test Structure

- **Co-located Tests**: Each module file has corresponding `.test.js` file in same directory
- **Unit Tests**: Pure function testing with comprehensive edge case coverage
- **Integration Tests**: Cross-module interaction testing
- **UI Tests**: Component testing with JSDOM environment

### Test Categories

1. **Pure Function Tests**: Mathematical accuracy and edge case handling
2. **State Management Tests**: Data persistence and observer pattern functionality
3. **UI Component Tests**: DOM manipulation and user interaction simulation
4. **Integration Tests**: Complete data flow from input to display
5. **Performance Tests**: Bundle size, calculation speed, and memory usage

### Testing Standards

- **100% Coverage**: All functions must have comprehensive test coverage
- **Educational Tests**: Tests document expected behavior and edge cases
- **Fast Execution**: Entire test suite completes in under 2 seconds
- **JSDOM Environment**: UI tests run in simulated browser environment
- **Async Testing**: Proper handling of debounced operations and lazy loading

This architecture provides a solid foundation for maintainable, testable, and performant financial planning software while maintaining educational value through comprehensive documentation and clear separation of concerns.
