import { supabase } from "@/integrations/supabase/client";
import { ServiceMetrics, ServiceStatus, PaymentDetails } from "./types";

export type PaymentProvider = 'mpesa' | 'paystack' | 'flutterwave' | 'coingate';

export class PaymentService {
  static async getServiceMetrics(): Promise<ServiceMetrics> {
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

  static async initiatePayment(provider: PaymentProvider, details: PaymentDetails) {
    switch (provider) {
      case 'mpesa':
        return await this.initiateMpesaPayment(details);
      case 'paystack':
        return await this.initiatePaystackPayment(details);
      case 'flutterwave':
        return await this.initiateFlutterwavePayment(details);
      case 'coingate':
        return await this.initiateCryptoPayment(details);
      default:
        throw new Error('Unsupported payment provider');
    }
  }

  private static async initiateMpesaPayment(details: PaymentDetails) {
    const { data, error } = await supabase.functions.invoke('mpesa-payment', {
      body: details
    });
    if (error) throw error;
    return data;
  }

  private static async initiatePaystackPayment(details: PaymentDetails) {
    const { data, error } = await supabase.functions.invoke('paystack-payment', {
      body: details
    });
    if (error) throw error;
    return data;
  }

  private static async initiateFlutterwavePayment(details: PaymentDetails) {
    const { data, error } = await supabase.functions.invoke('flutterwave-payment', {
      body: details
    });
    if (error) throw error;
    return data;
  }

  private static async initiateCryptoPayment(details: PaymentDetails) {
    const { data, error } = await supabase.functions.invoke('crypto-payment', {
      body: details
    });
    if (error) throw error;
    return data;
  }
}