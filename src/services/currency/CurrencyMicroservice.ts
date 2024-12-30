import { supabase } from "@/integrations/supabase/client";

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyMetrics {
  service_name: string;
  status: string;
  response_time_ms: number;
  error_count: number;
  timestamp: string;
  currency: string;
}

export class CurrencyMicroservice {
  private static instance: CurrencyMicroservice;
  private exchangeRates: ExchangeRates = {};
  private lastUpdate: Date = new Date();
  private updateInterval: number = 3600000; // 1 hour
  private errorCount: number = 0;
  private defaultCurrency: string = 'USD';

  private constructor() {
    this.initializeExchangeRates();
    this.startPeriodicUpdate();
  }

  public static getInstance(): CurrencyMicroservice {
    if (!CurrencyMicroservice.instance) {
      CurrencyMicroservice.instance = new CurrencyMicroservice();
    }
    return CurrencyMicroservice.instance;
  }

  private async initializeExchangeRates() {
    console.log("CurrencyMicroservice: Initializing exchange rates");
    
    this.exchangeRates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      KES: 108.5,
      NGN: 460.0,
      GHS: 12.5,
      TZS: 2500.0
    };
    
    await this.logMetrics('initialization', 0);
    console.log("CurrencyMicroservice: Exchange rates initialized", this.exchangeRates);
  }

  private startPeriodicUpdate() {
    setInterval(async () => {
      try {
        await this.updateExchangeRates();
      } catch (error) {
        console.error("Failed to update exchange rates:", error);
        this.errorCount++;
        await this.logError('periodic_update', error);
      }
    }, this.updateInterval);
  }

  private async updateExchangeRates() {
    console.log("CurrencyMicroservice: Updating exchange rates");
    this.lastUpdate = new Date();
    await this.logMetrics('rate_update', 0);
  }

  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
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
      this.errorCount++;
      await this.logError('currency_conversion', error);
      throw error;
    }
  }

  private async logMetrics(operation: string, responseTime: number) {
    try {
      const metrics = {
        service_name: 'currency_service',
        status: this.errorCount > 5 ? 'down' : this.errorCount > 0 ? 'degraded' : 'operational',
        response_time_ms: responseTime,
        error_count: this.errorCount,
        timestamp: new Date().toISOString(),
        currency: this.defaultCurrency // Add the required currency field
      };

      await supabase
        .from('payment_service_metrics')
        .insert(metrics);
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
          error_count: this.errorCount,
          metadata: { operation, error: error.message },
          currency: this.defaultCurrency // Add the required currency field
        });
    } catch (err) {
      console.error("Failed to log currency error:", err);
    }
  }

  async getExchangeRates(): Promise<ExchangeRates> {
    return this.exchangeRates;
  }

  async getServiceHealth(): Promise<CurrencyMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('payment_service_metrics')
        .select('*')
        .eq('service_name', 'currency_service')
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

export const currencyService = CurrencyMicroservice.getInstance();