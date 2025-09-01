/**
 * Production build configuration using esbuild
 * Bundles application code while keeping heavy dependencies external
 */

import { build } from 'esbuild';
import { readFileSync, writeFileSync, statSync } from 'fs';

const externalDependencies = [
  'lodash-es',
  'date-fns', 
  'uplot'
];

/**
 * Build CSS bundle by concatenating all component stylesheets
 */
function buildCSS() {
  console.log('� Processing CSS...');
  const cssFiles = [
    'src/styles/base.css',
    'src/styles/layout.css', 
    'src/styles/forms.css',
    'src/styles/tables.css',
    'src/styles/results.css'
  ];
  
  let concatenatedCSS = '/* Finance Agent - Concatenated CSS Bundle */\n\n';
  
  for (const cssFile of cssFiles) {
    try {
      const cssContent = readFileSync(cssFile, 'utf8');
      concatenatedCSS += `/* === ${cssFile} === */\n`;
      concatenatedCSS += cssContent + '\n\n';
    } catch (error) {
      console.warn(`⚠️  Could not read ${cssFile}, skipping...`);
    }
  }
  
  writeFileSync('dist/bundle.css', concatenatedCSS);
  console.log('� CSS bundle created successfully');
}

/**
 * Validate bundle size against limits
 */
function validateBundleSize() {
  const bundleStats = statSync('dist/bundle.js');
  const bundleSizeKB = Math.round(bundleStats.size / 1024 * 100) / 100;
  
  console.log(`📦 Bundle size: ${bundleSizeKB} KB`);
  
  if (bundleSizeKB > 25) {
    console.error('❌ Bundle size exceeds 25KB limit');
    console.error(`Current: ${bundleSizeKB} KB | Limit: 25 KB`);
    process.exit(1);
  }
  
  console.log('✅ Bundle size within 25KB limit');
}

/**
 * Build JavaScript bundle with esbuild
 */
async function buildJavaScript() {
  return build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/bundle.js',
    external: externalDependencies,
    treeShaking: true,
    metafile: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  }).then(result => {
    // Write metafile for bundle analysis
    if (result.metafile) {
      writeFileSync('dist/bundle-meta.json', JSON.stringify(result.metafile, null, 2));
      console.log('📊 Bundle analysis saved to dist/bundle-meta.json');
    }
  });
}

async function buildProduction() {
  console.log('🔧 Building production bundle...');
  
  try {
    // Build JavaScript bundle with external dependencies
    await buildJavaScript();
    
    // Check bundle size
    validateBundleSize();
    
    // Process and concatenate CSS
    buildCSS();
    
    console.log('🎉 Production build complete!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProduction();
