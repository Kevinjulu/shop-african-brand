import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PaymentService } from '@/services/payments/PaymentService';
import { ServiceMetrics } from '@/services/payments/types';

export const ServiceHealthMonitor = () => {
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    status: 'operational',
    response_time_ms: 0,
    error_count: 0,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const paymentService = new PaymentService();
    const fetchMetrics = async () => {
      try {
        const serviceMetrics = await paymentService.getServiceMetrics();
        setMetrics(serviceMetrics);
      } catch (error) {
        console.error('Error fetching service metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Service Health Status</h3>
      <div className="space-y-4">
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
          <span>Error Count:</span>
          <span>{metrics.error_count}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Last Updated:</span>
          <span>{new Date(metrics.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};