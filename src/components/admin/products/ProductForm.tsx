import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Product, ProductFormData } from "@/types/product";
import { BasicDetails } from "./BasicDetails";
import { CategorySelect } from "./CategorySelect";
import { StatusSelect } from "./StatusSelect";
import { InventoryField } from "./InventoryField";
import { SEOFields } from "./SEOFields";
import { ImageSection } from "./form/ImageSection";
import { ProductFormActions } from "./form/ProductFormActions";
import { handleProductSubmit } from "./form/ProductFormHandler";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(0),
  category: z.string(),
  inventory_quantity: z.number().min(0),
  status: z.enum(['draft', 'published', 'out_of_stock']),
  origin_country: z.string(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  keywords: z.string().optional(),
  stock: z.number().min(0),
});

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      inventory_quantity: product?.inventory_quantity || 0,
      status: product?.status || "draft",
      origin_country: product?.origin_country || "",
      meta_title: product?.meta_title || "",
      meta_description: product?.meta_description || "",
      keywords: product?.keywords || "",
      stock: product?.stock || 0,
    },
  });

  // Set up real-time updates for product changes
  useEffect(() => {
    if (!product?.id) return;

    console.log("Setting up real-time updates for product:", product.id);
    
    const channel = supabase
      .channel('product_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${product.id}`
        },
        (payload) => {
          console.log("Received product update:", payload);
          const updatedProduct = payload.new as Product;
          
          form.reset({
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.price,
            category: updatedProduct.category || "",
            inventory_quantity: updatedProduct.inventory_quantity,
            status: updatedProduct.status,
            origin_country: updatedProduct.origin_country || "",
            meta_title: updatedProduct.meta_title || "",
            meta_description: updatedProduct.meta_description || "",
            keywords: updatedProduct.keywords || "",
            stock: updatedProduct.stock,
          });

          toast.success("Product updated successfully");
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [product?.id]);

  const onSubmit = async (data: ProductFormData) => {
    console.log("Submitting product data:", data);
    setIsLoading(true);
    
    try {
      await handleProductSubmit(data, product || null, uploadedImages, onSuccess);
      form.reset();
      setUploadedImages([]);
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (files: File[]) => {
    console.log("New images selected:", files);
    setUploadedImages(files);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicDetails form={form} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategorySelect form={form} />
          <StatusSelect form={form} />
        </div>
        <InventoryField form={form} />
        <ImageSection 
          form={form} 
          productId={product?.id}
          onImagesSelect={handleImageSelect}
          existingImages={product?.product_images || []}
        />
        <SEOFields form={form} />
        <ProductFormActions isLoading={isLoading} isEditing={!!product} />
      </form>
    </Form>
  );
};