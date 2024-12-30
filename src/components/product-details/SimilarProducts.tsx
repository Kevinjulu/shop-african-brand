import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { FormattedPrice } from "@/components/common/FormattedPrice";

interface SimilarProductsProps {
  products: Product[];
}

export const SimilarProducts = ({ products }: SimilarProductsProps) => {
  if (!products.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Similar Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="aspect-square relative mb-2 overflow-hidden rounded-md">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                  {product.name}
                </h4>
                <FormattedPrice 
                  amount={product.price}
                  countryCode={product.origin_country}
                  className="text-primary font-bold text-sm"
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};