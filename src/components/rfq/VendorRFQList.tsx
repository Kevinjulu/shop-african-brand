import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const VendorRFQList = () => {
  const { user } = useAuth();

  const { data: rfqs, isLoading } = useQuery({
    queryKey: ["vendor-rfqs", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("rfq_requests")
        .select(`
          *,
          products (name, price),
          profiles (full_name)
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading RFQs...</div>;
  }

  if (!rfqs?.length) {
    return <div>No RFQ requests found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Desired Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rfqs.map((rfq) => (
          <TableRow key={rfq.id}>
            <TableCell>{rfq.products?.name}</TableCell>
            <TableCell>{rfq.profiles?.full_name}</TableCell>
            <TableCell>{rfq.quantity}</TableCell>
            <TableCell>
              <FormattedPrice 
                amount={rfq.desired_price || 0}
                countryCode={rfq.currency_code}
              />
            </TableCell>
            <TableCell>
              <Badge variant={rfq.status === "pending" ? "secondary" : "default"}>
                {rfq.status}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(rfq.created_at), "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};