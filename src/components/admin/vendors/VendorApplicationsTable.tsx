import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface VendorApplication {
  id: string;
  business_name: string;
  business_type: string;
  verification_status: string;
  created_at: string;
  verification_documents: any[];
}

interface VendorApplicationsTableProps {
  applications: VendorApplication[];
  onViewApplication: (app: VendorApplication) => void;
}

export const VendorApplicationsTable = ({
  applications,
  onViewApplication,
}: VendorApplicationsTableProps) => {
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

  return (
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewApplication(app)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};