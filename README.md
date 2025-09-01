# Finance Agent

Ultra-lightweight vanilla JavaScript finance agent with TypeScript design-time validation and zero-build architecture.

## Architecture

### Core Principles

- **Pure JavaScript ES2022+** - Modern ES modules with esbuild production bundling
- **JSDoc + TypeScript** - Compile-time type checking in pure .js files
- **Minimal dependencies** - Only 3 carefully chosen utilities (tree-shakeable imports)
- **< 25kb bundle** - Ultra-lightweight with tree-shaking and minification (8.42KB gzipped)
- **Native DOM APIs** - No framework overhead, zero-build development
- **Educational Code** - Every function includes financial formula explanations

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (src/ui/)                       │
├─────────────────────────────────────────────────────────────┤
│  financial-inputs.js    │  phase-tables.js                 │
│  summary-cards.js       │  wealth-chart.js                 │
│  calculation-controller.js │ theme-manager.js             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 State Management (src/state/)               │
├─────────────────────────────────────────────────────────────┤
│  financial-data.js      │  simulation-results.js           │
│  defaults.js            │  observers.js                    │
│  validation.js          │                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Business Logic (src/lib/)                    │
├─────────────────────────────────────────────────────────────┤
│  simulate-wealth.js     │  retirement.js                   │
│  phase-organization.js  │  optimal-retirement.js           │
│  investments.js         │  allocations.js                  │
│  expenses.js            │  growth.js                       │
│  currency.js            │  tax.js                          │
│  validators.js          │  simulation-helpers.js           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Utilities (src/utils/)                     │
├─────────────────────────────────────────────────────────────┤
│  dom-helpers.js         │  formatting/                     │
│                         │    currency.js                   │
│                         │    display.js                    │
│                         │    growth.js                     │
│                         │    accessibility.js              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Layer**: User interactions captured by `financial-inputs.js`
2. **Validation**: TypeBox schemas validate all user input data
3. **State Management**: `financial-data.js` persists data, `observers.js` notifies changes
4. **Business Logic**: `simulate-wealth.js` orchestrates financial calculations
5. **Results Caching**: `simulation-results.js` provides LRU cache for expensive calculations
6. **Display**: UI modules render formatted results with `formatters/` utilities

### Performance Features

- **Lazy Loading**: Chart module loads only when needed (`wealth-chart.js`)
- **Intelligent Caching**: LRU cache with 100-entry limit prevents recalculation
- **Debounced Updates**: Input changes trigger calculations after 300ms delay
- **Tree Shaking**: Only used functions included in production bundle
- **Memory Management**: Automatic cleanup of event listeners and observers

## Development Scripts

### Testing
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Development
```bash
# Option 1: Production build + server
npm run build              # Build the production bundle first
npm run dev                # Start HTTP server on localhost:3000 (serves dist/)

# Option 2: Development with source files
# Serve the project root with any HTTP server to use index.html (dev version)
python3 -m http.server 8000  # Then visit http://localhost:8000
```

### Code Quality & Automation
```bash
npm run check          # Run all quality checks (type, lint, test, bundle size)
npm run precommit      # Same as check - use before committing
# For commits: Use ./scripts/auto-commit.sh "detailed commit message"
npm run release        # Automated GitHub release with assets
npm run type-check     # Check types with TypeScript (no emit)
npm run type-check:watch # Check types in watch mode
npm run lint           # Check code with ESLint
npm run lint:fix       # Fix ESLint issues automatically
```

**Commit & Release Workflow**:
```bash
# 1. Run quality checks
npm run check

# 2. Stage changes and commit with detailed message
git add .
./scripts/auto-commit.sh "feat: implement advanced feature X

Detailed description of what was changed and why.
Include business context and impact analysis."

# 3. Create GitHub release
npm run release
```

