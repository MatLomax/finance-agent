# AI Development Agent Rules

## Core Architecture
- **Pure vanilla JS**: ES2022+ with esbuild production bundling, no frameworks
- **Bundle size**: < 25KB total, < 2KB per module
- **Performance**: TTI < 300ms, no main thread blocking > 8ms
- **Type safety**: JSDoc + TypeScript checking with basic runtime validation
- **TypeScript types**: Prefer `type` over `interface` (enforced by ESLint)
- **Testing**: Node.js native test runner, 100% coverage, < 2s total runtime

## File Structure & Complexity
- **Auto-enforced by ESLint**: 100 lines max per file, 10 cyclomatic complexity max
- **Co-located tests**: `module.test.js` next to `module.js` (REQUIRED for any .js file with functions)
- **Integration tests**: `integration.test.js` files test module interactions
- **Flattened structure**: `src/lib/domain.js` instead of `src/lib/domain/calculations.js`
- **Domain organization**: Direct files in `src/lib/`, `src/ui/`, `src/state/`
- **Split when violated**: ESLint will fail - must refactor into smaller modules

**Example Structure**:
```
src/
  lib/
    calc.js          # Main API (re-exports for compatibility)
    currency.js      # Currency conversion functions
    currency.test.js # Currency conversion tests
    tax.js          # Tax calculation functions  
    tax.test.js     # Tax calculation tests
    retirement.js   # Retirement planning functions
    retirement.test.js # Retirement tests
    growth.js       # Growth calculation functions
    growth.test.js  # Growth tests
    integration.test.js # Cross-module integration tests
  state/
    financial-data.js     # Data persistence functions
    financial-data.test.js # Data persistence tests
    defaults.js          # Default values
    defaults.test.js     # Default values tests
  utils/
    formatting/
      currency.js      # Currency formatting functions
      currency.test.js # Currency formatting tests
```

**Testing Requirements**:
- **Mandatory**: Every .js file containing functions MUST have a corresponding .test.js file
- **Co-location**: Test files placed directly adjacent to source files (no `__tests__` folders)
- **Integration tests**: Required for testing module interactions and data flow
- **100% coverage**: All functions must be tested with comprehensive test cases

## Dependencies & Imports
**Tree-shakeable imports for optimal bundling**:
```javascript
// ✅ CORRECT - esbuild can tree-shake these
import { debounce } from 'lodash-es';
import { format } from 'date-fns';

// ❌ WRONG - massive bundle impact, poor tree-shaking
import _ from 'lodash';
```

## Code Standards
### Functions
- **Pure functions**: No side effects, same input = same output
- **Educational comments**: Explain WHY and business context, not just WHAT
- **Mathematical formulas**: Step-by-step breakdown with real examples
- **Basic runtime validation**: Critical edge case checking

### TypeScript Types
- **Use `type` over `interface`**: Enforced by ESLint `@typescript-eslint/consistent-type-definitions`
- **Type inheritance**: Use intersection types (`&`) instead of `extends`
- **Readonly properties**: All type properties should be `readonly` for immutability
- **Type definitions**: Centralized in `src/types/index.ts` for consistency

```typescript
// ✅ CORRECT - Use type with intersection for inheritance
export type SimulationInput = FinancialInputData & {
  readonly grossSalaryMonthly: number;
  readonly allocations: FinancialAllocations;
}

// ❌ WRONG - Don't use interface
export interface SimulationInput extends FinancialInputData {
  readonly grossSalaryMonthly: number;
  readonly allocations: FinancialAllocations;
}
```

### Documentation
```javascript
/**
 * Brief description with business context.
 * Formula: A = P(1 + r/n)^(nt) [if applicable]
 * 
 * @param {number} principal - Amount in cents (avoids floating-point errors)
 * @returns {number} Final amount after compound interest
 * @example
 * calculateCompoundInterest(100000, 0.05, 2, 12); // Returns 110494
 * @throws {Error} If validation fails
 */
```

### Implementation Pattern
```javascript
// Import validation helpers
import { validateNonNegativeNumber, validatePercentage } from './validators.js';

export function calculateSomething(amount, rate) {
  // 1. Runtime validation for critical edge cases
  validateNonNegativeNumber(amount, 'amount');
  validatePercentage(rate, 'rate');
  
  // 2. Step-by-step calculation with educational comments
  // Calculate periodic rate: annual rate divided by compounding frequency
  const periodicRate = rate / 12; // Convert annual to monthly rate
  
  // Apply compound growth formula...
  return result;
}
```

## Testing (TDD Required)
```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('functionName', () => {
  it('should handle normal case', () => {
    const result = functionName(validInput);
    assert.strictEqual(result, expectedOutput);
  });
  
  it('should throw on invalid input', () => {
    assert.throws(() => functionName(invalidInput), /Expected error message/);
  });
});
```

