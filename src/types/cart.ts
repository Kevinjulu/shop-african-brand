export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  product_id?: string;
  user_id?: string;
  session_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  itemsCount: number;
}