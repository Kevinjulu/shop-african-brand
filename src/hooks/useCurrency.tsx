import { useState, useCallback } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';
import { CURRENCIES } from '@/utils/currency';

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  const currencyService = CurrencyMicroservice.getInstance();
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});

  const formatPrice = useCallback(async (amount: number, countryCode?: string) => {
    const cacheKey = `${amount}-${countryCode || 'default'}`;
    
    if (formattedPrices[cacheKey]) {
      return formattedPrices[cacheKey];
    }

    try {
      setLoading(true);
      const formattedPrice = await currencyService.formatPrice(amount, countryCode);
      setFormattedPrices(prev => ({ ...prev, [cacheKey]: formattedPrice }));
      return formattedPrice;
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatPriceSync(amount);
    } finally {
      setLoading(false);
    }
  }, [formattedPrices]);

  const formatPriceSync = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, []);

  const currency = CURRENCIES['US']; // Default to USD

  return {
    formatPrice,
    formatPriceSync,
    loading,
    currency
  };
};