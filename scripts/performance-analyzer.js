#!/usr/bin/env node

/**
 * Performance Analysis Tool for Finance Agent
 * Main analysis runner that coordinates all performance checks
 */

import { BundleAnalyzer } from './performance/bundle-analyzer.js';
import { DependencyAnalyzer } from './performance/dependency-analyzer.js';
import { TreeShakingAnalyzer } from './performance/tree-shaking-analyzer.js';
import { PerformanceEstimator } from './performance/performance-estimator.js';

const COLORS = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  CYAN: '\x1b[0;36m',
  NC: '\x1b[0m'
};

/**
 * Main performance analysis orchestrator
 */
class PerformanceAnalyzer {
  constructor() {
    this.bundleAnalyzer = new BundleAnalyzer();
    this.dependencyAnalyzer = new DependencyAnalyzer();
    this.treeShakingAnalyzer = new TreeShakingAnalyzer();
    this.performanceEstimator = new PerformanceEstimator();
    this.results = {};
  }

  /**
   * Generate optimization recommendations based on analysis results
   */
  generateRecommendations() {
    console.log(`${COLORS.BLUE}💡 Optimization Recommendations${COLORS.NC}`);
    console.log('='.repeat(50));

    const recommendations = [];
    const bundleSize = this.results.bundleSize?.total;

    if (bundleSize?.gzippedKb > 8) {
      recommendations.push('Consider code splitting for non-critical features');
    }

    if (bundleSize?.gzippedKb > 6) {
      recommendations.push('Review module sizes and consolidate small utilities');
    }

    if (this.results.treeShaking?.issues?.length > 0) {
      recommendations.push('Fix tree-shaking issues to reduce bundle size');
    }

    if (this.results.performance?.estimatedTTI > 300) {
      recommendations.push('Implement lazy loading for non-critical modules');
      recommendations.push('Consider using a service worker for caching');
    }

    if (recommendations.length === 0) {
      console.log(`${COLORS.GREEN}✅ Bundle is well optimized!${COLORS.NC}`);
      console.log(`${COLORS.GREEN}✅ No optimization recommendations${COLORS.NC}`);
    } else {
      recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }

    console.log();
  }

  /**
   * Run all analyses and collect results
   */
  async runAnalyses() {
    const bundlePassed = this.bundleAnalyzer.analyze();
    this.results.bundleSize = this.bundleAnalyzer.getResults();

    const compositionPassed = this.bundleAnalyzer.analyzeComposition();
    
    const dependencyPassed = this.dependencyAnalyzer.analyze();
    this.results.dependencies = this.dependencyAnalyzer.getResults();

    const treeShakingPassed = this.treeShakingAnalyzer.analyze();
    this.results.treeShaking = this.treeShakingAnalyzer.getResults();

    const performancePassed = this.performanceEstimator.analyze(this.results.bundleSize);
    this.results.performance = this.performanceEstimator.getResults();

    return { bundlePassed, compositionPassed, dependencyPassed, treeShakingPassed, performancePassed };
  }

  /**
   * Display analysis summary
   */
  displaySummary(analysisResults) {
    console.log(`${COLORS.BLUE}📊 Analysis Summary${COLORS.NC}`);
    console.log('='.repeat(50));
    
    const allPassed = Object.values(analysisResults).every(Boolean);
    const status = allPassed ? `${COLORS.GREEN}✅` : `${COLORS.YELLOW}⚠️`;
    
    console.log(`${status} Overall Status: ${allPassed ? 'Excellent' : 'Needs Attention'}${COLORS.NC}`);
    
    if (this.results.bundleSize?.total) {
      console.log(`📦 Total Bundle: ${this.results.bundleSize.total.gzippedKb}KB gzipped`);
    }
    
    if (this.results.performance?.estimatedTTI) {
      console.log(`🚀 Estimated TTI: ${this.results.performance.estimatedTTI}ms`);
    }

    console.log();
    return allPassed;
  }

  /**
   * Run complete performance analysis
   */
  async analyze() {
    console.log(`${COLORS.CYAN}🔬 Finance Agent Performance Analysis${COLORS.NC}`);
    console.log('='.repeat(60));
    console.log();

    const analysisResults = await this.runAnalyses();
    this.generateRecommendations();
    return this.displaySummary(analysisResults);
  }
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new PerformanceAnalyzer();
  const success = await analyzer.analyze();
  process.exit(success ? 0 : 1);
}

export { PerformanceAnalyzer };
