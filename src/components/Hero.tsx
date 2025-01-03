import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselSlide } from "./hero/CarouselSlide";
import { PromoBanner } from "./hero/PromoBanner";
import { carouselItems } from "@/data/categories";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";

export const Hero = () => {
  const { onApiChange, handleMouseEnter, handleMouseLeave } = useCarouselAutoplay({
    delay: 5000,
    stopOnInteraction: true,
  });

  return (
    <div className="bg-cream">
      <div className="container mx-auto px-3 md:px-4 py-2 md:py-6">
        <div className="grid grid-cols-12 gap-2 md:gap-4">
          <div className="col-span-12 lg:col-span-9">
            <Carousel 
              className="relative rounded-lg overflow-hidden"
              setApi={onApiChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <CarouselContent>
                {carouselItems.map((item, index) => (
                  <CarouselItem key={index}>
                    <CarouselSlide item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>

          <div className="col-span-12 lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-4">
            <PromoBanner
              title="Traditional Beadwork"
              subtitle="Handcrafted Beauty"
              image="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=60"
              link="/products?collection=beadwork"
              tag="New"
              price="Up to 20% off"
            />
            <PromoBanner
              title="Ankara Collection"
              subtitle="Modern African Fashion"
              image="https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&auto=format&fit=crop&q=60"
              link="/products?collection=ankara"
              tag="Popular"
              price="From $29.99"
            />
          </div>
        </div>
      </div>
    </div>
  );
};