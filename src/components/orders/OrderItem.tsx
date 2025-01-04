import { OrderDetails } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, Clock, Truck } from "lucide-react";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import { toast } from "sonner";

interface OrderItemProps {
  order: OrderDetails;
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleTrackOrder = () => {
    if (!order.tracking_number) {
      toast.error("Tracking information not available yet");
      return;
    }
    navigate(`/order/${order.id}`);
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <FormattedPrice amount={order.total_amount} className="font-medium" />
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            {getStatusIcon(order.status)}
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <img
                src={item.product.image_url || "/placeholder.svg"}
                alt={item.product.name}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
              {item.quantity > 1 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {item.quantity}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <FormattedPrice 
                amount={item.price_at_time} 
                className="text-sm text-gray-600"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/order/${order.id}`)}
        >
          View Details
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={handleTrackOrder}
        >
          <Package className="w-4 h-4" />
          Track Order
        </Button>
      </div>
    </Card>
  );
};