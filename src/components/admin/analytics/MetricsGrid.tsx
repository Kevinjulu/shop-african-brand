import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";

interface Metric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export const MetricsGrid = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      console.log('Fetching admin metrics...');
      const { data: analyticsData, error } = await supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching metrics:', error);
        throw error;
      }

      // Calculate metrics from analytics data
      const current = analyticsData[0] || { total_sales: 0, unique_visitors: 0 };
      const previous = analyticsData[1] || { total_sales: 0, unique_visitors: 0 };

      const salesChange = ((current.total_sales - previous.total_sales) / previous.total_sales) * 100;
      const visitorsChange = ((current.unique_visitors - previous.unique_visitors) / previous.unique_visitors) * 100;

      return [
        {
          title: "Total Revenue",
          value: `$${current.total_sales.toLocaleString()}`,
          change: salesChange,
          icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
        },
        {
          title: "Unique Visitors",
          value: current.unique_visitors.toLocaleString(),
          change: visitorsChange,
          icon: <Users className="h-4 w-4 text-muted-foreground" />
        },
        {
          title: "Orders",
          value: "1,234",
          change: 12.5,
          icon: <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        },
        {
          title: "Growth Rate",
          value: "18.2%",
          change: 4.1,
          icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
        }
      ];
    }
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics?.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2">
              {metric.change > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <p className={`text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metric.change).toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};