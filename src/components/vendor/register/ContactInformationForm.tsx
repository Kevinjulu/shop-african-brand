import { Input } from "@/components/ui/input";

interface ContactInformationFormProps {
  formData: any;
  setFormData: (data: any) => void;
  isLoading: boolean;
}

export const ContactInformationForm = ({ formData, setFormData, isLoading }: ContactInformationFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Contact Email
          </label>
          <Input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            required
            placeholder="Business contact email"
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
    </div>
  );
};