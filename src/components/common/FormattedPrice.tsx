import { useEffect, useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";

interface FormattedPriceProps {
  amount: number;
  className?: string;
}

export const FormattedPrice = ({ amount, className = "" }: FormattedPriceProps) => {
  const { formatPrice, loading } = useCurrency();
  const [formattedPrice, setFormattedPrice] = useState<string>("");

  useEffect(() => {
    const formatThePrice = async () => {
      const price = await formatPrice(amount);
      setFormattedPrice(price);
    };
    formatThePrice();
  }, [amount, formatPrice]);

  if (loading || !formattedPrice) {
    return <Skeleton className="h-4 w-24" />;
  }

  return <span className={className}>{formattedPrice}</span>;
};