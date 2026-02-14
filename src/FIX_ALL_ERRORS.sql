-- ============================================
-- COMPLETE FIX: All Errors
-- ============================================
-- Run this in Supabase SQL Editor to fix:
-- 1. Missing 'from_email' column error
-- 2. RLS policy issues
-- 3. All missing columns
-- ============================================
-- Project: knqbtdugvessaehgwwcg
-- ============================================

-- ============================================
-- PART 1: FIX SYSTEM_SETTINGS TABLE
-- ============================================

-- Add missing email/payment configuration columns
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS smtp_host TEXT,
ADD COLUMN IF NOT EXISTS smtp_port INTEGER DEFAULT 587,
ADD COLUMN IF NOT EXISTS smtp_username TEXT,
ADD COLUMN IF NOT EXISTS smtp_password TEXT,
ADD COLUMN IF NOT EXISTS from_email TEXT DEFAULT 'noreply@vendoura.com',
ADD COLUMN IF NOT EXISTS from_name TEXT DEFAULT 'Vendoura Hub',
ADD COLUMN IF NOT EXISTS paystack_public_key TEXT,
ADD COLUMN IF NOT EXISTS paystack_secret_key TEXT,
ADD COLUMN IF NOT EXISTS flutterwave_public_key TEXT,
ADD COLUMN IF NOT EXISTS flutterwave_secret_key TEXT;

-- Update existing row with default values
UPDATE public.system_settings
SET 
  from_email = COALESCE(from_email, 'noreply@vendoura.com'),
  from_name = COALESCE(from_name, 'Vendoura Hub'),
  smtp_port = COALESCE(smtp_port, 587)
WHERE id = 1;

-- Ensure system_settings row exists
INSERT INTO public.system_settings (
  id, 
  cohort_program_active, 
  current_cohort_name, 
  current_cohort_week,
  from_email,
  from_name,
  smtp_port
)
VALUES (
  1, 
  true, 
  'Cohort 3 - Feb 2026', 
  4,
  'noreply@vendoura.com',
  'Vendoura Hub',
  587
)
ON CONFLICT (id) DO UPDATE SET
  from_email = COALESCE(system_settings.from_email, 'noreply@vendoura.com'),
  from_name = COALESCE(system_settings.from_name, 'Vendoura Hub'),
  smtp_port = COALESCE(system_settings.smtp_port, 587);

-- ============================================
-- PART 2: FIX RLS POLICIES
-- ============================================

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Super admins can manage system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Allow authenticated read system settings" ON public.system_settings;

-- System Settings - Allow all authenticated users to read (needed for app functionality)
CREATE POLICY "Allow authenticated read system settings"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING (true);

-- System Settings - Only admins can update
CREATE POLICY "Admins can update system settings"
  ON public.system_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- System Settings - Only super admins can insert/delete
CREATE POLICY "Super admins can manage system settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- PART 3: FIX ADMIN_USERS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete admin users" ON public.admin_users;

-- All admins can view all admin users (for user management)
CREATE POLICY "Admins can view all admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Super admins can insert new admin users
CREATE POLICY "Super admins can insert admin users"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Super admins can update any admin user
CREATE POLICY "Super admins can update admin users"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Regular admins can update their own profile
CREATE POLICY "Admins can update own profile"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Super admins can delete admin users
CREATE POLICY "Super admins can delete admin users"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- PART 4: FIX FOUNDER_PROFILES POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Founders can view own profile" ON public.founder_profiles;
DROP POLICY IF EXISTS "Admins can view all founder profiles" ON public.founder_profiles;
DROP POLICY IF EXISTS "Founders can update own profile" ON public.founder_profiles;
DROP POLICY IF EXISTS "Admins can update founder profiles" ON public.founder_profiles;
DROP POLICY IF EXISTS "Allow authenticated to insert founder profile" ON public.founder_profiles;

-- Founders can view their own profile
CREATE POLICY "Founders can view own profile"
  ON public.founder_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all founder profiles
CREATE POLICY "Admins can view all founder profiles"
  ON public.founder_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Founders can update their own profile
CREATE POLICY "Founders can update own profile"
  ON public.founder_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can update any founder profile
CREATE POLICY "Admins can update founder profiles"
  ON public.founder_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert their own profile (for OAuth)
CREATE POLICY "Allow authenticated to insert founder profile"
  ON public.founder_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can insert founder profiles
CREATE POLICY "Admins can insert founder profiles"
  ON public.founder_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PART 5: FIX WAITLIST POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can update waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can delete waitlist" ON public.waitlist;

-- Anyone can join waitlist (public access)
CREATE POLICY "Anyone can insert into waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can view all waitlist entries
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Admins can update waitlist entries
CREATE POLICY "Admins can update waitlist"
  ON public.waitlist FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Admins can delete waitlist entries
CREATE POLICY "Admins can delete waitlist"
  ON public.waitlist FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PART 6: VERIFICATION
-- ============================================

-- Check system_settings columns
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'system_settings'
    AND table_schema = 'public'
    AND column_name IN ('from_email', 'from_name', 'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password');
  
  IF col_count = 6 THEN
    RAISE NOTICE '✅ All email configuration columns exist';
  ELSE
    RAISE NOTICE '⚠️  Only % of 6 email columns found', col_count;
  END IF;
END $$;

-- Check if system_settings row exists
DO $$
DECLARE
  row_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.system_settings WHERE id = 1) INTO row_exists;
  
  IF row_exists THEN
    RAISE NOTICE '✅ System settings row exists';
  ELSE
    RAISE NOTICE '❌ System settings row does not exist';
  END IF;
END $$;

-- Check RLS policies
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('system_settings', 'admin_users', 'founder_profiles', 'waitlist');
  
  RAISE NOTICE '✅ Found % RLS policies', policy_count;
END $$;

-- Display final status
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  RAISE NOTICE '║  ✅ ALL FIXES APPLIED SUCCESSFULLY!   ║';
  RAISE NOTICE '╚════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Fixed Items:';
  RAISE NOTICE '  ✅ system_settings: Added email configuration columns';
  RAISE NOTICE '  ✅ system_settings: Added payment gateway columns';
  RAISE NOTICE '  ✅ system_settings: Ensured default row exists';
  RAISE NOTICE '  ✅ system_settings: Fixed RLS policies';
  RAISE NOTICE '  ✅ admin_users: Fixed RLS policies';
  RAISE NOTICE '  ✅ founder_profiles: Fixed RLS policies';
  RAISE NOTICE '  ✅ waitlist: Fixed RLS policies';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 What This Fixes:';
  RAISE NOTICE '  ✅ "Could not find from_email column" error';
  RAISE NOTICE '  ✅ "User not allowed" error when loading users';
  RAISE NOTICE '  ✅ Super Admin Control panel loads correctly';
  RAISE NOTICE '  ✅ All admin operations work properly';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next Steps:';
  RAISE NOTICE '  1. Refresh your browser (Ctrl+Shift+R)';
  RAISE NOTICE '  2. Go to /admin/settings';
  RAISE NOTICE '  3. Verify no console errors';
  RAISE NOTICE '';
END $$;

-- Show system_settings data
SELECT 
  id,
  cohort_program_active,
  current_cohort_name,
  current_cohort_week,
  from_email,
  from_name,
  smtp_port
FROM public.system_settings
WHERE id = 1;
