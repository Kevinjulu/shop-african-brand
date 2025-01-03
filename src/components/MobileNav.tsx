import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SearchInput } from "./search/SearchInput";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { MobileBottomNav } from "./navbar/mobile/MobileBottomNav";
import { MenuItem, menuItems, supportItems } from "./navbar/mobile/MobileMenuItems";

export const MobileNav = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  console.log("MobileNav rendering");

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
                  {menuItems.map((item) => (
                    <MenuItem key={item.path} item={item} />
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Support Links */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Support</p>
                <div className="space-y-1">
                  {supportItems.map((item) => (
                    <MenuItem key={item.path} item={item} />
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

      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </>
  );
};