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
      return data as CartItem[];
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
      return [];
    }
  };

  const addToCart = async (product: any, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user?.id || null,
          session_id: !user ? sessionId : null,
          product_id: product.id,
          quantity: quantity,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Added to cart');
      return data;
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
      return await fetchCartItems();
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