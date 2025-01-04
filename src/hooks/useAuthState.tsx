import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("useAuthState: Initializing");

    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          if (mounted) {
            setError(sessionError);
          }
          return;
        }

        console.log("Initial session check:", session?.user?.email);
        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setError(error instanceof Error ? error : new Error('Unknown authentication error'));
          setLoading(false);
        }
      }
    };

    // Get initial session
    getInitialSession();

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);
          setError(null);
        }
      }
    );

    // Cleanup subscription and mounted flag on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};