### Build & Production
```bash
npm run build          # Build production bundle with esbuild (minified, tree-shaken)
npm run build:check    # Build and validate bundle size
npm run build:dev      # Development build (CSS modularized, JS copied)
```

## Project Structure

```
src/
├── lib/               # Pure business logic functions
│   ├── simulate-wealth.js      # Core wealth simulation engine
│   ├── phase-organization.js   # Financial phase management
│   ├── optimal-retirement.js   # Retirement age optimization
│   ├── investments.js          # Investment growth calculations
│   ├── retirement.js           # Retirement planning functions
│   ├── allocations.js          # Financial allocation strategies
│   ├── expenses.js             # Expense management functions
│   ├── growth.js               # Compound growth calculations
│   ├── currency.js             # Currency conversion utilities
│   ├── tax.js                  # Tax calculation functions
│   ├── validators.js           # TypeBox validation helpers
│   ├── simulation-helpers.js   # Wealth simulation utilities
│   ├── *.test.js              # Co-located unit tests for each module
│   └── integration.test.js    # Cross-module integration tests
├── ui/               # UI creation modules
│   ├── financial-inputs.js     # Income/expense input forms
│   ├── summary-cards.js        # Financial overview displays
│   ├── phase-tables.js         # Year-by-year breakdown tables
│   ├── wealth-chart.js         # Interactive wealth trajectory chart
│   ├── calculation-controller.js # Orchestrates UI updates
│   ├── theme-manager.js        # Dark/light theme management
│   ├── app-layout.js           # Main application layout
│   ├── app-controllers.js      # Application lifecycle management
│   ├── input-field.js          # Reusable input field component
│   ├── input-section.js        # Input section container
│   ├── phase-tables-container.js # Container for phase tables
│   ├── phase-table-helpers.js  # Table cell creation utilities
│   ├── chart-loader.js         # Lazy loading for chart module
│   ├── financial-inputs-extended.js # Extended input functionality
│   ├── *.test.js              # UI component tests
│   └── integration.test.js    # UI integration tests
├── state/           # State management modules
│   ├── financial-data.js       # User input persistence
│   ├── simulation-results.js   # Intelligent result caching
│   ├── defaults.js             # Default financial values
│   ├── observers.js            # Observer pattern implementation
│   ├── validation.js           # Data validation and migration
│   └── *.test.js              # State management tests
├── utils/           # Utility functions
│   ├── dom-helpers.js          # DOM manipulation utilities
│   └── formatting/            # Formatting utilities
│       ├── currency.js        # Currency formatting
│       ├── display.js         # General display formatting
│       ├── growth.js          # Growth percentage formatting
│       ├── accessibility.js   # Accessibility formatting
│       └── *.test.js         # Formatting tests
├── styles/          # Modular CSS architecture
│   ├── main.css               # CSS imports and custom properties
│   ├── base.css               # Base typography and reset
│   ├── layout.css             # Grid layout and structure
│   ├── forms.css              # Form styling and inputs
│   ├── tables.css             # Table styling and responsive design
│   └── results.css            # Results display styling
└── main.js         # Application entry point
```

### Module Responsibilities

#### Business Logic (`src/lib/`)
- **`simulate-wealth.js`** - Core financial simulation engine with multi-phase planning
- **`phase-organization.js`** - Manages debt elimination → emergency fund → retirement phases
- **`optimal-retirement.js`** - Calculates optimal retirement age based on financial goals
- **`investments.js`** - Investment growth calculations with compound interest
- **`allocations.js`** - Dynamic allocation strategies based on financial phase
- **`expenses.js`** - Expense categorization and emergency fund calculations
- **`growth.js`** - Pure compound growth mathematics with educational formulas
- **`currency.js`** - USD → EUR → THB conversion chain for cost-of-living calculations
- **`tax.js`** - Tax calculations with multi-year progression support
- **`validators.js`** - TypeBox validation schemas for all financial data

