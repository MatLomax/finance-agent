# Cursor IDE Rules for Finance Agent

This directory contains Cursor IDE-specific rules (`.mdc` files) that guide the AI agent's development decisions across the finance agent project.

## Rule Files Overview (Principle-Based)

- **`global.mdc`** - Project-wide standards and task completion requirements
- **`comments.mdc`** - Educational code commenting standards for self-documenting code
- **`pure-functions.mdc`** - Pure business logic functions with TDD methodology
- **`validation.mdc`** - Runtime type validation with TypeBox schemas and JSDoc
- **`ui-modules.mdc`** - UI creation and DOM manipulation with native web APIs
- **`testing.mdc`** - Fast, comprehensive testing with Node.js native test runner
- **`performance.mdc`** - Bundle size and runtime performance optimization
- **`build-deploy.mdc`** - Zero-build deployment and optional build tooling

## Architecture Philosophy

The finance agent follows an **ultra-lightweight, portable** vanilla JavaScript architecture with these constraints:

- **Bundle size**: < 15kb gzipped total (no framework overhead!)
- **Build time**: < 2 seconds (or no build at all!)
- **Dependencies**: Maximum 5 total (lodash-es, date-fns, etc.) with tree-shakeable imports only
- **Time to interactive**: < 300ms on 3G
- **Zero-config**: Native ES modules with import maps preferred

## How Rules Work

Cursor IDE automatically applies these rules based on:
- **`alwaysApply: true`** - Rules that apply globally
- **`globs: ["path/**/*.ext"]`** - Rules for specific file patterns
- **File location** - Rules activate when editing matching files

## Usage for AI Agent

When developing:
1. **Rules automatically guide code generation** based on file patterns and global settings
2. **Task completion gates**: No task is complete until ESLint passes, tests pass, and documentation is complete
3. **Principle-based organization**: Rules focus on coding principles rather than folder structure
4. **Educational focus**: All code must teach finance concepts through detailed comments
5. **Performance enforcement**: Bundle size and speed targets are automatically enforced

## Key Features

- **🎓 Educational Code**: Comments teach finance concepts, not just implementation details
- **📐 Formula Documentation**: Mathematical formulas are broken down step-by-step with real examples
- **💼 Business Context**: Code explains WHY decisions were made, not just WHAT the code does
- **🚫 No Magic**: Every constant, formula, and complex operation is thoroughly explained
- **📚 Self-Documenting**: Code should be readable by finance professionals, not just developers
- **📦 Tree-Shakeable Imports**: All external libraries use specific imports to minimize bundle size

## Import Guidelines (Critical for Bundle Size)

### ✅ CORRECT Import Patterns
```javascript
// TypeBox - Runtime validation (~2KB per function)
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// Lodash - Utilities (~500B per function)
import { debounce } from 'lodash-es';  // Must use lodash-es!
import { throttle } from 'lodash-es';

// Date-fns - Date utilities (~1.5KB per function)
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
```

### ❌ WRONG Import Patterns (Massive Bundle Impact)
```javascript
// These patterns import entire libraries:
import _ from 'lodash';                    // ~70KB+ 
import * as TypeBox from '@sinclair/typebox'; // ~50KB+
import dateFns from 'date-fns';              // ~200KB+
import { debounce } from 'lodash';           // No tree-shaking!
```

**Reference**: See `APPROVED_LIBRARY_IMPORTS` in `src/lib/consts.js` for complete guidelines.

These rules ensure consistent, high-quality, **educational** code while maintaining the project's core principles of speed, portability, and minimal complexity.
