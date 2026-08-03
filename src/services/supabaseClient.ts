import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const initSupabase = (url: string, anonKey: string): SupabaseClient | null => {
  if (!url || !anonKey) {
    supabaseInstance = null;
    return null;
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  
  return supabaseInstance;
};

export const getSupabase = (): SupabaseClient | null => {
  return supabaseInstance;
};