#### User Interface (`src/ui/`)
- **`financial-inputs.js`** - Dynamic form generation with auto-save and validation
- **`summary-cards.js`** - Financial overview cards with milestone summaries
- **`phase-tables.js`** - Year-by-year breakdown with delta calculations
- **`wealth-chart.js`** - Interactive wealth trajectory visualization with μPlot
- **`calculation-controller.js`** - Debounced calculation orchestration
- **`theme-manager.js`** - Dark/light theme with CSS custom properties

#### State Management (`src/state/`)
- **`financial-data.js`** - localStorage persistence with observer notifications
- **`simulation-results.js`** - LRU cache for expensive simulation results
- **`defaults.js`** - Default financial values and constants
- **`observers.js`** - Publisher-subscriber pattern for state changes
- **`validation.js`** - Data migration and schema validation

#### Utilities (`src/utils/`)
- **`dom-helpers.js`** - Performance-optimized DOM manipulation
- **`formatting/`** - Currency, percentage, and display formatting utilities

**Testing Standards**:
- **Mandatory Co-location**: Every `.js` file with functions must have a `.test.js` file in the same directory
- **Integration Tests**: `integration.test.js` files test module interactions and complete data flows
- **100% Coverage**: All functions must be tested with comprehensive test cases
- **No `__tests__` folders**: Tests are placed directly adjacent to source files

**Currency Handling**:
- **User Input**: All user expense inputs are in EUR (not THB)
- **Default Values**: All default expense values are in EUR
- **Conversions**: USD → EUR → THB conversion chain for Thai cost-of-living calculations
- **Display**: Local currency formatting respects user's currency preferences

## Financial Modeling Features

### Core Financial Calculations

- **Multi-Phase Planning**: Debt elimination → Emergency fund → Retirement optimization
- **Currency Conversion**: USD salary → EUR expenses → THB cost-of-living calculations
- **Tax Progression**: Multi-year tax scenarios with tax-free vs. taxed periods
- **Compound Growth**: Investment returns with configurable annual growth rates
- **Emergency Fund**: 6-month expense rule with dynamic target calculations
- **Optimal Retirement**: Algorithm finds ideal retirement age based on financial goals

### Educational Components

Every financial calculation includes:
- **Step-by-step formula breakdowns** in JSDoc comments
- **Real-world context** explaining financial concepts
- **Practical examples** with sample calculations
- **Edge case handling** with clear error messages
- **Interactive exploration** of financial scenarios

### Performance Optimizations

- **Intelligent Caching**: LRU cache prevents recalculation of expensive simulations
- **Debounced Input**: 300ms delay aggregates rapid user input changes
- **Lazy Chart Loading**: Chart module loads only when visualization is needed
- **Memory Management**: Automatic cleanup prevents memory leaks
- **Bundle Optimization**: Tree-shaking ensures minimal production size (8.42KB gzipped)

## Dependencies

### Runtime Dependencies (3 total)
- **lodash-es** - Utility functions (tree-shakeable)
- **date-fns** - Date manipulation utilities
- **uplot** - High-performance charting library

### Development Dependencies
- **eslint** - Code linting
- **esbuild** - Production bundling with minification and tree-shaking
- **typescript** - Type checking (compile-time only)
- **knip** - Unused dependency detection

## AI Agent Development Workflow

1. **Write Tests First** - Follow TDD methodology with co-located test files
2. **Design Types** - Use JSDoc comments for TypeScript inference
3. **Implement Functions** - Pure functions with TypeScript type safety
4. **Document Thoroughly** - Educational comments explaining formulas
5. **Integration Testing** - Test module interactions and complete data flows
6. **Quality Gate** - AI agent runs `npm run precommit` (validates everything)
7. **Analyze Changes** - AI agent examines all staged changes and generates detailed commit message
8. **Automated Commit** - AI agent runs `./scripts/auto-commit.sh "detailed message"` with comprehensive description
9. **Automated Release** - AI agent runs `npm run release` (GitHub release with assets)
10. **Complete Workflow** - AI agent must use direct script calls for detailed commit messages

