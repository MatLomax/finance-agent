/**
 * @fileoverview Project-wide constants for the finance agent
 * 
 * This file contains all standardized values used across rule files and automation
 * to ensure consistency and eliminate discrepancies. These constants should be
 * referenced by all rule files and scripts to maintain a single source of truth.
 * 
 * Last updated: Based on comprehensive rule file analysis and discrepancy resolution
 */



/**
 * Maximum total bundle size in kilobytes (gzipped)
 * This is the most restrictive but achievable target for vanilla JS applications
 */
export const MAX_BUNDLE_SIZE_KB = 15;

/**
 * Maximum total bundle size in bytes (for automated checks)
 * Calculated as MAX_BUNDLE_SIZE_KB * 1024
 */
export const MAX_BUNDLE_SIZE_BYTES = MAX_BUNDLE_SIZE_KB * 1024;

/**
 * Maximum size per individual module in kilobytes
 * Ensures modules stay focused and lightweight
 */
export const MAX_MODULE_SIZE_KB = 2;

/**
 * Maximum Time to Interactive on 3G connection in milliseconds
 * Critical performance metric for mobile users
 */
export const MAX_TTI_MS = 300;

/**
 * Maximum First Contentful Paint in milliseconds
 * User perception of loading speed
 */
export const MAX_FCP_MS = 400;

/**
 * Maximum Largest Contentful Paint in milliseconds
 * Core Web Vital for loading performance
 */
export const MAX_LCP_MS = 600;



/**
 * Maximum lines per file (code only, comments excluded)
 * Encourages modular code structure while allowing comprehensive documentation
 * Comments are excluded to promote detailed JSDoc and educational documentation
 */
export const MAX_LINES_PER_FILE = 100;

/**
 * Maximum implementation lines per pure function
 * Excludes comments, JSDoc, and validation - focuses on core logic
 */
export const MAX_IMPLEMENTATION_LINES_PER_FUNCTION = 30;

/**
 * Maximum cyclomatic complexity per function
 * Measures the number of linearly independent paths through code
 * Higher values indicate functions that should be broken down
 */
export const MAX_CYCLOMATIC_COMPLEXITY = 10;

/**
 * Maximum number of statements per function
 * Prevents overly long functions that try to do too much
 */
export const MAX_STATEMENTS_PER_FUNCTION = 20;

/**
 * Maximum function parameters
 * Functions with too many parameters often indicate design issues
 */
export const MAX_FUNCTION_PARAMETERS = 5;

/**
 * Maximum nesting depth
 * Deeply nested code is harder to read and test
 */
export const MAX_NESTING_DEPTH = 4;

/**
 * Maximum runtime dependencies allowed in package.json
 * Keeps the application lightweight and reduces security surface
 */
export const MAX_RUNTIME_DEPENDENCIES = 5;

/**
 * Maximum size per dependency in kilobytes
 * Ensures each dependency justifies its inclusion
 */
export const MAX_DEPENDENCY_SIZE_KB = 50;



/**
 * Maximum execution time for pure function tests in milliseconds
 * Pure functions should be fast to test due to no I/O or side effects
 */
export const MAX_PURE_FUNCTION_TEST_TIME_MS = 50;

/**
 * Maximum execution time for full test suite in milliseconds
 * Ensures fast feedback loop during development
 */
export const MAX_FULL_TEST_SUITE_TIME_MS = 2000;

/**
 * Maximum execution time for individual test in milliseconds
 * Prevents slow tests from blocking development workflow
 */
export const MAX_INDIVIDUAL_TEST_TIME_MS = 50;

/**
 * Required test coverage percentage
 * Ensures comprehensive testing of all code paths
 */
export const REQUIRED_TEST_COVERAGE_PERCENT = 100;

/**
 * Maximum main thread blocking time in milliseconds
 * Ensures smooth user interactions and 60fps performance
 */
export const MAX_MAIN_THREAD_BLOCKING_MS = 8;



/**
 * Standard test directory name
 * Consistent across all modules for predictable organization
 */
export const TEST_DIRECTORY_NAME = '__tests__';

/**
 * Test file suffix pattern
 * Standard naming convention for test files
 */
export const TEST_FILE_SUFFIX = '.test.js';

/**
 * Spec file suffix pattern (alternative test naming)
 * Alternative naming convention for specification-style tests
 */
export const SPEC_FILE_SUFFIX = '.spec.js';

/**
 * Quality gate script path
 * Centralized path to the comprehensive quality checking script
 */
export const QUALITY_GATE_SCRIPT_PATH = './scripts/check.sh';

/**
 * Auto-commit script path
 * Path to the automated commit script for AI agent workflow
 */
export const AUTO_COMMIT_SCRIPT_PATH = './scripts/auto-commit.sh';

/**
 * Auto-release script path
 * Path to the automated release script for GitHub integration
 */
export const AUTO_RELEASE_SCRIPT_PATH = './scripts/auto-release.sh';



/**
 * Minimum Node.js version required
 * Ensures compatibility with native test runner and modern JavaScript features
 */
export const MIN_NODE_VERSION = '18.0.0';

/**
 * Target JavaScript version
 * Modern JavaScript features without requiring transpilation
 */
export const TARGET_JS_VERSION = 'ES2022';

/**
 * TypeScript configuration mode
 * Type checking only, no compilation/transpilation
 */
export const TYPESCRIPT_MODE = 'type-check-only';

/**
 * Package.json type field value
 * Enables ES module support throughout the project
 */
export const PACKAGE_TYPE = 'module';



/**
 * Runtime validation library
 * Chosen for lightweight, tree-shakeable runtime type checking
 */
export const RUNTIME_VALIDATION_LIBRARY = '@sinclair/typebox';

/**
 * Compile-time type checking approach
 * JSDoc comments in .js files with TypeScript type checking
 */
export const COMPILE_TIME_TYPE_CHECKING = 'jsdoc-typescript-tsc-noEmit';

/**
 * Maximum string length for descriptions
 * Prevents excessively long user input while allowing detailed descriptions
 */
export const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Minimum string length for descriptions
 * Ensures meaningful descriptions are provided
 */
export const MIN_DESCRIPTION_LENGTH = 1;



/**
 * Transaction types allowed in the system
 * Core financial transaction categories
 */
export const TRANSACTION_TYPES = ['income', 'expense', 'transfer'];

/**
 * Currency precision (decimal places)
 * Standard precision for financial calculations
 */
export const CURRENCY_PRECISION = 2;

/**
 * Use cents for internal calculations
 * Avoids floating-point precision issues in financial calculations
 */
export const USE_CENTS_INTERNALLY = true;



/**
 * Default branch for releases
 * Primary branch for production deployments
 */
export const DEFAULT_BRANCH = 'main';

/**
 * Semantic versioning types
 * Standard semantic versioning increment types
 */
export const SEMVER_TYPES = ['patch', 'minor', 'major'];

/**
 * GitHub release asset patterns
 * Files to include in automated GitHub releases
 */
export const RELEASE_ASSET_PATTERNS = [
  '.cursor/',
  'scripts/',
  'src/',
  'package.json',
  'tsconfig.json',
  'README.md',
  '.vscode/',
  '.gitignore',
  '.nvmrc'
];

/**
 * Required GitHub CLI scopes
 * Permissions needed for automated releases
 */
export const REQUIRED_GH_SCOPES = ['repo', 'workflow'];
