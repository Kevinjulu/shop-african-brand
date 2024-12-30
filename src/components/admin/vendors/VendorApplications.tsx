import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VendorApplicationsTable } from "./VendorApplicationsTable";
import { VendorApplicationDetails } from "./VendorApplicationDetails";
import { Json } from "@/integrations/supabase/types";

interface VendorApplication {
  id: string;
  business_name: string;
  business_type: string;
  verification_status: string;
  created_at: string;
  verification_documents: any[];
}

export const VendorApplications = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match VendorApplication interface
      const transformedData: VendorApplication[] = (data || []).map(app => ({
        id: app.id,
        business_name: app.business_name,
        business_type: app.business_type || '',
        verification_status: app.verification_status || 'pending',
        created_at: app.created_at,
        verification_documents: Array.isArray(app.verification_documents) 
          ? app.verification_documents 
          : []
      }));

      setApplications(transformedData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load vendor applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id: string, status: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from("vendor_profiles")
        .update({ 
          verification_status: status,
          rejection_reason: reason || null,
          verification_date: status === 'verified' ? new Date().toISOString() : null
        })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Vendor ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
      fetchApplications();
      setShowDialog(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Error updating vendor status:", error);
      toast.error("Failed to update vendor status");
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <VendorApplicationsTable
        applications={applications}
        onViewApplication={(app) => {
          setSelectedApp(app);
          setShowDialog(true);
        }}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Application Details</DialogTitle>
            <DialogDescription>
              Review the vendor's application and verification documents
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <VendorApplicationDetails
              application={selectedApp}
              rejectionReason={rejectionReason}
              onReject={(id, reason) => handleStatusUpdate(id, "rejected", reason)}
              onApprove={(id) => handleStatusUpdate(id, "verified")}
              onReasonChange={setRejectionReason}
              onClose={() => setShowDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};