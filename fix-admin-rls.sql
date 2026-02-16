-- Fix Admin RLS Policy - Remove circular dependency
-- This fixes the "Access denied. Admin privileges required." error on login

-- Drop ALL existing admin_users policies
DROP POLICY IF EXISTS "Admins can view all admins" ON admin_users;
DROP POLICY IF EXISTS "Users can view own admin status" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admin_users;

-- Create simple policy: authenticated users can view admin_users
-- This allows login verification without circular dependency
CREATE POLICY "Authenticated users can view admin records" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only super admins can modify admin records
CREATE POLICY "Super admins can manage admins" ON admin_users
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM admin_users WHERE admin_role = 'super_admin')
  );

-- Note: This allows any authenticated user to check admin status,
-- but your app logic in authManager.ts still enforces admin-only access
