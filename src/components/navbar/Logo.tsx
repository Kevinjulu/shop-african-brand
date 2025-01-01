import { Link } from "react-router-dom";

export const Logo = () => {
  console.log('Logo rendering');
  
  return (
    <Link 
      to="/" 
      className="flex-shrink-0 md:flex-none w-full md:w-auto flex justify-center md:justify-start"
      aria-label="Home"
    >
      <img 
        src="/logo.svg"
        alt="Shop African Brands" 
        className="h-12 w-auto object-contain drop-shadow-sm transition-all duration-300 hover:drop-shadow-md"
      />
    </Link>
  );
};