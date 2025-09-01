#!/bin/bash

# Bundle Size Validation Script
# 
# Validates that the Finance Agent bundle meets performance requirements:
# - Total bundle size < 15KB gzipped
# - Individual modules < 2KB each
# - Critical CSS inlined efficiently
# 
# Educational: Bundle optimization is crucial for web performance,
# especially on mobile networks with limited bandwidth.

set -e

echo "🔍 Finance Agent Bundle Size Validation"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_TOTAL_SIZE_KB=15
MAX_MODULE_SIZE_KB=2
SRC_DIR="src"
DIST_DIR="dist"

# Create temporary directory for analysis
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo -e "${BLUE}📊 Analyzing bundle size...${NC}"

# Function to get file size in KB
get_size_kb() {
    local file="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        stat -f%z "$file" | awk '{print int($1/1024)}'
    else
        # Linux
        stat -c%s "$file" | awk '{print int($1/1024)}'
    fi
}

# Function to get gzipped size in KB
get_gzipped_size_kb() {
    local file="$1"
    gzip -c "$file" | wc -c | awk '{print int($1/1024)}'
}

# Check if required tools are available
if ! command -v gzip &> /dev/null; then
    echo -e "${RED}❌ gzip is required for bundle analysis${NC}"
    exit 1
fi

# Analyze individual JavaScript modules
echo -e "\n${BLUE}📁 Individual Module Analysis:${NC}"
total_js_size=0
module_violations=0

find "$SRC_DIR" -name "*.js" -not -path "*/node_modules/*" | while read -r file; do
    size_kb=$(get_size_kb "$file")
    gzipped_kb=$(get_gzipped_size_kb "$file")
    
    if [ "$size_kb" -gt "$MAX_MODULE_SIZE_KB" ]; then
        echo -e "${RED}❌ $file: ${size_kb}KB (exceeds ${MAX_MODULE_SIZE_KB}KB limit)${NC}"
        module_violations=$((module_violations + 1))
    else
        echo -e "${GREEN}✅ $file: ${size_kb}KB (${gzipped_kb}KB gzipped)${NC}"
    fi
    
    total_js_size=$((total_js_size + gzipped_kb))
done

# Analyze CSS files
echo -e "\n${BLUE}🎨 CSS Analysis:${NC}"
total_css_size=0

find "$SRC_DIR/styles" -name "*.css" 2>/dev/null | while read -r file; do
    size_kb=$(get_size_kb "$file")
    gzipped_kb=$(get_gzipped_size_kb "$file")
    echo -e "${GREEN}✅ $file: ${size_kb}KB (${gzipped_kb}KB gzipped)${NC}"
    total_css_size=$((total_css_size + gzipped_kb))
done

# Check HTML file
echo -e "\n${BLUE}📄 HTML Analysis:${NC}"
html_size=0
if [ -f "$DIST_DIR/index.html" ]; then
    html_size=$(get_gzipped_size_kb "$DIST_DIR/index.html")
    echo -e "${GREEN}✅ index.html: ${html_size}KB gzipped${NC}"
fi

# Calculate total bundle size
echo -e "\n${BLUE}📦 Bundle Size Summary:${NC}"
echo "JavaScript modules: ${total_js_size}KB gzipped"
echo "CSS stylesheets: ${total_css_size}KB gzipped"
echo "HTML structure: ${html_size}KB gzipped"

total_bundle_size=$((total_js_size + total_css_size + html_size))
echo -e "\nTotal bundle size: ${total_bundle_size}KB gzipped"

# Validation results
echo -e "\n${BLUE}✨ Validation Results:${NC}"

if [ "$total_bundle_size" -le "$MAX_TOTAL_SIZE_KB" ]; then
    echo -e "${GREEN}✅ Total bundle size: ${total_bundle_size}KB (within ${MAX_TOTAL_SIZE_KB}KB limit)${NC}"
else
    echo -e "${RED}❌ Total bundle size: ${total_bundle_size}KB (exceeds ${MAX_TOTAL_SIZE_KB}KB limit)${NC}"
    exit 1
fi

if [ "$module_violations" -eq 0 ]; then
    echo -e "${GREEN}✅ All modules are within size limits${NC}"
else
    echo -e "${RED}❌ ${module_violations} modules exceed size limits${NC}"
    exit 1
fi

# Performance recommendations
echo -e "\n${BLUE}🚀 Performance Recommendations:${NC}"

if [ "$total_bundle_size" -gt 10 ]; then
    echo -e "${YELLOW}💡 Consider further optimization for bundles > 10KB${NC}"
fi

echo -e "${GREEN}✅ Bundle validation complete!${NC}"

# Tree shaking analysis
echo -e "\n${BLUE}🌳 Tree Shaking Analysis:${NC}"
echo "Checking for potential unused imports..."

# Check for common anti-patterns
if grep -r "import \*" "$SRC_DIR" --include="*.js" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Found wildcard imports - consider specific imports for better tree shaking${NC}"
fi

if grep -r "require(" "$SRC_DIR" --include="*.js" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Found CommonJS requires - prefer ES modules for tree shaking${NC}"
fi

echo -e "${GREEN}✅ Tree shaking analysis complete${NC}"
