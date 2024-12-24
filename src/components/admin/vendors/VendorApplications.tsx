import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Eye } from "lucide-react";

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
      setApplications(data || []);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">{app.business_name}</TableCell>
              <TableCell>{app.business_type}</TableCell>
              <TableCell>{getStatusBadge(app.verification_status)}</TableCell>
              <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedApp(app);
                      setShowDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {app.verification_status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, "verified")}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowDialog(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Application Details</DialogTitle>
            <DialogDescription>
              Review the vendor's application and verification documents
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Business Details</h4>
                  <p className="text-sm">Name: {selectedApp.business_name}</p>
                  <p className="text-sm">Type: {selectedApp.business_type}</p>
                </div>
                <div>
                  <h4 className="font-medium">Verification Documents</h4>
                  <div className="space-y-2">
                    {selectedApp.verification_documents?.map((doc: any, index: number) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {selectedApp.verification_status === "pending" && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Reason for rejection (required if rejecting)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDialog(false);
                        setRejectionReason("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate(selectedApp.id, "rejected", rejectionReason)}
                      disabled={!rejectionReason}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedApp.id, "verified")}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};