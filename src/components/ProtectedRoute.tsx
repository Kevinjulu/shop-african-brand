import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - State:", { 
    loading, 
    userEmail: user?.email,
    error: error?.message,
    currentPath: location.pathname 
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error("ProtectedRoute - Auth error:", error);
    toast.error(`Authentication error: ${error.message}`);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!user) {
    console.log("ProtectedRoute - No user found, redirecting to auth");
    toast.error("Please sign in to access this page");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};