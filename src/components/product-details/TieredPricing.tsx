import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TierPricing } from "@/types/product";
import { useCurrency } from "@/hooks/useCurrency";

interface TieredPricingProps {
  tiers?: TierPricing[];
  basePrice: number;
}

export const TieredPricing = ({ tiers, basePrice }: TieredPricingProps) => {
  const { formatPrice } = useCurrency();

  if (!tiers?.length) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Bulk Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-600">
            <div>Quantity Range</div>
            <div>Price per Unit</div>
            <div>Total Savings</div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm border-b pb-2">
              <div>1-{tiers[0].minQuantity - 1}</div>
              <div>{formatPrice(basePrice)}</div>
              <div>-</div>
            </div>
            {tiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-sm border-b pb-2">
                <div>
                  {tier.minQuantity}-{tier.maxQuantity || '∞'}
                </div>
                <div>{formatPrice(tier.price)}</div>
                <div className="text-green-600">
                  {Math.round(((basePrice - tier.price) / basePrice) * 100)}% off
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};