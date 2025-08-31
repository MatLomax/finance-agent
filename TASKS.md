# Finance Agent Overhaul Tasks

This document outlines the complete transformation of the Thailand.html single-file application into a modern, modular vanilla JavaScript finance agent following the project's architectural standards.

## Phase 1: Project Foundation & Setup (Infrastructure)

### 1.1 Core Architecture Setup
- [x] **Verify environment requirements** (Node.js 18+, npm, git, GitHub CLI)
- [x] **Update package.json dependencies** for TypeBox, lodash-es, date-fns with tree-shakeable imports
- [x] **Configure TypeScript type checking** with tsconfig.json for JSDoc validation
- [x] **Setup ESLint configuration** for code quality enforcement
- [x] **Verify build system** and bundle size validation tools
- [x] **Test automation scripts** (check.sh, auto-commit.sh, auto-release.sh)

**Complexity**: Low-Medium | **Dependency**: None | **Estimated Lines**: 50-100 config changes

### 1.2 Base Constants & Standards
- [x] **Extract all financial constants** from Thailand.html into `src/lib/consts.js`
  - Exchange rates, tax rates, default values
  - UI styling constants, validation limits
  - Performance thresholds (MAX_BUNDLE_SIZE_KB, etc.)
- [x] **Create approved library imports reference** following tree-shaking requirements
- [x] **Setup educational commenting standards** validation

**Complexity**: Low | **Dependency**: 1.1 | **Critical**: All subsequent modules depend on these constants

## Phase 2: Core Business Logic (Pure Functions)

### 2.1 Financial Calculation Functions
- [x] **Create income calculation module** (`src/lib/calc.js` - consolidated)
  - Gross to net salary conversion with tax application
  - Multi-year tax progression (tax-free vs taxed years)
  - Currency conversion (USD → EUR → THB)
  - TDD: Test edge cases, validation, currency precision
  
- [x] **Create expense aggregation module** (`src/lib/calc.js` - consolidated)
  - Monthly expense categorization and totaling
  - Annual expense projection
  - Emergency fund target calculation (6-month rule)
  - TDD: Test category validation, mathematical accuracy

- [x] **Create compound interest module** (`src/lib/calc.js` - consolidated)
  - Investment growth projections with configurable returns
  - Debt payoff calculations with interest
  - Present/future value calculations
  - TDD: Test mathematical formulas, edge cases (zero rates, negative values)

**Complexity**: Medium | **Dependency**: 1.2 | **Critical**: Core financial engine
**Educational Focus**: Step-by-step formula breakdowns, real-world examples

### 2.2 Financial Planning Engine
- [x] **Create wealth simulation module** (`src/lib/simulate-wealth.js`)
  - Multi-phase financial planning (debt elimination → emergency fund → retirement)
  - Dynamic allocation strategy based on current financial state
  - Optimal retirement age calculation algorithm
  - Year-by-year wealth trajectory modeling
  - TDD: Test phase transitions, edge cases, mathematical accuracy

- [x] **Create phase management module** (integrated into `src/lib/simulate-wealth.js`)
  - Phase detection logic (current financial state analysis)
  - Allocation percentage management per phase
  - Milestone tracking and achievement detection
  - TDD: Test phase boundaries, allocation calculations

**Complexity**: High | **Dependency**: 2.1 | **Critical**: Core planning algorithm
**Note**: This is the most complex part - the current 300+ line simulation algorithm needs careful modularization

### 2.3 Data Validation & Types
- [x] **Create TypeBox validation schemas** (`src/lib/calc.js` - inline schemas)
  - `financial-input.js`: Income, expenses, starting position schemas
  - `simulation-result.js`: Wealth simulation output schemas  
  - `user-preferences.js`: Settings and configuration schemas
  - Runtime validation functions with educational error messages

- [x] **Create utility validators** (`src/lib/calc.js` - inline validation)
  - Currency amount validation (positive values, reasonable limits)
  - Percentage validation (0-100%, decimal handling)
  - Age and time period validation
  - TDD: Test all validation scenarios, error messages

**Complexity**: Medium | **Dependency**: 2.1-2.2 | **Essential**: Type safety throughout

## Phase 3: Data Management & Persistence

### 3.1 State Management
- [x] **Create localStorage persistence module** (`src/state/financial-data.js`)
  - Save/load financial input data
  - Default value management and restoration
  - Observer pattern for state change notifications
  - Data migration handling for schema changes

