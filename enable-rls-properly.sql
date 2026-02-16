-- ============================================================================
-- COMPREHENSIVE RLS POLICY SETUP FOR admin_users
-- ============================================================================
-- This ensures security without circular dependencies

-- STEP 1: Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL old policies (avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can view admin records" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admins" ON admin_users;
DROP POLICY IF EXISTS "Users can view own admin status" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admin_users;

-- ============================================================================
-- STEP 3: Create new non-circular policies
-- ============================================================================

-- Policy 1: Authenticated users can READ admin_users table
-- This allows login verification without checking if they're admin first
CREATE POLICY "authenticated_users_can_read_admin_records"
  ON admin_users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 2: Only super_admins can INSERT new admin records
CREATE POLICY "super_admins_can_insert_admin_records"
  ON admin_users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE admin_role = 'super_admin'
    )
  );

-- Policy 3: Only super_admins can UPDATE admin records
CREATE POLICY "super_admins_can_update_admin_records"
  ON admin_users
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE admin_role = 'super_admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE admin_role = 'super_admin'
    )
  );

-- Policy 4: Only super_admins can DELETE admin records
CREATE POLICY "super_admins_can_delete_admin_records"
  ON admin_users
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE admin_role = 'super_admin'
    )
  );

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. All authenticated users can READ admin records (for login verification)
-- 2. Only super_admins can modify (INSERT, UPDATE, DELETE) admin records
-- 3. NO circular dependency: We don't check if user is admin to let them read
-- 4. App logic in authManager.ts provides additional authorization layer
-- 5. This is layered security: database RLS + application checks