**Testing Standards**:
- **Co-located tests**: Each `module.js` has `module.test.js` in same directory
- **Integration tests**: `integration.test.js` files test module interactions
- **100% coverage**: All functions must have comprehensive test cases
- **TDD workflow**: Write tests first, then implement functions
- **ZERO TOLERANCE for failing tests**: Every test must pass before commit
- **Test categories**:
  - Unit tests: Individual function behavior
  - Integration tests: Module interaction and data flow
  - Edge cases: Boundary conditions, error scenarios
  - Performance tests: Execution time validation

**TEST FAILURE PROTOCOL:**
1. **Immediately stop development** when any test fails
2. **Analyze the failure** - understand the root cause
3. **Fix the underlying issue** - don't just make tests pass superficially
4. **Verify the fix** - run tests again to ensure they pass
5. **Check coverage** - ensure no coverage gaps were introduced
6. **Only then proceed** with further development or commits

## UI Modules (Native Web APIs)
```javascript
// DOM creation with educational comments
export function createTransactionCard({ id, amount, description }) {
  const card = document.createElement('div');
  card.className = 'transaction-card';
  card.dataset.id = id;
  
  // Format amount in cents to avoid floating-point errors
  card.innerHTML = `
    <span class="amount">${formatCurrency(amount)}</span>
    <span class="description">${description}</span>
  `;
  
  return card;
}

// Event delegation for performance
document.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    const id = e.target.closest('.transaction-card').dataset.id;
    deleteTransaction(id);
  }
});
```

## Quality Gates (Automated)
```bash
npm run check     # Full validation: type-check, lint, test, coverage, bundle size
# Commit: ./scripts/auto-commit.sh "detailed commit message"
# Release: npm run release
```

**❌ CRITICAL: NO COMMITS ALLOWED WITH FAILING TESTS OR INCOMPLETE COVERAGE ❌**

**MANDATORY checks that MUST pass before ANY commit:**
- **ALL TESTS MUST PASS**: Zero test failures allowed - every single test must pass
- **100% TEST COVERAGE**: No exceptions - every function must be fully tested
- **TypeScript type checking (tsc --noEmit)**: Zero type errors
- **ESLint with zero warnings**: Zero linting issues
- **Bundle size < 25KB (production build)**: Performance requirement

**BLOCKING CONDITIONS - DO NOT COMMIT IF:**
- ❌ Any test is failing (`npm test` shows failures)
- ❌ Test coverage is below 100% (`npm run test:coverage` shows incomplete coverage)
- ❌ Type checking fails (`npm run type-check` shows errors)
- ❌ ESLint reports any warnings or errors (`npm run lint` shows issues)
- ❌ Bundle size exceeds limits (`npm run build:check` fails)
- ❌ Quality gates script fails (`npm run check` exits with non-zero code)

**COMMIT PROCESS - NEVER SKIP THESE STEPS:**
```bash
npm run check                             # ✅ MUST PASS - if this fails, DO NOT COMMIT
git add .                                # Stage all changes only after checks pass
./scripts/auto-commit.sh "detailed msg"  # Commit only when all tests pass
npm run release                          # Create GitHub release
```

**AI AGENT REQUIREMENTS:**
- **NEVER commit with failing tests** - Fix all test failures before any commit
- **NEVER commit with incomplete coverage** - Add missing tests to reach 100% coverage
- **Always run `npm run check` before commit** - If it fails, fix issues first
- **Analyze test output** - Understand why tests are failing and fix root causes
- **Verify coverage reports** - Ensure no uncovered lines remain

## Automation Scripts
- **`scripts/auto-commit.sh`**: **REQUIRES** descriptive commit message as parameter
  - Usage: `./scripts/auto-commit.sh "detailed commit message"`
  - **MANDATORY**: AI agent must provide comprehensive commit message analyzing all changes
  - Auto-stages all changes, increments version, generates changelog
  - **Example**: `./scripts/auto-commit.sh "docs: replace zero-build terminology with esbuild production bundling\n\nUpdate architecture documentation across README.md, RULES.md, TASKS.md and package.json\nto accurately reflect current build process using esbuild for production bundling.\nChanged bundle size targets from 15KB to 25KB to match actual configuration.\n\nMotivation: Previous 'zero-build' terminology was misleading since we now use\nesbuild for production minification, tree-shaking, and optimization."`
- **`scripts/check.sh`**: Runs all quality gates and validation
- **`scripts/auto-release.sh`**: Creates GitHub releases with automated changelog

