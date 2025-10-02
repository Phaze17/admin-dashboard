import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Use mock for local development when using placeholder values
const useMock = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key';

console.log('Supabase Mode:', useMock ? 'MOCK (Local Dev)' : 'REAL (Cloud)');

if (useMock) {
  console.log('🎭 Using mock database for local development');
} else {
  console.log('☁️ Using real Supabase:', supabaseUrl);
  console.log('Key starts with:', supabaseAnonKey.substring(0, 20) + '...');
}

export const supabase = useMock ? mockSupabase as any : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
