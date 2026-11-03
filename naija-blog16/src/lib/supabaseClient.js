// Wired up to Supabase — make sure .env has VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY set (see README) before running the app.

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
