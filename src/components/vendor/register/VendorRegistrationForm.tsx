import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const VendorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    businessRegistrationNumber: "",
    businessAddress: "",
    contactEmail: "",
    contactPhone: "",
    businessType: "",
    taxId: "",
    websiteUrl: "",
    businessCategory: "retail",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    businessHours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
    },
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const uploadDocuments = async () => {
    const uploadedUrls = [];
    for (const file of documents) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(filePath);

      uploadedUrls.push({
        name: file.name,
        url: publicUrl,
        type: file.type,
      });
    }
    return uploadedUrls;
  };

  const createVendorProfile = async (documentUrls: any[]) => {
    const { error } = await supabase.from("vendor_profiles").insert([
      {
        user_id: user?.id,
        business_name: formData.businessName,
        description: formData.description,
        business_registration_number: formData.businessRegistrationNumber,
        business_address: formData.businessAddress,
        contact_email: formData.contactEmail || user?.email,
        contact_phone: formData.contactPhone,
        business_category: formData.businessCategory,
        business_type: formData.businessType,
        tax_id: formData.taxId,
        website_url: formData.websiteUrl,
        social_media: formData.socialMedia,
        business_hours: formData.businessHours,
        status: "pending",
        verification_status: "pending",
        verification_documents: documentUrls,
      },
    ]);

    if (error) throw error;
    
    toast.success("Vendor profile created successfully! Our team will review your application.");
    navigate("/vendor/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const documentUrls = await uploadDocuments();
      await createVendorProfile(documentUrls);
    } catch (error) {
      console.error("Error creating vendor profile:", error);
      toast.error("Failed to create vendor profile");
    } finally {
      setIsLoading(false);
    }
  };

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
    "LLC",
    "Other"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Your Business</CardTitle>
        <CardDescription>
          Fill in your business details to start selling on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Name
              </label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
                placeholder="Your business name"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Type
              </label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Registration Number
              </label>
              <Input
                value={formData.businessRegistrationNumber}
                onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                required
                placeholder="Registration number"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tax ID
              </label>
              <Input
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                required
                placeholder="Tax ID number"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Business Address
            </label>
            <Input
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              required
              placeholder="Full business address"
              disabled={isLoading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Email
              </label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder={user?.email || "Business contact email"}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Phone
              </label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
                placeholder="Business phone number"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Website URL
            </label>
            <Input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://your-business-website.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Business Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Tell us about your business"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Verification Documents
            </label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Business registration, licenses, permits (PDF, JPG, PNG)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              {documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="mt-2 space-y-2">
                    {documents.map((file, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register as Vendor"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};