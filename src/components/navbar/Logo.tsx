import { Link } from "react-router-dom";

export const Logo = () => {
  console.log('Logo rendering');
  
  return (
    <Link 
      to="/" 
      className="flex-shrink-0 md:flex-none w-full md:w-auto flex justify-center md:justify-start"
      aria-label="Home"
    >
      <div className="text-2xl font-bold flex items-center">
        <span className="text-black">shop</span>
        <span className="text-[#C41E3A] ml-1">AFRICAN</span>
        <span className="text-black text-sm ml-1 mt-auto mb-1">brands</span>
      </div>
    </Link>
  );
};