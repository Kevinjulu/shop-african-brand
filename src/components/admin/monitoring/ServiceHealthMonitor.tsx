import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PaymentService } from '@/services/payments/PaymentService';

interface ServiceMetrics {
  response_time_ms: number;
  error_count: number;
  status: 'operational' | 'degraded' | 'down';
  timestamp: string;
}

export const ServiceHealthMonitor = () => {
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    response_time_ms: 0,
    error_count: 0,
    status: 'operational',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const paymentService = new PaymentService();
    const fetchMetrics = async () => {
      try {
        const serviceMetrics = await paymentService.getServiceMetrics();
        setMetrics({
          response_time_ms: serviceMetrics.metrics.responseTime || 0,
          error_count: serviceMetrics.errorCount,
          status: serviceMetrics.status,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching service metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Service Health</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={`font-medium ${
            metrics.status === 'operational' ? 'text-green-500' :
            metrics.status === 'degraded' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Response Time:</span>
          <span>{metrics.response_time_ms}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Errors (24h):</span>
          <span>{metrics.error_count}</span>
        </div>
      </div>
    </Card>
  );
};