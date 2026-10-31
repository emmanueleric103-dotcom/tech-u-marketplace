import { createClient } from '@supabase/supabase-js';

// Placeholder fallback so build never fails on Vercel / local without env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build-only-replace-in-env';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
