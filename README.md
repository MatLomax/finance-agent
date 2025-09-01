# Finance Agent

Ultra-lightweight vanilla JavaScript finance agent with TypeScript design-time validation and zero-build architecture.

## Architecture

- **Pure JavaScript ES2022+** - Modern ES modules with esbuild production bundling
- **JSDoc + TypeScript** - Compile-time type checking in pure .js files
- **Minimal dependencies** - Only 3 carefully chosen utilities (external in production)
- **< 25kb bundle** - Ultra-lightweight with tree-shaking and minification
- **Native DOM APIs** - No framework overhead

## Development Scripts

### Testing
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Development
```bash
npm run dev            # Start development server (Python HTTP server on port 3000)
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
│   ├── *.js          # Individual function files
│   ├── *.test.js     # Co-located unit tests for each module
│   └── integration.test.js # Cross-module integration tests
├── ui/               # UI creation modules
│   ├── *.js         # UI module files
│   └── *.test.js    # UI component tests
├── state/           # State management modules
│   ├── *.js         # State management files
│   └── *.test.js    # State management tests
├── utils/           # Utility functions
│   └── formatting/ # Formatting utilities
│       ├── *.js    # Formatting functions
│       └── *.test.js # Formatting tests
└── main.js         # Application entry point
```

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

- **Bundle Size**: < 25kb minified (external dependencies loaded separately)
- **Time to Interactive**: < 300ms on 3G
- **Memory Usage**: < 5MB heap
- **Test Execution**: < 2 seconds total

## Code Standards

All code follows comprehensive standards defined in `.cursor/rules/`:
- Educational commenting with formula breakdowns
- JSDoc comments with type annotations
- Basic runtime validation for critical edge cases
- Pure functions with SOLID principles
- Zero magic - every line explained
- ESLint must pass before task completion
