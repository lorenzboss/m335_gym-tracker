import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;

if (!supabaseUrl) {
  throw new Error(
    'Supabase URL is missing. Please define it in src/environments/environment.ts.'
  );
}

if (!supabaseKey) {
  throw new Error(
    'Supabase Key is missing. Please define it in src/environments/environment.ts.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
