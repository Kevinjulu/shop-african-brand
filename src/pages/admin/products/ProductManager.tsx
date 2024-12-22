import { useState } from "react";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { ProductActions } from "@/components/admin/products/ProductActions";
import { ProductFormDialog } from "@/components/admin/products/ProductFormDialog";
import { InventoryManager } from "@/components/admin/products/InventoryManager";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProductManager = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      console.log('Fetching products for admin...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            is_primary,
            display_order
          ),
          vendor:vendor_profiles (
            id,
            business_name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        throw error;
      }

      return data as unknown as Product[];
    },
  });

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedProduct(null);
    refetch();
    toast.success(selectedProduct ? 'Product updated successfully' : 'Product created successfully');
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      refetch();
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;

      setSelectedProducts([]);
      refetch();
      toast.success('Products deleted successfully');
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <ProductActions
          selectedProducts={selectedProducts}
          onAddProduct={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductTable
            products={products || []}
            isLoading={isLoading}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            onEdit={(product) => {
              setSelectedProduct(product);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="p-6">
            <InventoryManager />
          </Card>
        </TabsContent>
      </Tabs>

      <ProductFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProductManager;