import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { WishlistItem } from "@/components/wishlist/WishlistItem";
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist";
import { WishlistSkeleton } from "@/components/wishlist/WishlistSkeleton";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Wishlist component mounted, user:", user?.email);
    fetchWishlistItems();
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching wishlist items for user:", user.id);
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (wishlistError) throw wishlistError;

      if (wishlistData && wishlistData.length > 0) {
        const productIds = wishlistData.map(item => item.product_id);
        console.log("Found wishlist items:", productIds);
        
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_images (
              id,
              image_url,
              is_primary,
              display_order
            )
          `)
          .in('id', productIds);

        if (productsError) throw productsError;
        
        console.log("Fetched products:", products);
        setWishlistItems(products);
      } else {
        console.log("No wishlist items found");
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error("Failed to load wishlist items");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      console.log("Removing product from wishlist:", productId);
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlistItems(items => items.filter(item => item.id !== productId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success("Item moved to cart");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto text-orange-400 mb-4" />
          <h2 className="text-2xl font-medium text-gray-600 mb-4">Please sign in to view your wishlist</h2>
          <p className="text-gray-500 mb-6">Create an account or sign in to save your favorite items</p>
          <Link to="/auth">
            <Button className="bg-orange-400 hover:bg-orange-500">Sign In / Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <WishlistSkeleton />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyWishlist />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid gap-6">
        {wishlistItems.map((item) => (
          <WishlistItem
            key={item.id}
            item={item}
            onMoveToCart={moveToCart}
            onRemove={removeFromWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;