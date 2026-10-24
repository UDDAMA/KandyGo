-- =============================================================================
-- Migration: Recycle Bin & Safe Deletion for KandyGo Attractions
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor).
-- =============================================================================

-- 1. Add deleted_at timestamp column to public.attractions
ALTER TABLE public.attractions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create index on deleted_at to optimize public catalog and recycle bin queries
CREATE INDEX IF NOT EXISTS idx_attractions_deleted_at 
ON public.attractions(deleted_at);

-- 3. Update Row Level Security (RLS) for SELECT
-- To prevent "permission denied for function is_admin" for unauthenticated visitors,
-- anonymous reads and authenticated reads are separated by role:
DROP POLICY IF EXISTS "public_read_attractions" ON public.attractions;
DROP POLICY IF EXISTS "anon_read_attractions" ON public.attractions;
DROP POLICY IF EXISTS "authenticated_read_attractions" ON public.attractions;

-- (a) Anonymous visitors: can ONLY view active attractions (does not call is_admin())
CREATE POLICY "anon_read_attractions"
  ON public.attractions FOR SELECT
  TO anon
  USING (deleted_at IS NULL);

-- (b) Authenticated users: regular users view active attractions; designated admin views all
CREATE POLICY "authenticated_read_attractions"
  ON public.attractions FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL OR public.is_admin());
