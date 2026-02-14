-- ============================================
-- FIX RLS POLICY FOR OAUTH SIGNUP
-- ============================================
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/sql/new
-- ============================================

-- Step 1: Drop all existing conflicting policies on founder_profiles
DROP POLICY IF EXISTS "Allow authenticated insert founder_profiles" ON founder_profiles;
DROP POLICY IF EXISTS "System can create profiles" ON founder_profiles;
DROP POLICY IF EXISTS "Allow authenticated to insert founder profile" ON founder_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON founder_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON founder_profiles;

-- Step 2: Create a permissive INSERT policy that allows any authenticated user to create a profile
CREATE POLICY "Allow authenticated users to insert founder_profiles" 
  ON founder_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Step 3: Ensure SELECT policy exists for users to read their own profile
DROP POLICY IF EXISTS "Founders can view own profile" ON founder_profiles;
CREATE POLICY "Founders can view own profile" 
  ON founder_profiles 
  FOR SELECT 
  TO authenticated 
  USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Step 4: Ensure UPDATE policy exists for users to update their own profile
DROP POLICY IF EXISTS "Founders can update own profile" ON founder_profiles;
CREATE POLICY "Founders can update own profile" 
  ON founder_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Step 5: Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'founder_profiles';

-- ============================================
-- EXPECTED OUTPUT: You should see 3 policies:
-- 1. "Allow authenticated users to insert founder_profiles" (INSERT)
-- 2. "Founders can view own profile" (SELECT)
-- 3. "Founders can update own profile" (UPDATE)
-- ============================================