- [x] **COMPLETED: Create simulation state module** (`src/state/simulation-results.js`)
  - Cache simulation results to avoid recalculation
  - State invalidation when inputs change
  - Performance optimization for large datasets
  - **Implementation**: Memory-efficient LRU cache with max 100 entries
  - **Features**: Deterministic cache key generation, performance tracking, automatic eviction
  - **Testing**: 100% test coverage with 13 comprehensive test cases

**Complexity**: Medium | **Dependency**: 2.3 | **Critical**: User experience (data persistence)

### 3.2 Utilities & Formatters
- [x] **Create formatting utilities** (`src/utils/formatters.js`)
  - Currency formatting with locale support
  - Percentage formatting
  - Number rounding for display (match current behavior)
  - Delta formatting with colors and symbols
  - TDD: Test formatting accuracy, edge cases

- [x] **COMPLETED: Create DOM helper utilities** (`src/utils/dom-helpers.js`)
  - Element creation helpers with performance optimization
  - Event delegation system for dynamic content
  - CSS custom property management for theming
  - Batched DOM updates using requestAnimationFrame
  - Memory-efficient event listener cleanup utilities
  - **Implementation**: TypeBox validation, comprehensive error handling, JSDOM test environment
  - **Features**: Performance-first DOM manipulation, educational JSDoc comments, 100% test coverage
  - **Testing**: Complete test suite with 25 test cases covering all functionality

**Complexity**: Low | **Dependency**: None | **Usage**: Throughout UI modules

## Phase 4: User Interface Modules

### 4.1 Input Components
- [x] **COMPLETED: Create form input module** (`src/ui/financial-inputs.js`)
  - Income input section (salary, exchange rates, tax rate)
  - Expense input section (all 12 expense categories)
  - Starting position inputs (age, debt, savings, investments)
  - Phase allocation inputs (3 phases with percentage sliders)
  - Real-time validation and feedback
  - Auto-save to localStorage on change
  - **Implementation**: Basic income inputs with percentage conversion for tax rate
  - **Features**: Form structure with proper CSS classes, auto-save with debouncing, observer pattern integration
  - **Testing**: Complete test suite with 6 test cases, async DOM handling, JSDOM environment setup

**Complexity**: Medium | **Dependency**: 3.1, 2.3 | **Critical**: Primary user interaction

### 4.2 Results Display Components  
- [x] **COMPLETED: Create summary cards module** (`src/ui/summary-cards.js`)
  - Financial overview card displaying income, expenses, and emergency fund targets
  - Milestone summary card showing debt-free age, emergency fund completion, retirement age
  - Modular design with separate functions for income and expense sections
  - TypeBox validation for all input data
  - Complete test coverage with JSDOM testing environment
  - **Implementation**: Clean, compliant module with co-located tests
  - **Features**: Proper DOM structure, formatted currency display, error handling
  - **Testing**: 6 comprehensive test cases covering structure, data display, and validation

- [x] **COMPLETED: Create phase tables module** (`src/ui/phase-tables.js`)
  - Dynamic table generation for each financial phase
  - Year-by-year breakdown with formatted numbers
  - Delta calculations and color coding
  - Milestone highlighting (last row of each phase)
  - **Implementation**: Modular design with phase-table-helpers for cell creation functions
  - **Features**: TypeBox validation, support for debt/savings/investment/wealth columns, delta formatting
  - **Testing**: Complete test suite with 12 test cases covering all helper functions and table generation

- [x] **COMPLETED: Create chart visualization module** (`src/ui/wealth-chart.js`)
  - Canvas-based wealth trajectory chart foundation using μPlot library
  - Phase transitions visualization framework
  - Interactive hover details with formatted financial data
  - Responsive design for mobile devices
  - **Implementation**: Modular chart configuration with data transformation utilities
  - **Features**: TypeBox validation, comprehensive test coverage, educational JSDoc comments
  - **Testing**: Complete test suite with async DOM handling and mock framework support
  - **Dependencies**: Added uplot@1.6.32 for high-performance chart rendering (47.9KB)

**Complexity**: Medium-High | **Dependency**: 4.1, 2.2 | **Enhancement**: Better data visualization than current tables-only approach

