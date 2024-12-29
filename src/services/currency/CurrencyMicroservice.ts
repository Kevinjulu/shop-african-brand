import { supabase } from "@/integrations/supabase/client";

export class CurrencyMicroservice {
  private static instance: CurrencyMicroservice;
  private exchangeRates: Record<string, number> = {};
  private lastUpdate: Date = new Date();

  private constructor() {
    this.initializeExchangeRates();
  }

  public static getInstance(): CurrencyMicroservice {
    if (!CurrencyMicroservice.instance) {
      CurrencyMicroservice.instance = new CurrencyMicroservice();
    }
    return CurrencyMicroservice.instance;
  }

  private async initializeExchangeRates() {
    // Initialize with some default rates
    this.exchangeRates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      KES: 108.5,
    };
    
    console.log("CurrencyMicroservice: Exchange rates initialized", this.exchangeRates);
  }

  async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    console.log("CurrencyMicroservice: Converting currency", { amount, fromCurrency, toCurrency });
    
    try {
      const startTime = performance.now();
      
      if (fromCurrency === toCurrency) return amount;

      const fromRate = this.exchangeRates[fromCurrency];
      const toRate = this.exchangeRates[toCurrency];

      if (!fromRate || !toRate) {
        throw new Error(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`);
      }

      const convertedAmount = (amount / fromRate) * toRate;
      
      const endTime = performance.now();
      await this.logMetrics('currency_conversion', Math.round(endTime - startTime));

      console.log("CurrencyMicroservice: Conversion successful", { 
        original: amount, 
        converted: convertedAmount 
      });
      
      return Number(convertedAmount.toFixed(2));
    } catch (error) {
      console.error("CurrencyMicroservice: Conversion failed", error);
      await this.logError('currency_conversion', error);
      throw error;
    }
  }

  private async logMetrics(operation: string, responseTime: number) {
    try {
      await supabase
        .from('payment_service_metrics')
        .insert({
          service_name: 'currency_service',
          response_time_ms: responseTime,
          status: 'operational',
        });
    } catch (error) {
      console.error("Failed to log currency metrics:", error);
    }
  }

  private async logError(operation: string, error: any) {
    try {
      await supabase
        .from('payment_service_metrics')
        .insert({
          service_name: 'currency_service',
          status: 'error',
          error_count: 1,
          metadata: { operation, error: error.message },
        });
    } catch (err) {
      console.error("Failed to log currency error:", err);
    }
  }

  async getExchangeRates() {
    return this.exchangeRates;
  }
}