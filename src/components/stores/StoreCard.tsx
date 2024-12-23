import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Award } from "lucide-react";
import { Store } from "./types";

interface StoreCardProps {
  store: Store;
}

export const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <Link to={`/store/${store.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <CardContent className="p-0">
          <div className="relative h-48">
            <img
              src={store.logo_url || "/placeholder.svg"}
              alt={store.business_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {store.verification_status === 'verified' && (
              <Badge 
                className="absolute top-2 right-2 bg-green-500"
                variant="secondary"
              >
                Verified
              </Badge>
            )}
            {store.featured && (
              <Badge 
                className="absolute top-2 left-2 bg-primary"
                variant="secondary"
              >
                Featured
              </Badge>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {store.business_name}
              </h3>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {store.description}
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{store.business_address || store.country}</span>
              </div>
              {store.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="line-clamp-1">{store.contact_email}</span>
                </div>
              )}
              {store.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{store.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};