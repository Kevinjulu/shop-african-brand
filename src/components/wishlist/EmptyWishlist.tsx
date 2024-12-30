import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const EmptyWishlist = () => {
  return (
    <div className="text-center py-12">
      <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-medium text-gray-600 mb-4">Your wishlist is empty</h2>
      <p className="text-gray-500 mb-6">Browse our products and add your favorites to the wishlist</p>
      <Link to="/products">
        <Button className="bg-orange-400 hover:bg-orange-500">Browse Products</Button>
      </Link>
    </div>
  );
};