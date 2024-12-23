import { Link } from "react-router-dom";

export const Logo = () => {
  // Get the base URL from the current window location
  const baseUrl = window.location.pathname.includes('/shop-african-brand') 
    ? '/shop-african-brand'
    : '';
    
  const logoPath = `${baseUrl}/lovable-uploads/dfdf98ce-6665-4af0-aa1d-71c82f1fe485.png`;
  
  console.log('Logo path:', logoPath);
  console.log('Base URL:', baseUrl);
  console.log('Current pathname:', window.location.pathname);

  return (
    <Link to="/" className="flex-shrink-0 md:flex-none w-full md:w-auto flex justify-center md:justify-start">
      <img 
        src={logoPath}
        alt="Shop African Brands" 
        className="h-12 w-auto object-contain drop-shadow-sm transition-all duration-300 hover:drop-shadow-md"
      />
    </Link>
  );
};