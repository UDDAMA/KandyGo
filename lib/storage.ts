// lib/storage.ts
// Supabase Storage utilities for attraction images
// Configured for the existing 'kandygo-attraction-images' public bucket.

export const ATTRACTION_IMAGES_BUCKET = 'kandygo-attraction-images';
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

/**
 * Validates file MIME type and size.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: 'No image file was provided.' };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Unsupported image format. Allowed formats: JPEG, PNG, WebP, AVIF.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit. Please upload an image smaller than 5MB.',
    };
  }

  return { valid: true };
}

/**
 * Extracts and strictly validates the storage object path from a Supabase Storage public URL.
 * Safety guard: Only paths belonging to the 'kandygo-attraction-images' bucket and 'attractions/' prefix
 * will be matched. Rejects traversal or arbitrary object paths.
 */
export function getSafeStoragePath(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${ATTRACTION_IMAGES_BUCKET}/`;
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;

    const objectPath = decodeURIComponent(parsed.pathname.slice(idx + marker.length));

    // Security check: strictly allow only 'attractions/[scope]/[filename]'
    // Disallows '..', leading/trailing slashes, and paths outside attractions/
    if (/^attractions\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(objectPath)) {
      return objectPath;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Safely removes a storage object if:
 *  1. It belongs to the 'kandygo-attraction-images' bucket and 'attractions/' path.
 *  2. Its URL is NOT referenced anywhere in the attractions table (by main or secondary image fields,
 *     across both active records and records in the Recycle Bin).
 */
export async function safelyDeleteStorageObject(supabase: any, url: string): Promise<void> {
  const path = getSafeStoragePath(url);
  if (!path) return;

  try {
    // Confirm the URL is not referenced by ANY attraction record in the database
    const { count, error } = await supabase
      .from('attractions')
      .select('id', { count: 'exact', head: true })
      .or(`image_url.eq.${url},secondary_image_url.eq.${url}`);

    if (error) {
      console.warn('Could not verify attraction image references, skipping storage deletion:', error.message);
      return;
    }

    // Only remove the object if zero attractions reference it
    if (count === 0) {
      await supabase.storage.from(ATTRACTION_IMAGES_BUCKET).remove([path]);
    }
  } catch (err) {
    console.error('Failed to safely remove storage object:', path, err);
  }
}
