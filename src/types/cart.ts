export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  itemsCount: number;
}