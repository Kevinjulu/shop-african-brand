import { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface FormattedPriceProps {
  amount: number;
  countryCode?: string;
  className?: string;
}

export const FormattedPrice = ({ amount, countryCode, className = '' }: FormattedPriceProps) => {
  const { formatPrice, formatPriceSync } = useCurrency();
  const [formattedValue, setFormattedValue] = useState(formatPriceSync(amount));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const formatPriceValue = async () => {
      try {
        const formatted = await formatPrice(amount, countryCode);
        if (isMounted) {
          setFormattedValue(formatted);
        }
      } catch (error) {
        console.error('Error formatting price:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    formatPriceValue();

    return () => {
      isMounted = false;
    };
  }, [amount, countryCode, formatPrice]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <span className={className}>{formattedValue}</span>;
};