import { Home, Search, Store, ShoppingCart, User, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SearchInput } from "./search/SearchInput";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  console.log("MobileNav rendering, pathname:", location.pathname);

  const items = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: Search,
      label: "Search",
      href: "#",
      onClick: () => setIsSearchOpen(true)
    },
    {
      icon: Store,
      label: "Products",
      href: "/products",
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      href: "/cart",
      count: itemsCount
    },
    {
      icon: User,
      label: user ? "Account" : "Sign In",
      href: user ? "/account" : "/auth",
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    } else {
      toast.error("Please enter a search term");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-40 shadow-lg">
        <nav className="flex items-center justify-around h-16 px-2">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full relative px-1",
                  isActive ? "text-primary" : "text-gray-500"
                )}
                onClick={item.onClick}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1 whitespace-nowrap">{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="absolute -top-1 right-1/4 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="w-full p-4">
          <div className="space-y-4">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              placeholder="Search products..."
              className="bg-white"
            />
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                onClick={() => setIsSearchOpen(false)}
                className="text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};