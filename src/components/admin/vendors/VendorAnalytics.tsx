import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, Users, ShoppingBag } from "lucide-react";

interface VendorAnalyticsSummary {
  total_vendors?: number;
  total_sales: number;
  total_products: number;
  average_rating: number;
}

export const VendorAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['vendor-analytics-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_analytics_summary')
        .select('*');
      
      if (error) throw error;
      return data as VendorAnalyticsSummary[];
    }
  });

  const stats = [
    {
      title: "Total Vendors",
      value: analytics?.[0]?.total_vendors || 0,
      icon: Users,
      change: "+12%"
    },
    {
      title: "Total Sales",
      value: analytics?.[0]?.total_sales ? `$${analytics[0].total_sales.toLocaleString()}` : "$0",
      icon: DollarSign,
      change: "+23%"
    },
    {
      title: "Active Products",
      value: analytics?.[0]?.total_products || 0,
      icon: ShoppingBag,
      change: "+8%"
    },
    {
      title: "Average Rating",
      value: analytics?.[0]?.average_rating?.toFixed(1) || "0.0",
      icon: BarChart,
      change: "+5%"
    }
  ];

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};