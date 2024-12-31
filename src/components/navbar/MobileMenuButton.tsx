import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <div className="md:hidden flex items-center h-14">
      <Button 
        variant="ghost" 
        onClick={onClick}
        className="p-2 hover:bg-gray-100 transition-colors rounded-full"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
};