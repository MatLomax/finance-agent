# AI Development Agent Rules

## Core Architecture
- **Pure vanilla JS**: ES2022+ with zero transpilation, no frameworks
- **Bundle size**: < 15KB total, < 2KB per module
- **Performance**: TTI < 300ms, no main thread blocking > 8ms
- **Type safety**: JSDoc + TypeScript checking + TypeBox runtime validation
- **Testing**: Node.js native test runner, 100% coverage, < 2s total runtime

## File Structure & Complexity
- **Auto-enforced by ESLint**: 100 lines max per file, 10 cyclomatic complexity max
- **Co-located tests**: `module.test.js` next to `module.js` (one test file per module)
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
```

## Dependencies & Imports
**Tree-shakeable imports ONLY**:
```javascript
// ✅ CORRECT
import { Type } from '@sinclair/typebox';
import { debounce } from 'lodash-es';
import { format } from 'date-fns';

// ❌ WRONG - massive bundle impact
import * as TypeBox from '@sinclair/typebox';
import _ from 'lodash';
```

## Code Standards
### Functions
- **Pure functions**: No side effects, same input = same output
- **Educational comments**: Explain WHY and business context, not just WHAT
- **Mathematical formulas**: Step-by-step breakdown with real examples
- **TypeBox validation**: Runtime type checking on all inputs

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
// Input validation schema
const InputSchema = Type.Object({
  amount: Type.Number({ minimum: 0 }),
  rate: Type.Number({ minimum: 0, maximum: 1 })
});

export function calculateSomething(amount, rate) {
  // 1. Runtime validation
  validate(InputSchema, { amount, rate });
  
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
npm run ship      # Complete workflow: check → auto-stage → commit → release
```

**All checks must pass before commit:**
- TypeScript type checking (tsc --noEmit)
- ESLint with zero warnings
- 100% test coverage
- Bundle size < 15KB
- Educational comments validation

## Workflow
1. **TDD**: Write failing test first
2. **Implement**: Pure function with TypeBox validation
3. **Document**: JSDoc + educational comments
4. **Quality gate**: `npm run check` must pass
5. **Auto-stage changes**: `git add .` to stage all working tree files
6. **Automated commit**: `npm run commit` (semantic versioning)
7. **Automated release**: `npm run release` (GitHub release)

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
- MAX_BUNDLE_SIZE_KB: 15
- MAX_MODULE_SIZE_KB: 2
- MAX_TTI_MS: 300
- REQUIRED_TEST_COVERAGE_PERCENT: 100
- MAX_IMPLEMENTATION_LINES_PER_FUNCTION: 30

## Anti-Patterns
❌ Framework dependencies (React, Vue, Angular)
❌ Build tools (webpack, vite) - prefer zero-build
❌ Non-tree-shakeable imports
❌ Magic numbers without constants
❌ Functions > 30 lines of implementation
❌ Files > 100 lines of code
❌ Missing educational comments
❌ Skipping quality gates
