import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Store } from "./types";
import { StoreCard } from "./StoreCard";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedStores = () => {
  const { data: stores, isLoading } = useQuery({
    queryKey: ["featured-stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("featured", true)
        .eq("verification_status", "verified")
        .order("business_name");

      if (error) throw error;
      return data as Store[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[400px]">
            <Skeleton className="h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!stores?.length) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Featured Stores</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};