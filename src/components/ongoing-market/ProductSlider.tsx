import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard } from "./ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";

interface ProductSliderProps {
  products: Array<{
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    image: string;
    discount: string;
    moq: number;
  }>;
}

export const ProductSlider = ({ products }: ProductSliderProps) => {
  const isMobile = useIsMobile();
  const { onApiChange, handleMouseEnter, handleMouseLeave } = useCarouselAutoplay({
    delay: 3000,
    stopOnInteraction: true,
  });

  if (!isMobile) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
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
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-full">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};