## Workflow
1. **TDD**: Write failing test first
2. **Implement**: Pure function with basic runtime validation
3. **Document**: JSDoc + educational comments
4. **Quality gate**: `npm run check` must pass
5. **Auto-stage changes**: `git add .` to stage all working tree files
6. **Generate descriptive commit**: AI agent analyzes all staged changes and creates detailed commit message
7. **Automated commit**: `./scripts/auto-commit.sh "descriptive commit message"` (semantic versioning)
8. **Automated release**: `npm run release` (GitHub release)

### Detailed Commit Message Requirements
The AI agent **MUST** provide comprehensive commit messages that include:
- **Semantic prefix**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `style:`, `chore:`
- **What changed**: Specific files and functionality modified
- **Why changed**: Business justification and motivation
- **Impact**: How this affects users, performance, or architecture
- **Context**: Any related issues, requirements, or architectural decisions

**Template**:
```
<type>: <brief summary in imperative mood>

<detailed description of what was changed>

<explanation of why the change was necessary>

<impact on users, performance, or architecture>
```

## Commit Message Generation
The AI development agent must analyze all staged changes and generate detailed, descriptive commit messages that:
- **Summarize the actual changes**: Examine file diffs and understand what was modified
- **Use semantic commit format**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, etc.
- **Be specific and detailed**: Instead of generic titles, describe the actual functionality added
- **Include business context**: Explain WHY the changes were made, not just WHAT changed
- **Avoid switch-case logic**: Each commit message should be unique and contextual
- **Analyze impact**: Describe how changes affect users, performance, or architecture

**Examples of excellent commit messages**:
```
feat: implement compound interest calculation with monthly compounding support

Add calculateCompoundInterest function to src/lib/growth.js with basic validation,
comprehensive test coverage, and educational JSDoc comments explaining the mathematical
formula A = P(1 + r/n)^(nt). Includes edge case handling for zero rates and validation
for negative inputs.

Impact: Enables accurate investment growth projections for financial planning.
Performance: O(1) calculation with memoization for repeated calls.

docs: replace zero-build terminology with esbuild production bundling architecture

Update documentation across README.md, RULES.md, TASKS.md and package.json to accurately
reflect current build process. Changed bundle size targets from 15KB to 25KB to match
actual esbuild configuration with tree-shaking and minification.

Motivation: Previous 'zero-build' terminology was misleading since we now use esbuild
for production optimization. This clarifies the modern ES modules + production bundling
approach for better developer understanding.

Impact: Removes confusion about build process, improves onboarding for new developers.
```

**Anti-pattern examples**:
```
❌ feat: add utility functions
❌ feat: update source code  
❌ feat: add new files
❌ feat: v1.2.3 - automated commit
❌ docs: update documentation
❌ fix: various improvements
```

## Performance Optimizations
- **Lazy loading**: Dynamic imports for non-critical modules
- **Event delegation**: Single listeners for multiple elements
- **Batch DOM updates**: Use requestAnimationFrame
- **Memory management**: Clean up event listeners
- **CSS custom properties**: For efficient theming

## State Management (Native)
```javascript
// localStorage persistence with observer pattern
let state = JSON.parse(localStorage.getItem('key') || '[]');
let subscribers = [];

export function setState(newState) {
  state = newState;
  localStorage.setItem('key', JSON.stringify(state));
  subscribers.forEach(callback => callback(state));
}

export function subscribe(callback) {
  subscribers.push(callback);
  return () => subscribers = subscribers.filter(s => s !== callback);
}
```

## Error Handling
- **Validation errors**: Clear, user-friendly messages
- **Runtime errors**: Graceful degradation
- **Network errors**: Retry logic with exponential backoff
- **Development errors**: Detailed console logs for debugging

## Key Constants Reference
All limits and thresholds are defined in `src/lib/consts.js`:
- MAX_BUNDLE_SIZE_KB: 25
- MAX_MODULE_SIZE_KB: 2
- MAX_TTI_MS: 300
- REQUIRED_TEST_COVERAGE_PERCENT: 100
- MAX_IMPLEMENTATION_LINES_PER_FUNCTION: 30

## Anti-Patterns
❌ Framework dependencies (React, Vue, Angular)
❌ Poor bundling practices (non-tree-shakeable imports)
❌ Non-tree-shakeable imports
❌ Magic numbers without constants
❌ Functions > 30 lines of implementation
❌ Files > 100 lines of code
❌ Missing educational comments
❌ Skipping quality gates
❌ **COMMITTING WITH FAILING TESTS** - ABSOLUTELY FORBIDDEN
❌ **COMMITTING WITH INCOMPLETE COVERAGE** - ABSOLUTELY FORBIDDEN
❌ **IGNORING QUALITY GATE FAILURES** - ABSOLUTELY FORBIDDEN
❌ **BYPASSING THE `npm run check` REQUIREMENT** - ABSOLUTELY FORBIDDEN
