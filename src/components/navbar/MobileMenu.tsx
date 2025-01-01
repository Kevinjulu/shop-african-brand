import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MobileMenuProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit,
  onClose 
}: MobileMenuProps) => {
  console.log("MobileMenu rendering, isOpen:", isOpen);
  
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const mobileMenuItems = [
    { title: "Home", path: "/" },
    { title: "All Products", path: "/products" },
    { title: "New Arrivals", path: "/new-arrivals" },
    { title: "Best Sellers", path: "/best-sellers" },
    { title: "On Sale", path: "/on-sale" },
    { title: "Traditional", path: "/traditional" },
    { title: "Stores", path: "/stores" },
    { title: "About Us", path: "/about" },
  ];

  const secondaryMenuItems = [
    { title: "Shipping Policy", path: "/shipping-policy" },
    { title: "Returns Policy", path: "/returns-policy" },
    { title: "Terms & Conditions", path: "/terms" },
    { title: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <form onSubmit={onSearchSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleChange}
              className="flex-1"
            />
            <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="divide-y divide-gray-100">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-between px-4 py-3 hover:bg-primary/5"
                onClick={onClose}
              >
                <span>{item.title}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </nav>

          <div className="bg-gray-50 mt-4">
            <div className="px-4 py-3 text-sm font-medium text-gray-500">
              Customer Service
            </div>
            <nav className="divide-y divide-gray-100">
              {secondaryMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center justify-between px-4 py-3 hover:bg-primary/5"
                  onClick={onClose}
                >
                  <span>{item.title}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t p-4">
          <Button 
            variant="outline" 
            className="w-full hover:bg-primary/5"
            onClick={onClose}
          >
            Close Menu
          </Button>
        </div>
      </div>
    </div>
  );
};