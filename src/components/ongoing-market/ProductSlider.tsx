import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard } from "./ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { type EmblaCarouselType } from "embla-carousel";

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  discount: string;
  moq: number;
}

interface ProductSliderProps {
  products: Product[];
  onCarouselApiChange?: (api: EmblaCarouselType) => void;
}

export const ProductSlider = ({ products, onCarouselApiChange }: ProductSliderProps) => {
  const isMobile = useIsMobile();

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
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
      onApiChange={onCarouselApiChange}
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