'use server';

// app/admin/actions.ts
// Server Actions for Admin Authentication & Attraction Management (FR-018 through FR-023)

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getConfiguredAdminId, verifyAdminAction } from '@/lib/auth';
import {
  ATTRACTION_IMAGES_BUCKET,
  validateImageFile,
  safelyDeleteStorageObject,
} from '@/lib/storage';

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
      error: 'Administrator authentication is temporarily unavailable (unconfigured system credentials). Please check server configuration.',
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: 'Invalid credentials. Please check your email and password.' };
  }

  // Authorize strictly against the designated ADMIN_USER_ID
  if (!data?.user || data.user.id !== configuredAdminId) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Access denied: Your account is not authorized as the designated site administrator.',
    };
  }

  redirect('/admin');
}

/**
 * Admin Logout Server Action (FR-022)
 */
export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/**
 * Upload Attraction Image Action
 * Uploads an image to the existing 'kandygo-attraction-images' bucket.
 * Restricts uploads strictly to the authenticated administrator identity.
 * Validates file type (JPEG, PNG, WebP, AVIF) and size (<= 5MB).
 */
export async function uploadAttractionImageAction(formData: FormData) {
  try {
    const { supabase } = await verifyAdminAction();

    const file = formData.get('file') as File;
    const slot = (formData.get('slot') as string) || 'main';
    const attractionId = (formData.get('attraction_id') as string)?.trim() || 'draft';

    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanSlot = slot === 'secondary' ? 'secondary' : 'main';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const objectPath = `attractions/${attractionId}/${cleanSlot}-${timestamp}-${randomSuffix}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(ATTRACTION_IMAGES_BUCKET)
      .upload(objectPath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    const { data: publicData } = supabase.storage
      .from(ATTRACTION_IMAGES_BUCKET)
      .getPublicUrl(objectPath);

    return {
      success: true,
      publicUrl: publicData.publicUrl,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Image upload failed.' };
  }
}

/**
 * Delete Unsaved Draft Image Action
 * Removes an uncommitted image object if the admin removes or replaces it before saving the form.
 */
export async function deleteDraftImageAction(url: string) {
  try {
    const { supabase } = await verifyAdminAction();
    await safelyDeleteStorageObject(supabase, url);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Create Attraction Server Action (FR-019)
 */
export async function createAttractionAction(prevState: any, formData: FormData) {
  let image_url: string | null = null;
  let secondary_image_url: string | null = null;

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
    image_url = (formData.get('image_url') as string)?.trim() || null;
    secondary_image_url = (formData.get('secondary_image_url') as string)?.trim() || null;

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
        secondary_image_url,
      })
      .select('id')
      .single();

    if (error) {
      // Safe Cleanup: If the database insert fails, clean up the newly uploaded draft images
      if (image_url) await safelyDeleteStorageObject(supabase, image_url);
      if (secondary_image_url) await safelyDeleteStorageObject(supabase, secondary_image_url);
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
 * Safely handles image replacements and cleanup:
 * Old storage objects are only deleted AFTER the database update succeeds,
 * and only if no other attraction record references the URL.
 */
export async function updateAttractionAction(id: number, prevState: any, formData: FormData) {
  let oldMainUrl: string | null = null;
  let oldSecondaryUrl: string | null = null;
  let image_url: string | null = null;
  let secondary_image_url: string | null = null;

  try {
    const { supabase } = await verifyAdminAction();

    // 1. Fetch current attraction to identify previously attached image URLs
    const { data: currentItem } = await supabase
      .from('attractions')
      .select('image_url, secondary_image_url')
      .eq('id', id)
      .single();

    if (currentItem) {
      oldMainUrl = currentItem.image_url;
      oldSecondaryUrl = currentItem.secondary_image_url;
    }

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
    image_url = (formData.get('image_url') as string)?.trim() || null;
    secondary_image_url = (formData.get('secondary_image_url') as string)?.trim() || null;

    if (!name || isNaN(category_id) || !description || isNaN(latitude) || isNaN(longitude)) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    // 2. Perform database update
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
        secondary_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      // Safe Cleanup: If the database update fails, preserve existing images;
      // clean up any new draft images that failed to save.
      if (image_url && image_url !== oldMainUrl && image_url !== oldSecondaryUrl) {
        await safelyDeleteStorageObject(supabase, image_url);
      }
      if (secondary_image_url && secondary_image_url !== oldSecondaryUrl && secondary_image_url !== oldMainUrl) {
        await safelyDeleteStorageObject(supabase, secondary_image_url);
      }
      return { success: false, error: error.message };
    }

    // 3. Post-update storage cleanup:
    // Only delete old storage objects if the database update succeeded AND the old object is no longer referenced.
    if (oldMainUrl && oldMainUrl !== image_url && oldMainUrl !== secondary_image_url) {
      await safelyDeleteStorageObject(supabase, oldMainUrl);
    }
    if (oldSecondaryUrl && oldSecondaryUrl !== secondary_image_url && oldSecondaryUrl !== image_url) {
      await safelyDeleteStorageObject(supabase, oldSecondaryUrl);
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
 * Soft Delete Attraction Server Action (FR-021)
 * Safely marks the attraction as deleted by setting deleted_at timestamp.
 * The record and its images remain preserved in the database and can be restored.
 */
export async function softDeleteAttractionAction(id: number) {
  try {
    const { supabase } = await verifyAdminAction();

    const { error } = await supabase
      .from('attractions')
      .update({
        deleted_at: new Date().toISOString(),
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
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to move attraction to Recycle Bin.' };
  }
}

// Backward-compatible alias
export const deleteAttractionAction = softDeleteAttractionAction;

/**
 * Restore Attraction Server Action
 * Restores a soft-deleted attraction from the Recycle Bin by clearing deleted_at.
 */
export async function restoreAttractionAction(id: number) {
  try {
    const { supabase } = await verifyAdminAction();

    const { error } = await supabase
      .from('attractions')
      .update({
        deleted_at: null,
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
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to restore attraction.' };
  }
}

/**
 * Permanent Delete Attraction Server Action
 * Permanently removes an attraction and cleans up its storage images if unreferenced elsewhere.
 * Safety guard: Only allowed if the attraction has already been soft-deleted to the Recycle Bin.
 */
export async function permanentDeleteAttractionAction(id: number) {
  try {
    const { supabase } = await verifyAdminAction();

    // Verify the record is in the Recycle Bin before permanent deletion
    const { data: item, error: fetchErr } = await supabase
      .from('attractions')
      .select('id, name, deleted_at, image_url, secondary_image_url')
      .eq('id', id)
      .single();

    if (fetchErr || !item) {
      return { success: false, error: 'Attraction not found.' };
    }

    if (!item.deleted_at) {
      return {
        success: false,
        error: 'Safety Guard: The attraction must be moved to the Recycle Bin before permanent deletion.',
      };
    }

    const { error } = await supabase
      .from('attractions')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Clean up stored images if they belong to kandygo-attraction-images and are not referenced elsewhere
    if (item.image_url) {
      await safelyDeleteStorageObject(supabase, item.image_url);
    }
    if (item.secondary_image_url) {
      await safelyDeleteStorageObject(supabase, item.secondary_image_url);
    }

    revalidatePath('/attractions');
    revalidatePath(`/attractions/${id}`);
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to permanently delete attraction.' };
  }
}
