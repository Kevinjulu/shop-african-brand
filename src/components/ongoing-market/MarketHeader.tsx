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
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-6">
      <div className="flex-grow">
        <h2 className="text-lg md:text-2xl font-bold text-secondary">
          Ongoing Market Day ({name})
        </h2>
        <div className="flex items-center text-gray-600 text-sm mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {location}, {country}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-[#f97316] text-white rounded-lg px-3 py-2 md:py-2.5 whitespace-nowrap">
          <Timer className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <div className="flex items-center gap-1 text-sm md:text-base font-medium">
            <div className="flex flex-col items-center">
              <span className="tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] opacity-80">HRS</span>
            </div>
            <span className="mx-0.5">:</span>
            <div className="flex flex-col items-center">
              <span className="tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] opacity-80">MIN</span>
            </div>
            <span className="mx-0.5">:</span>
            <div className="flex flex-col items-center">
              <span className="tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] opacity-80">SEC</span>
            </div>
          </div>
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