import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentMetrics {
  serviceName: string;
  responseTime: number;
  success: boolean;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

class PaymentMicroservice {
  private static instance: PaymentMicroservice;
  private serviceStatus: 'operational' | 'degraded' | 'down' = 'operational';

  private constructor() {
    console.log('Initializing Payment Microservice');
    this.monitorHealth();
  }

  public static getInstance(): PaymentMicroservice {
    if (!PaymentMicroservice.instance) {
      PaymentMicroservice.instance = new PaymentMicroservice();
    }
    return PaymentMicroservice.instance;
  }

  private async monitorHealth(): Promise<void> {
    try {
      const { data: metrics } = await supabase
        .from('payment_service_metrics')
        .select('status, response_time_ms')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (metrics?.response_time_ms > 1000) {
        this.serviceStatus = 'degraded';
      } else {
        this.serviceStatus = 'operational';
      }
    } catch (error) {
      console.error('Payment service health check failed:', error);
      this.serviceStatus = 'down';
    }
  }

  private async recordMetrics(metrics: PaymentMetrics): Promise<void> {
    try {
      await supabase.from('payment_service_metrics').insert([{
        service_name: metrics.serviceName,
        response_time_ms: metrics.responseTime,
        success_rate: metrics.success ? 100 : 0,
        error_count: metrics.success ? 0 : 1,
        total_transactions: 1,
        total_amount: metrics.amount,
        currency: metrics.currency,
        metadata: metrics.metadata
      }]);
    } catch (error) {
      console.error('Failed to record payment metrics:', error);
    }
  }

  public async processPayment(
    amount: number,
    currency: string,
    paymentMethod: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    console.log(`Processing payment: ${amount} ${currency} via ${paymentMethod}`);
    const startTime = performance.now();
    
    try {
      // Simulate payment processing
      const response = await this.executePayment(amount, currency, paymentMethod);
      const endTime = performance.now();
      
      await this.recordMetrics({
        serviceName: paymentMethod,
        responseTime: Math.round(endTime - startTime),
        success: response.success,
        amount,
        currency,
        metadata
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success('Payment processed successfully');
      return true;
    } catch (error) {
      console.error('Payment processing failed:', error);
      toast.error('Payment processing failed');
      return false;
    }
  }

  private async executePayment(
    amount: number,
    currency: string,
    paymentMethod: string
  ): Promise<{ success: boolean; error?: string }> {
    // This would integrate with actual payment providers
    // For now, we'll simulate the payment process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: Math.random() > 0.1 }); // 90% success rate
      }, 1000);
    });
  }

  public getServiceStatus(): string {
    return this.serviceStatus;
  }
}

export const paymentService = PaymentMicroservice.getInstance();