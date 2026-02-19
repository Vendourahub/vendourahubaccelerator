-- Fix RLS policy for applications table to allow public submissions
-- The applications table stores pre-signup applications from anyone

-- Drop existing policies
DROP POLICY IF EXISTS applications_public_read ON applications;
DROP POLICY IF EXISTS applications_admin_all ON applications;
DROP POLICY IF EXISTS applications_anon_insert ON applications;

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can insert (public signup form)
CREATE POLICY applications_anon_insert
  ON applications
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Only authenticated users (and admins) can view applications
CREATE POLICY applications_auth_read
  ON applications
  FOR SELECT
  USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

-- Policy 3: Only admins can update applications
CREATE POLICY applications_admin_update
  ON applications
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 4: Only admins can delete applications
CREATE POLICY applications_admin_delete
  ON applications
  FOR DELETE
  USING (auth.role() = 'service_role');

COMMENT ON TABLE applications IS 'Public signup applications from potential founders';
