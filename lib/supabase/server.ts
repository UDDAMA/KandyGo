// lib/supabase/server.ts
//
// Creates a Supabase client for use in Server Components, Server Actions, and
// Next.js middleware — anywhere code runs on the server.
//
// Unlike the browser client, this client reads and writes the session cookie
// via Next.js's `cookies()` API. This is how the admin's login session is
// preserved between requests without any session data touching the browser's
// JavaScript environment directly.
//
// The `@supabase/ssr` package handles the secure HttpOnly cookie mechanics.
//
// Important: This file must only be imported in server-side code.
// If you import it inside a Client Component you will get a build error
// because `next/headers` is not available in the browser.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is sometimes called from a Server Component where cookies
            // cannot be set. This is safe to ignore — the middleware handles
            // session refresh when a Server Component reads session data.
          }
        },
      },
    }
  );
}
