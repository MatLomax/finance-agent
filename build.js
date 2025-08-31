#!/usr/bin/env node

/**
 * @fileoverview Minimal build script for finance agent
 * 
 * This script creates a minified production build for releases while maintaining
 * the zero-build development philosophy. The build is optional and only used
 * for distribution packages and bundle size validation.
 * 
 * Features:
 * - Minifies JavaScript files for smaller distribution
 * - Preserves ES module structure
 * - Maintains source maps for debugging
 * - Validates bundle size constraints
 */

import { build } from 'esbuild';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  reset: '\x1b[0m'
};

const log = {
  info: (/** @type {string} */ msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (/** @type {string} */ msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (/** @type {string} */ msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (/** @type {string} */ msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (/** @type {string} */ msg) => console.log(`${colors.cyan}▶${colors.reset} ${msg}`)
};

// Build configuration
const buildConfig = {
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: 'es2022',
  format: /** @type {const} */ ('esm'),
  outdir: 'dist',
  splitting: true,
  chunkNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
  metafile: true,
  treeShaking: true,
  // Preserve function names for debugging
  keepNames: false,
  // External dependencies (don't bundle these)
  external: [],
  // Define environment variables
  define: {
    'process.env.NODE_ENV': '"production"'
  }
};

/**
 * Get bundle size in bytes
 * @param {any} metafile - esbuild metafile
 * @returns {number} - total bundle size in bytes
 */
function getBundleSize(metafile) {
  let totalSize = 0;
  for (const output of Object.values(metafile.outputs)) {
    totalSize += output.bytes;
  }
  return totalSize;
}

/**
 * Format bytes to human readable string
 * @param {number} bytes - bytes to format
 * @returns {string} - formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate bundle size against constraints
 * @param {number} sizeBytes - bundle size in bytes
 * @returns {boolean} - true if within limits
 */
function validateBundleSize(sizeBytes) {
  const maxSizeKB = 15; // From constants - ultra-lightweight target
  const maxSizeBytes = maxSizeKB * 1024;
  
  if (sizeBytes > maxSizeBytes) {
    log.error(`Bundle size ${formatBytes(sizeBytes)} exceeds ${maxSizeKB}KB limit`);
    return false;
  }
  
  log.success(`Bundle size ${formatBytes(sizeBytes)} is within ${maxSizeKB}KB limit`);
  return true;
}

/**
 * Create index.html for distribution
 * @param {any} metafile - esbuild metafile
 */
function createDistributionHTML(metafile) {
  // Find the main JS file in outputs
  const jsFiles = Object.keys(metafile.outputs).filter(file => 
    file.endsWith('.js') && !file.includes('chunk')
  );
  
  const mainJsFile = jsFiles[0] || 'main.js';
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Agent</title>
    <meta name="description" content="Ultra-lightweight vanilla JavaScript finance agent">
    <style>
        /* Minimal critical CSS */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Finance Agent</h1>
            <p>Ultra-lightweight vanilla JavaScript finance application</p>
        </header>
        <main id="app">
            <p>Loading...</p>
        </main>
    </div>
    
    <script type="module" src="./${mainJsFile}"></script>
</body>
</html>`;

  writeFileSync(join('dist', 'index.html'), html);
  log.success('Created distribution HTML');
}

/**
 * Main build function
 */
async function buildProject() {
  try {
    log.step('Starting finance agent build...');
    
    // Ensure dist directory exists
    if (!existsSync('dist')) {
      mkdirSync('dist', { recursive: true });
    }
    
    // Check if main entry point exists
    if (!existsSync('src/main.js')) {
      log.warn('src/main.js not found, creating minimal entry point');
      
      // Ensure src directory exists
      if (!existsSync('src')) {
        mkdirSync('src', { recursive: true });
      }
      
      // Create minimal main.js
      const minimalMain = `/**
 * Finance Agent - Ultra-lightweight vanilla JavaScript
 * Entry point for the finance application
 */

console.log('🚀 Finance Agent initialized');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = '<h2>Finance Agent Ready</h2><p>Ultra-lightweight vanilla JavaScript finance application.</p>';
    }
});

export default {};
`;
      writeFileSync('src/main.js', minimalMain);
      log.success('Created minimal src/main.js');
    }
    
    log.step('Building with esbuild...');
    
    // Run esbuild
    const result = await build(buildConfig);
    
    // Get bundle size
    const bundleSize = getBundleSize(result.metafile);
    
    log.success(`Build completed successfully`);
    log.info(`Bundle size: ${formatBytes(bundleSize)}`);
    
    // Validate bundle size
    if (!validateBundleSize(bundleSize)) {
      process.exit(1);
    }
    
    // Create distribution HTML
    createDistributionHTML(result.metafile);
    
    // Write metafile for analysis
    writeFileSync('dist/meta.json', JSON.stringify(result.metafile, null, 2));
    log.success('Build metadata saved to dist/meta.json');
    
    // Summary
    console.log('');
    log.success('🎉 Build completed successfully!');
    log.info(`📦 Output: dist/ directory`);
    log.info(`📊 Bundle size: ${formatBytes(bundleSize)} (${((bundleSize / (15 * 1024)) * 100).toFixed(1)}% of 15KB limit)`);
    log.info(`🚀 Ready for deployment`);
    
  } catch (error) {
    log.error('Build failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildProject();
}

export { buildProject };
