import { useState, useEffect, useCallback } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';
import { CurrencyService, CURRENCIES } from '@/services/currency/CurrencyService';

export const useCurrency = () => {
  const [currency, setCurrency] = useState({ 
    code: CURRENCIES.DEFAULT.code, 
    symbol: CURRENCIES.DEFAULT.symbol 
  });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    detectUserCurrency();
  }, []);

  const formatPrice = useCallback(async (amount: number, countryCode?: string) => {
    try {
      const service = CurrencyMicroservice.getInstance();
      return service.formatPrice(amount, countryCode);
    } catch (error) {
      console.error('Error formatting price:', error);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  }, []);

  const formatPriceSync = useCallback((amount: number, countryCode?: string) => {
    try {
      const service = CurrencyMicroservice.getInstance();
      return service.formatPriceSync(amount, countryCode);
    } catch (error) {
      console.error('Error formatting price:', error);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  }, []);

  const convertPrice = useCallback(async (amount: number, fromCurrency: string, toCurrency: string) => {
    try {
      const service = CurrencyService.getInstance();
      return service.convertAmount(amount, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Error converting price:', error);
      return amount;
    }
  }, []);

  return {
    formatPrice,
    formatPriceSync,
    convertPrice,
    loading,
    currency
  };
};
