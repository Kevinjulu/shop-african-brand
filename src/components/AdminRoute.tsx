import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const location = useLocation();

  console.log("AdminRoute - Auth State:", { 
    userEmail: user?.email, 
    authLoading, 
    isAdmin, 
    adminLoading,
    currentPath: location.pathname
  });

  // Show loading state while checking authentication and admin status
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("AdminRoute - No user, redirecting to auth");
    toast.error("Please sign in to access admin features");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, redirect to home
  if (!isAdmin) {
    console.log("AdminRoute - User not admin, redirecting to home");
    toast.error("You don't have permission to access admin features");
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin
  console.log("AdminRoute - Access granted to admin");
  return <>{children}</>;
};