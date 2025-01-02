import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const countries = [
  { name: "Kenya", code: "KE" },
  { name: "Nigeria", code: "NG" },
  { name: "South Africa", code: "ZA" },
  { name: "Ghana", code: "GH" },
  { name: "Ethiopia", code: "ET" },
  { name: "Tanzania", code: "TZ" },
  { name: "Uganda", code: "UG" },
  { name: "Rwanda", code: "RW" },
];

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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-white border border-gray-200 shadow-lg" 
        align="end"
        sideOffset={0}
      >
        {countries.map((country) => (
          <DropdownMenuItem key={country.code} asChild>
            <Link
              to={`/products?country=${country.code}`}
              className="flex items-center w-full py-2 px-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <span className="font-medium">{country.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};