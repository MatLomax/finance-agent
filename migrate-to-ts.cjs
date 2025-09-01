#!/usr/bin/env node

/**
 * Automated JavaScript to TypeScript Migration Script
 * 
 * This script automates the conversion of JavaScript files with JSDoc to TypeScript
 * by performing the following transformations:
 * 1. Rename .js files to .ts
 * 2. Convert JSDoc @param and @returns to TypeScript types
 * 3. Add type annotations to function parameters and return types
 * 4. Transform import/export statements
 * 5. Update type references
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  srcDir: 'src',
  testPattern: /\.test\.js$/,
  skipFiles: [
    'src/types/index.ts', // Already converted
    'src/lib/simulate-wealth.ts', // Already converted
    'src/lib/simulation-helpers.ts' // Already converted
  ],
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose')
};

// Type mapping for common JSDoc types to TypeScript
const TYPE_MAPPINGS = {
  'any': 'any',
  'string': 'string',
  'number': 'number',
  'boolean': 'boolean',
  'object': 'object',
  'Object': 'object',
  'Array': 'any[]',
  'Array.': 'Array',
  'Function': '(...args: any[]) => any',
  'HTMLElement': 'HTMLElement',
  'Event': 'Event',
  'NodeList': 'NodeList',
  'Element': 'Element'
};

// Common interface imports
const COMMON_TYPES = [
  'AllocationAmounts',
  'FinancialPhase',
  'SimulationYearParams',
  'SimulationYearResult',
  'FinancialInputData',
  'SimulationInput',
  'RetirementWithdrawal',
  'YearlySimulationData',
  'WealthSimulationResult',
  'FinancialAllocations'
];

function log(message, level = 'info') {
  if (level === 'verbose' && !CONFIG.verbose) return;
  const prefix = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : '✅';
  console.log(`${prefix} ${message}`);
}

function getAllJSFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllJSFiles(fullPath, allFiles);
    } else if (file.endsWith('.js') && !CONFIG.skipFiles.includes(fullPath)) {
      allFiles.push(fullPath);
    }
  }
  
  return allFiles;
}

function extractJSDocTypes(content) {
  const paramTypes = new Map();
  const returnType = { type: 'void' };
  
  // Extract @param types: @param {type} name - description
  const paramMatches = content.matchAll(/\*\s*@param\s*\{([^}]+)\}\s*([^\s-]+)/g);
  for (const match of paramMatches) {
    const type = convertJSDocType(match[1]);
    const paramName = match[2];
    paramTypes.set(paramName, type);
  }
  
  // Extract @returns type: @returns {type} description
  const returnMatch = content.match(/\*\s*@returns?\s*\{([^}]+)\}/);
  if (returnMatch) {
    returnType.type = convertJSDocType(returnMatch[1]);
  }
  
  return { paramTypes, returnType };
}

function convertJSDocType(jsDocType) {
  // Handle simple types
  if (TYPE_MAPPINGS[jsDocType]) {
    return TYPE_MAPPINGS[jsDocType];
  }
  
  // Handle arrays: Array<Type> or Type[]
  if (jsDocType.includes('Array<') || jsDocType.includes('[]')) {
    return jsDocType.replace(/Array<([^>]+)>/g, '$1[]');
  }
  
  // Handle union types: type1|type2
  if (jsDocType.includes('|')) {
    return jsDocType.split('|').map(t => t.trim()).join(' | ');
  }
  
  // Check if it's a common interface type
  if (COMMON_TYPES.includes(jsDocType)) {
    return jsDocType;
  }
  
  // Default to any for unknown types
  return 'any';
}

function addTypeAnnotationsToFunction(content) {
  const { paramTypes, returnType } = extractJSDocTypes(content);
  
  // Pattern to match function declarations and expressions
  const functionPatterns = [
    // function name(params) {
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*\{/g,
    // export function name(params) {
    /export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*\{/g,
    // const name = function(params) {
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{/g,
    // const name = (params) => {
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(([^)]*)\)\s*=>/g,
    // name: function(params) {
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*function\s*\(([^)]*)\)\s*\{/g
  ];
  
  let result = content;
  
  for (const pattern of functionPatterns) {
    result = result.replace(pattern, (match, functionName, params) => {
      const isArrowFunction = match.includes('=>');
      const isExport = match.includes('export');
      const isMethod = match.includes(':');
      
      // Type the parameters
      const typedParams = params.split(',').map(param => {
        const paramName = param.trim().split('=')[0].trim(); // Handle default params
        const paramType = paramTypes.get(paramName) || 'any';
        
        if (param.includes('=')) {
          // Handle default parameters
          const [name, defaultValue] = param.split('=');
          return `${name.trim()}: ${paramType} = ${defaultValue.trim()}`;
        } else {
          return param.trim() ? `${paramName}: ${paramType}` : '';
        }
      }).filter(Boolean).join(', ');
      
      // Add return type
      const returnTypeAnnotation = returnType.type !== 'void' ? `: ${returnType.type}` : '';
      
      if (isArrowFunction) {
        return `const ${functionName} = (${typedParams})${returnTypeAnnotation} =>`;
      } else if (isExport) {
        return `export function ${functionName}(${typedParams})${returnTypeAnnotation} {`;
      } else if (isMethod) {
        return `${functionName}: function(${typedParams})${returnTypeAnnotation} {`;
      } else {
        return `function ${functionName}(${typedParams})${returnTypeAnnotation} {`;
      }
    });
  }
  
  return result;
}

function addImportStatements(content, filePath) {
  // Check if file needs type imports
  const needsTypes = COMMON_TYPES.some(type => content.includes(type));
  
  if (!needsTypes) return content;
  
  // Determine relative path to types
  const fileDir = path.dirname(filePath);
  const typesPath = path.relative(fileDir, 'src/types/index.js').replace(/\\/g, '/');
  const importPath = typesPath.startsWith('.') ? typesPath : `./${typesPath}`;
  
  // Find used types
  const usedTypes = COMMON_TYPES.filter(type => content.includes(type));
  
  if (usedTypes.length === 0) return content;
  
  // Add import statement at the top after other imports
  const importStatement = `import type { ${usedTypes.join(', ')} } from '${importPath}';\n`;
  
  // Insert after existing imports or at the top
  const importRegex = /^((?:import[^;]+;|\s|\/\*[\s\S]*?\*\/|\/\/.*)*)/m;
  const match = content.match(importRegex);
  
  if (match) {
    return content.replace(importRegex, match[1] + importStatement);
  } else {
    return importStatement + content;
  }
}

function removeJSDocComments(content) {
  // Remove JSDoc param and returns comments that are now redundant
  return content.replace(/^\s*\*\s*@param\s*\{[^}]+\}[^\n]*\n/gm, '')
                .replace(/^\s*\*\s*@returns?\s*\{[^}]+\}[^\n]*\n/gm, '');
}

function updateImportExtensions(content) {
  // Update .js imports to .ts where appropriate
  return content.replace(/from\s+['"]([^'"]+)\.js['"]/g, "from '$1.js'") // Keep .js for now in imports
                .replace(/import\s+['"]([^'"]+)\.js['"]/g, "import '$1.js'"); // Keep .js for now in imports
}

function convertFileToTypeScript(filePath) {
  log(`Converting ${filePath}...`, 'verbose');
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Step 1: Add type annotations to functions
  let result = addTypeAnnotationsToFunction(content);
  
  // Step 2: Add import statements for types
  result = addImportStatements(result, filePath);
  
  // Step 3: Remove redundant JSDoc comments
  result = removeJSDocComments(result);
  
  // Step 4: Update import extensions (keep as .js for now)
  result = updateImportExtensions(result);
  
  return result;
}

function renameToTypeScript(jsPath) {
  return jsPath.replace(/\.js$/, '.ts');
}

function migrateFile(jsPath) {
  try {
    const tsPath = renameToTypeScript(jsPath);
    const convertedContent = convertFileToTypeScript(jsPath);
    
    if (CONFIG.dryRun) {
      log(`[DRY RUN] Would convert ${jsPath} → ${tsPath}`);
      log(`[DRY RUN] Content preview (first 200 chars):\n${convertedContent.substring(0, 200)}...`, 'verbose');
    } else {
      // Write the converted content to the .ts file
      fs.writeFileSync(tsPath, convertedContent);
      
      // Remove the original .js file
      fs.unlinkSync(jsPath);
      
      log(`Converted ${jsPath} → ${tsPath}`);
    }
  } catch (error) {
    log(`Error converting ${jsPath}: ${error.message}`, 'error');
  }
}

function updatePackageJsonPatterns() {
  if (CONFIG.dryRun) {
    log('[DRY RUN] Would update package.json test patterns');
    return;
  }
  
  const packagePath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Update test patterns to include .ts files
  if (packageJson.scripts && packageJson.scripts.test) {
    packageJson.scripts.test = packageJson.scripts.test.replace(/\*\.js/g, '*.{js,ts}');
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  log('Updated package.json test patterns');
}

function updateTSConfigIncludes() {
  if (CONFIG.dryRun) {
    log('[DRY RUN] Would update tsconfig.json include patterns');
    return;
  }
  
  const tsconfigPath = 'tsconfig.json';
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  // Update include patterns
  if (!tsconfig.include) {
    tsconfig.include = [];
  }
  
  // Add TypeScript file patterns
  const patterns = ['src/**/*.ts', 'src/**/*.tsx'];
  patterns.forEach(pattern => {
    if (!tsconfig.include.includes(pattern)) {
      tsconfig.include.push(pattern);
    }
  });
  
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  log('Updated tsconfig.json include patterns');
}

