import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vliipymofvhkewtlyqdi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsaWlweW1vZnZoa2V3dGx5cWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNTEyMzksImV4cCI6MjA0OTYyNzIzOX0.d_heyFGQQgl_vLqUncG3u87cTq_cptgPk2dwaBIurek";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
    db: {
      schema: 'public'
    },
  }
);

// Add global error handling through auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'ERROR') {
    console.error('Supabase auth error:', session?.error);
  }
});