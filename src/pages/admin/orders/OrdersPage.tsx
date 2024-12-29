import { Card } from "@/components/ui/card";
import { PaymentServiceMonitor } from "@/components/admin/payments/PaymentServiceMonitor";

const OrdersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Service Health Monitor</h2>
          <PaymentServiceMonitor />
        </Card>

        <Card className="p-6">
          <p>Order management features will be implemented here.</p>
        </Card>
      </div>
    </div>
  );
};

export default OrdersPage;