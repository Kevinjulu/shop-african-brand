import { CURRENCIES } from "@/utils/currency";

const API_KEY = 'fca_live_o8Y77Vr1KT22kgx1mtgltreMqAsXxEVQ04ofERZd';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CacheEntry {
  rates: { [key: string]: number };
  timestamp: number;
}

export class CurrencyService {
  private static instance: CurrencyService;
  private cache: CacheEntry | null = null;

  private constructor() {}

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private isCacheValid(): boolean {
    return (
      this.cache !== null &&
      Date.now() - this.cache.timestamp < CACHE_DURATION
    );
  }

  async fetchExchangeRates(): Promise<{ [key: string]: number }> {
    if (this.isCacheValid()) {
      console.log('Using cached exchange rates');
      return this.cache!.rates;
    }

    try {
      console.log('Fetching fresh exchange rates');
      const currencies = Object.keys(CURRENCIES).map(key => CURRENCIES[key].code).join(',');
      
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=USD&currencies=${currencies}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();
      
      this.cache = {
        rates: data.data,
        timestamp: Date.now()
      };

      return data.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }

  async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const rates = await this.fetchExchangeRates();
      
      // If either currency is USD, we can use the rate directly
      if (fromCurrency === 'USD') {
        return amount * (rates[toCurrency] || 1);
      }
      if (toCurrency === 'USD') {
        return amount / (rates[fromCurrency] || 1);
      }

      // Convert through USD
      const amountInUSD = amount / (rates[fromCurrency] || 1);
      return amountInUSD * (rates[toCurrency] || 1);
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount; // Return original amount if conversion fails
    }
  }
}