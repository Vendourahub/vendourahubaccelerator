# 🔐 FIX: Supabase Auth "Invalid Login Credentials" Error

## 🎯 **Problem Diagnosis**

The error `AuthApiError: Invalid login credentials` occurs when:

1. ❌ **No users exist** - You haven't created any test users yet
2. ❌ **Wrong credentials** - Email/password mismatch
3. ❌ **Email confirmation required** - Supabase requires email verification
4. ❌ **User exists in Auth but not in database tables** - Orphaned auth records

---

## ✅ **SOLUTION 1: Disable Email Confirmation (Recommended for Development)**

### **Step 1: Turn Off Email Confirmation**

1. Go to: https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers
2. Scroll to **"Email Auth"**
3. **UNCHECK** "Confirm email"
4. Click **Save**

This allows users to log in immediately after signup without email verification.

---

## ✅ **SOLUTION 2: Create Test Users**

You need to create test accounts in Supabase. Here are 3 methods:

### **Method A: Create Admin User via SQL (EASIEST)**

Run this in Supabase SQL Editor:

```sql
-- This creates an admin user you can log in with
-- Email: admin@vendoura.com
-- Password: VendouraAdmin2026!

-- Step 1: Create auth user (using auth.users)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@vendoura.com',
  crypt('VendouraAdmin2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User","user_type":"admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Step 2: Get the user_id (run SELECT to see the ID)
-- Then insert into admin_users table:

INSERT INTO admin_users (user_id, email, name, role, status)
SELECT 
  id,
  'admin@vendoura.com',
  'Admin User',
  'super_admin',
  'active'
FROM auth.users 
WHERE email = 'admin@vendoura.com'
ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Verify
SELECT u.email, a.name, a.role 
FROM auth.users u
JOIN admin_users a ON u.id = a.user_id
WHERE u.email = 'admin@vendoura.com';
```

**Now you can log in with:**
- Email: `admin@vendoura.com`
- Password: `VendouraAdmin2026!`

---

### **Method B: Use Application Page (For Founders)**

1. Go to: http://localhost:5173/apply
2. Fill out the application form
3. Create account with:
   - Email: `founder@test.com`
   - Password: `Test1234!`
   - Name: `Test Founder`
   - Business: `Test Business`
   - Revenue 30d: `50000`
   - Revenue 90d: `120000`
4. Check all commitment checkboxes
5. Click "Submit Application"

---

### **Method C: Use Supabase Dashboard (Manual)**

1. Go to: https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/users
2. Click **"Add user"**
3. **Manual method:**
   - Email: `test@vendoura.com`
   - Password: `Test1234!`
   - **Check** "Auto Confirm User" (important!)
   - Click "Create user"
4. Then run SQL to create admin record:

```sql
-- Replace YOUR_USER_ID with the ID from step 3
INSERT INTO admin_users (user_id, email, name, role, status)
VALUES (
  'YOUR_USER_ID',  -- Get this from Auth > Users page
  'test@vendoura.com',
  'Test Admin',
  'super_admin',
  'active'
);
```

---

## ✅ **SOLUTION 3: Better Error Handling**

I'll update the auth code to provide clearer error messages:

**The code already handles this well, but let's add a helpful tip to the UI:**

---

## 🧪 **TESTING YOUR FIX**

### **Test Admin Login:**

1. Go to: http://localhost:5173/admin
2. Enter:
   - Email: `admin@vendoura.com`
   - Password: `VendouraAdmin2026!`
3. Click "Sign In"
4. Should redirect to `/admin` dashboard

### **Test Founder Login:**

1. Go to: http://localhost:5173/login
2. Enter the credentials you created
3. Click "Sign In"
4. Should redirect to `/founder/dashboard` or `/onboarding`

---

## 🔍 **DEBUGGING CHECKLIST**

If still getting errors, check:

### **1. Email Confirmation Setting**
```bash
# Go to Auth Settings
https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers

# Verify "Confirm email" is UNCHECKED
```

### **2. Users Exist**
```sql
-- Run in SQL Editor
SELECT 
  u.id,
  u.email, 
  u.email_confirmed_at,
  u.created_at
FROM auth.users u
ORDER BY u.created_at DESC;

-- Should show at least 1 user
```

