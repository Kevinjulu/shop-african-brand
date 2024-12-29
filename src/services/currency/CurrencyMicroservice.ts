import { CURRENCIES } from "@/utils/currency";

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

class CurrencyMicroservice {
  private static instance: CurrencyMicroservice;
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private updateInterval: number = 3600000; // 1 hour

  private constructor() {
    console.log('Initializing Currency Microservice');
    this.initializeRates();
    this.startRateUpdates();
  }

  public static getInstance(): CurrencyMicroservice {
    if (!CurrencyMicroservice.instance) {
      CurrencyMicroservice.instance = new CurrencyMicroservice();
    }
    return CurrencyMicroservice.instance;
  }

  private initializeRates(): void {
    Object.entries(CURRENCIES).forEach(([country, currency]) => {
      const key = `USD-${currency.code}`;
      this.exchangeRates.set(key, {
        from: 'USD',
        to: currency.code,
        rate: currency.rate,
        lastUpdated: new Date()
      });
    });
  }

  private startRateUpdates(): void {
    setInterval(() => {
      this.updateRates();
    }, this.updateInterval);
  }

  private async updateRates(): Promise<void> {
    console.log('Updating currency exchange rates');
    try {
      // In a real implementation, this would fetch from an exchange rate API
      // For now, we'll just update the timestamp
      this.exchangeRates.forEach((rate, key) => {
        this.exchangeRates.set(key, {
          ...rate,
          lastUpdated: new Date()
        });
      });
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }

  public convert(amount: number, fromCurrency: string, toCurrency: string): number {
    console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);
    
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const key = `USD-${toCurrency}`;
    const rate = this.exchangeRates.get(key);

    if (!rate) {
      console.error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
      return amount;
    }

    return amount * rate.rate;
  }

  public getExchangeRate(fromCurrency: string, toCurrency: string): number {
    const key = `USD-${toCurrency}`;
    return this.exchangeRates.get(key)?.rate || 1;
  }

  public getAllRates(): Map<string, ExchangeRate> {
    return new Map(this.exchangeRates);
  }

  public getLastUpdate(currency: string): Date | null {
    const key = `USD-${currency}`;
    return this.exchangeRates.get(key)?.lastUpdated || null;
  }
}

export const currencyService = CurrencyMicroservice.getInstance();