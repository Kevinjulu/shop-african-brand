import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowRight } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useState, useEffect } from "react";

export const DealOfTheDay = () => {
  const { formatPriceSync } = useCurrency();
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 14,
    seconds: 48
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "Handwoven Basket",
      originalPrice: 99.99,
      discountedPrice: 79.99,
      image: "https://images.unsplash.com/photo-1632171927336-696d86fd27c8?w=800&auto=format&fit=crop&q=60",
      discount: "20%"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "Traditional Clay Pot",
      originalPrice: 49.99,
      discountedPrice: 39.99,
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=60",
      discount: "20%"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440014",
      name: "Beaded Necklace",
      originalPrice: 29.99,
      discountedPrice: 24.99,
      image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=60",
      discount: "17%"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440015",
      name: "Handmade Wooden Spoon Set",
      originalPrice: 15.99,
      discountedPrice: 12.99,
      image: "https://images.unsplash.com/photo-1592837613828-c36c1d0ec7e9?w=800&auto=format&fit=crop&q=60",
      discount: "19%"
    },
  ];

  return (
    <section className="py-4 md:py-8 bg-cream">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-secondary">Deal of the Day</h2>
          <div className="inline-flex items-center gap-2 bg-[#f97316] text-white rounded-lg px-2 md:px-3 py-1 md:py-1.5 w-fit whitespace-nowrap">
            <Timer className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">
              Ends in: {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          <Link to="/products?deals=true" className="ml-auto">
            <Button variant="link" className="group text-sm md:text-base p-0">
              View All Deals
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {deals.map((deal) => (
            <Link key={deal.id} to={`/product/${deal.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-2 md:p-3">
                  <div className="relative mb-2 md:mb-3">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <span className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-red-500 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium">
                      {deal.discount} OFF
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm font-medium mb-1 md:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-sm md:text-lg font-bold text-primary">
                      {formatPriceSync(deal.discountedPrice)}
                    </span>
                    <span className="text-[10px] md:text-sm text-gray-500 line-through">
                      {formatPriceSync(deal.originalPrice)}
                    </span>
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