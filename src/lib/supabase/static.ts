import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-free Supabase client for public data on statically rendered (ISR)
// pages. The cookie-based server client opts the route into dynamic
// rendering, which hits Supabase on every request.
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
