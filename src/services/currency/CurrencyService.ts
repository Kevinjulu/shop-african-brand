import { performanceMonitor } from '@/services/monitoring/PerformanceMonitor';

const API_KEY = 'fca_live_o8Y77Vr1KT22kgx1mtgltreMqAsXxEVQ04ofERZd';
const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const CURRENCIES = {
  KE: { code: 'KES', symbol: 'KSh' },
  NG: { code: 'NGN', symbol: '₦' },
  GH: { code: 'GHS', symbol: 'GH₵' },
  ZA: { code: 'ZAR', symbol: 'R' },
  EG: { code: 'EGP', symbol: 'E£' },
  MA: { code: 'MAD', symbol: 'MAD' },
  US: { code: 'USD', symbol: '$' },
  // Default fallback
  DEFAULT: { code: 'USD', symbol: '$' }
};

export class CurrencyService {
  private static instance: CurrencyService;
  private rates: Record<string, number> | null = null;
  private lastFetch: number = 0;

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private async fetchExchangeRates(): Promise<Record<string, number>> {
    const startTime = performance.now();
    try {
      console.log('Fetching fresh exchange rates');
      // Only request supported currencies
      const supportedCurrencies = ['KES', 'NGN', 'GHS', 'ZAR', 'EGP', 'MAD', 'USD'].join(',');
      
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=USD&currencies=${supportedCurrencies}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Exchange rate API error:', errorText);
        throw new Error(`Exchange rate API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Record API performance
      const endTime = performance.now();
      performanceMonitor.recordMetric('currency_api_response_time', endTime - startTime);

      // Cache the rates
      this.rates = data.data;
      this.lastFetch = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        rates: this.rates,
        timestamp: this.lastFetch
      }));

      return data.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Return default rates if API fails
      return {
        KES: 153.00,
        NGN: 907.00,
        GHS: 12.30,
        ZAR: 18.65,
        EGP: 30.90,
        MAD: 9.95,
        USD: 1.00
      };
    }
  }

  private loadCachedRates(): boolean {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        this.rates = rates;
        this.lastFetch = timestamp;
        return true;
      }
    }
    return false;
  }

  async getExchangeRates(): Promise<Record<string, number>> {
    if (!this.rates) {
      const hasCachedRates = this.loadCachedRates();
      if (!hasCachedRates) {
        return this.fetchExchangeRates();
      }
    } else if (Date.now() - this.lastFetch > CACHE_DURATION) {
      return this.fetchExchangeRates();
    }
    return this.rates;
  }

  async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const rates = await this.getExchangeRates();
      
      // If either currency is not supported, return original amount
      if (!rates[fromCurrency] || !rates[toCurrency]) {
        console.warn(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
        return amount;
      }

      // Convert to USD first (base currency)
      const amountInUSD = amount / rates[fromCurrency];
      // Then convert to target currency
      return amountInUSD * rates[toCurrency];
    } catch (error) {
      console.error('Currency conversion error:', error);
      return amount; // Return original amount if conversion fails
    }
  }
}