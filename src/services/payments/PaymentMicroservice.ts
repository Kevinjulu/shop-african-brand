import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceMetrics {
  status: 'operational' | 'degraded' | 'down';
  response_time_ms: number;
  error_count: number;
  timestamp: string;
}

export class PaymentMicroservice {
  private static instance: PaymentMicroservice;
  private serviceStatus: 'operational' | 'degraded' | 'down' = 'operational';
  private errorCount: number = 0;
  private lastHealthCheck: Date = new Date();

  private constructor() {
    this.initializeHealthCheck();
  }

  public static getInstance(): PaymentMicroservice {
    if (!PaymentMicroservice.instance) {
      PaymentMicroservice.instance = new PaymentMicroservice();
    }
    return PaymentMicroservice.instance;
  }

  private async initializeHealthCheck() {
    console.log("PaymentMicroservice: Initializing health check");
    try {
      await this.updateServiceMetrics({
        status: 'operational',
        response_time_ms: 0,
        error_count: 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to initialize health check:", error);
    }
  }

  async processPayment(amount: number, currency: string, orderId: string) {
    try {
      console.log("PaymentMicroservice: Processing payment", { amount, currency, orderId });
      
      const startTime = performance.now();
      
      // Process payment logic
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          order_id: orderId,
          amount,
          currency,
          status: 'processing',
        })
        .select()
        .single();

      if (error) throw error;

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      // Log successful transaction metrics
      await this.updateServiceMetrics({
        status: this.serviceStatus,
        response_time_ms: responseTime,
        error_count: this.errorCount,
        timestamp: new Date().toISOString()
      });

      console.log("PaymentMicroservice: Payment processed successfully", data);
      return data;
    } catch (error) {
      console.error("PaymentMicroservice: Payment processing failed", error);
      this.errorCount++;
      this.serviceStatus = this.errorCount > 5 ? 'down' : 'degraded';
      
      await this.logError('payment_processing', error);
      throw error;
    }
  }

  private async updateServiceMetrics(metrics: ServiceMetrics) {
    try {
      await supabase
        .from('payment_service_metrics')
        .insert({
          service_name: 'payment_processor',
          status: metrics.status,
          response_time_ms: metrics.response_time_ms,
          error_count: metrics.error_count,
          timestamp: metrics.timestamp
        });
    } catch (error) {
      console.error("Failed to update service metrics:", error);
    }
  }

  private async logError(operation: string, error: any) {
    try {
      await supabase
        .from('payment_service_metrics')
        .insert({
          service_name: 'payment_processor',
          status: 'error',
          error_count: this.errorCount,
          metadata: { operation, error: error.message },
        });
    } catch (err) {
      console.error("Failed to log payment error:", err);
    }
  }

  async getServiceHealth(): Promise<ServiceMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('payment_service_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to get service health:", error);
      return null;
    }
  }

  async resetErrorCount() {
    this.errorCount = 0;
    this.serviceStatus = 'operational';
    await this.updateServiceMetrics({
      status: this.serviceStatus,
      response_time_ms: 0,
      error_count: 0,
      timestamp: new Date().toISOString()
    });
  }
}