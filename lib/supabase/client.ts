import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyfeithwpexfqdtdsoov.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2YNUf2aUUr-nFlBBEOPjiA_bFFcySQV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
