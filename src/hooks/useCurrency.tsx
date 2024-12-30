import { useState, useCallback } from 'react';
import { CurrencyMicroservice } from '@/services/currency/CurrencyMicroservice';

interface Currency {
  code: string;
  symbol: string;
}

export const useCurrency = () => {
  const [loading, setLoading] = useState(false);
  const currencyService = CurrencyMicroservice.getInstance();
  const [currency, setCurrency] = useState<Currency>({ code: 'USD', symbol: '$' });
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});

  const formatPrice = useCallback(async (amount: number, countryCode?: string) => {
    try {
      setLoading(true);
      const formatted = await currencyService.formatPrice(amount, countryCode);
      return formatted;
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatPriceSync(amount);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPriceSync = useCallback((amount: number): string => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  }, [currency]);

  return {
    formatPrice,
    formatPriceSync,
    loading,
    currency,
    formattedPrices,
    setFormattedPrices
  };
};