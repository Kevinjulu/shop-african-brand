import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MarketHeader } from "./ongoing-market/MarketHeader";
import { ProductSlider } from "./ongoing-market/ProductSlider";

interface Marketplace {
  id: string;
  name: string;
  location: string;
  country: string;
  next_market_date: string;
  end_market_date: string;
}

export const OngoingMarketDay = () => {
  const [activeMarket, setActiveMarket] = useState<Marketplace | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchActiveMarket = async () => {
      try {
        console.log("Fetching active marketplace...");
        const { data, error } = await supabase
          .from('marketplaces')
          .select('*')
          .gte('end_market_date', new Date().toISOString())
          .order('next_market_date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching marketplace:', error);
          return;
        }

        console.log('Active market data:', data);
        setActiveMarket(data);
      } catch (error) {
        console.error('Error in fetchActiveMarket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMarket();
  }, []);

  useEffect(() => {
    if (!activeMarket?.end_market_date) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(activeMarket.end_market_date).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [activeMarket]);

  const products = [
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "Bulk Maasai Beaded Necklaces (50 pieces)",
      originalPrice: 999.99,
      discountedPrice: 799.99,
      image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=60",
      discount: "20%",
      moq: 50
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "Wholesale African Print Fabric Bundle (100 yards)",
      originalPrice: 1499.99,
      discountedPrice: 1199.99,
      image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&auto=format&fit=crop&q=60",
      discount: "20%",
      moq: 100
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440014",
      name: "Traditional Wooden Crafts Set (25 pieces)",
      originalPrice: 749.99,
      discountedPrice: 599.99,
      image: "https://images.unsplash.com/photo-1592837613828-c36c1d0ec7e9?w=800&auto=format&fit=crop&q=60",
      discount: "20%",
      moq: 25
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440015",
      name: "Handwoven Basket Collection (30 pieces)",
      originalPrice: 899.99,
      discountedPrice: 719.99,
      image: "https://images.unsplash.com/photo-1632171927336-696d86fd27c8?w=800&auto=format&fit=crop&q=60",
      discount: "20%",
      moq: 30
    },
  ];

  if (loading) {
    return (
      <div className="py-4 md:py-8 bg-cream">
        <div className="container mx-auto px-3 md:px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeMarket) {
    return null;
  }

  return (
    <section className="py-4 md:py-8 bg-cream">
      <div className="container mx-auto px-3 md:px-4">
        <MarketHeader
          name={activeMarket.name}
          location={activeMarket.location}
          country={activeMarket.country}
          timeLeft={timeLeft}
          marketId={activeMarket.id}
        />
        <ProductSlider products={products} />
      </div>
    </section>
  );
};