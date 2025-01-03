import { Home, Search, Store, ShoppingCart, User, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SearchInput } from "./search/SearchInput";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Separator } from "./ui/separator";

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  console.log("MobileNav rendering, pathname:", location.pathname);

  const mainMenuItems = [
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
      label: "Brands",
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

  const secondaryMenuItems = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "On Sale", href: "/on-sale" },
    { label: "Traditional", href: "/traditional" },
  ];

  const supportMenuItems = [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "About Us", href: "/about" },
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
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-40">
        <nav className="flex items-center justify-around h-16">
          {mainMenuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full relative",
                  isActive ? "text-primary" : "text-gray-500 hover:text-primary"
                )}
                onClick={item.onClick}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
                {item.count > 0 && (
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

      {/* Side Menu Sheet */}
      <Sheet>
        <SheetContent side="right" className="w-[300px] p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto">
              {/* User Section */}
              <div className="p-4 bg-primary/5">
                {user ? (
                  <div className="space-y-2">
                    <p className="font-medium">Welcome back!</p>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/account')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Account
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Sign in for the best experience</p>
                    <Button 
                      variant="default"
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              {/* Main Navigation */}
              <div className="p-4">
                <div className="space-y-1">
                  {secondaryMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Support Links */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Support</p>
                <div className="space-y-1">
                  {supportMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100"
                    >
                      <span className="text-sm">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            {user && (
              <div className="p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};