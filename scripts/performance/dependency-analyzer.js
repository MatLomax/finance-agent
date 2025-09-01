/**
 * Dependency analysis module
 * Analyzes external dependencies and their impact on bundle size
 */

import { readFileSync } from 'fs';

const COLORS = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  CYAN: '\x1b[0;36m',
  NC: '\x1b[0m'
};

export class DependencyAnalyzer {
  constructor() {
    this.results = {};
  }

  /**
   * Analyze external dependencies impact
   */
  analyze() {
    console.log(`${COLORS.BLUE}📚 Dependency Analysis${COLORS.NC}`);
    console.log('='.repeat(50));

    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const dependencies = packageJson.dependencies || {};
      
      console.log(`Runtime dependencies: ${Object.keys(dependencies).length}`);
      
      Object.entries(dependencies).forEach(([name, version]) => {
        console.log(`${COLORS.GREEN}✅ ${name}@${version}${COLORS.NC} (external)`);
      });

      console.log(`\n${COLORS.CYAN}💡 External dependencies are loaded separately from CDN${COLORS.NC}`);
      console.log(`${COLORS.CYAN}   This keeps the main bundle lightweight${COLORS.NC}\n`);
      
      this.results = dependencies;
      return true;
    } catch (error) {
      console.log(`${COLORS.RED}❌ Error reading package.json${COLORS.NC}\n`);
      return false;
    }
  }

  getResults() {
    return this.results;
  }
}
