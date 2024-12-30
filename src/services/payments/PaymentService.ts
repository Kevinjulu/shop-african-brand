import { supabase } from "@/integrations/supabase/client";
import {
  initiateMpesaPayment,
  initiatePaystackPayment,
  initiateFlutterwavePayment,
  initiateCryptoPayment
} from "@/utils/payments";
import { ServiceMetrics, ServiceStatus, PaymentDetails } from "./types";

export type PaymentProvider = 'mpesa' | 'paystack' | 'flutterwave' | 'coingate';

export class PaymentService {
  async getServiceMetrics(): Promise<ServiceMetrics> {
    const { data, error } = await supabase
      .from('payment_service_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      status: data.status as ServiceStatus,
      response_time_ms: data.response_time_ms,
      error_count: data.error_count,
      timestamp: data.timestamp
    };
  }

  async initiatePayment(provider: PaymentProvider, details: PaymentDetails) {
    switch (provider) {
      case 'mpesa':
        return await initiateMpesaPayment(details);
      case 'paystack':
        return await initiatePaystackPayment(details);
      case 'flutterwave':
        return await initiateFlutterwavePayment(details);
      case 'coingate':
        return await initiateCryptoPayment(details);
      default:
        throw new Error('Unsupported payment provider');
    }
  }
}

export const paymentService = new PaymentService();