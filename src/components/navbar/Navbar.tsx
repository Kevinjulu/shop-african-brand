import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { NavIcons } from "./NavIcons";
import { SubMenu } from "./SubMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "../MobileNav";
import { cn } from "@/lib/utils";

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

  return (
    <header 
      className={cn(
        "w-full bg-[#F97316] transition-all duration-300 border-b border-[#F97316]/20",
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
          
          <NavIcons />
        </div>
      </div>

      {!isMobile && showSubmenu && <SubMenu />}
      <MobileNav />
    </header>
  );
};