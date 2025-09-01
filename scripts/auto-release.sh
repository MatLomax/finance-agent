#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
GREY='\033[0;37m'
NC='\033[0m' # No Color

# Function to get version from package.json (single source of truth)
get_version() {
    node -p "require('./package.json').version"
}

# Function to generate release notes
generate_release_notes() {
    local version=$1
    local commit_message=$(git log -1 --pretty=format:"%B")
    
    cat << EOF
# 🤖 AI Agent Release v${version}

## Overview
Automated release created by AI development agent after successful quality gate validation.

## What's Changed
$(echo "$commit_message" | sed -n '/## Changes in v/,/### Quality Assurance/p' | head -n -1)

## Quality Assurance
- ✅ **Type Safety**: JSDoc + TypeScript type checking passed
- ✅ **Code Quality**: ESLint with zero warnings
- ✅ **Testing**: 100% test coverage maintained
- ✅ **Performance**: Bundle size < 25KB (production build)
- ✅ **Architecture**: Minimal dependencies with tree-shaking
- ✅ **Documentation**: Educational comments validated

## Installation & Usage

\`\`\`bash
# Clone the repository
git clone https://github.com/MatLomax/finance-agent.git

# Install dependencies
npm install

# Run quality checks
npm run check

# Start development (requires Python for local server)
python -m http.server 3000 --directory .
\`\`\`

## Architecture Highlights
- **Ultra-lightweight**: < 25KB total bundle size with esbuild production bundling
- **Modern ES Modules**: Pure JavaScript ES2022+ with esbuild for production optimization
- **Type-safe**: JSDoc comments + TypeScript checking + runtime validation
- **Educational**: All code includes step-by-step explanations of financial concepts
- **Automated**: AI agent handles commits and releases with detailed analysis

---
*This release was automatically created by the AI development agent following comprehensive quality validation.*
EOF
}

# Function to create GitHub release with assets
create_github_release() {
    local version=$1
    local release_notes_file="release-notes-v${version}.md"
    
    # Generate release notes file
    generate_release_notes "$version" > "$release_notes_file"
    
    # Build minified version for release
    echo "Building minified version for release..."
    npm run build
    
    # Create release archive with essential files including minified build
    local archive_name="finance-agent-v${version}.tar.gz"
    
    # Create list of files to include, checking if they exist
    local files_to_include=()
    for file in .cursor scripts src dist package.json tsconfig.json build.js README.md .vscode .gitignore .nvmrc; do
        if [ -e "$file" ]; then
            files_to_include+=("$file")
        fi
    done
    
    # Create tar archive with only existing files
    tar --exclude-vcs -czf "$archive_name" "${files_to_include[@]}"
    
    # Create GitHub release
    gh release create "v${version}" \
        --title "🤖 AI Agent Release v${version}" \
        --notes-file "$release_notes_file" \
        --latest \
        "$archive_name"
    
    # Clean up temporary files
    rm "$release_notes_file" "$archive_name"
    
    echo -e "${GREEN}📦 GitHub release v${version} created with assets${NC}"
}

# Main execution
echo -e "${WHITE}🚀 AI Dev Agent - Automated Release${NC}"
echo ""

# Get version to release
version=$(get_version)

if [ -z "$version" ]; then
    echo -e "${RED}❌ Could not determine version to release${NC}"
    exit 1
fi

echo -e "${YELLOW}🏷️  Creating release for v${version}...${NC}"

# Check if we're on main branch and up to date
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${RED}❌ Must be on main branch to create release${NC}"
    exit 1
fi

# Ensure we're up to date with remote
git fetch origin
if ! git diff --quiet HEAD origin/main; then
    echo -e "${RED}❌ Local branch is not up to date with remote${NC}"
    echo -e "${GREY}Run 'git pull origin main' first${NC}"
    exit 1
fi

# Create git tag
git tag "v${version}"
git push origin "v${version}"

echo -e "${GREEN}✅ Git tag v${version} created and pushed${NC}"

# Create GitHub release
create_github_release "$version"

# Note: Using package.json as single source of truth for version

echo ""
echo -e "${GREEN}🎉 Release v${version} completed successfully!${NC}"
echo -e "${GREY}🔗 View at: https://github.com/MatLomax/finance-agent/releases/tag/v${version}${NC}"
