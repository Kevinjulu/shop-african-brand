import { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

interface PriceSectionProps {
  price: number;
  quantity: number;
  origin_country?: string;
}

export const PriceSection = ({ price, quantity, origin_country }: PriceSectionProps) => {
  const { formatPrice, formatPriceSync } = useCurrency();
  const [formattedPrice, setFormattedPrice] = useState(formatPriceSync(price));
  const [formattedTotal, setFormattedTotal] = useState(formatPriceSync(price * quantity));

  useEffect(() => {
    const updatePrices = async () => {
      const price1 = await formatPrice(price, origin_country);
      setFormattedPrice(price1);
      
      if (quantity > 1) {
        const total = await formatPrice(price * quantity, origin_country);
        setFormattedTotal(total);
      }
    };
    
    updatePrices();
  }, [price, quantity, origin_country, formatPrice]);

  return (
    <div className="flex items-baseline gap-4">
      <span className="text-3xl md:text-4xl font-bold text-primary">
        {formattedPrice}
      </span>
      {quantity > 1 && (
        <span className="text-sm text-gray-500">
          Total: {formattedTotal}
        </span>
      )}
    </div>
  );
};