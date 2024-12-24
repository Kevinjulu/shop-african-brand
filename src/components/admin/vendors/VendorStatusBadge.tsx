import { Badge } from "@/components/ui/badge";

interface VendorStatusBadgeProps {
  status: 'active' | 'pending' | 'suspended';
}

export const VendorStatusBadge = ({ status }: VendorStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getStatusColor()} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};