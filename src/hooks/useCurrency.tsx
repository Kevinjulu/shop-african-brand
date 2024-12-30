import { useState, useCallback } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  const currencyService = new CurrencyMicroservice();

  const formatPrice = useCallback(async (amount: number, countryCode?: string) => {
    try {
      setLoading(true);
      const formattedPrice = await currencyService.formatPrice(amount, countryCode);
      return formattedPrice;
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${amount}`; // Fallback to basic formatting
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPriceSync = useCallback((amount: number) => {
    // Synchronous fallback formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, []);

  return {
    formatPrice,
    formatPriceSync, // Use this for immediate rendering
    loading
  };
};