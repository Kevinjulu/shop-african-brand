import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessDetailsFormProps {
  formData: any;
  setFormData: (data: any) => void;
  isLoading: boolean;
}

export const BusinessDetailsForm = ({ formData, setFormData, isLoading }: BusinessDetailsFormProps) => {
  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
    "LLC",
    "Other"
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Registration Number
          </label>
          <Input
            value={formData.businessRegistrationNumber}
            onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
            required
            placeholder="Business registration number"
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
    </div>
  );
};