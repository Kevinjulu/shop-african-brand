import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FormattedPrice } from "@/components/common/FormattedPrice";

export const RFQList = () => {
  const { user } = useAuth();

  const { data: rfqs, isLoading } = useQuery({
    queryKey: ["rfqs", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("rfq_requests")
        .select(`
          *,
          products (name, price),
          vendor_profiles (business_name)
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading RFQs...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My RFQ Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Desired Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfqs?.map((rfq) => (
            <TableRow key={rfq.id}>
              <TableCell>{rfq.products?.name}</TableCell>
              <TableCell>{rfq.vendor_profiles?.business_name}</TableCell>
              <TableCell>{rfq.quantity}</TableCell>
              <TableCell>
                <FormattedPrice amount={rfq.desired_price || 0} />
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    rfq.status === "pending"
                      ? "secondary"
                      : rfq.status === "accepted"
                      ? "default"
                      : "destructive"
                  }
                >
                  {rfq.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};