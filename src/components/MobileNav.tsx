import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

export const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const items = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: Search,
      label: "Search",
      href: "/products",
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      href: "/cart",
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/wishlist",
    },
    {
      icon: User,
      label: "Account",
      href: user ? "/account" : "/auth",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <nav className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                isActive ? "text-mart-yellow" : "text-gray-500"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};