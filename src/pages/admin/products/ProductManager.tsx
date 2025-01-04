import { useState } from "react";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { ProductActions } from "@/components/admin/products/ProductActions";
import { ProductFormDialog } from "@/components/admin/products/ProductFormDialog";
import { BulkOperations } from "@/components/admin/products/BulkOperations";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

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

      return data as Product[];
    },
  });

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedProduct(null);
    refetch();
  };

  const handleDelete = async (productId: string) => {
    try {
      // First delete associated images from storage
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', productId);

      if (images) {
        for (const image of images) {
          const fileName = image.image_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('product-images')
              .remove([fileName]);
          }
        }
      }

      // Delete product and related records
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
      // Delete associated images first
      for (const productId of selectedProducts) {
        const { data: images } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', productId);

        if (images) {
          for (const image of images) {
            const fileName = image.image_url.split('/').pop();
            if (fileName) {
              await supabase.storage
                .from('product-images')
                .remove([fileName]);
            }
          }
        }
      }

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

      <BulkOperations vendorId={products?.[0]?.vendor_id || ''} />

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