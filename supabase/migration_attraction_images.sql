-- =============================================================================
-- Migration: Attraction Images (Supabase Storage & Secondary Image Support)
-- KandyGo Day-Visit Planner
-- Configured for the existing 'kandygo-attraction-images' public bucket.
-- Safe to run multiple times (idempotent).
-- =============================================================================

-- 1. Add secondary_image_url column to public.attractions (if not already present)
ALTER TABLE public.attractions
ADD COLUMN IF NOT EXISTS secondary_image_url TEXT DEFAULT NULL;

-- 2. Configure the existing 'kandygo-attraction-images' storage bucket:
-- Ensure it is public, 5 MB file size limit, and restricted to standard web image MIME types.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kandygo-attraction-images',
  'kandygo-attraction-images',
  true,
  5242880, -- 5 MB limit (5 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 3. Storage Policies on storage.objects
-- Drop old or conflicting policies to ensure clean, idempotent re-runs:
DROP POLICY IF EXISTS "public_read_attraction_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access: Attraction Images" ON storage.objects;
DROP POLICY IF EXISTS "admin_insert_attraction_images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload: Attraction Images" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_attraction_images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update: Attraction Images" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_attraction_images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete: Attraction Images" ON storage.objects;

-- (a) Public Read Access: Visitors and authenticated users can view/download images
CREATE POLICY "public_read_attraction_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'kandygo-attraction-images');

-- (b) Admin Upload Access: Only the designated admin can upload images
CREATE POLICY "admin_insert_attraction_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'kandygo-attraction-images'
    AND public.is_admin()
  );

-- (c) Admin Update/Replace Access: Only the designated admin can replace image objects
CREATE POLICY "admin_update_attraction_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'kandygo-attraction-images'
    AND public.is_admin()
  );

-- (d) Admin Delete Access: Only the designated admin can delete image objects
CREATE POLICY "admin_delete_attraction_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'kandygo-attraction-images'
    AND public.is_admin()
  );
