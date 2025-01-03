import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { NavIcons } from "./NavIcons";
import { SubMenu } from "./SubMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "@/components/MobileNav";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsSticky(currentScrollY > 0);
      
      if (!isMobile) {
        if (currentScrollY > lastScrollY) {
          setShowSubmenu(false);
        } else {
          setShowSubmenu(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  console.log("Navbar rendering, isSticky:", isSticky, "pathname:", location.pathname);

  const mobileMenuItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "On Sale", path: "/on-sale" },
    { label: "Traditional", path: "/traditional" },
    { label: "Stores", path: "/stores" },
    { label: "About Us", path: "/about" },
  ];

  return (
    <>
      <header 
        className={cn(
          "w-full bg-[#FFA500] transition-all duration-300 border-b border-primary/20",
          isSticky && "fixed top-0 left-0 right-0 shadow-md z-50"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo />
            </div>
            
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearch}
            />
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <NavIcons />
              </div>
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 text-white hover:bg-primary-dark rounded-full ml-2">
                      <Menu className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                    <nav className="h-full bg-white">
                      <div className="px-6 py-8 space-y-6">
                        {mobileMenuItems.map((item) => (
                          <a
                            key={item.path}
                            href={item.path}
                            className="block py-3 text-lg font-medium text-gray-900 hover:text-[#FB923C] border-b border-gray-100"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>

        {!isMobile && showSubmenu && <SubMenu />}
      </header>
      {isMobile && <MobileNav />}
      {/* Add padding to prevent content from being hidden under the mobile nav */}
      {isMobile && <div className="h-16" />}
    </>
  );
};