/**
 * Bundle size analysis module
 * Analyzes production bundle sizes and validates against targets
 */

import { statSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const COLORS = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  CYAN: '\x1b[0;36m',
  NC: '\x1b[0m'
};

const TARGETS = {
  MAX_BUNDLE_SIZE_KB: 25,
  MAX_BUNDLE_GZIPPED_KB: 10,
  MAX_CSS_SIZE_KB: 5
};

export class BundleAnalyzer {
  constructor() {
    this.results = {
      bundleSize: {},
      total: null
    };
  }

  /**
   * Get file size in bytes and KB
   * @param {string} filePath - Path to file
   * @returns {object} Size information
   */
  getFileSize(filePath) {
    try {
      const stats = statSync(filePath);
      const bytes = stats.size;
      const kb = Math.round(bytes / 1024 * 100) / 100;
      
      // Get gzipped size
      const gzippedBytes = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
      const gzippedKb = Math.round(parseInt(gzippedBytes.trim()) / 1024 * 100) / 100;
      
      return { bytes, kb, gzippedKb };
    } catch (error) {
      return { bytes: 0, kb: 0, gzippedKb: 0 };
    }
  }

  /**
   * Analyze production bundle sizes
   */
  analyze() {
    console.log(`${COLORS.BLUE}📦 Bundle Size Analysis${COLORS.NC}`);
    console.log('='.repeat(50));

    const files = ['bundle.js', 'bundle.css'];
    let totalSize = 0;
    let totalGzipped = 0;

    files.forEach(filename => {
      const filePath = join('dist', filename);
      const size = this.getFileSize(filePath);
      
      this.results.bundleSize[filename] = size;
      totalSize += size.kb;
      totalGzipped += size.gzippedKb;

      const isJS = filename.includes('.js');
      const limit = isJS ? TARGETS.MAX_BUNDLE_SIZE_KB : TARGETS.MAX_CSS_SIZE_KB;
      const status = size.kb <= limit ? `${COLORS.GREEN}✅` : `${COLORS.RED}❌`;
      
      console.log(`${status} ${filename}: ${size.kb}KB (${size.gzippedKb}KB gzipped)${COLORS.NC}`);
    });

    // Overall assessment
    const overallStatus = totalGzipped <= TARGETS.MAX_BUNDLE_GZIPPED_KB 
      ? `${COLORS.GREEN}✅` : `${COLORS.RED}❌`;
    
    console.log(`\n${overallStatus} Total bundle: ${totalSize}KB (${totalGzipped}KB gzipped)${COLORS.NC}`);
    console.log(`Target: ≤ ${TARGETS.MAX_BUNDLE_GZIPPED_KB}KB gzipped\n`);

    this.results.total = { kb: totalSize, gzippedKb: totalGzipped };
    return totalGzipped <= TARGETS.MAX_BUNDLE_GZIPPED_KB;
  }

  /**
   * Analyze bundle composition from esbuild metafile
   */
  analyzeComposition() {
    console.log(`${COLORS.BLUE}🧩 Bundle Composition Analysis${COLORS.NC}`);
    console.log('='.repeat(50));

    try {
      const metafile = JSON.parse(readFileSync('dist/bundle-meta.json', 'utf8'));
      const inputs = metafile.inputs;
      
      // Group by module type
      const moduleTypes = { lib: [], ui: [], state: [], utils: [], main: [] };

      Object.entries(inputs).forEach(([path, info]) => {
        if (path.includes('/lib/')) moduleTypes.lib.push({ path, ...info });
        else if (path.includes('/ui/')) moduleTypes.ui.push({ path, ...info });
        else if (path.includes('/state/')) moduleTypes.state.push({ path, ...info });
        else if (path.includes('/utils/')) moduleTypes.utils.push({ path, ...info });
        else if (path === 'src/main.js') moduleTypes.main.push({ path, ...info });
      });

      // Display composition
      Object.entries(moduleTypes).forEach(([type, modules]) => {
        if (modules.length === 0) return;
        
        const totalBytes = modules.reduce((sum, mod) => sum + mod.bytes, 0);
        const totalKb = Math.round(totalBytes / 1024 * 100) / 100;
        
        console.log(`${COLORS.CYAN}📁 ${type.toUpperCase()}: ${totalKb}KB (${modules.length} modules)${COLORS.NC}`);
      });

      console.log();
      return true;
    } catch (error) {
      console.log(`${COLORS.YELLOW}⚠️  Bundle meta file not found - run npm run build first${COLORS.NC}\n`);
      return false;
    }
  }

  getResults() {
    return this.results;
  }
}
