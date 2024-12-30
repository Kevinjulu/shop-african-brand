import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PaymentMicroservice } from "@/services/payments/PaymentMicroservice";
import { ServiceMetrics } from "@/services/payments/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const PaymentServiceMonitor = () => {
  const [paymentMetrics, setPaymentMetrics] = useState<ServiceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const paymentService = PaymentMicroservice.getInstance();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await paymentService.getServiceHealth();
        console.log('Fetched payment metrics:', metrics);
        setPaymentMetrics({
          status: metrics.status,
          response_time_ms: metrics.metrics.averageResponseTime,
          error_count: metrics.errorCount,
          timestamp: new Date().toISOString()
        });
        setError(null);
      } catch (err) {
        console.error('Error in PaymentServiceMonitor:', err);
        setError('Failed to fetch service metrics');
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceMetrics['status']) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Payment Service Status</h3>
        {paymentMetrics ? (
          <div className="space-y-2">
            <p className={`font-medium ${getStatusColor(paymentMetrics.status)}`}>
              Status: {paymentMetrics.status}
            </p>
            <p>Response Time: {paymentMetrics.response_time_ms}ms</p>
            <p>Error Count: {paymentMetrics.error_count}</p>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date(paymentMetrics.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        )}
      </Card>
    </div>
  );
};