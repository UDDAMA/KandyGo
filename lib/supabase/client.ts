// lib/supabase/client.ts
//
// Creates a Supabase client for use inside Client Components (browser-side code).
//
// This client uses the public ANON key, which is safe to expose because:
//   1. Row Level Security (RLS) on the database prevents unauthorized writes.
//   2. Public read access is intentional — visitors browse attractions freely.
//
// Import: import { createBrowserClient } from '@/lib/supabase/client'
// Usage: const supabase = createBrowserClient()

import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
