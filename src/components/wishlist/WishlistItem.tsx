import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { FormattedPrice } from "@/components/common/FormattedPrice";

interface WishlistItemProps {
  item: Product;
  onMoveToCart: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export const WishlistItem = ({ item, onMoveToCart, onRemove }: WishlistItemProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow">
      <Link to={`/product/${item.id}`} className="sm:w-24">
        <img
          src={item.product_images?.[0]?.image_url || item.image_url || '/placeholder.svg'}
          alt={item.name}
          className="w-full sm:w-24 h-24 object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow">
        <Link to={`/product/${item.id}`}>
          <h3 className="font-medium text-lg hover:text-orange-400 transition-colors">
            {item.name}
          </h3>
        </Link>
        <FormattedPrice amount={item.price} className="text-orange-400 font-semibold mt-1" />
        {item.stock > 0 ? (
          <p className="text-green-600 text-sm mt-1">In Stock</p>
        ) : (
          <p className="text-red-600 text-sm mt-1">Out of Stock</p>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveToCart(item)}
            disabled={item.stock === 0}
            className="flex items-center gap-2 border-orange-400 text-orange-400 hover:bg-orange-50"
          >
            <ShoppingCart className="w-4 h-4" />
            Move to Cart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};