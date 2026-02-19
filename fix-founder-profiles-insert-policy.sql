-- Fix: Add INSERT and service role policies to founder_profiles table
-- This allows founders to create their own profiles and backend to manage them

-- Drop existing policies
DROP POLICY IF EXISTS "Founders can view own profile" ON founder_profiles;
DROP POLICY IF EXISTS "Founders can update own profile" ON founder_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON founder_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON founder_profiles;
DROP POLICY IF EXISTS founder_profiles_service_role ON founder_profiles;

-- Enable RLS if not already enabled
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Service role (backend) has full access
CREATE POLICY founder_profiles_service_role
  ON founder_profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 2: Founders can insert their own profile
CREATE POLICY founder_profiles_auth_insert
  ON founder_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Founders can view their own profile
CREATE POLICY founder_profiles_auth_read
  ON founder_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 4: Founders can update their own profile
CREATE POLICY founder_profiles_auth_update
  ON founder_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 5: Admins can view all profiles
CREATE POLICY founder_profiles_admin_read
  ON founder_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Policy 6: Admins can update all profiles
CREATE POLICY founder_profiles_admin_update
  ON founder_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

COMMENT ON TABLE founder_profiles IS 'Stores founder information and program tracking';
