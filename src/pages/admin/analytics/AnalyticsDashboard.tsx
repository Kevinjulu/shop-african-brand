import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsGrid } from "@/components/admin/analytics/MetricsGrid";
import { PerformanceChart } from "@/components/admin/analytics/PerformanceChart";
import { VendorTable } from "@/components/admin/VendorTable";

const AnalyticsDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <MetricsGrid />
      
      <div className="grid gap-6 grid-cols-1">
        <PerformanceChart />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Vendor Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <VendorTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;