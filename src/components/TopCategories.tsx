import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Gem, 
  Palette, 
  Home, 
  Shirt,
  Music,
  Crown,
  Sparkles,
  Brush
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

const categories = [
  { 
    name: "Jewelry & Beads", 
    icon: Gem,
    path: "/products?category=jewelry"
  },
  { 
    name: "Art & Sculptures", 
    icon: Palette,
    path: "/products?category=art"
  },
  { 
    name: "Home Decor", 
    icon: Home,
    path: "/products?category=decor"
  },
  { 
    name: "Fashion", 
    icon: Shirt,
    path: "/products?category=fashion"
  },
  { 
    name: "Musical Instruments", 
    icon: Music,
    path: "/products?category=music"
  },
  { 
    name: "Accessories", 
    icon: Crown,
    path: "/products?category=accessories"
  },
  { 
    name: "Cultural Items", 
    icon: Sparkles,
    path: "/products?category=cultural"
  },
  { 
    name: "Traditional Art", 
    icon: Brush,
    path: "/products?category=traditional"
  }
];

export const TopCategories = () => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<any>(null);
  const autoplayPlugin = Autoplay({ delay: 3000, stopOnInteraction: true });

  useEffect(() => {
    if (api) {
      console.log("Mobile carousel initialized with autoplay");
    }
  }, [api]);

  const CategoryCard = ({ category }: { category: typeof categories[0] }) => {
    const Icon = category.icon;
    return (
      <Link
        to={category.path}
        className="block"
      >
        <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm text-center font-medium group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (isMobile) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">
            Top Categories Of The Month
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((category, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
                  <CategoryCard category={category} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              {categories.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    api?.selectedScrollSnap() === index
                      ? "bg-primary w-4"
                      : "bg-primary/30"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-secondary mb-6">
          Top Categories Of The Month
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};