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

async function buildProduction() {
  console.log('🔧 Building production bundle...');
  
  try {
    // Build JavaScript bundle with external dependencies
    await build({
      entryPoints: ['src/main.js'],
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
    
    // Check bundle size
    const bundleStats = statSync('dist/bundle.js');
    const bundleSizeKB = Math.round(bundleStats.size / 1024 * 100) / 100;
    
    console.log(`📦 Bundle size: ${bundleSizeKB} KB`);
    
    if (bundleSizeKB > 25) {
      console.error('❌ Bundle size exceeds 25KB limit');
      console.error(`Current: ${bundleSizeKB} KB | Limit: 25 KB`);
      process.exit(1);
    }
    
    console.log('✅ Bundle size within 25KB limit');
    
    // Copy CSS
    const cssContent = readFileSync('src/styles/main.css', 'utf8');
    writeFileSync('dist/bundle.css', cssContent);
    console.log('📄 CSS copied to dist/bundle.css');
    
    console.log('🎉 Production build complete!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProduction();
