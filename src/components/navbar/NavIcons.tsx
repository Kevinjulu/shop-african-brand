import { Link } from "react-router-dom";
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

export const NavIcons = () => {
  const { itemsCount } = useCart();
  const { wishlistCount } = useWishlistCount();
  const { user, signOut } = useAuth();

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-primary-dark rounded-full"
          >
            <User className="h-6 w-6 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {user ? (
            <>
              <DropdownMenuItem asChild>
                <Link to="/account" className="w-full">My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/order-history" className="w-full">Order History</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/auth" className="w-full">Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};