-- =============================================================================
-- KandyGo Database Schema (Revised)
-- Run this entire script in the Supabase SQL Editor (supabase.com → SQL Editor).
--
-- Structure:
--   1. Tables & Constraints (Idempotent)
--   2. Helper Functions (SECURITY DEFINER for safe admin verification)
--   3. Row Level Security & Policies (Clean drops & recreate)
--   4. PostgreSQL Grants (Data API / PostgREST exposure)
--   5. Seed Data (Categories and original 10 attractions with ON CONFLICT)
-- =============================================================================


-- =============================================================================
-- SECTION 1: Tables & Constraints
-- =============================================================================

-- Categories organise attractions for filtering (FR-003).
-- Each attraction belongs to exactly one category (BR-002).
CREATE TABLE IF NOT EXISTS public.categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT
);

-- admin_config holds the UUID of the single authorised administrator.
-- Public and anonymous access is completely revoked from this table.
-- The is_admin() SECURITY DEFINER function safely inspects this table.
CREATE TABLE IF NOT EXISTS public.admin_config (
  admin_user_id UUID PRIMARY KEY
);

-- Attractions are the core dataset (FR-001, FR-002, FR-006 through FR-010).
-- Unique constraint on name guarantees safe, idempotent seed re-runs.
CREATE TABLE IF NOT EXISTS public.attractions (
  id                      SERIAL PRIMARY KEY,
  name                    TEXT           NOT NULL UNIQUE,
  category_id             INTEGER        NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  description             TEXT           NOT NULL,
  opening_hours           TEXT,              -- null means 'not available'
  travel_tips             TEXT,              -- null means 'not available'
  visit_duration_minutes  INTEGER,           -- null means unknown; used in plan (FR-015)
  entrance_fee_lkr        NUMERIC(10, 2),   -- null means free or unknown (local rate)
  entrance_fee_usd        NUMERIC(10, 2),   -- null means free or unknown (foreign rate)
  latitude                NUMERIC(10, 7)  NOT NULL,
  longitude               NUMERIC(10, 7)  NOT NULL,
  distance_km             NUMERIC(5, 2),     -- straight-line km from Kandy city centre
  image_url               TEXT,              -- null until an image is provided
  created_at              TIMESTAMPTZ    DEFAULT NOW(),
  updated_at              TIMESTAMPTZ    DEFAULT NOW()
);

-- Ensure UNIQUE constraint on attractions(name) if the table was previously created without it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attractions_name_key'
  ) THEN
    ALTER TABLE public.attractions ADD CONSTRAINT attractions_name_key UNIQUE (name);
  END IF;
END $$;


-- =============================================================================
-- SECTION 2: Helper Functions (SECURITY DEFINER)
-- =============================================================================
-- Solves RLS recursion/deny deadlock:
-- 1. admin_config has RLS enabled with no public read access.
-- 2. Direct subqueries like `SELECT admin_user_id FROM admin_config` from an RLS
--    policy on attractions would be evaluated under the caller role and return 0 rows.
-- 3. A SECURITY DEFINER function runs with the privileges of the database owner (postgres),
--    bypassing table RLS on admin_config while exposing only a boolean result.
-- 4. search_path is pinned to 'public' to prevent search-path injection vulnerabilities.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_config
    WHERE admin_user_id = auth.uid()
  );
$$;

-- Ensure the function and table are owned by postgres so SECURITY DEFINER
-- has table read rights and automatically bypasses RLS on admin_config.
ALTER FUNCTION public.is_admin() OWNER TO postgres;
ALTER TABLE public.admin_config OWNER TO postgres;


-- =============================================================================
-- SECTION 3: Row Level Security (RLS)
-- =============================================================================
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- 1. Categories Policies
DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
DROP POLICY IF EXISTS "admin_write_categories" ON public.categories;
DROP POLICY IF EXISTS "admin_insert_categories" ON public.categories;
DROP POLICY IF EXISTS "admin_update_categories" ON public.categories;
DROP POLICY IF EXISTS "admin_delete_categories" ON public.categories;

-- Anyone (unauthenticated visitor or authenticated user) can read categories
CREATE POLICY "public_read_categories"
  ON public.categories FOR SELECT
  USING (true);

-- Only verified admin can insert, update, or delete categories
CREATE POLICY "admin_insert_categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 2. Attractions Policies
DROP POLICY IF EXISTS "public_read_attractions" ON public.attractions;
DROP POLICY IF EXISTS "admin_write_attractions" ON public.attractions;
DROP POLICY IF EXISTS "admin_insert_attractions" ON public.attractions;
DROP POLICY IF EXISTS "admin_update_attractions" ON public.attractions;
DROP POLICY IF EXISTS "admin_delete_attractions" ON public.attractions;

-- Anyone can read attractions (unauthenticated visitors browse freely)
CREATE POLICY "public_read_attractions"
  ON public.attractions FOR SELECT
  USING (true);

