import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FormattedPrice } from "@/components/common/FormattedPrice";

const NewArrivals = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data as Product[];
    },
  });

  if (isLoading) {
    return <div>Loading new arrivals...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Arrivals</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products?.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="aspect-square relative mb-2 overflow-hidden rounded-md">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h2 className="text-sm font-medium line-clamp-2 mb-1">
                  {product.name}
                </h2>
                <FormattedPrice 
                  amount={product.price}
                  countryCode={product.origin_country}
                  className="text-primary font-bold text-sm"
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;