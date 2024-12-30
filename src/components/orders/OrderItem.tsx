import { OrderDetails } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { FormattedPrice } from "@/components/common/FormattedPrice";

interface OrderItemProps {
  order: OrderDetails;
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <FormattedPrice amount={order.total_amount} className="font-medium" />
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <img
              src={item.product.image_url || "/placeholder.svg"}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                Quantity: {item.quantity}
              </p>
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
        {order.tracking_number && (
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <Package className="w-4 h-4" />
            Track Order
          </Button>
        )}
      </div>
    </Card>
  );
};