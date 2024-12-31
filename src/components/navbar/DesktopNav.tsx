import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, User } from "lucide-react";
import { useWishlistCount } from "@/hooks/useWishlistCount";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/contexts/CartContext";

export const DesktopNav = () => {
  const { wishlistCount } = useWishlistCount();
  const { user } = useAuth();
  const { itemsCount } = useCart();

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link to="/cart" className="relative">
        <Button variant="ghost" size="icon">
          <ShoppingCart className="h-5 w-5" />
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {itemsCount}
            </span>
          )}
        </Button>
      </Link>
      
      <Link to="/wishlist" className="relative">
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Button>
      </Link>
      
      <Link to={user ? "/account" : "/auth"}>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    </nav>
  );
};