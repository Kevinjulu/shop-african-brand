import { supabase } from "@/integrations/supabase/client";
import { ProductFormData, Product } from "@/types/product";
import { toast } from "sonner";

const uploadImages = async (files: File[], productId: string) => {
  console.log("Uploading images for product:", productId);
  const uploadedImages = [];
  
  for (const file of files) {
    console.log("Processing file:", file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    uploadedImages.push({
      url: publicUrl,
      alt: file.name
    });
  }

  return uploadedImages;
};

const deleteOldImages = async (productId: string) => {
  console.log("Deleting old images for product:", productId);
  
  const { data: oldImages, error: fetchError } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('product_id', productId);

  if (fetchError) {
    console.error("Error fetching old images:", fetchError);
    throw fetchError;
  }

  // Delete from storage
  for (const image of oldImages || []) {
    const fileName = image.image_url.split('/').pop();
    if (fileName) {
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (deleteError) {
        console.error("Error deleting image from storage:", deleteError);
      }
    }
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (deleteError) {
    console.error("Error deleting image records:", deleteError);
    throw deleteError;
  }
};

export const handleProductSubmit = async (
  data: ProductFormData,
  product: Product | null,
  newImages: File[],
  onSuccess?: () => void
) => {
  console.log("Starting product submission process...");
  
  try {
    let uploadedImages = [];
    let primaryImageUrl = product?.image_url;

    if (newImages.length > 0) {
      if (product?.id) {
        await deleteOldImages(product.id);
      }
      uploadedImages = await uploadImages(newImages, product?.id || 'new');
      primaryImageUrl = uploadedImages[0]?.url;
    }

    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      inventory_quantity: data.inventory_quantity,
      status: data.status,
      origin_country: data.origin_country,
      stock: data.stock,
      updated_at: new Date().toISOString(),
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      keywords: data.keywords,
      image_url: primaryImageUrl,
    };

    let productId = product?.id;

    if (product) {
      console.log("Updating existing product:", product.id);
      const { error: updateError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);

      if (updateError) throw updateError;
    } else {
      console.log("Creating new product");
      const { data: newProduct, error: createError } = await supabase
        .from("products")
        .insert([{
          ...productData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) throw createError;
      productId = newProduct.id;
    }

    if (uploadedImages.length > 0 && productId) {
      console.log("Inserting new product images");
      const { error: imageError } = await supabase
        .from("product_images")
        .insert(
          uploadedImages.map((img, index) => ({
            product_id: productId,
            image_url: img.url,
            is_primary: index === 0,
            display_order: index
          }))
        );

      if (imageError) throw imageError;
    }
    
    toast.success(product ? "Product updated successfully" : "Product created successfully");
    onSuccess?.();
    return true;
  } catch (error) {
    console.error("Error saving product:", error);
    toast.error("Failed to save product");
    throw error;
  }
};