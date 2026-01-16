import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// This defines the function that your components are looking for
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// We also export the single instance just in case some files use it directly
export const supabase = createClient();
