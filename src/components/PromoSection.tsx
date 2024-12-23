import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";

const promos = [
  {
    title: "Traditional Crafts",
    description: "Up to 40% Off",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&auto=format&fit=crop&q=60",
    link: "/products?category=traditional"
  },
  {
    title: "New Collection",
    description: "Special Prices",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=60",
    link: "/products?collection=new"
  },
  {
    title: "African Art",
    description: "Featured Items",
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&auto=format&fit=crop&q=60",
    link: "/products?category=art"
  }
];

export const PromoSection = () => {
  const { onApiChange, handleMouseEnter, handleMouseLeave } = useCarouselAutoplay({
    delay: 4000,
    stopOnInteraction: true,
  });

  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 md:mb-8">Special Offers</h2>
        
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {promos.map((promo, index) => (
            <Link
              key={index}
              to={promo.link}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[16/9] relative">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                    <p className="text-lg">{promo.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden">
          <Carousel
            setApi={onApiChange}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {promos.map((promo, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2">
                  <Link
                    to={promo.link}
                    className="block group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-[16/9] relative">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
                          <p className="text-base">{promo.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};