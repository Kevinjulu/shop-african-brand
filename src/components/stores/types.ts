export interface Store {
  id: string;
  business_name: string;
  description: string | null;
  logo_url: string | null;
  business_category: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  business_address: string | null;
  verification_status: string;
  country: string | null;
  featured: boolean;
  specialties: string[];
  created_at: string; // Added this field
  updated_at: string; // Added this field for completeness
}