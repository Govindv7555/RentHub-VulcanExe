import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  console.warn("WARNING: Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

// Anon client for simulating frontend sign-ins to obtain JWTs
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
