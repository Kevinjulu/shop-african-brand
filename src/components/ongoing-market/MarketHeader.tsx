import { MapPin, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MarketHeaderProps {
  name: string;
  location: string;
  country: string;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  marketId: string;
}

export const MarketHeader = ({ name, location, country, timeLeft, marketId }: MarketHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 md:mb-4">
      <div className="flex-grow flex flex-col md:flex-row md:items-center gap-2">
        <h2 className="text-lg md:text-2xl font-bold text-secondary">
          Ongoing Market Day ({name})
        </h2>
        
        <div className="flex items-center bg-[#f97316] text-white rounded-lg px-3 py-1.5 md:py-2 shadow-md hover:bg-[#ea580c] transition-colors">
          <Timer className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 animate-pulse" />
          <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium">
            <div className="flex flex-col items-center leading-tight">
              <span className="tabular-nums font-semibold">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] md:text-[10px] opacity-80 uppercase tracking-wider">hrs</span>
            </div>
            <span className="mx-0.5 -mt-3">:</span>
            <div className="flex flex-col items-center leading-tight">
              <span className="tabular-nums font-semibold">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] md:text-[10px] opacity-80 uppercase tracking-wider">min</span>
            </div>
            <span className="mx-0.5 -mt-3">:</span>
            <div className="flex flex-col items-center leading-tight">
              <span className="tabular-nums font-semibold">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] md:text-[10px] opacity-80 uppercase tracking-wider">sec</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {location}, {country}
        </div>
        
        <Link to={`/products?market_id=${marketId}`} className="hidden md:block">
          <Button variant="link" className="group text-sm md:text-base p-0">
            View All Market Products
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};