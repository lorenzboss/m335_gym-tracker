import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xftyksprqipuzongahwh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdHlrc3BycWlwdXpvbmdhaHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTc0NjgsImV4cCI6MjA0OTA3MzQ2OH0.jq4z_onZC8-9OGmyUj4VLiK1XDe5Q2gBN7uouoZ9GY8';

export const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL oder Key fehlen. Überprüfe deine .env-Datei.');
}