**Commit Message Requirements**:
- **Detailed Analysis**: Must analyze all file changes and explain what/why/impact
- **Semantic Format**: Use `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, etc.
- **Business Context**: Explain motivation and architectural decisions
- **Impact Description**: How changes affect users, performance, or development
- **Multi-paragraph**: Include summary, detailed description, motivation, and impact

**Example commit workflow**:
```bash
# After making changes...
npm run check                    # Validate all quality gates
git add .                       # Stage all changes  

# Generate detailed commit message and commit
./scripts/auto-commit.sh "feat: implement advanced caching with LRU eviction strategy

Add intelligent simulation result caching to src/state/simulation-results.js with
memory-bounded LRU cache (max 100 entries), deterministic key generation, and
performance tracking. Includes comprehensive test suite with 13 test cases.

Motivation: Expensive simulation calculations were being repeated unnecessarily
when users made minor input adjustments, causing UI lag and poor UX.

Impact: Reduces calculation time by 80% for repeated scenarios, improves
responsiveness, and maintains memory efficiency through automatic eviction."

# Create GitHub release
npm run release
```

**Testing Requirements**:
- Every `.js` file with functions MUST have a corresponding `.test.js` file
- Integration tests required for testing module interactions
- Tests co-located with source files (no separate test directories)
- 100% test coverage with comprehensive edge case testing

## Performance Targets

### Achieved Performance
- **Bundle Size**: 8.42KB gzipped (well under 25KB target) ✅
- **Time to Interactive**: 166ms on 3G (under 300ms target) ✅  
- **Runtime Dependencies**: 3 packages (minimal footprint) ✅
- **Test Coverage**: 544 tests passing, 98%+ coverage ✅
- **Tree Shaking**: Optimal - only used functions included ✅

### Quality Gates
- **Type Safety**: 100% TypeScript compliance with JSDoc annotations
- **Code Quality**: ESLint passing with zero warnings
- **Test Coverage**: All modules have co-located comprehensive tests
- **Performance Budget**: Automated bundle size validation in CI
- **Educational Code**: Every function includes formula explanations

## Code Standards

All code follows comprehensive standards defined in `.cursor/rules/`:
- Educational commenting with formula breakdowns
- JSDoc comments with type annotations
- Basic runtime validation for critical edge cases
- Pure functions with SOLID principles
- Zero magic - every line explained
- ESLint must pass before task completion

## Migration from Single-File Architecture

This project evolved from a single `Thailand.html` file into a modular architecture while maintaining 100% feature parity.

### What Changed
- **Modularization**: Split 1,500+ line file into focused, testable modules
- **Testing**: Added comprehensive test suite with 544+ tests
- **Performance**: Reduced bundle size and improved load times
- **Maintainability**: Each module has single responsibility
- **Documentation**: Added educational comments throughout

### What Stayed the Same
- **All calculations**: Identical financial formulas and results
- **User Interface**: Same dark theme design and responsive layout
- **Default Values**: Same starting financial assumptions
- **Data Persistence**: Same localStorage behavior
- **Currency Handling**: Same USD → EUR → THB conversion chain

### Architecture Benefits
- **Testability**: Every function has comprehensive unit tests
- **Performance**: Intelligent caching and lazy loading
- **Type Safety**: TypeScript validation without runtime overhead
- **Code Quality**: ESLint enforcement and educational documentation
- **Maintainability**: Clear separation of concerns and module boundaries

### Development Workflow Improvements
- **Quality Gates**: Automated validation before every commit
- **Test-Driven Development**: Write tests before implementation
- **Performance Monitoring**: Bundle size validation and optimization
- **Educational Code**: Every function explains financial concepts
- **Automated Releases**: GitHub releases with detailed changelogs
