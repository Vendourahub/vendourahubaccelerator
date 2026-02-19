-- Fix RLS policies for applications table
-- This allows founder signup and application submission to work properly

-- ============================================================================
-- DROP EXISTING POLICIES (to start fresh)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
DROP POLICY IF EXISTS "Admins can view applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE NEW POLICIES
-- ============================================================================

-- Allow ANYONE (authenticated or not) to INSERT applications
-- This is critical for founder signup - they haven't been verified yet
CREATE POLICY "allows_insert_applications" ON applications
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated founders to view their own applications
CREATE POLICY "founders_view_own_applications" ON applications
  FOR SELECT
  USING (
    auth.uid() = (
      SELECT user_id FROM founder_profiles 
      WHERE founder_profiles.email = applications.email
    )
  );

-- Allow admins to view all applications
CREATE POLICY "admins_view_all_applications" ON applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Allow admins to update applications
CREATE POLICY "admins_update_applications" ON applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- ============================================================================
-- VERIFY POLICIES
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'applications'
  AND schemaname = 'public'
ORDER BY policyname;
