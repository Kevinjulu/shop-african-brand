import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const NewArrivals = () => {
  const { formatPrice, formatPriceSync } = useCurrency();
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>({});
  
  const products = [
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "African Print Dress",
      price: 129.99,
      origin_country: "NG",
      vendor_verification: "verified",
      image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "Handmade Leather Bag",
      price: 89.99,
      origin_country: "KE",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440014",
      name: "Beaded Necklace",
      price: 45.99,
      origin_country: "TZ",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440015",
      name: "Traditional Sculpture",
      price: 199.99,
      origin_country: "GH",
      image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440016",
      name: "African Djembe Drum",
      price: 199.99,
      origin_country: "GH",
      image: "https://images.unsplash.com/photo-1516663235285-845fac339ca7?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440017",
      name: "Handmade Pottery Set",
      price: 89.99,
      origin_country: "TZ",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=60"
    }
  ];

  useEffect(() => {
    const updatePrices = async () => {
      const prices: Record<string, string> = {};
      for (const product of products) {
        prices[product.id] = await formatPrice(product.price, product.origin_country);
      }
      setFormattedPrices(prices);
    };
    updatePrices();
  }, [products, formatPrice]);

  const getDisplayPrice = (productId: string, price: number, countryCode: string) => {
    return formattedPrices[productId] || formatPriceSync(price);
  };

  return (
    <section className="py-6 md:py-8 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-secondary">New Arrivals</h2>
          <Link to="/new-arrivals">
            <Button variant="link" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-2 md:p-3">
                  <div className="aspect-square relative mb-2 overflow-hidden rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {product.origin_country}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.vendor_verification === "verified" && (
                      <Badge variant="secondary" className="h-5 flex items-center gap-1 bg-green-50 text-green-700">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[10px]">Verified</span>
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1">
                    {getDisplayPrice(product.id, product.price, product.origin_country)}
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