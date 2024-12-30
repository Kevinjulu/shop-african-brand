import { useEffect, useState } from 'react';
import { currencyService } from '@/services/currency/CurrencyMicroservice';
import { CURRENCIES } from '@/utils/currency';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  symbol: '$',
  rate: 1
};

export const useCurrency = () => {
  const [userCurrency, setUserCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const detectLocation = async () => {
      console.log('Attempting to detect location...');
      try {
        // Simulated currency data - in a real app, this would come from an API
        // For demo purposes, setting to KES
        const detectedCountry = 'KE';
        console.log('Detected country:', detectedCountry);
        
        const detectedCurrency = CURRENCIES[detectedCountry] || DEFAULT_CURRENCY;
        console.log('Setting currency to:', detectedCurrency);
        setUserCurrency(detectedCurrency);
      } catch (error) {
        console.error('Error detecting location:', error);
        setUserCurrency(DEFAULT_CURRENCY);
      }
    };

    detectLocation();
  }, []);

  const formatPrice = async (price: number, originCountry?: string) => {
    setIsConverting(true);
    try {
      const originalCurrency = CURRENCIES[originCountry || 'US'];
      
      if (!originCountry || originCountry === userCurrency.code) {
        setIsConverting(false);
        return (
          <span className="text-base font-bold text-primary">
            {formatCurrencyValue(price, userCurrency)}
          </span>
        );
      }

      const convertedPrice = await currencyService.convert(
        price, 
        originalCurrency.code, 
        userCurrency.code
      );
      
      setIsConverting(false);
      return (
        <div className="space-y-0.5">
          <span className="text-base font-bold text-primary block">
            {formatCurrencyValue(price, originalCurrency)}
          </span>
          <span className="text-xs text-gray-500 font-normal block">
            ≈ {formatCurrencyValue(convertedPrice, userCurrency)}
          </span>
        </div>
      );
    } catch (error) {
      console.error('Error converting currency:', error);
      setIsConverting(false);
      return (
        <span className="text-base font-bold text-primary">
          {formatCurrencyValue(price, DEFAULT_CURRENCY)}
        </span>
      );
    }
  };

  const formatCurrencyValue = (price: number, currency: Currency): string => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    
    return `${currency.symbol} ${formattedNumber}`;
  };

  return {
    currency: userCurrency,
    formatPrice,
    formatCurrencyValue,
    isConverting
  };
};