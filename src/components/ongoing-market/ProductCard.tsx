import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";
import { Star, Truck } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    image: string;
    discount: string;
    moq: number;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { formatPrice } = useCurrency();

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
              <Badge variant="destructive" className="bg-red-500">
                {product.discount} OFF
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-black">
                <Truck className="w-3 h-3 mr-1" />
                Free Shipping
              </Badge>
            </div>
          </div>
          
          <div className="p-3 space-y-2">
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.discountedPrice)}
              </span>
              <span className="text-sm text-gray-400 font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4" />
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
              <span className="text-xs text-gray-600">
                MOQ: {product.moq} pieces
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};