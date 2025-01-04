import { useEffect, useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { CURRENCIES } from "@/utils/currency";

interface FormattedPriceProps {
  amount: number;
  className?: string;
  countryCode?: string;
  showOriginal?: boolean;
  showConverted?: boolean;
}

export const FormattedPrice = ({ 
  amount, 
  className = "", 
  countryCode = "US",
  showOriginal = true,
  showConverted = true
}: FormattedPriceProps) => {
  const { formatPrice, loading, currency } = useCurrency();
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<string>("");

  useEffect(() => {
    const formatPrices = async () => {
      // Format price in original currency
      const original = await formatPrice(amount, countryCode);
      setOriginalPrice(original);

      // Format price in user's local currency (if different)
      if (countryCode !== currency.code) {
        const converted = await formatPrice(amount, currency.code);
        setConvertedPrice(converted);
      }
    };
    formatPrices();
  }, [amount, countryCode, currency.code, formatPrice]);

  if (loading || !originalPrice) {
    return <Skeleton className="h-4 w-24" />;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {showOriginal && (
        <span className="text-primary font-bold">
          {originalPrice}
        </span>
      )}
      {showConverted && countryCode !== currency.code && (
        <span className="text-gray-500 text-sm block">
          ({convertedPrice})
        </span>
      )}
    </div>
  );
};