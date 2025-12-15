import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

const initializeSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY not set. Supabase Storage disabled.');
      return null;
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error?.message || error);
      supabaseClient = null;
    }
  }

  return supabaseClient;
};

export const getSupabaseClient = () => {
  return initializeSupabase();
};

export default {
  getSupabaseClient,
};

