export interface ServiceMetrics {
  status: 'operational' | 'degraded' | 'down';
  response_time_ms: number;
  error_count: number;
  timestamp: string;
}

export interface ServiceHealth {
  status: ServiceMetrics['status'];
  metrics: ServiceMetrics;
  lastUpdated: Date;
}