-- Only verified admin can insert, update, or delete attractions
CREATE POLICY "admin_insert_attractions"
  ON public.attractions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_attractions"
  ON public.attractions FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_attractions"
  ON public.attractions FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3. admin_config Policy
-- Deny direct access through Data API (PostgREST) to all callers.
-- The admin UUID cannot be queried or scraped by visitors or other users.
DROP POLICY IF EXISTS "no_direct_access_admin_config" ON public.admin_config;
DROP POLICY IF EXISTS "no_public_access_admin_config" ON public.admin_config;

CREATE POLICY "no_direct_access_admin_config"
  ON public.admin_config FOR ALL
  TO public
  USING (false);


-- =============================================================================
-- SECTION 4: PostgreSQL Grants (Data API Exposure)
-- =============================================================================
-- Ensures tables are accessible via Supabase Data API (PostgREST) even if
-- default table exposure is restricted.

-- Schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Categories table permissions
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

-- Attractions table permissions
GRANT SELECT ON TABLE public.attractions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.attractions TO authenticated;

-- Primary key sequence permissions for inserts
GRANT USAGE, SELECT ON SEQUENCE public.categories_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.attractions_id_seq TO authenticated;

-- Function execution: restricted strictly to authenticated users (visitors/anon cannot execute)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Ensure admin_config table is never accessible via Data API
REVOKE ALL ON TABLE public.admin_config FROM PUBLIC, anon, authenticated;


-- =============================================================================
-- SECTION 5: Seed Data — Categories
-- =============================================================================
INSERT INTO public.categories (name, description) VALUES
  ('Religious/Heritage', 'Sacred temples, shrines, and historical religious sites'),
  ('Nature/Scenic',      'Scenic lakes, viewpoints, and natural landscapes'),
  ('Nature/Hiking',      'Forest reserves, mountain ranges, and trekking destinations'),
  ('Museum/Tea',         'Museums, heritage centres, and tea-related experiences'),
  ('Nature/Gardens',     'Botanical gardens and curated natural spaces'),
  ('Religious/Scenic',   'Religious sites with panoramic scenic surroundings'),
  ('Waterfall/Nature',   'Waterfalls and natural outdoor destinations')
ON CONFLICT (name) DO NOTHING;


-- =============================================================================
-- SECTION 6: Seed Data — Original 10 Attractions
-- =============================================================================
-- The 10 originally defined attractions. Idempotent via ON CONFLICT (name) DO NOTHING.

INSERT INTO public.attractions (
  name, category_id, description, opening_hours, travel_tips,
  visit_duration_minutes, entrance_fee_lkr, entrance_fee_usd,
  latitude, longitude, distance_km, image_url
)
SELECT
  a.name,
  c.id AS category_id,
  a.description, a.opening_hours, a.travel_tips,
  a.visit_duration_minutes, a.entrance_fee_lkr, a.entrance_fee_usd,
  a.latitude, a.longitude, a.distance_km, a.image_url
