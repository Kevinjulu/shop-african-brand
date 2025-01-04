import { CURRENCIES } from './CurrencyService';

export class CurrencyMicroservice {
  private static instance: CurrencyMicroservice;
  private cachedCountry: string | null = null;

  private constructor() {}

  static getInstance(): CurrencyMicroservice {
    if (!CurrencyMicroservice.instance) {
      CurrencyMicroservice.instance = new CurrencyMicroservice();
    }
    return CurrencyMicroservice.instance;
  }

  async getUserCountry(): Promise<string> {
    if (this.cachedCountry) {
      return this.cachedCountry;
    }

    try {
      // Try to get country from browser's navigator.language first
      const browserLocale = navigator.language;
      if (browserLocale) {
        const country = browserLocale.split('-')[1];
        if (country && CURRENCIES[country]) {
          console.log('Using browser locale for country detection:', country);
          this.cachedCountry = country;
          return country;
        }
      }

      // Fallback to IP-based detection
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
      const countryCode = data.country_code;
      
      if (countryCode && CURRENCIES[countryCode]) {
        console.log('Detected user country:', countryCode);
        this.cachedCountry = countryCode;
        return countryCode;
      }

      console.log('Falling back to default country: US');
      return 'US';
    } catch (error) {
      console.error('Error getting user country:', error);
      return 'US'; // Default to US if detection fails
    }
  }

  async formatPrice(amount: number, countryCode?: string): Promise<string> {
    const userCountry = countryCode || await this.getUserCountry();
    const currency = CURRENCIES[userCountry] || CURRENCIES.DEFAULT;
    
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatPriceSync(amount: number, countryCode?: string): string {
    const currency = countryCode ? CURRENCIES[countryCode] : CURRENCIES.DEFAULT;
    
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}