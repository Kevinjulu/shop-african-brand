export interface Image {
  url: string;
  alt: string;
}

export type ProductStatus = 'draft' | 'published' | 'out_of_stock';

export interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order?: number;
}

export interface VendorProfile {
  id: string;
  business_name: string;
  logo_url?: string | null;
}

export interface ProductVariant {
  size: string;
  color: string;
  sku: string;
  price: number;
  inventory_quantity: number;
}

export interface TierPricing {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string | null;
  description: string | null;
  status: ProductStatus;
  category_id: string | null;
  inventory_quantity: number;
  stock: number;
  created_at: string;
  updated_at: string;
  vendor_id: string | null;
  vendor?: VendorProfile;
  images?: Image[];
  origin_country: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  product_images?: ProductImage[];
  is_bulk_only?: boolean;
  minimum_order_quantity?: number;
  tier_pricing?: TierPricing[];
  sku?: string;
  weight?: number;
  dimensions?: string;
  materials?: string;
  tags?: string;
  // Add SEO fields
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  canonical_url?: string | null;
  structured_data?: Record<string, any> | null;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  inventory_quantity: number;
  status: ProductStatus;
  variants: ProductVariant[];
  origin_country: string;
  images: Image[];
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  stock: number;
  minimum_order_quantity?: number;
  is_bulk_only?: boolean;
  tier_pricing?: TierPricing[];
  sku?: string;
  weight?: number;
  dimensions?: string;
  materials?: string;
  tags?: string;
  newImages?: File[];
}