import { Link } from "react-router-dom";
import { CategoryDropdown } from "./submenu/CategoryDropdown";
import { CountrySelector } from "./submenu/CountrySelector";

export const SubMenu = () => {
  const menuItems = [
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "On Sale", path: "/on-sale" },
    { label: "Traditional", path: "/traditional" },
    { label: "All Stores", path: "/stores" },
  ];

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12">
          <CategoryDropdown />
          <nav className="ml-8 flex-1">
            <ul className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    className="text-sm hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <CountrySelector />
        </div>
      </div>
    </div>
  );
};