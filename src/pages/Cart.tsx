import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, ArrowRight, Package2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { FormattedPrice } from "@/components/common/FormattedPrice";

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500">Browse our categories and discover our best deals!</p>
          <Link to="/products">
            <Button className="bg-primary hover:bg-primary/90 text-white w-full">
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingCart className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({items.length})</h1>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScrollArea className="h-[calc(100vh-300px)] rounded-lg border bg-white p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg border">
                  <div className="w-full md:w-32 h-32 flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow space-y-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.name} removed from cart`);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100">
                        <Package2 className="w-3 h-3 mr-1" />
                        In Stock
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Free Shipping
                      </Badge>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-4 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormattedPrice 
                        amount={item.price * item.quantity}
                        className="font-semibold text-lg text-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit space-y-6 order-first lg:order-last border">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({items.length} items)</span>
              <FormattedPrice amount={subtotal} className="font-medium" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">
                {shipping === 0 ? 'Free' : <FormattedPrice amount={shipping} />}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (16%)</span>
              <FormattedPrice amount={tax} className="font-medium" />
            </div>
            {shipping > 0 && (
              <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                Add <FormattedPrice amount={100 - subtotal} /> more to get free shipping
              </p>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <FormattedPrice amount={total} className="text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <Link to="/checkout" className="block">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/products" className="block">
              <Button 
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;