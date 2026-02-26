-- Permanent fix for founder account creation RLS violations
-- Run in Supabase SQL Editor

BEGIN;

-- 1) Make founder_profiles resilient for upserts by user_id
-- Remove duplicate rows first (keep most recently updated row per user_id)
WITH ranked AS (
  SELECT
    id,
    user_id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
    ) AS rn
  FROM public.founder_profiles
  WHERE user_id IS NOT NULL
)
DELETE FROM public.founder_profiles fp
USING ranked r
WHERE fp.id = r.id
  AND r.rn > 1;

-- IMPORTANT: ON CONFLICT(user_id) requires a real unique index/constraint on user_id
DROP INDEX IF EXISTS public.founder_profiles_user_id_unique;
CREATE UNIQUE INDEX founder_profiles_user_id_unique
ON public.founder_profiles(user_id);

ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;

-- 2) Ensure INSERT policy allows founders to create only their own profile when authenticated
DROP POLICY IF EXISTS founder_profiles_auth_insert ON public.founder_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert founder_profiles" ON public.founder_profiles;
DROP POLICY IF EXISTS "System can create profiles" ON public.founder_profiles;

CREATE POLICY founder_profiles_auth_insert
  ON public.founder_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Founders can read/update only their own profile
DROP POLICY IF EXISTS founder_profiles_auth_read ON public.founder_profiles;
DROP POLICY IF EXISTS founder_profiles_auth_update ON public.founder_profiles;

CREATE POLICY founder_profiles_auth_read
  ON public.founder_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY founder_profiles_auth_update
  ON public.founder_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2b) Security-definer helper to guarantee profile exists for current authenticated founder
CREATE OR REPLACE FUNCTION public.ensure_founder_profile()
RETURNS public.founder_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_user_record auth.users%ROWTYPE;
  v_profile public.founder_profiles%ROWTYPE;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT *
  INTO v_user_record
  FROM auth.users
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Auth user not found for id %', v_user_id;
  END IF;

  INSERT INTO public.founder_profiles (
    user_id,
    email,
    name,
    business_name,
    business_description,
    business_stage,
    revenue,
    phone,
    country
  )
  VALUES (
    v_user_record.id,
    v_user_record.email,
    COALESCE(
      NULLIF(v_user_record.raw_user_meta_data->>'name', ''),
      NULLIF(v_user_record.raw_user_meta_data->>'full_name', ''),
      split_part(v_user_record.email, '@', 1)
    ),
    COALESCE(v_user_record.raw_user_meta_data->>'business_name', ''),
    COALESCE(v_user_record.raw_user_meta_data->>'business_description', ''),
    COALESCE(NULLIF(v_user_record.raw_user_meta_data->>'business_stage', ''), 'ideation'),
    COALESCE(v_user_record.raw_user_meta_data->>'revenue', '0'),
    COALESCE(v_user_record.raw_user_meta_data->>'phone', ''),
    COALESCE(v_user_record.raw_user_meta_data->>'country', '')
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(EXCLUDED.name, ''), founder_profiles.name),
    business_name = COALESCE(NULLIF(EXCLUDED.business_name, ''), founder_profiles.business_name),
    business_description = COALESCE(NULLIF(EXCLUDED.business_description, ''), founder_profiles.business_description),
    business_stage = COALESCE(NULLIF(EXCLUDED.business_stage, ''), founder_profiles.business_stage),
    revenue = COALESCE(NULLIF(EXCLUDED.revenue, ''), founder_profiles.revenue),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), founder_profiles.phone),
    country = COALESCE(NULLIF(EXCLUDED.country, ''), founder_profiles.country),
    updated_at = NOW()
  RETURNING * INTO v_profile;

  RETURN v_profile;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_founder_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_founder_profile() TO authenticated;

-- 3) Auto-create founder_profiles from auth.users (works even when email confirmation delays session)
CREATE OR REPLACE FUNCTION public.handle_new_founder_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', NEW.raw_user_meta_data->>'type', '') = 'founder' THEN
    INSERT INTO public.founder_profiles (
      user_id,
      email,
      name,
      business_name,
      business_description,
      business_stage,
      revenue,
      phone,
      country
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'name', ''),
        NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_description', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_stage', 'ideation'),
      COALESCE(NEW.raw_user_meta_data->>'revenue', '0'),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'country', '')
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
      email = EXCLUDED.email,
      name = COALESCE(NULLIF(EXCLUDED.name, ''), founder_profiles.name),
      business_name = COALESCE(NULLIF(EXCLUDED.business_name, ''), founder_profiles.business_name),
      business_description = COALESCE(NULLIF(EXCLUDED.business_description, ''), founder_profiles.business_description),
      business_stage = COALESCE(NULLIF(EXCLUDED.business_stage, ''), founder_profiles.business_stage),
      revenue = COALESCE(NULLIF(EXCLUDED.revenue, ''), founder_profiles.revenue),
      phone = COALESCE(NULLIF(EXCLUDED.phone, ''), founder_profiles.phone),
      country = COALESCE(NULLIF(EXCLUDED.country, ''), founder_profiles.country),
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_founder_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_founder_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_founder_profile();

-- 4) Backfill any founder auth users missing profiles
INSERT INTO public.founder_profiles (
  user_id,
  email,
  name,
  business_name,
  business_description,
  business_stage,
  revenue,
  phone,
  country
)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', ''),
  COALESCE(u.raw_user_meta_data->>'business_name', ''),
  COALESCE(u.raw_user_meta_data->>'business_description', ''),
  COALESCE(u.raw_user_meta_data->>'business_stage', 'ideation'),
  COALESCE(u.raw_user_meta_data->>'revenue', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->>'country', '')
FROM auth.users u
LEFT JOIN public.founder_profiles fp ON fp.user_id = u.id
WHERE fp.user_id IS NULL
  AND COALESCE(u.raw_user_meta_data->>'user_type', u.raw_user_meta_data->>'type', '') = 'founder'
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
