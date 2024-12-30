import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  initiateMpesaPayment,
  initiatePaystackPayment,
  initiateFlutterwavePayment,
  initiateCryptoPayment
} from "@/utils/payments";
import { ServiceMetrics } from "./types";

export type PaymentProvider = 'mpesa' | 'paystack' | 'flutterwave' | 'coingate';

interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  email?: string;
  phoneNumber?: string;
}

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
      status: data.status,
      response_time_ms: data.response_time_ms,
      error_count: data.error_count,
      timestamp: data.timestamp
    };
  }

  static async initiatePayment(provider: PaymentProvider, details: PaymentDetails) {
    try {
      let response;
      
      switch (provider) {
        case 'mpesa':
          if (!details.phoneNumber) throw new Error('Phone number required for M-Pesa');
          response = await initiateMpesaPayment(
            details.amount,
            details.phoneNumber,
            details.orderId
          );
          break;

        case 'paystack':
          if (!details.email) throw new Error('Email required for Paystack');
          response = await initiatePaystackPayment(
            details.amount,
            details.email,
            details.orderId
          );
          break;

        case 'flutterwave':
          if (!details.email) throw new Error('Email required for Flutterwave');
          response = await initiateFlutterwavePayment(
            details.amount,
            details.email,
            details.orderId
          );
          break;

        case 'coingate':
          response = await initiateCryptoPayment(
            details.amount,
            details.currency,
            details.orderId
          );
          break;

        default:
          throw new Error('Invalid payment provider');
      }

      // Record the payment attempt
      await supabase.from('payment_transactions').insert([{
        order_id: details.orderId,
        amount: details.amount,
        currency: details.currency,
        status: 'pending',
        payment_details: response
      }]);

      return response;
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      throw error;
    }
  }

  static async verifyPayment(transactionId: string) {
    try {
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      
      // Update order status if payment is successful
      if (transaction.status === 'success') {
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', transaction.order_id);
      }

      return transaction;
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
      throw error;
    }
  }
}