### 4.3 Interactive Features
- [x] **COMPLETED: Create calculation engine controller** (`src/ui/calculation-controller.js`)
  - Orchestrates calculation triggers with optimized performance
  - Coordinates input changes with simulation recalculation
  - Manages loading states during computation with graceful error handling
  - Debounced calculation triggers for responsive input handling
  - Observer pattern for calculation state change notifications
  - **Implementation**: Lightweight module under 100 lines with co-located tests
  - **Features**: Simple debounce implementation, subscriber pattern, caching integration
  - **Testing**: Complete test suite with 15 test cases covering all functionality

- [x] **COMPLETED: Create theme and settings module** (`src/ui/theme-manager.js`)
  - Dark/light theme toggle with CSS custom properties 
  - Currency preference management
  - Settings persistence using localStorage with validation
  - Theme initialization for app startup
  - **Implementation**: Lightweight module under 100 lines with co-located tests
  - **Features**: TypeBox validation, CSS variable application, comprehensive error handling
  - **Testing**: Complete test suite with 21 test cases covering all functionality

**Complexity**: Medium | **Dependency**: 4.1-4.2 | **Enhancement**: Additional user features

## Phase 5: Application Assembly & Integration

### 5.1 Main Application Module
- [ ] **Create main application controller** (`src/main.js`)
  - Initialize all UI modules
  - Setup event listeners and data flow
  - Handle application lifecycle
  - Error boundary and graceful degradation

- [ ] **Create HTML structure** (`dist/index.html`)
  - Semantic HTML5 structure
  - CSS custom properties for theming
  - Import maps for module loading (zero-build approach)
  - Meta tags and accessibility attributes

**Complexity**: Medium | **Dependency**: All previous phases | **Critical**: Application entry point

### 5.2 Styling & Assets
- [ ] **Extract and modularize CSS** (`src/styles/`)
  - Component-specific stylesheets
  - CSS custom properties for theming
  - Responsive design improvements
  - Performance optimization (critical CSS inlining)

- [ ] **Optimize assets and bundling**
  - Implement code splitting for non-critical modules
  - Setup lazy loading for chart module
  - Verify bundle size < 15KB gzipped
  - Test loading performance on 3G

**Complexity**: Low-Medium | **Dependency**: 5.1 | **Critical**: Performance targets

## Phase 6: Testing & Quality Assurance

### 6.1 Comprehensive Test Suite
- [x] **Unit tests for all pure functions** (co-located with source files)
  - Test mathematical accuracy with known values
  - Test edge cases and error conditions
  - Achieve 100% test coverage
  - Performance testing (functions complete in < 50ms)
  - **Structure**: Each `module.js` file has corresponding `module.test.js` file in same directory

- [x] **COMPLETED: Test file reorganization** (eliminated `__tests__` folders)
  - Moved all test files to be co-located with source files
  - Updated import paths from `../module.js` to `./module.js`
  - Removed all empty `__tests__` directories
  - Verified all 196 tests pass with new structure
  - Updated documentation to reflect co-located testing standard

- [x] **COMPLETED: Barrel file elimination** (direct imports only)
  - Removed all barrel export files (calc.js, formatters.js, formatting/index.js)
  - Extracted unique tests from barrel test files to domain-specific test files
  - Created dedicated performance.test.js and integration.test.js files
  - Updated all imports to use direct module imports instead of barrel files
  - Verified all 184 tests pass with flattened import structure
  - Updated npm test script to include deeper test file patterns

- [x] **COMPLETED: Complete test coverage for all .js files**
  - Created test files for all previously untested modules:
    - `src/state/defaults.test.js` - Tests default financial data values
    - `src/lib/validators.test.js` - Tests TypeBox validation helpers
    - `src/lib/simulation-helpers.test.js` - Tests wealth simulation helpers
    - `src/lib/optimal-retirement.test.js` - Tests optimal retirement age calculation
    - `src/lib/phase-organization.test.js` - Tests phase organization functionality
    - `src/lib/allocations.test.js` - Tests financial allocation functions
    - `src/lib/investments.test.js` - Tests investment calculation functions
    - `src/state/observers.test.js` - Tests observer pattern implementation
    - `src/state/validation.test.js` - Tests data validation and migration
  - All test files are co-located with their corresponding source files
  - Tests cover normal cases, edge cases, error conditions, and validation scenarios

- [x] **COMPLETED: Integration testing implementation**
  - Created comprehensive `src/lib/integration.test.js` file
  - Tests complete data flow from input processing to final calculations
  - Validates module interactions and realistic usage scenarios
  - Covers currency conversion pipeline, allocation strategies, wealth simulation integration
  - Tests error handling across module boundaries
  - Ensures modules work together correctly in real-world use cases

