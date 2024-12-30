import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { PaymentMethodSelector } from "@/components/payments/PaymentMethodSelector";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? 20 : 10;
  const tax = subtotal * 0.16;
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to complete your purchase");
      navigate("/auth");
      return;
    }

    toast.success("Order placed successfully!");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <CheckoutForm 
          formData={formData}
          onInputChange={handleInputChange}
          shippingMethod={shippingMethod}
          onShippingMethodChange={setShippingMethod}
        />

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;