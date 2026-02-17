-- Set up RLS policies for founder_profiles and related tables
-- This allows admins to access founder data without session issues

-- ============================================================================
-- FOUNDER PROFILES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Founders can view own profile" ON founder_profiles;
DROP POLICY IF EXISTS "Founders can update own profile" ON founder_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON founder_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON founder_profiles;

-- Enable RLS
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;

-- Founders can view and update their own profile
CREATE POLICY "Founders can view own profile" ON founder_profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Founders can update own profile" ON founder_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins can view and update all profiles
-- Check if user is in admin_users table
CREATE POLICY "Admins can view all profiles" ON founder_profiles
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all profiles" ON founder_profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert their own profile during signup
CREATE POLICY "Users can insert own profile" ON founder_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- COHORTS (if needed for admin access)
-- ============================================================================

-- Enable RLS on cohorts table
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- Admins can view all cohorts
CREATE POLICY "Admins can view all cohorts" ON cohorts
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admins can update cohorts
CREATE POLICY "Admins can update cohorts" ON cohorts
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admins can insert cohorts
CREATE POLICY "Admins can insert cohorts" ON cohorts
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Founders can view their own cohort
CREATE POLICY "Founders can view own cohort" ON cohorts
  FOR SELECT 
  USING (
    id IN (
      SELECT cohort_id FROM founder_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that RLS is enabled
SELECT 
  tablename, 
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('founder_profiles', 'cohorts', 'admin_users')
ORDER BY tablename;

-- Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('founder_profiles', 'cohorts', 'admin_users')
ORDER BY tablename, policyname;
