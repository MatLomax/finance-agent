# Finance Agent

Ultra-lightweight vanilla JavaScript finance agent with TypeBox validation and zero-build architecture.

## Architecture

- **Pure JavaScript ES2022+** - No transpilation needed for runtime
- **JSDoc + TypeScript + TypeBox** - Compile-time type checking + runtime validation in pure .js files
- **Zero dependencies** - Only 3 carefully chosen utilities
- **< 15kb bundle** - Ultra-lightweight for fast loading
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
npm run commit         # Automated commit with version bump and changelog
npm run release        # Automated GitHub release with assets
npm run ship           # Complete workflow: check → commit → release
npm run type-check     # Check types with TypeScript (no emit)
npm run type-check:watch # Check types in watch mode
npm run lint           # Check code with ESLint
npm run lint:fix       # Fix ESLint issues automatically
```

### Build (Optional)
```bash
npm run build          # Build with esbuild (only if needed)
```

## Project Structure

```
src/
├── lib/               # Pure business logic functions
│   ├── __tests__/     # Unit tests for lib functions
│   └── *.js          # Individual function files
├── ui/               # UI creation modules
│   ├── __tests__/    # UI component tests
│   └── *.js         # UI module files
├── state/           # State management modules
├── types/           # TypeBox schemas and validators
└── main.js         # Application entry point
```

## Dependencies

### Runtime Dependencies (3 total)
- **@sinclair/typebox** - Runtime type validation
- **lodash-es** - Utility functions (tree-shakeable)
- **date-fns** - Date manipulation utilities

### Development Dependencies
- **eslint** - Code linting
- **esbuild** - Optional build tool for minification

## AI Agent Development Workflow

1. **Write Tests First** - Follow TDD methodology
2. **Design Types** - Use JSDoc comments for TypeScript inference
3. **Implement Functions** - Pure functions with TypeBox validation
4. **Document Thoroughly** - Educational comments explaining formulas
5. **Quality Gate** - AI agent runs `npm run precommit` (validates everything)
6. **Automated Commit** - AI agent runs `npm run commit` (version bump, commit, push)
7. **Automated Release** - AI agent runs `npm run release` (GitHub release with assets)
8. **Complete Workflow** - AI agent uses `npm run ship` for full automation

## Performance Targets

- **Bundle Size**: < 15kb gzipped
- **Time to Interactive**: < 300ms on 3G
- **Memory Usage**: < 5MB heap
- **Test Execution**: < 2 seconds total

## Code Standards

All code follows comprehensive standards defined in `.cursor/rules/`:
- Educational commenting with formula breakdowns
- TypeBox schemas for runtime validation
- Pure functions with SOLID principles
- Zero magic - every line explained
- ESLint must pass before task completion
