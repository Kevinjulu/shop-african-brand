import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileMenu } from "./MobileMenu";
import { SubMenu } from "./SubMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavIcons } from "./NavIcons";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      
      // Only hide submenu on desktop
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  console.log("Navbar rendering, isSticky:", isSticky, "pathname:", location.pathname);

  return (
    <header 
      className={cn(
        "w-full bg-white transition-all duration-300 border-b border-gray-100",
        isSticky && "fixed top-0 left-0 right-0 shadow-md z-50"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 bg-white">
          <div className="flex items-center gap-4">
            <MobileMenuButton 
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            <Logo />
          </div>
          
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
          />
          
          <NavIcons />
        </div>
      </div>

      {!isMobile && showSubmenu && <SubMenu />}

      <MobileMenu 
        isOpen={isMenuOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};