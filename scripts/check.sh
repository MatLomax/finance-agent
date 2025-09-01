#!/bin/bash

# Finance Agent Quality Check Script
# Usage: ./scripts/check.sh [--fast] [--type-check] [--lint] [--test] [--build] [--deps] [--comments]
# Default: Run all checks
# --fast: Run only type-check, lint, and test (skip build, deps, comments)
# Individual flags: Run only specified checks

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
GREY='\033[0;37m'
NC='\033[0m' # No Color

# Spinner function
show_spinner() {
    local pid=$1
    local name="$2"
    local spinner="/-\|"
    local i=0

    while kill -0 $pid 2>/dev/null; do
        printf "\r${YELLOW}[%c]${NC} ${GREY}Running %s...${NC}" "${spinner:$i:1}" "$name"
        i=$(( (i+1) % 4 ))
        sleep 0.1
    done

    # Clear the entire spinner line with spaces
    printf "\r%*s\r" "80" ""
}

# Function to run command and capture output
run_check() {
    local command="$1"
    local name="$2"

    # Create a temp file for output
    local temp_file=$(mktemp)

    # Run command in background and capture output to temp file
    # Force color output for various tools
    FORCE_COLOR=1 CLICOLOR_FORCE=1 eval "$command" > "$temp_file" 2>&1 &
    local cmd_pid=$!

    # Show spinner while command runs
    show_spinner $cmd_pid "$name"

    # Wait for command to complete and get exit code
    wait $cmd_pid
    local exit_code=$?

    # Read output from temp file
    local output=$(cat "$temp_file")
    rm "$temp_file"

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}[✓]${NC} ${WHITE}${name} passed${NC}"
        return 0
    else
        echo -e "${RED}[✗] ${name} failed${NC}"
        echo -e "$output"
        echo ""
        return 1
    fi
}

# Parse command line arguments
FAST_MODE=false
TYPE_CHECK=false
LINT=false
TEST=false
BUILD=false
DEPS=false
COMMENTS=false
RUN_ALL=true

for arg in "$@"; do
    case $arg in
        --fast)
            FAST_MODE=true
            TYPE_CHECK=true
            LINT=true
            TEST=true
            RUN_ALL=false
            ;;
        --type-check)
            TYPE_CHECK=true
            RUN_ALL=false
            ;;
        --lint)
            LINT=true
            RUN_ALL=false
            ;;
        --test)
            TEST=true
            RUN_ALL=false
            ;;
        --build)
            BUILD=true
            RUN_ALL=false
            ;;
        --deps)
            DEPS=true
            RUN_ALL=false
            ;;
        --comments)
            COMMENTS=true
            RUN_ALL=false
            ;;
        *)
            echo "Unknown option: $arg"
            echo "Usage: $0 [--fast] [--type-check] [--lint] [--test] [--build] [--deps] [--comments]"
            exit 1
            ;;
    esac
done

# If no specific flags, run everything
if [ "$RUN_ALL" = true ]; then
    TYPE_CHECK=true
    LINT=true
    TEST=true
    BUILD=true
    DEPS=true
    COMMENTS=true
fi

echo -e "${WHITE}🔍 Finance Agent Quality Checks${NC}"
if [ "$FAST_MODE" = true ]; then
    echo -e "${YELLOW}⚡ Fast mode: Core checks only${NC}"
fi
echo ""

# Run type check (JSDoc + TypeScript)
if [ "$TYPE_CHECK" = true ]; then
    if ! run_check "npm run type-check" "TypeScript Type Check"; then
        echo -e "${RED}💥 Type checking failed - JSDoc comments may have type errors${NC}"
        exit 1
    fi
fi

# Run lint
if [ "$LINT" = true ]; then
    if ! run_check "npm run lint" "ESLint Code Quality"; then
        echo -e "${RED}💥 Linting failed - code quality issues detected${NC}"
        exit 1
    fi
fi

# Run tests with coverage
if [ "$TEST" = true ]; then
    if ! run_check "npm run test:coverage" "Tests with Coverage"; then
        echo -e "${RED}💥 Tests failed - functionality or coverage issues${NC}"
        exit 1
    fi
fi

# Check bundle size
if [ "$BUILD" = true ]; then
    if ! run_check "npm run build:check" "Bundle Size Check"; then
        echo -e "${RED}💥 Bundle size check failed${NC}"
        exit 1
    fi
fi

# Check for unused files and exports
if [ "$DEPS" = true ]; then
    if ! run_check "npm run knip" "Unused Files/Exports Check"; then
        echo -e "${YELLOW}⚠️  Unused files or exports detected - consider running 'npm run knip:fix'${NC}"
        # Don't exit on knip failures, just warn
    fi
fi

# Validate package.json dependencies count
if [ "$DEPS" = true ]; then
    if ! run_check "node -e \"const pkg=require('./package.json'); const deps=Object.keys(pkg.dependencies||{}).length; if(deps>5) process.exit(1);\"" "Dependency Count Check"; then
        echo -e "${RED}💥 Too many dependencies - maximum 5 allowed${NC}"
        exit 1
    fi
fi

# Check for educational comments in lib files (only if there are function files)
if [ "$COMMENTS" = true ]; then
    # Check if there are any function files (files with 'function' or 'export function')
    function_files=$(find src/lib -name '*.js' -exec grep -l 'function\\|export.*function' {} \; 2>/dev/null | wc -l)
    
    if [ "$function_files" -gt 0 ]; then
        if ! run_check "find src/lib -name '*.js' -exec grep -l '@param\\|@returns\\|Step [0-9]' {} \\; | wc -l | awk '{if(\$1==0) exit 1}'" "Educational Comments Check"; then
            echo -e "${RED}💥 Missing educational comments in lib functions${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}[✓]${NC} ${WHITE}Educational Comments Check passed${NC} (no function files found)"
    fi
fi

echo ""
echo -e "${GREEN}🎉 All quality checks passed!${NC}"
echo -e "${GREY}✨ Ready for deployment - ultra-lightweight finance agent validated${NC}"
