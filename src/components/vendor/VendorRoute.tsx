import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { LoadingSpinner } from "../LoadingSpinner";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VendorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("verification_status")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setIsVendor(data?.verification_status === "verified");
      } catch (error) {
        console.error("Error checking vendor status:", error);
        toast.error("Error verifying vendor status");
      } finally {
        setLoading(false);
      }
    };

    checkVendorStatus();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    toast.error("Please sign in to access vendor features");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!isVendor) {
    toast.error("You need to be a verified vendor to access this area");
    return <Navigate to="/vendor/register" replace />;
  }

  return <>{children}</>;
};