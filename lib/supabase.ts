import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Placeholder fallback prevents build crash when env not set
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'removed';

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: 'New' | 'Used';
  description: string;
  location?: string;
  whatsapp: string;
  phone: string;
  image_urls: string[];
  status: ListingStatus;
  created_at: string;
  views?: number;
}
