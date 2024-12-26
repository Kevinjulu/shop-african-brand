import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log("Checking admin status for user:", {
          email: user.email,
          id: user.id,
          metadata: user.user_metadata
        });

        const { data, error } = await supabase
          .from('admin_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          toast.error('Error verifying admin status. Please try again.');
          setIsAdmin(false);
        } else {
          console.log("Admin check result:", {
            data,
            isAdmin: data?.is_admin || false,
            userId: user.id
          });
          setIsAdmin(data?.is_admin || false);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        toast.error('Error checking admin permissions');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};