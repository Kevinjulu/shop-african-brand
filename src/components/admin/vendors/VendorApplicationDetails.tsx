import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";

interface VendorApplication {
  id: string;
  business_name: string;
  business_type: string;
  verification_status: string;
  created_at: string;
  verification_documents: any[];
}

interface VendorApplicationDetailsProps {
  application: VendorApplication;
  rejectionReason: string;
  onReject: (id: string, reason: string) => Promise<void>;
  onApprove: (id: string) => Promise<void>;
  onReasonChange: (value: string) => void;
  onClose: () => void;
}

export const VendorApplicationDetails = ({
  application,
  rejectionReason,
  onReject,
  onApprove,
  onReasonChange,
  onClose,
}: VendorApplicationDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Business Details</h4>
          <p className="text-sm">Name: {application.business_name}</p>
          <p className="text-sm">Type: {application.business_type}</p>
        </div>
        <div>
          <h4 className="font-medium">Verification Documents</h4>
          <div className="space-y-2">
            {application.verification_documents?.map((doc: any, index: number) => (
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

      {application.verification_status === "pending" && (
        <div className="space-y-4">
          <Textarea
            placeholder="Reason for rejection (required if rejecting)"
            value={rejectionReason}
            onChange={(e) => onReasonChange(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onReject(application.id, rejectionReason)}
              disabled={!rejectionReason}
            >
              Reject
            </Button>
            <Button
              onClick={() => onApprove(application.id)}
            >
              Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};