import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/components/AuthProvider";
import { CartItem } from "@/types/cart";
import { useCartOperations } from "@/hooks/cart/useCartOperations";
import { useCartSync } from "@/hooks/cart/useCartSync";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => Promise<void>;
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
  }, [sessionId]);

  const {
    fetchCartItems,
    addToCart: addToCartOp,
    removeFromCart: removeFromCartOp,
    updateQuantity: updateQuantityOp,
    clearCart: clearCartOp
  } = useCartOperations(user, sessionId);

  const handleCartUpdate = async () => {
    const items = await fetchCartItems();
    setItems(items);
  };

  useEffect(() => {
    handleCartUpdate();
  }, [user]);

  // Set up real-time sync
  useCartSync(user, sessionId, handleCartUpdate);

  const addToCart = async (product: any, quantity: number) => {
    await addToCartOp(product, quantity);
    await handleCartUpdate();
  };

  const removeFromCart = async (productId: string) => {
    await removeFromCartOp(productId);
    await handleCartUpdate();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    await updateQuantityOp(productId, quantity);
    await handleCartUpdate();
  };

  const clearCart = async () => {
    await clearCartOp();
    await handleCartUpdate();
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