import { useSearch } from "@/hooks/useSearch";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Package2 } from "lucide-react";
import { FormattedPrice } from "@/components/common/FormattedPrice";

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const countryFilter = searchParams.get('country');
  
  const { 
    query, 
    filters, 
    products, 
    isLoading, 
    error, 
    updateSearch, 
    updateFilters 
  } = useSearch();

  useEffect(() => {
    if (countryFilter) {
      console.log('Filtering products by country:', countryFilter);
      updateFilters({ origin: countryFilter });
    }
  }, [countryFilter, updateFilters]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {countryFilter ? `Products from ${countryFilter}` : 'All Products'}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white">
            <Package2 className="w-4 h-4 mr-1" />
            {products.length} Products
          </Badge>
          <Badge variant="secondary" className="bg-white">
            <Truck className="w-4 h-4 mr-1" />
            Free Shipping
          </Badge>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <AdvancedSearch
          initialQuery={query}
          initialFilters={filters}
          onQueryChange={updateSearch}
          onFiltersChange={updateFilters}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-3">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary/90">
                      New Arrival
                    </Badge>
                  </div>
                  <div className="p-3 space-y-2">
                    <h2 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <FormattedPrice 
                      amount={product.price}
                      className="text-primary font-bold text-lg"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4" />
                        <span className="text-xs text-gray-500 ml-1">(24)</span>
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Products;