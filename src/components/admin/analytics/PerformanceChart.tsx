import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PerformanceChart = () => {
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['admin-performance'],
    queryFn: async () => {
      console.log('Fetching performance data...');
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: true })
        .limit(30);

      if (error) {
        console.error('Error fetching performance data:', error);
        throw error;
      }

      return data.map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        sales: item.total_sales,
        visitors: item.unique_visitors
      }));
    }
  });

  if (isLoading) {
    return <div>Loading performance data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                name="Sales"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="visitors"
                stroke="#82ca9d"
                name="Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};