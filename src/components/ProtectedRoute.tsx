import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to auth");
    toast.error("Please sign in to access this feature");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};