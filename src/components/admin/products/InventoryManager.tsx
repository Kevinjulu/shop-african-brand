import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export const InventoryManager = () => {
  const [thresholds, setThresholds] = useState<{[key: string]: number}>({});

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      console.log('Fetching products for inventory management...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendor:vendor_profiles (
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        throw error;
      }

      return data;
    },
  });

  const { data: preferences } = useQuery({
    queryKey: ['inventory-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        toast.error('Failed to load preferences');
      }

      return data;
    },
  });

  const updateThreshold = async (productId: string, threshold: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ low_stock_threshold: threshold })
        .eq('id', productId);

      if (error) throw error;
      toast.success('Threshold updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating threshold:', error);
      toast.error('Failed to update threshold');
    }
  };

  const toggleNotification = async (type: 'low_stock' | 'out_of_stock') => {
    try {
      const field = type === 'low_stock' ? 'notify_on_low_stock' : 'notify_on_out_of_stock';
      const { error } = await supabase
        .from('inventory_preferences')
        .upsert({
          [field]: !(preferences?.[field] ?? true),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  if (isLoading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={preferences?.notify_on_low_stock ?? true}
              onCheckedChange={() => toggleNotification('low_stock')}
            />
            <span>Low Stock Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={preferences?.notify_on_out_of_stock ?? true}
              onCheckedChange={() => toggleNotification('out_of_stock')}
            />
            <span>Out of Stock Alerts</span>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Low Stock Threshold</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.inventory_quantity}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  defaultValue={product.low_stock_threshold}
                  onChange={(e) => setThresholds({
                    ...thresholds,
                    [product.id]: parseInt(e.target.value)
                  })}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                {product.inventory_quantity <= (product.low_stock_threshold || 10) && (
                  <div className="flex items-center text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Low Stock
                  </div>
                )}
              </TableCell>
              <TableCell>{product.vendor?.business_name || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => updateThreshold(
                    product.id,
                    thresholds[product.id] || product.low_stock_threshold
                  )}
                >
                  Update Threshold
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};