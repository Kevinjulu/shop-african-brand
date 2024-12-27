import { createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import type { AuthContextType } from "@/types/auth";
import { LoadingSpinner } from "./LoadingSpinner";

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  error: null,
  signOut: async () => {} 
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, error } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("AuthProvider: Current state", { 
    isAuthenticated: !!user, 
    userEmail: user?.email,
    currentPath: location.pathname,
    loading,
    error: error?.message 
  });

  const handleSignOut = async () => {
    try {
      console.log("AuthProvider: Initiating sign out");
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      console.log("AuthProvider: Sign out successful");
      navigate('/auth');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("AuthProvider: Sign out failed", error);
      toast.error('Error signing out. Please try again.');
    }
  };

  // Only show loading spinner for initial auth check
  if (loading && !user) {
    console.log("AuthProvider: Initial loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error("AuthProvider: Error state", error);
    toast.error(`Authentication error: ${error.message}`);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};