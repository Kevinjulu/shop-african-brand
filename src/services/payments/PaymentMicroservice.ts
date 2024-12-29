import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class PaymentMicroservice {
  private static instance: PaymentMicroservice;
  private serviceStatus: 'operational' | 'degraded' | 'down' = 'operational';

  private constructor() {}

  public static getInstance(): PaymentMicroservice {
    if (!PaymentMicroservice.instance) {
      PaymentMicroservice.instance = new PaymentMicroservice();
    }
    return PaymentMicroservice.instance;
  }

  async processPayment(amount: number, currency: string, orderId: string) {
    try {
      console.log("PaymentMicroservice: Processing payment", { amount, currency, orderId });
      
      const startTime = performance.now();
      
      // Process payment logic here
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

      // Log metrics
      await this.logMetrics('payment_processing', responseTime);

      console.log("PaymentMicroservice: Payment processed successfully", data);
      return data;
    } catch (error) {
      console.error("PaymentMicroservice: Payment processing failed", error);
      this.serviceStatus = 'degraded';
      await this.logError('payment_processing', error);
      throw error;
    }
  }

  private async logMetrics(operation: string, responseTime: number) {
    try {
      await supabase
        .from('payment_service_metrics')
        .insert({
          service_name: 'payment_processor',
          response_time_ms: responseTime,
          status: this.serviceStatus,
        });
    } catch (error) {
      console.error("Failed to log payment metrics:", error);
    }
  }

  private async logError(operation: string, error: any) {
    try {
      await supabase
        .from('payment_service_metrics')
        .insert({
          service_name: 'payment_processor',
          status: 'error',
          error_count: 1,
          metadata: { operation, error: error.message },
        });
    } catch (err) {
      console.error("Failed to log payment error:", err);
    }
  }

  async getServiceHealth() {
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
}