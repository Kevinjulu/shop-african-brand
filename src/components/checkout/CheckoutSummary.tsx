import { Separator } from "@/components/ui/separator";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import { CartItem } from "@/types/cart";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export const CheckoutSummary = ({ 
  items, 
  subtotal, 
  shippingCost, 
  tax, 
  total 
}: CheckoutSummaryProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
          </div>
          <FormattedPrice amount={item.price * item.quantity} className="font-medium" />
        </div>
      ))}
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <FormattedPrice amount={subtotal} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <FormattedPrice amount={shippingCost} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (16%)</span>
          <FormattedPrice amount={tax} />
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <FormattedPrice amount={total} />
        </div>
      </div>
    </div>
  );
};