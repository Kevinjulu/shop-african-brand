import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { VendorTable } from "@/components/admin/VendorTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AnalyticsDashboard = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      console.log('Fetching analytics data...');
      const { data, error } = await supabase
        .from('analytics')
        .select(`
          *,
          vendor:vendor_profiles (
            business_name
          )
        `)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <DashboardStats />

      <div className="grid gap-6 grid-cols-1">
        <AnalyticsChart />
        
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