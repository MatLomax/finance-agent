/**
 * @fileoverview Chart Module Loader - Lazy loading for chart visualization
 * 
 * Implements dynamic import for chart module to reduce initial bundle size.
 * Chart module is only loaded when needed for results display.
 */

/**
 * Lazy load the chart module and create chart
 * 
 */
export async function loadChart(simulationData: any[], container: HTMLElement): any {
  try {
    // Show loading state
    container.innerHTML = '<div class="chart-loading">📊 Loading chart...</div>';
    
    // Dynamically import the chart module
    const { createWealthChart } = await import('./wealth-chart.js');
    
    // Clear loading state
    container.innerHTML = '';
    
    // Create the chart with simulation data
    const chartElement = createWealthChart(simulationData);
    
    container.appendChild(chartElement);
    console.log('✅ Chart loaded and rendered');
    
  } catch (error) {
    console.error('❌ Failed to load chart:', error);
    container.innerHTML = `
      <div class="chart-error">
        <p>📊 Chart visualization unavailable</p>
        <p>Showing data in table format instead</p>
      </div>
    `;
  }
}

/**
 * Check if chart should be loaded based on screen size and user preference
 * 
 */
export function shouldLoadChart(): any {
  // Don't load chart on very small screens or slow connections
  const hasWideScreen = window.innerWidth >= 768;
  const hasGoodConnection = !('connection' in navigator) || 
  /** @type {any} */ (navigator).connection?.effectiveType !== 'slow-2g';
  
  return hasWideScreen && hasGoodConnection;
}

/**
 * Create chart section with lazy loading
 * 
 */
export function createChartSection(simulationData: any[]): any {
  const section = document.createElement('div');
  section.className = 'chart-section';
  
  const title = document.createElement('h3');
  title.textContent = 'Wealth Trajectory';
  title.className = 'chart-title';
  section.appendChild(title);
  
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  section.appendChild(chartContainer);
  
  // Load chart if conditions are met
  if (shouldLoadChart()) {
    loadChart(simulationData, chartContainer);
  } else {
    chartContainer.innerHTML = `
      <div class="chart-placeholder">
        <p>📊 Chart available on larger screens</p>
        <button type="button" onclick="this.parentElement.parentElement.dispatchEvent(new CustomEvent('load-chart'))">
          Load Chart
        </button>
      </div>
    `;
    
    // Allow manual loading
    chartContainer.addEventListener('load-chart', () => {
      loadChart(simulationData, chartContainer);
    });
  }
  
  return section;
}
