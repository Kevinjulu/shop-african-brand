export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface ServiceMetrics {
  status: ServiceStatus;
  response_time_ms: number;
  error_count: number;
  timestamp: string;
}

export interface PaymentMetrics {
  responseTime: number;
  successRate: number;
  totalTransactions: number;
}

export interface PaymentServiceState {
  status: ServiceStatus;
  errorCount: number;
  metrics: PaymentMetrics;
  providers: Array<{
    name: string;
    isEnabled: boolean;
  }>;
}