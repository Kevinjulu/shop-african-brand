import { useState, useCallback } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  const currencyService = new CurrencyMicroservice();

  const formatPrice = useCallback(async (amount: number, countryCode?: string) => {
    try {
      setLoading(true);
      return await currencyService.formatPrice(amount, countryCode);
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatPriceSync(amount);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPriceSync = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return {
    formatPrice,
    formatPriceSync,
    loading
  };
};