function main() {
  log('🚀 Starting JavaScript to TypeScript migration...');
  
  if (CONFIG.dryRun) {
    log('🔍 Running in DRY RUN mode - no files will be modified');
  }
  
  // Get all JavaScript files
  const jsFiles = getAllJSFiles(CONFIG.srcDir);
  
  // Separate test files from regular files
  const testFiles = jsFiles.filter(file => CONFIG.testPattern.test(file));
  const sourceFiles = jsFiles.filter(file => !CONFIG.testPattern.test(file));
  
  log(`Found ${sourceFiles.length} source files and ${testFiles.length} test files`);
  
  // Convert source files first
  log('\n📦 Converting source files...');
  sourceFiles.forEach(migrateFile);
  
  // Convert test files
  log('\n🧪 Converting test files...');
  testFiles.forEach(migrateFile);
  
  // Update configuration files
  log('\n⚙️ Updating configuration files...');
  updatePackageJsonPatterns();
  updateTSConfigIncludes();
  
  log('\n🎉 Migration complete!');
  
  if (!CONFIG.dryRun) {
    log('\n📋 Next steps:');
    log('1. Run `npm run build` to check for TypeScript compilation errors');
    log('2. Fix any remaining type errors manually');
    log('3. Run tests to ensure everything still works');
    log('4. Commit your changes');
  }
}

// Run the migration
if (require.main === module) {
  main();
}
