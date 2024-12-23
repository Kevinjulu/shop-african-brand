import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { SubMenu } from "./navbar/SubMenu";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "./AuthProvider";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Layout mounted, current path:", location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);
      
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        setShowSubMenu(currentScrollY < lastScrollY || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (user) {
      console.log("User authenticated in Layout:", user.email);
    } else {
      console.log("No authenticated user in Layout");
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-[#FDB813] shadow-sm">
          <div className="container mx-auto">
            <Navbar />
            {!isMobile && (
              <div 
                className={`transition-all duration-300 ${
                  showSubMenu ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <SubMenu />
              </div>
            )}
          </div>
        </div>
      </header>
      <main className={`flex-1 ${isMobile ? 'mt-14' : 'mt-[104px]'}`}>
        {children}
      </main>
      <Footer />
      {isMobile && <MobileNav />}
    </div>
  );
};