#!/bin/bash

# Finance Agent Quality Check Script
# Usage: ./scripts/check.sh [--fast] [--type-check] [--lint] [--test] [--build] [--deps]
# Default: Run all checks including comprehensive performance analysis
# --fast: Run only type-check, lint, and test (skip build, deps)
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

    # Clear the spinner line completely
    printf "\r\033[K"
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
        printf "${GREEN}[✓]${NC} ${WHITE}${name} passed${NC}\n"
        
        # Store summary information based on check type
        case "$name" in
            "TypeScript Type Check")
                # TypeScript exits 0 with no output if successful
                SUMMARY_TYPES="TypeScript validation passed"
                ;;
            "Tests with Coverage")
                # Extract test count and coverage from Node.js test output
                local test_count=$(echo "$output" | grep -oE 'ok [0-9]+' | wc -l)
                local coverage_line=$(echo "$output" | grep -E 'all files.*[0-9.]+%' | head -1)
                local coverage=$(echo "$coverage_line" | grep -oE '[0-9.]+%' | head -1)
                if [ -n "$test_count" ] && [ "$test_count" -gt 0 ]; then
                    SUMMARY_TESTS="$test_count tests passed"
                fi
                if [ -n "$coverage" ]; then
                    SUMMARY_COVERAGE="$coverage line coverage"
                fi
                ;;
            "Bundle Size & Performance Analysis")
                # Extract bundle size and TTI from performance analyzer output
                local bundle_size=$(echo "$output" | grep -oE 'Total Bundle: [0-9.]+KB gzipped' | grep -oE '[0-9.]+KB')
                local tti=$(echo "$output" | grep -oE 'Estimated TTI: [0-9]+ms' | grep -oE '[0-9]+ms')
                if [ -n "$bundle_size" ]; then
                    SUMMARY_BUNDLE="Bundle: ${bundle_size} gzipped"
                fi
                if [ -n "$tti" ]; then
                    SUMMARY_TTI="TTI: ${tti}"
                fi
                ;;
            "ESLint Code Quality")
                # Check if there are any warnings (ESLint exits 0 but may have warnings)
                local warning_count=$(echo "$output" | grep -oE '[0-9]+ warning' | grep -oE '[0-9]+' | head -1)
                if [ -n "$warning_count" ] && [ "$warning_count" -gt 0 ]; then
                    SUMMARY_LINT="$warning_count ESLint warnings"
                else
                    SUMMARY_LINT="No linting issues"
                fi
                ;;
            "Dependency Count Check")
                # Extract dependency count
                local dep_count=$(node -e "const pkg=require('./package.json'); console.log(Object.keys(pkg.dependencies||{}).length);")
                SUMMARY_DEPS="$dep_count runtime dependencies"
                ;;
        esac
        
        return 0
    else
        printf "${RED}[✗] ${name} failed${NC}\n"
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
RUN_ALL=true

# Initialize summary variables
SUMMARY_TYPES=""
SUMMARY_TESTS=""
SUMMARY_COVERAGE=""
SUMMARY_BUNDLE=""
SUMMARY_TTI=""
SUMMARY_LINT=""
SUMMARY_DEPS=""

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
        *)
            echo "Unknown option: $arg"
            echo "Usage: $0 [--fast] [--type-check] [--lint] [--test] [--build] [--deps]"
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

# Check bundle size and performance
if [ "$BUILD" = true ]; then
    if ! run_check "npm run build:analyze" "Bundle Size & Performance Analysis"; then
        echo -e "${RED}💥 Bundle size or performance analysis failed${NC}"
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

echo ""
echo -e "${GREEN}🎉 All quality checks passed!${NC}"

# Display summary information
echo ""
echo -e "${WHITE}📊 Quality Summary:${NC}"
if [ -n "$SUMMARY_TYPES" ]; then
    echo -e "${GREY}   • ${SUMMARY_TYPES}${NC}"
fi
if [ -n "$SUMMARY_TESTS" ]; then
    echo -e "${GREY}   • ${SUMMARY_TESTS}${NC}"
fi
if [ -n "$SUMMARY_COVERAGE" ]; then
    echo -e "${GREY}   • ${SUMMARY_COVERAGE}${NC}"
fi
if [ -n "$SUMMARY_LINT" ]; then
    echo -e "${GREY}   • ${SUMMARY_LINT}${NC}"
fi
if [ -n "$SUMMARY_BUNDLE" ]; then
    echo -e "${GREY}   • ${SUMMARY_BUNDLE}${NC}"
fi
if [ -n "$SUMMARY_TTI" ]; then
    echo -e "${GREY}   • ${SUMMARY_TTI}${NC}"
fi
if [ -n "$SUMMARY_DEPS" ]; then
    echo -e "${GREY}   • ${SUMMARY_DEPS}${NC}"
fi

echo ""
echo -e "${GREY}✨ Ready for deployment - ultra-lightweight finance agent validated${NC}"