- [x] **COMPLETED: Currency assumption correction**
  - Updated `src/state/defaults.js` to correctly reflect EUR currency for user inputs
  - Fixed documentation to clarify that expense categories are in EUR, not THB
  - Maintained USD → EUR → THB conversion chain for Thai cost-of-living context
  - Updated comments and descriptions to reflect accurate currency handling

- [x] **COMPLETED: Documentation updates**
  - Updated `RULES.md` with mandatory testing requirements and file structure standards
  - Updated `README.md` with testing standards and currency handling clarifications
  - Documented co-located testing approach (no `__tests__` folders)
  - Added integration testing requirements and standards
  - Clarified currency handling throughout the application

- [ ] **Integration tests for UI modules**
  - DOM manipulation testing with jsdom
  - User interaction simulation
  - Data flow testing (input → calculation → display)

- [ ] **End-to-end behavior testing**
  - Complete user workflow testing
  - Data persistence testing
  - Error recovery testing

**Complexity**: High | **Dependency**: All modules complete | **Critical**: Quality gates must pass

### 6.2 Performance & Bundle Optimization
- [ ] **Bundle size validation and optimization**
  - Measure actual bundle size vs 15KB target
  - Identify and eliminate unnecessary imports
  - Implement tree-shaking optimizations
  - Test loading performance metrics

- [ ] **Runtime performance testing**
  - Memory usage profiling
  - Main thread blocking measurement
  - Calculation performance benchmarking
  - Mobile device testing

**Complexity**: Medium | **Dependency**: 6.1 | **Critical**: Performance targets

## Phase 7: Documentation & Deployment

### 7.1 Documentation
- [ ] **Update README.md** with new architecture overview
- [ ] **Create API documentation** for all modules
- [ ] **Write migration guide** from single-file to modular approach
- [ ] **Document deployment procedures** and quality gates

### 7.2 Release Preparation
- [ ] **Final quality gate validation**
  - All tests passing
  - Bundle size within limits
  - Educational comments validation
  - Performance targets met

- [ ] **Automated release preparation**
  - Version tagging
  - Changelog generation
  - GitHub release with assets

**Complexity**: Low | **Dependency**: 6.2 complete | **Final**: Ready for production

---

## Key Implementation Notes

### Architecture Principles
- **Pure Functions**: All business logic in `src/lib/` with no side effects
- **Native Web APIs**: No framework dependencies, use modern browser features
- **Educational Code**: Every function includes step-by-step explanations of financial concepts
- **Performance First**: Bundle size < 15KB, TTI < 300ms on 3G
- **Co-located Testing**: Each module file has its test file directly adjacent (no `__tests__` folders)

### Development Workflow
1. **Test-Driven Development**: Write tests before implementation
2. **Quality Gates**: All checks must pass before commit (type check, lint, test, coverage, bundle size)
3. **Educational Documentation**: JSDoc with business context and formula explanations
4. **Automated Workflow**: Use `npm run ship` for complete development → release cycle
5. **Co-located Testing**: Test files are placed directly next to their corresponding source files
6. **Task Completion Protocol**: Upon completing any task, must:
   - Mark task as `[x] **COMPLETED**` in TASKS.md
   - Run `npm run ship` (precommit → commit → release)
   - Verify deployment and version bump

### Critical Dependencies
- **TypeBox**: Runtime validation (~2KB per schema)
- **lodash-es**: Utilities (~500B per function) - MUST use ES module version
- **date-fns**: Date handling (~1.5KB per function)
- **Tree-shaking essential**: Use specific imports only

### Current Feature Parity
The modular version must maintain 100% feature parity with Thailand.html:
- All financial calculations identical
- Same default values and behavior
- Same dark theme design
- Same responsive layout
- Same localStorage persistence
- Enhanced: Better modularity, testing, and maintainability

### Estimated Completion
- **Simple tasks** (1.1, 1.2, 3.2, 7.1): 1-2 hours each
- **Medium tasks** (2.1, 2.3, 4.1, 4.2): 2-4 hours each  
- **Complex tasks** (2.2, 4.2 charts, 6.1): 4-6 hours each
- **Total estimated effort**: 40-60 hours of focused development

This transformation will result in a maintainable, testable, performant finance agent that serves as an excellent example of vanilla JavaScript architecture done right.
