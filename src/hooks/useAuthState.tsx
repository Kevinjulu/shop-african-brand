import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';

export const useAuthState = () => {
  const session = useSession();
  const [user, setUser] = useState<User | null>(session?.user || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("useAuthState: Initializing");

    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError(sessionError);
          return;
        }

        console.log("Initial session check:", session?.user?.email);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
        setError(error instanceof Error ? error : new Error('Unknown authentication error'));
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setUser(session?.user || null);
        setLoading(false);
        setError(null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};