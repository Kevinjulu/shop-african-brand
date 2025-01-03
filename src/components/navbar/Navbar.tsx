import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { NavIcons } from "./NavIcons";
import { SubMenu } from "./SubMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "../MobileNav";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
        "w-full bg-primary transition-all duration-300 border-b border-primary/20",
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
            <NavIcons />
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 text-white hover:bg-primary-dark rounded-full">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4">
                    <a href="/" className="px-4 py-2 hover:bg-primary/10 rounded-md">Home</a>
                    <a href="/products" className="px-4 py-2 hover:bg-primary/10 rounded-md">Products</a>
                    <a href="/new-arrivals" className="px-4 py-2 hover:bg-primary/10 rounded-md">New Arrivals</a>
                    <a href="/best-sellers" className="px-4 py-2 hover:bg-primary/10 rounded-md">Best Sellers</a>
                    <a href="/on-sale" className="px-4 py-2 hover:bg-primary/10 rounded-md">On Sale</a>
                    <a href="/traditional" className="px-4 py-2 hover:bg-primary/10 rounded-md">Traditional</a>
                    <a href="/stores" className="px-4 py-2 hover:bg-primary/10 rounded-md">Stores</a>
                    <a href="/about" className="px-4 py-2 hover:bg-primary/10 rounded-md">About Us</a>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {!isMobile && showSubmenu && <SubMenu />}
    </header>
  );
};