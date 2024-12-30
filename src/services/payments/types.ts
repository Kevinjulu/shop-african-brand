export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface ServiceMetrics {
  status: ServiceStatus;
  response_time_ms: number;
  error_count: number;
  timestamp: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, any>;
}