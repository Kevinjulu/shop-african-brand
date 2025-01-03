import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit }: SearchBarProps) => {
  return (
    <form 
      onSubmit={onSearchSubmit} 
      className="hidden md:flex items-center flex-1 max-w-xl mx-4"
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 focus-visible:ring-primary bg-white/90 backdrop-blur-sm border-white/20 placeholder:text-gray-500"
        />
        <Button 
          type="submit" 
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:text-primary text-gray-600"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};