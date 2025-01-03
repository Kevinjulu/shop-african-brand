import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useCartSync = (user: any, sessionId: string, onCartUpdate: () => void) => {
  useEffect(() => {
    console.log("Setting up cart sync for:", user?.id ? `user ${user.id}` : `session ${sessionId}`);
    
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: user 
            ? `user_id=eq.${user.id}` 
            : `session_id=eq.${sessionId}`
        },
        () => {
          console.log('Cart updated, fetching new items');
          onCartUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, sessionId, onCartUpdate]);
};