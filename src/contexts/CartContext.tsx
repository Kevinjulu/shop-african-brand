import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "@/types/product";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const [sessionId] = useState(() => localStorage.getItem('cartSessionId') || uuidv4());

  useEffect(() => {
    localStorage.setItem('cartSessionId', sessionId);
    fetchCartItems();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: user 
            ? `user_id=eq.${user.id}` 
            : `session_id=eq.${sessionId}`
        },
        () => {
          fetchCartItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, sessionId]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            name,
            price,
            image_url
          )
        `)
        .or(`user_id.eq.${user?.id},session_id.eq.${sessionId}`);

      if (error) throw error;

      const cartItems = data.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to fetch cart items');
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user?.id,
          session_id: !user ? sessionId : null,
          product_id: product.id,
          quantity: quantity,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success(`Added ${product.name} to cart`);
      await fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .or(`user_id.eq.${user?.id},session_id.eq.${sessionId}`)
        .eq('product_id', productId);

      if (error) throw error;
      toast.success('Item removed from cart');
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .or(`user_id.eq.${user?.id},session_id.eq.${sessionId}`)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .or(`user_id.eq.${user?.id},session_id.eq.${sessionId}`);

      if (error) throw error;
      toast.success('Cart cleared');
      await fetchCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity,
      itemsCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}