import { useState, useEffect } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});

  const formatPriceSync = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPrice = async (amount: number, countryCode?: string): Promise<string> => {
    const cacheKey = `${amount}-${countryCode || 'USD'}`;
    
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
    loading
  };
};