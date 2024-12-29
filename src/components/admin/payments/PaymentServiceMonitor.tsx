import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PaymentMicroservice } from "@/services/payments/PaymentMicroservice";
import { CurrencyMicroservice } from "@/services/currency/CurrencyMicroservice";

interface ServiceMetrics {
  status: string;
  response_time_ms: number;
  error_count: number;
  timestamp: string;
}

export const PaymentServiceMonitor = () => {
  const [paymentMetrics, setPaymentMetrics] = useState<ServiceMetrics | null>(null);
  const paymentService = PaymentMicroservice.getInstance();

  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await paymentService.getServiceHealth();
      setPaymentMetrics(metrics);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
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
          <p>Loading metrics...</p>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Currency Service Status</h3>
        <div className="space-y-2">
          <p className="text-green-500 font-medium">Status: Operational</p>
          <p>Supported Currencies: USD, EUR, GBP, KES</p>
          <p>Auto-updates: Every 24 hours</p>
        </div>
      </Card>
    </div>
  );
};