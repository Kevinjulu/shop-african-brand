import { Link, useLocation } from "react-router-dom";
import { Home, Search, Store, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  count?: number;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, count, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full relative",
        isActive ? "text-primary" : "text-gray-500 hover:text-primary"
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs mt-1">{label}</span>
      {count > 0 && (
        <span className="absolute -top-1 right-1/4 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
};

export const MobileBottomNav = ({ onSearchClick }: { onSearchClick: () => void }) => {
  const { itemsCount } = useCart();
  console.log("Mobile bottom nav rendering");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-40">
      <div className="flex items-center justify-around h-16">
        <NavItem icon={Home} label="Home" href="/" />
        <NavItem icon={Search} label="Search" href="#" onClick={onSearchClick} />
        <NavItem icon={Store} label="Brands" href="/products" />
        <NavItem icon={ShoppingCart} label="Cart" href="/cart" count={itemsCount} />
        <NavItem icon={User} label="Account" href="/auth" />
      </div>
    </nav>
  );
};