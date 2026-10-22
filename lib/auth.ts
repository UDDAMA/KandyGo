// lib/auth.ts
// Centralized Administrator Identity & Authorization Guards (Fail-Closed)

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Retrieves the validated ADMIN_USER_ID from process.env.
 * Returns null if unset, empty, or set to placeholder text.
 */
export function getConfiguredAdminId(): string | null {
  const raw = process.env.ADMIN_USER_ID?.replace(/['"]/g, '').trim();
  if (!raw || raw === 'your-admin-user-uuid' || raw.includes('placeholder')) {
    return null;
  }
  return raw;
}

/**
 * Page Guard: Verifies that the current visitor is the designated administrator.
 * Fails closed: redirects to /admin/login if:
 *  - No active session exists.
 *  - ADMIN_USER_ID is unset or empty in the environment.
 *  - The authenticated user's UUID does not match ADMIN_USER_ID.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const configuredAdminId = getConfiguredAdminId();

  if (error || !user || !configuredAdminId || user.id !== configuredAdminId) {
    redirect('/admin/login');
  }

  return { supabase, user };
}

/**
 * Server Action Guard: Verifies that the mutating action caller is the designated admin.
 * Fails closed: throws an Error if:
 *  - No active session exists.
 *  - ADMIN_USER_ID is unset or empty in the environment.
 *  - The authenticated user's UUID does not match ADMIN_USER_ID.
 */
export async function verifyAdminAction() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized: You must be logged in as an administrator.');
  }

  const configuredAdminId = getConfiguredAdminId();
  if (!configuredAdminId) {
    throw new Error('Server configuration error: ADMIN_USER_ID is unset or unconfigured.');
  }

  if (user.id !== configuredAdminId) {
    throw new Error('Forbidden: Your account is not authorized as the designated administrator.');
  }

  return { supabase, user };
}
