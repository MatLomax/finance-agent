/**
 * Build HTML for production bundle
 * Creates optimized HTML that references bundled CSS and JS files
 */

import { readFile, writeFile } from 'fs/promises';

async function buildProductionHTML() {
  try {
    console.log('🏗️  Building production HTML...');
    
    // Read the source HTML template from the existing dist file
    const sourceHTML = await readFile('dist/index.html', 'utf-8');
    
    // Create production HTML with bundled resources
    const productionHTML = sourceHTML
      .replace(/href="\.\/styles\/main\.css"/, 'href="./bundle.css"')
      .replace(/src="\.\/main\.js"/, 'src="./bundle.js"')
      .replace(/href="\.\/main\.js"/, 'href="./bundle.js"'); // preload reference
    
    // Write production HTML
    await writeFile('dist/index.html', productionHTML);
    
    console.log('✅ Production HTML created');
    
  } catch (error) {
    console.error('❌ Failed to build production HTML:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildProductionHTML();
}

export { buildProductionHTML };
