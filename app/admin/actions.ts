'use server';

// app/admin/actions.ts
// Server Actions for Admin Authentication & Attraction Management (FR-018 through FR-023)

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getConfiguredAdminId, verifyAdminAction } from '@/lib/auth';

/**
 * Admin Login Server Action (FR-018)
 * Fails closed: Rejects login if ADMIN_USER_ID is unset, empty, or does not match.
 */
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const configuredAdminId = getConfiguredAdminId();
  if (!configuredAdminId) {
    return {
      success: false,
      error: 'Server configuration error: ADMIN_USER_ID is unset or unconfigured. Access denied.',
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Strictly verify the authenticated user matches the designated admin UUID
  if (data.user.id !== configuredAdminId) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Account authenticated, but it is not authorized as the project administrator.',
    };
  }

  redirect('/admin');
}

/**
 * Admin Logout Server Action
 */
export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/**
 * Create Attraction Server Action (FR-019)
 */
export async function createAttractionAction(prevState: any, formData: FormData) {
  try {
    const { supabase } = await verifyAdminAction();

    const name = (formData.get('name') as string)?.trim();
    const category_id = parseInt(formData.get('category_id') as string, 10);
    const description = (formData.get('description') as string)?.trim();
    const opening_hours = (formData.get('opening_hours') as string)?.trim() || null;
    const travel_tips = (formData.get('travel_tips') as string)?.trim() || null;
    const visit_duration_minutes = formData.get('visit_duration_minutes')
      ? parseInt(formData.get('visit_duration_minutes') as string, 10)
      : null;
    const entrance_fee_lkr = formData.get('entrance_fee_lkr')
      ? parseFloat(formData.get('entrance_fee_lkr') as string)
      : null;
    const entrance_fee_usd = formData.get('entrance_fee_usd')
      ? parseFloat(formData.get('entrance_fee_usd') as string)
      : null;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const distance_km = formData.get('distance_km')
      ? parseFloat(formData.get('distance_km') as string)
      : null;
    const image_url = (formData.get('image_url') as string)?.trim() || null;

    if (!name || isNaN(category_id) || !description || isNaN(latitude) || isNaN(longitude)) {
      return { success: false, error: 'Please fill in all required fields (Name, Category, Description, Latitude, Longitude).' };
    }

    const { error } = await supabase
      .from('attractions')
      .insert({
        name,
        category_id,
        description,
        opening_hours,
        travel_tips,
        visit_duration_minutes,
        entrance_fee_lkr,
        entrance_fee_usd,
        latitude,
        longitude,
        distance_km,
        image_url,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/attractions');
    revalidatePath('/admin');
    revalidatePath('/');
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    return { success: false, error: err.message || 'Failed to create attraction.' };
  }

  redirect('/admin');
}

/**
 * Update Attraction Server Action (FR-020)
 */
export async function updateAttractionAction(id: number, prevState: any, formData: FormData) {
  try {
    const { supabase } = await verifyAdminAction();

    const name = (formData.get('name') as string)?.trim();
    const category_id = parseInt(formData.get('category_id') as string, 10);
    const description = (formData.get('description') as string)?.trim();
    const opening_hours = (formData.get('opening_hours') as string)?.trim() || null;
    const travel_tips = (formData.get('travel_tips') as string)?.trim() || null;
    const visit_duration_minutes = formData.get('visit_duration_minutes')
      ? parseInt(formData.get('visit_duration_minutes') as string, 10)
      : null;
    const entrance_fee_lkr = formData.get('entrance_fee_lkr')
      ? parseFloat(formData.get('entrance_fee_lkr') as string)
      : null;
    const entrance_fee_usd = formData.get('entrance_fee_usd')
      ? parseFloat(formData.get('entrance_fee_usd') as string)
      : null;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const distance_km = formData.get('distance_km')
      ? parseFloat(formData.get('distance_km') as string)
      : null;
    const image_url = (formData.get('image_url') as string)?.trim() || null;

    if (!name || isNaN(category_id) || !description || isNaN(latitude) || isNaN(longitude)) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const { error } = await supabase
      .from('attractions')
      .update({
        name,
        category_id,
        description,
        opening_hours,
        travel_tips,
        visit_duration_minutes,
        entrance_fee_lkr,
        entrance_fee_usd,
        latitude,
        longitude,
        distance_km,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/attractions');
    revalidatePath(`/attractions/${id}`);
    revalidatePath('/admin');
    revalidatePath('/');
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    return { success: false, error: err.message || 'Failed to update attraction.' };
  }

  redirect('/admin');
}

/**
 * Delete Attraction Server Action (FR-021)
 */
export async function deleteAttractionAction(id: number) {
  try {
    const { supabase } = await verifyAdminAction();

    const { error } = await supabase
      .from('attractions')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/attractions');
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete attraction.' };
  }
}
