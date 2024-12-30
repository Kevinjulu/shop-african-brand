import { ServiceMetrics } from './types';
import { supabase } from "@/integrations/supabase/client";

export class PaymentMicroservice {
  private static instance: PaymentMicroservice;
  
  private constructor() {
    console.log('PaymentMicroservice initialized');
  }

  public static getInstance(): PaymentMicroservice {
    if (!PaymentMicroservice.instance) {
      PaymentMicroservice.instance = new PaymentMicroservice();
    }
    return PaymentMicroservice.instance;
  }

  async getServiceHealth(): Promise<ServiceMetrics> {
    console.log('Fetching payment service health metrics');
    try {
      const { data, error } = await supabase
        .from('payment_service_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching payment metrics:', error);
        throw error;
      }

      return {
        status: data.status,
        response_time_ms: data.response_time_ms,
        error_count: data.error_count,
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('Failed to fetch payment service health:', error);
      return {
        status: 'degraded',
        response_time_ms: 0,
        error_count: 1,
        timestamp: new Date().toISOString()
      };
    }
  }
}