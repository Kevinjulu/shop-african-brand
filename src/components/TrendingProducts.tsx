import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";

export const TrendingProducts = () => {
  const { formatPrice, formatPriceSync } = useCurrency();
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});
  
  const products = [
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "African Art Canvas",
      price: 15999.99,
      trend: "+120% sales",
      origin_country: "GH",
      vendor_verification: "verified",
      trade_docs_verified: true,
      image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "Handmade Pottery Set",
      price: 8999.99,
      trend: "+85% views",
      origin_country: "TZ",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440014",
      name: "Traditional Jewelry Box",
      price: 6999.99,
      trend: "+95% sales",
      origin_country: "KE",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440015",
      name: "Woven Wall Hanging",
      price: 12999.99,
      trend: "+75% views",
      origin_country: "NG",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&auto=format&fit=crop&q=60"
    }
  ];

  useEffect(() => {
    const updatePrices = async () => {
      const prices: Record<string, string> = {};
      for (const product of products) {
        try {
          prices[product.id] = await formatPrice(product.price, product.origin_country);
        } catch (error) {
          console.error(`Error formatting price for product ${product.id}:`, error);
          prices[product.id] = formatPriceSync(product.price);
        }
      }
      setFormattedPrices(prices);
    };
    updatePrices();
  }, [products, formatPrice, formatPriceSync]);

  const getDisplayPrice = (productId: string, price: number) => {
    return formattedPrices[productId] || formatPriceSync(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent>
            <h3>{product.name}</h3>
            <p>{getDisplayPrice(product.id, product.price)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
