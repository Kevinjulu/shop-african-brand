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
        setPaymentMetrics(metrics);
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

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Service Performance</h3>
        <div className="space-y-2">
          {paymentMetrics ? (
            <>
              <div className="flex justify-between items-center">
                <span>Response Time</span>
                <span className={paymentMetrics.response_time_ms > 1000 ? 'text-yellow-500' : 'text-green-500'}>
                  {paymentMetrics.response_time_ms}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Error Rate</span>
                <span className={paymentMetrics.error_count > 0 ? 'text-red-500' : 'text-green-500'}>
                  {paymentMetrics.error_count} errors
                </span>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};