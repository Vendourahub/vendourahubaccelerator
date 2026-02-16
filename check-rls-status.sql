-- Check current RLS status and policies
-- Run these queries in Supabase SQL Editor to review security

-- 1. Check if RLS is enabled on admin_users table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users' 
AND schemaname = 'public';

-- 2. Check all existing policies on admin_users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'admin_users'
AND schemaname = 'public'
ORDER BY policyname;

-- 3. Check if there are any roles or authentication rules
SELECT 
  auth.role() as current_role,
  auth.uid() as current_uid;
