import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";

export const Logo = () => {
  console.log('Logo rendering');
  
  return (
    <Link 
      to="/" 
      className="flex-shrink-0 md:flex-none w-full md:w-auto flex justify-center md:justify-start hover:opacity-90 transition-opacity"
      aria-label="Home"
    >
      <OptimizedImage 
        src="/lovable-uploads/a0b4a020-f868-4c6b-b7db-4d3c0252663a.png"
        alt="Shop African Brands" 
        className="h-12 w-auto object-contain drop-shadow-sm transition-all duration-300 hover:drop-shadow-md"
      />
    </Link>
  );
};