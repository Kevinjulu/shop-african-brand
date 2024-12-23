import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoreFiltersProps {
  searchQuery: string;
  category: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const StoreFilters = ({
  searchQuery,
  category,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: StoreFiltersProps) => {
  const categories = [
    "All Categories",
    "Fashion & Clothing",
    "Art & Crafts",
    "Jewelry & Accessories",
    "Home & Living",
    "Food & Beverages",
    "Beauty & Personal Care",
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stores by name or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem 
              key={cat.toLowerCase().replace(/ & /g, '_')} 
              value={cat.toLowerCase().replace(/ & /g, '_')}
            >
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="name_asc">Name (A-Z)</SelectItem>
          <SelectItem value="name_desc">Name (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};