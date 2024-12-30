import { OrderDetails } from "@/hooks/useOrders";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import { CalendarDays } from "lucide-react";

interface OrderDetailsProps {
  order: OrderDetails;
}

export const OrderDetailsCard = ({ order }: OrderDetailsProps) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="font-semibold">Order #{order.id}</h2>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
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
  );
};