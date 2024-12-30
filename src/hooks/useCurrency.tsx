import { useState, useCallback } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';

const currencyService = new CurrencyMicroservice();

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  
  const formatPrice = useCallback(async (amount: number, countryCode?: string) => {
    try {
      setLoading(true);
      const convertedAmount = await currencyService.convertCurrency(amount, countryCode);
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: countryCode === 'KE' ? 'KES' : 'USD',
      });
      return formatter.format(convertedAmount);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `$${amount.toFixed(2)}`;
    } finally {
      setLoading(false);
    }
  }, []);

  return { formatPrice, loading };
};