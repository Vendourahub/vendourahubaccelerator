-- Permanent fix for founder account creation RLS violations
-- Run in Supabase SQL Editor

BEGIN;

-- 1) Make founder_profiles resilient for upserts by user_id
CREATE UNIQUE INDEX IF NOT EXISTS founder_profiles_user_id_unique
ON public.founder_profiles(user_id)
WHERE user_id IS NOT NULL;

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

-- 3) Auto-create founder_profiles from auth.users (works even when email confirmation delays session)
CREATE OR REPLACE FUNCTION public.handle_new_founder_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', '') = 'founder' THEN
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
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_description', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_stage', 'ideation'),
      COALESCE(NEW.raw_user_meta_data->>'revenue', ''),
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
  AND COALESCE(u.raw_user_meta_data->>'user_type', '') = 'founder'
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
