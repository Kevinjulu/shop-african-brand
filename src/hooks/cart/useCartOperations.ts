import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/cart";

export const useCartOperations = (user: any, sessionId: string) => {
  const fetchCartItems = async () => {
    try {
      console.log("Fetching cart items for:", user?.id ? `user ${user.id}` : `session ${sessionId}`);
      
      let query = supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            name,
            price,
            image_url
          )
        `);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match CartItem interface
      const cartItems: CartItem[] = data.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url,
        product_id: item.product_id,
        user_id: item.user_id,
        session_id: item.session_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return cartItems;
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
      return [];
    }
  };

  const addToCart = async (product: any, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user?.id || null,
          session_id: !user ? sessionId : null,
          product_id: product.id,
          quantity: quantity,
        });

      if (error) throw error;
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      let query = supabase
        .from('cart_items')
        .delete();

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      query = query.eq('product_id', productId);

      const { error } = await query;

      if (error) throw error;
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      let query = supabase
        .from('cart_items')
        .update({ quantity });

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      query = query.eq('product_id', productId);

      const { error } = await query;

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      let query = supabase
        .from('cart_items')
        .delete();

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      const { error } = await query;

      if (error) throw error;
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  return {
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};