import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AuthContextType, Profile } from "@/types/auth";
import { LoadingSpinner } from "./LoadingSpinner";

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  error: null,
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  profile: null
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    console.log("AuthProvider: Initializing");

    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError(sessionError);
          return;
        }

        setUser(session?.user || null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      setUser(session?.user || null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
      
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (event === 'SIGNED_IN') {
        const from = (location.state as any)?.from || '/';
        navigate(from);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    }
  };

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

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to send reset instructions');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;
      await fetchProfile(user.id);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  if (loading) {
    console.log("AuthProvider: Loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      signOut: handleSignOut,
      resetPassword,
      updateProfile,
      profile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};