### **3. Admin Users Exist**
```sql
-- Run in SQL Editor
SELECT * FROM admin_users;

-- Should show at least 1 admin
```

### **4. Check Browser Console**
- Open DevTools (F12)
- Look for specific error messages
- Check Network tab for failed requests

---

## 🎯 **QUICK FIX SCRIPT**

Run this complete script to create both admin and founder test users:

```sql
-- ============================================
-- CREATE TEST USERS FOR VENDOURA
-- ============================================

-- 1. Create Super Admin
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Insert or get admin auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@vendoura.com',
    crypt('VendouraAdmin2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Super Admin","user_type":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO admin_user_id;

  -- Create admin_users record
  INSERT INTO admin_users (user_id, email, name, role, status)
  VALUES (
    admin_user_id,
    'admin@vendoura.com',
    'Super Admin',
    'super_admin',
    'active'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RAISE NOTICE '✅ Super Admin created: admin@vendoura.com / VendouraAdmin2026!';
END $$;

-- 2. Create Test Founder
DO $$
DECLARE
  founder_user_id UUID;
  founder_profile_id UUID;
BEGIN
  -- Insert or get founder auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'founder@test.com',
    crypt('Test1234!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Test Founder","user_type":"founder"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO founder_user_id;

  -- Create founder_profiles record
  INSERT INTO founder_profiles (
    user_id,
    email,
    name,
    business_name,
    baseline_revenue_30d,
    baseline_revenue_90d,
    current_stage,
    current_week,
    account_status,
    consecutive_misses,
    subscription_status,
    is_locked,
    created_at,
    updated_at
  ) VALUES (
    founder_user_id,
    'founder@test.com',
    'Test Founder',
    'Test Business',
    50000,
    120000,
    1,
    1,
    'active',
    0,
    'trial',
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO founder_profile_id;

  -- Create stage progress
  FOR i IN 1..5 LOOP
    INSERT INTO stage_progress (
      user_id,
      stage_number,
      status,
      unlocked_at,
      requirements_met
    ) VALUES (
      founder_user_id,
      i,
      CASE WHEN i = 1 THEN 'in_progress' ELSE 'locked' END,
      CASE WHEN i = 1 THEN NOW() ELSE NULL END,
      false
    )
    ON CONFLICT (user_id, stage_number) DO NOTHING;
  END LOOP;

  RAISE NOTICE '✅ Test Founder created: founder@test.com / Test1234!';
END $$;

-- 3. Verify users were created
SELECT 
  'Admin' as type,
  u.email,
  a.role,
  a.status
FROM auth.users u
JOIN admin_users a ON u.id = a.user_id
WHERE u.email = 'admin@vendoura.com'

UNION ALL

SELECT 
  'Founder' as type,
  u.email,
  f.business_name as role,
  f.account_status as status
FROM auth.users u
JOIN founder_profiles f ON u.id = f.user_id
WHERE u.email = 'founder@test.com';

-- ============================================
-- SUCCESS!
-- ============================================
-- You can now log in with:
-- 
-- ADMIN:
--   Email: admin@vendoura.com
--   Password: VendouraAdmin2026!
--   URL: /admin
--
-- FOUNDER:
--   Email: founder@test.com
--   Password: Test1234!
--   URL: /login
-- ============================================
```

---

## 📝 **SUMMARY**

### **Choose ONE solution:**

**Option 1 (Fastest):** Disable email confirmation + Run test user SQL script
**Option 2 (Best for dev):** Disable email confirmation + Create users via /apply page
**Option 3 (Production-ready):** Keep email confirmation + Set up email service

### **After applying fix:**

1. ✅ Clear browser cache/localStorage
2. ✅ Refresh page
3. ✅ Try logging in with test credentials
4. ✅ Check browser console for any remaining errors

---

## 🚀 **NEXT STEPS**

Once login works:

1. ✅ Deploy `/COMPLETE_SCHEMA.sql` to create missing tables
2. ✅ Create storage bucket for file uploads
3. ✅ Test full founder flow (Commit → Execute → Report)
4. ✅ Test admin tools

**Need help? The error messages in the UI are designed to guide you to the right solution!**
