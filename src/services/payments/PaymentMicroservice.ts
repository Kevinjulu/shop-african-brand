import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface PaymentProvider {
  name: string;
  isEnabled: boolean;
  config: Record<string, any>;
}

interface PaymentMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  averageResponseTime: number;
}

export class PaymentMicroservice {
  private static instance: PaymentMicroservice;
  private errorCount: number = 0;
  private status: ServiceStatus = 'operational';
  private metrics: PaymentMetrics = {
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    totalAmount: 0,
    averageResponseTime: 0,
  };

  private providers: PaymentProvider[] = [
    {
      name: 'stripe',
      isEnabled: true,
      config: {
        apiVersion: '2023-10-16',
        currency: 'usd',
      }
    },
    {
      name: 'mpesa',
      isEnabled: true,
      config: {
        currency: 'kes',
        environment: 'production',
      }
    }
  ];

  private constructor() {
    this.initializeMetrics();
  }

  public static getInstance(): PaymentMicroservice {
    if (!PaymentMicroservice.instance) {
      PaymentMicroservice.instance = new PaymentMicroservice();
    }
    return PaymentMicroservice.instance;
  }

  private async initializeMetrics() {
    try {
      await this.logServiceMetrics({
        responseTime: 0,
        success: true,
      });
    } catch (error) {
      console.error('Failed to initialize payment metrics:', error);
    }
  }

  private calculateSuccessRate(): number {
    if (this.metrics.totalTransactions === 0) return 100;
    return (this.metrics.successfulTransactions / this.metrics.totalTransactions) * 100;
  }

  private async logServiceMetrics(metrics: {
    responseTime: number;
    success: boolean;
    error?: any;
  }) {
    try {
      const status: ServiceStatus = this.errorCount > 5 
        ? 'down' 
        : this.errorCount > 0 
          ? 'degraded' 
          : 'operational';

      await supabase.from('payment_service_metrics').insert({
        service_name: 'payment_service',
        status,
        response_time_ms: metrics.responseTime,
        error_count: this.errorCount,
        success_rate: this.calculateSuccessRate(),
        currency: 'USD',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log payment metrics:', error);
    }
  }

  async processPayment(amount: number, currency: string, paymentMethod: string): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      // Simulate payment processing
      const provider = this.providers.find(p => p.isEnabled && p.name === paymentMethod);
      if (!provider) {
        throw new Error(`Payment provider ${paymentMethod} not found or disabled`);
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = Math.random() > 0.1; // 90% success rate
      
      if (!success) {
        throw new Error('Payment failed');
      }

      this.metrics.totalTransactions++;
      this.metrics.successfulTransactions++;
      this.metrics.totalAmount += amount;

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      await this.logServiceMetrics({
        responseTime,
        success: true,
      });

      return true;
    } catch (error) {
      this.errorCount++;
      this.metrics.failedTransactions++;
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      await this.logServiceMetrics({
        responseTime,
        success: false,
        error,
      });

      throw error;
    }
  }

  async getServiceHealth() {
    return {
      status: this.status,
      errorCount: this.errorCount,
      metrics: this.metrics,
      providers: this.providers.map(p => ({
        name: p.name,
        isEnabled: p.isEnabled,
      })),
    };
  }

  async getPaymentMethods() {
    return this.providers
      .filter(p => p.isEnabled)
      .map(p => ({
        name: p.name,
        config: p.config,
      }));
  }

  async resetMetrics() {
    this.errorCount = 0;
    this.status = 'operational';
    this.metrics = {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      totalAmount: 0,
      averageResponseTime: 0,
    };
    await this.initializeMetrics();
  }
}

export const paymentService = PaymentMicroservice.getInstance();