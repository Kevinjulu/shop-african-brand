import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Store } from "@/components/stores/types";
import { StoreFilters } from "@/components/stores/StoreFilters";
import { StoreCard } from "@/components/stores/StoreCard";
import { FeaturedStores } from "@/components/stores/FeaturedStores";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const StoreList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores", category],
    queryFn: async () => {
      console.log("Fetching stores with category:", category);
      let query = supabase
        .from("vendor_profiles")
        .select("*")
        .eq("verification_status", "verified");

      if (category !== "all") {
        query = query.eq("business_category", category);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching stores:", error);
        throw error;
      }

      return data as Store[];
    },
  });

  const filteredStores = stores?.filter(store => 
    store.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const sortedStores = [...(filteredStores || [])].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "name_asc":
        return a.business_name.localeCompare(b.business_name);
      case "name_desc":
        return b.business_name.localeCompare(a.business_name);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover African Brands</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of authentic African brands and artisans. 
          Each store brings unique products and stories from across the continent.
        </p>
      </div>

      <FeaturedStores />
      
      <StoreFilters
        searchQuery={searchQuery}
        category={category}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategory}
        onSortChange={setSortBy}
      />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px]">
              <Skeleton className="h-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>

          {sortedStores.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No stores found matching your criteria</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoreList;