#!/usr/bin/env node

/**
 * TypeScript Migration Cleanup Script
 * 
 * This script fixes common issues from the automated JS to TS conversion
 */

const fs = require('fs');
const path = require('path');

function getAllTSFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllTSFiles(fullPath, allFiles);
    } else if (file.endsWith('.ts')) {
      allFiles.push(fullPath);
    }
  }
  
  return allFiles;
}

function fixTypeScriptSyntax(content) {
  // Fix duplicate type annotations like "name: any: any"
  content = content.replace(/(\w+:\s*\w+):\s*any/g, '$1');
  
  // Fix duplicate exports like "export export"
  content = content.replace(/export\s+export/g, 'export');
  
  // Fix parameter types with duplicate any
  content = content.replace(/(\w+:\s*any):\s*any/g, '$1');
  
  // Fix function parameters that got double-typed
  content = content.replace(/(\w+:\s*\w+):\s*any\s*,/g, '$1,');
  content = content.replace(/(\w+:\s*\w+):\s*any\s*\)/g, '$1)');
  
  // Remove redundant JSDoc parameter annotations that weren't cleaned up
  content = content.replace(/^\s*\*\s*@param\s*\{[^}]*\}\s*\w+.*$/gm, '');
  
  // Clean up empty JSDoc blocks
  content = content.replace(/\/\*\*\s*\*\s*\*\//g, '');
  
  return content;
}

function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixTypeScriptSyntax(content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed);
      console.log(`✅ Fixed ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔧 Fixing TypeScript migration issues...');
  
  const tsFiles = getAllTSFiles('src');
  
  tsFiles.forEach(fixFile);
  
  console.log('🎉 Cleanup complete!');
}

if (require.main === module) {
  main();
}
