import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const menuItems = [
  { title: "Home", path: "/" },
  { title: "All Products", path: "/products" },
  { title: "New Arrivals", path: "/new-arrivals" },
  { title: "Best Sellers", path: "/best-sellers" },
  { title: "On Sale", path: "/on-sale" },
  { title: "Traditional", path: "/traditional" },
  { title: "Stores", path: "/stores" },
  { title: "About Us", path: "/about" },
];

export const supportItems = [
  { title: "Help Center", path: "/help" },
  { title: "Contact Us", path: "/contact" },
  { title: "Shipping Policy", path: "/shipping-policy" },
  { title: "Returns Policy", path: "/returns-policy" },
];

interface MenuItemProps {
  item: { title: string; path: string };
  onClose?: () => void;
}

export const MenuItem = ({ item, onClose }: MenuItemProps) => (
  <Link
    to={item.path}
    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
    onClick={onClose}
  >
    <span className="text-sm font-medium text-gray-900">{item.title}</span>
    <ChevronRight className="h-4 w-4 text-gray-400" />
  </Link>
);