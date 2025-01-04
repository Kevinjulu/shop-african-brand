import { CURRENCIES } from "@/utils/currency";
import { CurrencyService } from "./CurrencyService";

export class CurrencyMicroservice {
  private static instance: CurrencyMicroservice;
  private constructor() {}

  public static getInstance(): CurrencyMicroservice {
    if (!CurrencyMicroservice.instance) {
      CurrencyMicroservice.instance = new CurrencyMicroservice();
    }
    return CurrencyMicroservice.instance;
  }

  async formatPrice(amount: number, countryCode?: string): Promise<string> {
    try {
      console.log('Formatting price for country:', countryCode);
      
      // Default to USD if no country code provided
      const currency = countryCode ? await this.getCurrencyForCountry(countryCode) : 'USD';
      
      // Get currency service instance
      const currencyService = CurrencyService.getInstance();
      
      // Convert amount to the target currency
      const convertedAmount = await currencyService.convertAmount(
        amount,
        'USD',
        currency
      );

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(convertedAmount);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${amount}`;
    }
  }

  private async getCurrencyForCountry(countryCode: string): Promise<string> {
    return CURRENCIES[countryCode]?.code || 'USD';
  }

  async getUserCountry(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/', {
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect country');
      }
      
      const data = await response.json();
      console.log('Detected user country:', data.country_code);
      return data.country_code || 'US';
    } catch (error) {
      console.error('Error getting user country:', error);
      return 'US'; // Default to US if detection fails
    }
  }
}