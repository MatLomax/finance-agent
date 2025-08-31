#!/bin/bash

# File Complexity and Length Checker
# Provides detailed analysis of ESLint complexity violations with actionable suggestions

set -e

echo "🔍 Analyzing code complexity and file structure..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Ensure we're in a Node.js project
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Run from project root.${NC}"
    exit 1
fi

# Run ESLint with complexity rules only
echo -e "${BLUE}Running complexity analysis...${NC}"

# Capture ESLint output
COMPLEXITY_OUTPUT=$(npx eslint src/ --format=unix 2>&1 || true)

# Parse and categorize violations
FILE_LENGTH_VIOLATIONS=$(echo "$COMPLEXITY_OUTPUT" | grep "max-lines" | wc -l)
FUNCTION_COMPLEXITY_VIOLATIONS=$(echo "$COMPLEXITY_OUTPUT" | grep -E "(complexity|max-statements|max-params|max-depth)" | wc -l)
FUNCTION_LENGTH_VIOLATIONS=$(echo "$COMPLEXITY_OUTPUT" | grep "max-lines-per-function" | wc -l)
CALLBACK_NESTING_VIOLATIONS=$(echo "$COMPLEXITY_OUTPUT" | grep "max-nested-callbacks" | wc -l)

TOTAL_VIOLATIONS=$((FILE_LENGTH_VIOLATIONS + FUNCTION_COMPLEXITY_VIOLATIONS + FUNCTION_LENGTH_VIOLATIONS + CALLBACK_NESTING_VIOLATIONS))

echo ""
echo "📊 COMPLEXITY ANALYSIS RESULTS"
echo "=============================="
echo -e "📄 Files exceeding 100 lines: ${RED}$FILE_LENGTH_VIOLATIONS${NC}"
echo -e "⚡ Complex functions (>10 complexity): ${RED}$FUNCTION_COMPLEXITY_VIOLATIONS${NC}"  
echo -e "📏 Long functions (>50 lines): ${RED}$FUNCTION_LENGTH_VIOLATIONS${NC}"
echo -e "🔗 Deeply nested callbacks: ${RED}$CALLBACK_NESTING_VIOLATIONS${NC}"
echo -e "📋 Total violations: ${RED}$TOTAL_VIOLATIONS${NC}"
echo ""

# If there are violations, provide detailed analysis
if [ $TOTAL_VIOLATIONS -gt 0 ]; then
    echo -e "${YELLOW}🚨 FILES REQUIRING REFACTORING:${NC}"
    echo "================================"
    
    # Show files that exceed line limits
    if [ $FILE_LENGTH_VIOLATIONS -gt 0 ]; then
        echo -e "${RED}📄 Files exceeding 100 lines (need splitting):${NC}"
        echo "$COMPLEXITY_OUTPUT" | grep "max-lines" | sed 's/^/  /'
        echo ""
        echo -e "${BLUE}💡 Splitting Strategy:${NC}"
        echo "  1. Group related functions by domain (e.g., currency/, taxes/, calculations/)"
        echo "  2. Create focused modules with single responsibilities"
        echo "  3. Use src/lib/[domain]/ structure with individual test files"
        echo "  4. See .cursor/rules/file-structure.mdc for detailed guidelines"
        echo ""
    fi
    
    # Show function complexity issues
    if [ $FUNCTION_COMPLEXITY_VIOLATIONS -gt 0 ] || [ $FUNCTION_LENGTH_VIOLATIONS -gt 0 ]; then
        echo -e "${RED}⚡ Functions requiring simplification:${NC}"
        echo "$COMPLEXITY_OUTPUT" | grep -E "(complexity|max-statements|max-params|max-depth|max-lines-per-function)" | sed 's/^/  /'
        echo ""
        echo -e "${BLUE}💡 Function Refactoring Strategy:${NC}"
        echo "  1. Extract complex logic into smaller helper functions"
        echo "  2. Reduce parameter count by grouping related params into objects"
        echo "  3. Flatten nested conditionals using early returns"
        echo "  4. Split long functions into focused, single-purpose functions"
        echo ""
    fi
    
    # Show nesting issues (mainly test files)
    if [ $CALLBACK_NESTING_VIOLATIONS -gt 0 ]; then
        echo -e "${RED}🔗 Test files with deep nesting:${NC}"
        echo "$COMPLEXITY_OUTPUT" | grep "max-nested-callbacks" | sed 's/^/  /'
        echo ""
        echo -e "${BLUE}💡 Test Organization Strategy:${NC}"
        echo "  1. Split large test files by domain/function"
        echo "  2. Use helper functions to reduce describe/it nesting"
        echo "  3. Group related tests in separate files"
        echo "  4. Consider using test utilities to reduce repetition"
        echo ""
    fi
    
    echo -e "${YELLOW}🔧 NEXT STEPS:${NC}"
    echo "============="
    echo "1. Choose the largest file to refactor first (highest impact)"
    echo "2. Follow the splitting strategy in .cursor/rules/file-structure.mdc"
    echo "3. Run 'npm run lint' after each change to track progress"
    echo "4. Ensure all tests pass after refactoring: 'npm run test'"
    echo "5. Quality gates will pass once all violations are resolved"
    echo ""
    
    exit 1
else
    echo -e "${GREEN}✅ All files pass complexity checks!${NC}"
    echo -e "${GREEN}📊 Code structure is well-organized and maintainable${NC}"
    exit 0
fi
