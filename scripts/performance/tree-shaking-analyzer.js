/**
 * Tree shaking analysis module
 * Checks for anti-patterns that prevent optimal tree shaking
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const COLORS = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  CYAN: '\x1b[0;36m',
  NC: '\x1b[0m'
};

export class TreeShakingAnalyzer {
  constructor() {
    this.results = { issues: [] };
  }

  /**
   * Check directory recursively for tree-shaking anti-patterns
   * @param {string} dir - Directory to check
   */
  checkDirectory(dir) {
    const files = readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      if (file.isDirectory()) {
        this.checkDirectory(join(dir, file.name));
      } else if (file.name.endsWith('.js') && !file.name.endsWith('.test.js')) {
        const filePath = join(dir, file.name);
        const content = readFileSync(filePath, 'utf8');
        
        // Check for wildcard imports
        if (content.includes('import *')) {
          this.results.issues.push(`${filePath}: Contains wildcard import (*)`);
        }
        
        // Check for CommonJS requires
        if (content.includes('require(') && !content.includes('// require(')) {
          this.results.issues.push(`${filePath}: Contains CommonJS require()`);
        }
        
        // Check for barrel imports from dependencies (non-tree-shakeable)
        // Only flag imports that import the entire library, not specific functions
        const barrelPatterns = [
          /import lodash from ['"]lodash['"]/,  // import lodash from 'lodash'
          /import \* as .* from ['"]lodash['"]/,  // import * as _ from 'lodash'
          /import dateFns from ['"]date-fns['"]/,  // import dateFns from 'date-fns'
          /import \* as .* from ['"]date-fns['"]/  // import * as dateFns from 'date-fns'
        ];
        
        barrelPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            this.results.issues.push(`${filePath}: Non-tree-shakeable dependency import`);
          }
        });
      }
    });
  }

  /**
   * Analyze tree-shaking opportunities
   */
  analyze() {
    console.log(`${COLORS.BLUE}🌳 Tree Shaking Analysis${COLORS.NC}`);
    console.log('='.repeat(50));

    this.results.issues = [];
    this.checkDirectory('src');

    if (this.results.issues.length === 0) {
      console.log(`${COLORS.GREEN}✅ No tree-shaking issues found${COLORS.NC}`);
      console.log(`${COLORS.GREEN}✅ All imports are tree-shakeable${COLORS.NC}`);
    } else {
      console.log(`${COLORS.YELLOW}⚠️  Found ${this.results.issues.length} potential tree-shaking issues:${COLORS.NC}`);
      this.results.issues.forEach(issue => console.log(`   ${issue}`));
    }

    console.log();
    return this.results.issues.length === 0;
  }

  getResults() {
    return this.results;
  }
}
