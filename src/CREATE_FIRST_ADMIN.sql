-- ============================================
-- CREATE YOUR FIRST SUPER ADMIN USER
-- ============================================
-- IMPORTANT: Run COMPLETE_SETUP.sql FIRST!
-- ============================================

-- METHOD 1: If you already created a user in Supabase Auth Dashboard
-- ============================================
-- 1. Go to Authentication → Users in Supabase Dashboard
-- 2. Find your user and copy the User ID (UUID)
-- 3. Replace 'YOUR_USER_ID_HERE' below with that UUID
-- 4. Run this script

-- Insert admin record
INSERT INTO public.admin_users (
  user_id,
  email,
  name,
  role,
  cohort_access,
  status
) VALUES (
  'YOUR_USER_ID_HERE'::uuid,  -- ⚠️ REPLACE with your User ID
  'admin@vendoura.com',        -- ⚠️ REPLACE with your email
  'Super Administrator',        -- ⚠️ REPLACE with your name
  'super_admin',
  ARRAY['all']::TEXT[],
  'active'
) ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Update user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'user_type', 'admin',
  'admin_role', 'super_admin',
  'name', 'Super Administrator'
)
WHERE id = 'YOUR_USER_ID_HERE'::uuid;  -- ⚠️ REPLACE with same User ID

-- Create default preferences
INSERT INTO public.admin_preferences (
  admin_id,
  email_notifications,
  push_notifications,
  sms_notifications
)
SELECT 
  id,
  true,
  true,
  false
FROM public.admin_users
WHERE user_id = 'YOUR_USER_ID_HERE'::uuid  -- ⚠️ REPLACE with same User ID
ON CONFLICT (admin_id) DO NOTHING;

-- ============================================
-- VERIFICATION - Check if it worked
-- ============================================
SELECT 
  au.id,
  au.email,
  au.name,
  au.role,
  au.status,
  au.created_at,
  u.raw_user_meta_data
FROM public.admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
WHERE au.user_id = 'YOUR_USER_ID_HERE'::uuid;  -- ⚠️ REPLACE with same User ID

-- ============================================
-- METHOD 2: If you know the email but not the User ID
-- ============================================
-- Uncomment and run this instead:

/*
-- Find user by email and create admin record
INSERT INTO public.admin_users (
  user_id,
  email,
  name,
  role,
  cohort_access,
  status
)
SELECT 
  id,
  email,
  COALESCE((raw_user_meta_data->>'name')::text, 'Admin User'),
  'super_admin',
  ARRAY['all']::TEXT[],
  'active'
FROM auth.users
WHERE email = 'admin@vendoura.com'  -- ⚠️ REPLACE with your email
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  status = 'active';

-- Update metadata
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
  'user_type', 'admin',
  'admin_role', 'super_admin'
)
WHERE email = 'admin@vendoura.com';  -- ⚠️ REPLACE with your email

-- Create preferences
INSERT INTO public.admin_preferences (admin_id, email_notifications, push_notifications)
SELECT id, true, true
FROM public.admin_users
WHERE email = 'admin@vendoura.com'  -- ⚠️ REPLACE with your email
ON CONFLICT (admin_id) DO NOTHING;

-- Verify
SELECT 
  au.id,
  au.email,
  au.name,
  au.role,
  au.status,
  u.raw_user_meta_data
FROM public.admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'admin@vendoura.com';  -- ⚠️ REPLACE with your email
*/

-- ============================================
-- METHOD 3: Temporary RLS Bypass (if RLS is blocking)
-- ============================================
-- Only use this if you get "RLS policy violation" errors
-- Run this, then try METHOD 1 or 2 again, then re-enable RLS

/*
-- Disable RLS temporarily
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Now run METHOD 1 or METHOD 2 above

-- Re-enable RLS (IMPORTANT!)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
*/
