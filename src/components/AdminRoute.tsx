import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const location = useLocation();

  console.log("AdminRoute - Full Auth State:", { 
    user,
    userEmail: user?.email, 
    authLoading, 
    isAdmin, 
    adminLoading,
    currentPath: location.pathname,
    userMetadata: user?.user_metadata,
    userRole: user?.role
  });

  // Show loading state only during initial auth/admin check
  if (authLoading || adminLoading) {
    console.log("AdminRoute - Loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to auth page with return URL
  if (!user) {
    console.log("AdminRoute - No user, redirecting to auth");
    toast.error("Please sign in to access admin features");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but not admin, redirect to home
  if (!isAdmin) {
    console.error("AdminRoute - Access denied:", {
      userEmail: user.email,
      isAdmin,
      currentPath: location.pathname
    });
    toast.error("You don't have permission to access admin features");
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin
  console.log("AdminRoute - Access granted to admin");
  return <>{children}</>;
};