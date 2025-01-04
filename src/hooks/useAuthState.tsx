import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    console.log("useAuthState: Initializing");

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("useAuthState: Session error", sessionError);
          if (mounted) {
            setError(sessionError);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          console.log("useAuthState: Setting initial user", session?.user?.email);
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("useAuthState: Error checking session", error);
        if (mounted) {
          setError(error instanceof Error ? error : new Error('Unknown authentication error'));
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          console.log("useAuthState: Auth state changed", session?.user?.email);
          setUser(session?.user || null);
          setLoading(false);
          setError(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}