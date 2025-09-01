#!/usr/bin/env node

/**
 * TypeScript Error Fixer - Regex-based fixes for common TypeScript patterns
 * 
 * This script applies regex find & replace patterns to fix the most common
 * TypeScript error patterns found in the finance agent codebase.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TypeScriptErrorFixer {
  constructor() {
    this.srcDir = path.join(__dirname, 'src');
    this.patterns = [
      // Pattern 1: Remove unused import statements
      {
        name: 'Remove unused AllocationAmounts imports',
        pattern: /import type \{ AllocationAmounts \} from '[^']+';?\s*\n/g,
        replacement: '',
        files: ['**/*.test.ts']
      },
      
      // Pattern 2: Remove unused import lines marked by ESLint
      {
        name: 'Remove All imports in import declaration are unused',
        pattern: /import type \{ [^}]+ \} from '[^']+';?\s*\n/g,
        replacement: '',
        files: ['**/*.test.ts']
      },
      
      // Pattern 3: Add type annotations for common any parameters
      {
        name: 'Add type for year parameter in find callbacks',
        pattern: /(\w+)\.find\(year => /g,
        replacement: '$1.find((year: any) => ',
        files: ['**/*.test.ts']
      },
      
      // Pattern 4: Add type for unsubscribe parameter
      {
        name: 'Add type for unsubscribe parameter',
        pattern: /\(unsubscribe\) =>/g,
        replacement: '(unsubscribe: () => void) =>',
        files: ['**/*.test.ts']
      },
      
      // Pattern 5: Add type for key parameter in mock storage
      {
        name: 'Add type for key parameter in storage mocks',
        pattern: /getItem\(key\)/g,
        replacement: 'getItem(key: string)',
        files: ['**/*.test.ts']
      },
      
      // Pattern 6: Add type for setItem parameters in mock storage
      {
        name: 'Add type for setItem parameters in storage mocks',
        pattern: /setItem\(key, value\)/g,
        replacement: 'setItem(key: string, value: string)',
        files: ['**/*.test.ts']
      },
      
      // Pattern 7: Add type for removeItem parameter in mock storage  
      {
        name: 'Add type for removeItem parameter in storage mocks',
        pattern: /removeItem\(key\)/g,
        replacement: 'removeItem(key: string)',
        files: ['**/*.test.ts']
      },
      
      // Pattern 8: Add non-null assertions for array access where safe
      {
        name: 'Add non-null assertion for simulation[0] access',
        pattern: /simulation\[0\]\.(\w+)/g,
        replacement: 'simulation[0]!.$1',
        files: ['**/*.test.ts']
      },
      
      // Pattern 9: Add non-null assertions for year array access
      {
        name: 'Add non-null assertion for year variable access',
        pattern: /(year\d*)\.(\w+)/g,
        replacement: '$1?.$2',
        files: ['**/*.test.ts']
      },
      
      // Pattern 10: Add non-null assertions for array index access
      {
        name: 'Add non-null assertion for array index access',
        pattern: /(\w+)\[(\d+)\]\.(\w+)/g,
        replacement: '$1[$2]?.$3',
        files: ['**/*.test.ts']
      },
      
      // Pattern 11: Add type assertions for FinancialPhase
      {
        name: 'Add type assertion for FinancialPhase',
        pattern: /calculateAllocationAmounts\([^,]+, 'unknown'/g,
        replacement: "calculateAllocationAmounts($1, 'unknown' as FinancialPhase",
        files: ['**/*.test.ts']
      },
      
      // Pattern 12: Add type annotations for event handlers
      {
        name: 'Add type for event parameter in handlers',
        pattern: /\(_e\) =>/g,
        replacement: '(_e: Event) =>',
        files: ['**/*.ts']
      },
      
      // Pattern 13: Add type for element parameter in handlers  
      {
        name: 'Add type for element parameter in handlers',
        pattern: /, el\) =>/g,
        replacement: ', el: HTMLElement) =>',
        files: ['**/*.ts']
      }
    ];
  }

  /**
   * Get all TypeScript files in the src directory
   */
  getFiles(_patterns) {
    const allFiles = [];
    
    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (file.endsWith('.ts')) {
          allFiles.push(fullPath);
        }
      }
    }
    
    walkDir(this.srcDir);
    return allFiles;
  }

  /**
   * Apply a single pattern to all relevant files
   */
  applyPattern(pattern) {
    console.log(`Applying pattern: ${pattern.name}`);
    const files = this.getFiles(pattern.files);
    let changedCount = 0;
    
    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(pattern.pattern, pattern.replacement);
        
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          changedCount++;
          console.log(`  ✓ Fixed ${filePath}`);
        }
      } catch (error) {
        console.warn(`  ⚠ Warning: Could not process ${filePath}: ${error.message}`);
      }
    }
    
    console.log(`  Changed ${changedCount} files\n`);
    return changedCount;
  }

  /**
   * Apply all patterns and return summary
   */
  fixAll() {
    console.log('🔧 Starting TypeScript error fixes...\n');
    
    let totalChanges = 0;
    for (const pattern of this.patterns) {
      totalChanges += this.applyPattern(pattern);
    }
    
    console.log(`✅ Completed! Applied ${totalChanges} changes across all patterns.`);
    
    // Run type check to see results
    console.log('\n📊 Running type check to see remaining errors...');
    try {
      execSync('npm run type-check', { stdio: 'inherit', cwd: __dirname });
      console.log('✅ No type errors remaining!');
    } catch (error) {
      console.log('📋 Type errors still remain. Manual fixes may be needed.');
    }
    
    return totalChanges;
  }
}

// Run the fixer if called directly
if (require.main === module) {
  const fixer = new TypeScriptErrorFixer();
  fixer.fixAll();
}

module.exports = TypeScriptErrorFixer;
