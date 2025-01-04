export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {
    console.log('Initializing PerformanceMonitor');
    this.initializePerformanceObserver();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializePerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      console.log('Setting up PerformanceObserver');
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric(entry.name, entry.duration);
        });
      });

      observer.observe({ entryTypes: ['resource', 'navigation', 'longtask'] });
    }
  }

  recordMetric(name: string, value: number): void {
    console.log(`Recording metric - ${name}: ${value}ms`);
    const currentMetrics = this.metrics.get(name) || [];
    currentMetrics.push(value);
    this.metrics.set(name, currentMetrics);

    // Report to Supabase if threshold exceeded
    if (value > 1000) { // 1 second threshold
      this.reportPerformanceIssue(name, value);
    }
  }

  private async reportPerformanceIssue(metricName: string, value: number): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';

      console.log('Reporting performance metric to Supabase:', {
        metric_name: metricName,
        value,
        page_url: pageUrl,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      });

      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          metric_name: metricName,
          value: value,
          page_url: pageUrl,
          user_agent: userAgent,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to insert performance metric:', error);
        throw error;
      } else {
        console.log('Successfully recorded performance metric');
      }
    } catch (error) {
      console.error('Error reporting performance issue:', error);
    }
  }

  getMetrics(): Map<string, number[]> {
    return this.metrics;
  }

  getAverageMetric(name: string): number {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return 0;
    return metrics.reduce((a, b) => a + b, 0) / metrics.length;
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();