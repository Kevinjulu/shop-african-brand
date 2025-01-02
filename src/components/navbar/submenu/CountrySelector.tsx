import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AFRICAN_COUNTRIES = [
  { code: 'KE', name: 'Kenya' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'SN', name: 'Senegal' }
].sort((a, b) => a.name.localeCompare(b.name));

export const CountrySelector = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 px-3 gap-1.5 text-white hover:bg-white/10 hover:text-white font-medium text-sm"
        >
          <Globe className="h-4 w-4" />
          <span>Visit Country</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-white border border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto" 
        align="end"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          {AFRICAN_COUNTRIES.map((country) => (
            <DropdownMenuItem key={country.code} asChild>
              <Link
                to={`/products?country=${country.code}`}
                className="flex items-center w-full py-2 px-3 text-sm text-gray-700 hover:bg-[#F97316]/10 hover:text-[#F97316] transition-colors"
              >
                <span className="font-medium">{country.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};