FROM (VALUES
  (
    'Temple of the Sacred Tooth Relic',
    'Religious/Heritage',
    'Sri Lanka''s most sacred Buddhist site, housing the relic of the Tooth of the Buddha within the royal palace complex of the last Kandyan kings. A UNESCO World Heritage Site and the spiritual heart of Kandy.',
    'Open daily 05:30–20:00. Entry is permitted during puja ceremonies but movement is restricted. Three daily pujas at approximately 05:30, 09:30, and 18:30.',
    'Dress modestly — shoulders and knees must be covered. Shoes must be removed before entering. Photography of the inner relic chamber is not permitted during puja. Arrive early to avoid crowds.',
    90, 1500.00, 10.00,
    7.2936, 80.6412, 0.9, NULL
  ),
  (
    'Kandy Lake',
    'Nature/Scenic',
    'An artificial lake built in 1807 by the last Kandyan king, Sri Wickrama Rajasinha, in the heart of the city. The lake offers scenic walking paths, views of the Temple of the Tooth, and a peaceful atmosphere.',
    'Accessible at all times. The lakeside path is most pleasant in the early morning and evening.',
    'Walk the full perimeter for the best views. The cloud wall (Walakulu wall) on the north side is a notable feature. Rowboat hire is available at the lakeside.',
    60, NULL, NULL,
    7.2920, 80.6375, 0.4, NULL
  ),
  (
    'Udawatta Kele Forest Reserve',
    'Nature/Hiking',
    'A historic forest sanctuary directly behind the Temple of the Tooth that once served as the Royal Forest of the Kandyan kings. Home to endemic birds, macaques, and diverse flora with well-marked nature trails.',
    'Open daily 08:00–17:30.',
    'Bring insect repellent. The trails can be muddy after rain — wear appropriate footwear. A forest department entry ticket is required at the main gate.',
    120, 600.00, 3.00,
    7.2978, 80.6383, 0.9, NULL
  ),
  (
    'Bahirawakanda Vihara',
    'Religious/Scenic',
    'A hilltop Buddhist temple crowned by a large white seated Buddha statue that is visible from across Kandy. Offers one of the most commanding panoramic views of the entire city and surrounding hills.',
    'Open daily 06:00–20:00.',
    'The climb to the top involves steep steps — comfortable shoes recommended. Dress modestly as this is an active place of worship. The view is best in the early morning or late afternoon.',
    60, NULL, NULL,
    7.3009, 80.6316, 1.2, NULL
  ),
  (
    'Ceylon Tea Museum',
    'Museum/Tea',
    'Housed in a restored colonial-era tea factory on the slopes of Hantane, this museum traces the history of Sri Lanka''s tea industry from its beginnings in the 1860s. Exhibits include original machinery, tools, and photographs.',
    'Open Tuesday–Saturday 08:30–17:30, Sunday 08:30–14:30. Closed Monday.',
    'A guided tour is recommended to understand the machinery. Tea tasting is available. The uphill road to the museum is narrow — tuk-tuks and small vehicles are easiest.',
    90, 500.00, 3.00,
    7.2736, 80.6178, 2.6, NULL
  ),
  (
    'Royal Botanical Gardens, Peradeniya',
    'Nature/Gardens',
    'One of the finest tropical botanical gardens in Asia, spanning 147 acres along the Mahaweli River. Famous for its giant Javan fig tree, avenue of royal palms, orchid house, and a remarkable collection of over 4,000 plant species.',
    'Open daily 07:30–17:30.',
    'Allow at least two hours for a comfortable visit. The gardens are large — wear comfortable walking shoes. A map of the grounds is available at the entrance. Most crowded on weekends and public holidays.',
    150, 1500.00, 15.00,
    7.2693, 80.5954, 4.8, NULL
  ),
  (
    'Hanthana Mountain Range',
    'Nature/Hiking',
    'A scenic mountain range rising to the south of Kandy, popular with hikers for its rolling ridges, tea plantations, and cool climate. The range offers several marked trekking routes accessible from the city.',
    'Accessible year-round. Early morning starts recommended for clear weather and cooler temperatures.',
    'Inform someone of your route before heading out. Carry sufficient water and a light waterproof layer. The terrain can be steep and slippery after rain. Guides are available at the trailheads.',
    240, NULL, NULL,
    7.2588, 80.6286, 3.6, NULL
  ),
  (
    'Mandaram Nuwara',
    'Nature/Scenic',
    'A scenic highland village and nature destination in the Knuckles range foothills, known for its misty landscapes, paddy terraces, and cool temperatures. A quieter alternative to more visited destinations near Kandy.',
    'Accessible year-round. Best visited in the morning before mist sets in.',
    'The road to Mandaram Nuwara is winding and takes approximately two hours from Kandy. A four-wheel-drive vehicle is advisable in the wet season. Pack warm clothing as temperatures drop significantly.',
    180, NULL, NULL,
    7.0750, 80.7914, 29.6, NULL
  ),
  (
    'Madulkele',
    'Nature/Scenic',
    'A scenic highland area nestled in the foothills of the Knuckles Mountain Range, offering lush green landscapes, tea estate views, and a tranquil atmosphere away from the city. Popular for photography and nature walks.',
    'Accessible year-round.',
    'The route from Kandy passes through winding hill roads. A tuk-tuk or car is recommended. The area is best visited in the morning for clear views and good light.',
    150, NULL, NULL,
    7.3979, 80.7310, 16.0, NULL
  ),
  (
    'Galaboda Ella',
    'Waterfall/Nature',
    'A picturesque waterfall set within lush tea estate scenery, accessible via a scenic train journey from Kandy followed by a short hike. One of the hidden natural gems of the upcountry rail route.',
    'Accessible year-round, though the trail can be slippery during the monsoon season.',
    'Take the upcountry train from Kandy to Galaboda Station for the most scenic approach. The waterfall is a 1.5–2 km hike from the station through tea estates. Wear sturdy footwear and carry water.',
    180, NULL, NULL,
    6.7844, 80.7061, 56.9, NULL
  )
) AS a(name, category_name, description, opening_hours, travel_tips,
       visit_duration_minutes, entrance_fee_lkr, entrance_fee_usd,
       latitude, longitude, distance_km, image_url)
JOIN public.categories c ON c.name = a.category_name
ON CONFLICT (name) DO NOTHING;


-- =============================================================================
-- SECTION 7: Instructions for Assigning Admin User
-- =============================================================================
-- 1. In Supabase Dashboard → Authentication → Users:
--    Click 'Add User' → Create user (check 'Auto Confirm User', set email and password).
-- 2. Copy the UUID shown in the Users list.
-- 3. Run this command in the Supabase SQL Editor (replace the placeholder UUID):
--
--    INSERT INTO public.admin_config (admin_user_id)
--    VALUES ('PASTE-ADMIN-USER-UUID-HERE')
--    ON CONFLICT (admin_user_id) DO NOTHING;
--
-- 4. Add the same UUID to kandygo/.env.local:
--    ADMIN_USER_ID=PASTE-ADMIN-USER-UUID-HERE
