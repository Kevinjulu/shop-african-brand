import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetailsContent } from "@/components/product-details/ProductDetailsContent";
import { ProductImages } from "@/components/product-details/ProductImages";
import { ProductInfo } from "@/components/product-details/ProductInfo";
import { ProductTabs } from "@/components/product-details/ProductTabs";
import { ProductRecommendations } from "@/components/product-details/ProductRecommendations";
import { Product, ProductStatus } from "@/types/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Rendering ProductDetail page for id:", id);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (*),
          vendor:vendor_profiles (
            id,
            business_name,
            logo_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Product not found");
      }

      return {
        ...data,
        status: data.status as ProductStatus,
      } as Product;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            {error instanceof Error && error.message === "Product not found" 
              ? "Product Not Found" 
              : "Error Loading Product"
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error && error.message === "Product not found"
              ? "The product you're looking for doesn't exist or has been removed."
              : "There was a problem loading this product. Please try again later."
            }
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              Go Back
            </button>
            <a
              href="/products"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null; // This shouldn't happen due to error handling above
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailsContent product={product} />
      <ProductTabs product={product} />
      <ProductRecommendations 
        recentlyViewed={[]}
        similarProducts={[]}
        frequentlyBoughtTogether={[]}
      />
    </div>
  );
};

export default ProductDetail;