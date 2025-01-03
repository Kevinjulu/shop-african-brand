import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MarketHeader } from "./ongoing-market/MarketHeader";
import { ProductSlider } from "./ongoing-market/ProductSlider";
import { LoadingSpinner } from "./LoadingSpinner";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";

interface Marketplace {
  id: string;
  name: string;
  location: string;
  country: string;
  next_market_date: string;
  end_market_date: string;
}

interface FormattedProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  discount: string;
  moq: number;
}

export const OngoingMarketDay = () => {
  const [activeMarket, setActiveMarket] = useState<Marketplace | null>(null);
  const [marketProducts, setMarketProducts] = useState<FormattedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Setup autoplay for mobile carousel
  const { onApiChange, handleMouseEnter, handleMouseLeave } = useCarouselAutoplay({
    delay: 3000,
    stopOnInteraction: true
  });

  useEffect(() => {
    const fetchActiveMarket = async () => {
      try {
        console.log("Fetching active marketplace...");
        const { data: marketData, error: marketError } = await supabase
          .from('marketplaces')
          .select('*')
          .gte('end_market_date', new Date().toISOString())
          .order('next_market_date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (marketError) {
          console.error('Error fetching marketplace:', marketError);
          setError('Failed to fetch marketplace data');
          return;
        }

        if (!marketData) {
          console.log('No active market found');
          setError('No active market at the moment');
          setLoading(false);
          return;
        }

        console.log('Active market found:', marketData);
        setActiveMarket(marketData);

        // Fetch products - limit changed to 8 from 10
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            image_url,
            minimum_order_quantity,
            product_tier_pricing (
              price_per_unit
            )
          `)
          .eq('status', 'published')
          .limit(8);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          setError('Failed to fetch products');
          return;
        }

        const formattedProducts: FormattedProduct[] = productsData.map(product => ({
          id: product.id,
          name: product.name,
          originalPrice: product.price,
          discountedPrice: product.product_tier_pricing?.[0]?.price_per_unit || product.price * 0.8,
          image: product.image_url || "https://via.placeholder.com/400",
          discount: "20%",
          moq: product.minimum_order_quantity || 1
        }));

        console.log('Market products:', formattedProducts);
        setMarketProducts(formattedProducts);
      } catch (error) {
        console.error('Error in fetchActiveMarket:', error);
        setError('An unexpected error occurred');
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

  if (loading) {
    return (
      <div className="py-4 md:py-8 bg-cream">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 md:py-8 bg-cream">
        <div className="container mx-auto px-3 md:px-4">
          <div className="text-center text-gray-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!activeMarket || marketProducts.length === 0) {
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
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ProductSlider 
            products={marketProducts} 
            onCarouselApiChange={onApiChange}
          />
        </div>
      </div>
    </section>
  );
};