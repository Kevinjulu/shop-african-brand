import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  code: string;
  name: string;
  count: number;
}

export const CountrySelector = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      console.log("Fetching countries with products");
      const { data, error } = await supabase
        .from('products')
        .select('origin_country')
        .not('origin_country', 'is', null);

      if (error) {
        console.error('Error fetching countries:', error);
        return;
      }

      // Count products per country and create country list
      const countryMap = data.reduce((acc: { [key: string]: number }, product) => {
        const country = product.origin_country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      // Convert to array and add country names
      const countryList = Object.entries(countryMap).map(([code, count]) => ({
        code,
        name: getCountryName(code),
        count
      }));

      setCountries(countryList.sort((a, b) => b.count - a.count));
    };

    fetchCountries();
  }, []);

  const getCountryName = (code: string) => {
    const countries: { [key: string]: string } = {
      'KE': 'Kenya',
      'NG': 'Nigeria',
      'ZA': 'South Africa',
      'GH': 'Ghana',
      'ET': 'Ethiopia',
      'TZ': 'Tanzania',
      'UG': 'Uganda',
      'RW': 'Rwanda',
      'US': 'United States'
    };
    return countries[code] || code;
  };

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
        className="w-56 bg-white border border-gray-200 shadow-lg" 
        align="end"
        sideOffset={0}
      >
        {countries.map((country) => (
          <DropdownMenuItem key={country.code} asChild>
            <button
              onClick={() => navigate(`/products?country=${country.code}`)}
              className="flex items-center justify-between w-full py-2 px-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <span className="font-medium">{country.name}</span>
              <span className="text-xs text-gray-500">{country.count} products</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};