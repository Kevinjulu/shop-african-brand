import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle } from "lucide-react";
import { paymentService } from "@/services/payments/PaymentMicroservice";
import { currencyService } from "@/services/currency/CurrencyMicroservice";

export const PaymentServiceMonitor = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['payment-service-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_service_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  if (isLoading) {
    return <div>Loading service metrics...</div>;
  }

  const latestMetric = metrics?.[0];
  const paymentStatus = paymentService.getServiceStatus();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Payment Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(paymentStatus)}>
                {paymentStatus}
              </Badge>
              <div className="text-sm text-gray-500">
                Last updated: {latestMetric?.timestamp ? new Date(latestMetric.timestamp).toLocaleString() : 'N/A'}
              </div>
            </div>
            
            {latestMetric && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span>{latestMetric.response_time_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span>{latestMetric.success_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Transactions</span>
                  <span>{latestMetric.total_transactions}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Currency Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Operational</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-500">
                  Exchange Rates Last Updated:
                </div>
                <div>
                  {Object.entries(CURRENCIES).map(([country, currency]) => {
                    const lastUpdate = currencyService.getLastUpdate(currency.code);
                    return (
                      <div key={country} className="flex justify-between text-sm">
                        <span>{currency.code}</span>
                        <span>{lastUpdate?.toLocaleString() || 'N/A'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {paymentStatus !== 'operational' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Service Degraded</AlertTitle>
          <AlertDescription>
            The payment service is currently experiencing issues. Our team has been notified.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};