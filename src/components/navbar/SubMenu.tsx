import { Link } from "react-router-dom";
import { CategoryDropdown } from "./submenu/CategoryDropdown";
import { CountrySelector } from "./submenu/CountrySelector";

export const SubMenu = () => {
  const menuItems = [
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "On Sale", path: "/on-sale" },
    { label: "Traditional", path: "/traditional" },
    { label: "All Products", path: "/products" },
    { label: "All Stores", path: "/stores" },
  ];

  console.log("SubMenu rendering");

  return (
    <div className="border-t border-white/10 bg-primary/90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12">
          <CategoryDropdown />
          <nav className="ml-8 flex-1">
            <ul className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-sm text-white hover:text-white/80 transition-colors font-medium tracking-wide px-2 py-1 rounded-md hover:bg-white/10"
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