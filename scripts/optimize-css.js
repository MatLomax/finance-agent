/**
 * Simple CSS optimization for critical path performance
 * Educational: Demonstrates basic CSS optimization principles
 */

import { readFile, writeFile } from 'fs/promises';

/**
 * Generate production-ready HTML with external CSS
 */
async function optimizeForProduction() {
  try {
    console.log('🎨 Creating production-optimized HTML...');
    
    const htmlContent = await readFile('dist/index.html', 'utf-8');
    
    // Replace development CSS link with production version
    const optimizedHTML = htmlContent.replace(
      'href="../src/styles/main.css"',
      'href="./styles/main.css"'
    );
    
    await writeFile('dist/index-production.html', optimizedHTML);
    console.log('✅ Production HTML created: dist/index-production.html');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeForProduction();
}

export { optimizeForProduction };
