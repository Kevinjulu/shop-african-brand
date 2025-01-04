import { useState, useEffect } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';
import { CURRENCIES } from '@/utils/currency';

export interface Currency {
  code: string;
  symbol: string;
}

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});
  const [currency, setCurrency] = useState<Currency>({ code: 'USD', symbol: '$' });

  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        const service = CurrencyMicroservice.getInstance();
        const userCountry = await service.getUserCountry();
        const currencyInfo = CURRENCIES[userCountry];
        
        if (currencyInfo) {
          console.log('Setting user currency to:', currencyInfo.code);
          setCurrency({ 
            code: currencyInfo.code, 
            symbol: currencyInfo.symbol 
          });
        }
      } catch (error) {
        console.error('Error detecting user currency:', error);
        // Keep default USD if detection fails
      }
    };

    detectUserCurrency();
  }, []);

  const formatPriceSync = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code
    }).format(amount);
  };

  const formatPrice = async (amount: number, countryCode?: string): Promise<string> => {
    const cacheKey = `${amount}-${countryCode || currency.code}`;
    
    if (formattedPrices[cacheKey]) {
      return formattedPrices[cacheKey];
    }

    setLoading(true);
    try {
      const service = CurrencyMicroservice.getInstance();
      const formatted = await service.formatPrice(amount, countryCode);
      setFormattedPrices(prev => ({
        ...prev,
        [cacheKey]: formatted
      }));
      return formatted;
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatPriceSync(amount);
    } finally {
      setLoading(false);
    }
  };

  return {
    formatPrice,
    formatPriceSync,
    loading,
    currency
  };
};
