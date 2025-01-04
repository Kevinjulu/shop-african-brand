import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlistCount } from "@/hooks/useWishlistCount";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const NavIcons = () => {
  const { itemsCount } = useCart();
  const { wishlistCount } = useWishlistCount();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
    <div className="flex items-center space-x-2">
      <Link to="/wishlist" className="p-2 text-white hover:text-white/80 relative">
        <Heart className="h-6 w-6" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link to="/cart" className="p-2 text-white hover:text-white/80 relative">
        <ShoppingCart className="h-6 w-6" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {itemsCount}
          </span>
        )}
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="p-2 hover:bg-primary-dark rounded-full"
            >
              <User className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg mt-2"
          >
            <DropdownMenuItem asChild>
              <Link 
                to="/account" 
                className="flex items-center px-3 py-2 text-sm text-gray-900 hover:bg-primary/10 hover:text-primary rounded-md"
              >
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/orders" 
                className="flex items-center px-3 py-2 text-sm text-gray-900 hover:bg-primary/10 hover:text-primary rounded-md"
              >
                Order History
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md cursor-pointer"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          className="text-gray-900 hover:bg-primary/10"
          onClick={() => navigate("/auth")}
        >
          Sign In
        </Button>
      )}
    </div>
  );
};