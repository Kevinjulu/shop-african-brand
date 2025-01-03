import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const TrendingProducts = () => {
  const { formatPrice, formatPriceSync } = useCurrency();
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});
  
  const products = [
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "Handwoven African Basket",
      price: 4999.99,
      rating: 4.8,
      sales: 1500,
      origin_country: "KE",
      vendor_verification: "verified",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "Traditional Beaded Necklace",
      price: 2999.99,
      rating: 4.9,
      sales: 1200,
      origin_country: "TZ",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440014",
      name: "African Print Fabric",
      price: 8999.99,
      rating: 4.7,
      sales: 980,
      origin_country: "NG",
      image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440015",
      name: "Handmade Clay Pot",
      price: 1999.99,
      rating: 4.8,
      sales: 850,
      origin_country: "GH",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=60"
    }
  ];

  useEffect(() => {
    const loadPrices = async () => {
      const prices: Record<string, string> = {};
      for (const product of products) {
        prices[product.id] = await formatPrice(product.price, product.origin_country);
      }
      setFormattedPrices(prices);
    };
    loadPrices();
  }, [products, formatPrice]);

  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-secondary">Trending Products</h2>
          <Link to="/products?sort=trending">
            <Button variant="link" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-3 md:p-4">
                  <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {product.origin_country}
                    </div>
                    <div className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {product.vendor_verification === "verified" && (
                        <Badge variant="secondary" className="h-5 flex items-center gap-1 bg-green-50 text-green-700">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-[10px]">Verified</span>
                        </Badge>
                      )}
                    </div>
                    <div className="text-base md:text-lg font-semibold text-primary">
                      {formattedPrices[product.id] || formatPriceSync(product.price)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {product.sales.toLocaleString()} sold
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};