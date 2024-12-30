import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";

const rfqSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  desired_price: z.number().min(0, "Price cannot be negative"),
  delivery_location: z.string().min(1, "Delivery location is required"),
  requirements: z.string().optional(),
});

type RFQFormData = z.infer<typeof rfqSchema>;

interface RFQFormProps {
  productId: string;
  vendorId: string;
  onSuccess?: () => void;
}

export const RFQForm = ({ productId, vendorId, onSuccess }: RFQFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { formatPriceSync } = useCurrency();

  const form = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      quantity: 1,
      desired_price: 0,
      delivery_location: "",
      requirements: "",
    },
  });

  const onSubmit = async (data: RFQFormData) => {
    if (!user) {
      toast.error("Please login to submit an RFQ");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("rfq_requests").insert([
        {
          buyer_id: user.id,
          vendor_id: vendorId,
          product_id: productId,
          quantity: data.quantity,
          desired_price: data.desired_price,
          delivery_location: data.delivery_location,
          requirements: data.requirements,
          currency_code: 'USD'
        },
      ]);

      if (error) throw error;

      toast.success("RFQ submitted successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting RFQ:", error);
      toast.error("Failed to submit RFQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            {...form.register("quantity", { valueAsNumber: true })}
          />
          {form.formState.errors.quantity && (
            <p className="text-sm text-red-500">
              {form.formState.errors.quantity.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Desired Price per Unit ($)
          </label>
          <Input
            type="number"
            step="0.01"
            {...form.register("desired_price", { valueAsNumber: true })}
          />
          {form.formState.errors.desired_price && (
            <p className="text-sm text-red-500">
              {form.formState.errors.desired_price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Delivery Location</label>
          <Input {...form.register("delivery_location")} />
          {form.formState.errors.delivery_location && (
            <p className="text-sm text-red-500">
              {form.formState.errors.delivery_location.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Requirements</label>
          <Textarea {...form.register("requirements")} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit RFQ"}
        </Button>
      </form>
    </Form>
  );
};