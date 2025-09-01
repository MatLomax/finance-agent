/**
 * Bundle optimization utilities
 * Provides advanced bundle analysis and optimization recommendations
 */

import { readFileSync } from 'fs';

export class BundleOptimizer {
  constructor() {
    this.optimizations = [];
  }

  /**
   * Analyze bundle composition and suggest optimizations
   * @param {string} metafilePath - Path to esbuild metafile
   */
  analyzeComposition(metafilePath = 'dist/bundle-meta.json') {
    try {
      const metafile = JSON.parse(readFileSync(metafilePath, 'utf8'));
      const { inputs } = metafile;

      // Analyze module sizes and dependencies
      const moduleAnalysis = this.analyzeModules(inputs);
      const dependencyAnalysis = this.analyzeDependencies(inputs);
      
      return {
        modules: moduleAnalysis,
        dependencies: dependencyAnalysis,
        recommendations: this.generateOptimizations(moduleAnalysis)
      };
    } catch (error) {
      console.error('Error analyzing bundle composition:', error.message);
      return null;
    }
  }

  /**
   * Analyze individual modules for optimization opportunities
   * @param {object} inputs - Esbuild inputs from metafile
   */
  analyzeModules(inputs) {
    const modules = Object.entries(inputs).map(([path, info]) => ({
      path,
      size: info.bytes,
      sizeKB: Math.round(info.bytes / 1024 * 100) / 100,
      category: this.categorizeModule(path)
    }));

    // Sort by size descending
    modules.sort((a, b) => b.size - a.size);

    return {
      total: modules.length,
      largestModules: modules.slice(0, 5),
      byCategory: this.groupByCategory(modules)
    };
  }

  /**
   * Categorize module by path
   * @param {string} path - Module path
   */
  categorizeModule(path) {
    if (path.includes('/lib/')) return 'business-logic';
    if (path.includes('/ui/')) return 'user-interface';
    if (path.includes('/state/')) return 'state-management';
    if (path.includes('/utils/')) return 'utilities';
    if (path === 'src/main.js') return 'entry-point';
    return 'other';
  }

  /**
   * Group modules by category
   * @param {Array} modules - Array of module objects
   */
  groupByCategory(modules) {
    const categories = {};
    
    modules.forEach(module => {
      const { category } = module;
      if (!categories[category]) {
        categories[category] = { modules: [], totalSize: 0 };
      }
      categories[category].modules.push(module);
      categories[category].totalSize += module.size;
    });

    return categories;
  }

  /**
   * Analyze dependency usage patterns
   * @param {object} inputs - Esbuild inputs from metafile
   */
  analyzeDependencies(inputs) {
    const dependencyUsage = {};

    Object.entries(inputs).forEach(([path, info]) => {
      if (info.imports) {
        info.imports.forEach(imp => {
          if (imp.external) {
            if (!dependencyUsage[imp.path]) {
              dependencyUsage[imp.path] = { count: 0, modules: [] };
            }
            dependencyUsage[imp.path].count++;
            dependencyUsage[imp.path].modules.push(path);
          }
        });
      }
    });

    return dependencyUsage;
  }

  /**
   * Generate optimization recommendations
   * @param {object} moduleAnalysis - Module analysis results
   */
  generateOptimizations(moduleAnalysis) {
    const recommendations = [];

    // Check for large modules that could be split
    moduleAnalysis.largestModules.forEach(module => {
      if (module.sizeKB > 5) {
        recommendations.push({
          type: 'code-splitting',
          module: module.path,
          size: module.sizeKB,
          suggestion: 'Consider splitting this large module into smaller components'
        });
      }
    });

    return recommendations;
  }
}
