import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentMicroservice } from "@/services/payments/PaymentMicroservice";
import { CurrencyMicroservice } from "@/services/currency/CurrencyMicroservice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ServiceHealthMonitor = () => {
  const [paymentMetrics, setPaymentMetrics] = useState<any>(null);
  const [currencyMetrics, setCurrencyMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const paymentService = PaymentMicroservice.getInstance();
  const currencyService = CurrencyMicroservice.getInstance();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log('Fetching service metrics...');
        const [payment, currency] = await Promise.all([
          paymentService.getServiceHealth(),
          currencyService.getServiceHealth()
        ]);

        // Store metrics in Supabase
        await Promise.all([
          supabase.from('payment_service_metrics').insert({
            service_name: 'payment_service',
            status: payment.status,
            response_time_ms: payment.response_time_ms,
            error_count: payment.error_count,
            currency: 'USD'
          }),
          supabase.from('payment_service_metrics').insert({
            service_name: 'currency_service',
            status: currency.status,
            response_time_ms: currency.response_time_ms,
            error_count: currency.error_count,
            currency: 'USD'
          })
        ]);

        console.log('Service metrics stored successfully');
        setPaymentMetrics(payment);
        setCurrencyMetrics(currency);
      } catch (error) {
        console.error('Error fetching or storing service metrics:', error);
        toast.error('Failed to load service metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading service metrics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Payment Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMetrics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge className={getStatusColor(paymentMetrics.status)}>
                  {paymentMetrics.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span>{paymentMetrics.response_time_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Count</span>
                  <span>{paymentMetrics.error_count}</span>
                </div>
              </div>
            </div>
          ) : (
            <p>No metrics available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          {currencyMetrics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge className={getStatusColor(currencyMetrics.status)}>
                  {currencyMetrics.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span>{currencyMetrics.response_time_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Count</span>
                  <span>{currencyMetrics.error_count}</span>
                </div>
              </div>
            </div>
          ) : (
            <p>No metrics available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};