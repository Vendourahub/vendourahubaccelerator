# Supabase Setup Guide for Vendoura Hub

## 🚨 IMPORTANT: Run This First!

Your database tables don't exist yet. Follow these steps to set up your database:

---

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql
2. Click **"New Query"**

---

## Step 2: Run the Migration SQL

1. Open the file `/supabase_migration.sql` in this project
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

You should see: **"Success. No rows returned"**

---

## Step 3: Verify Tables Created

1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/editor
2. You should now see these tables:
   - ✅ `admin_users`
   - ✅ `system_settings`
   - ✅ `founder_profiles`
   - ✅ `waitlist`
   - ✅ `weekly_commits`
   - ✅ `weekly_reports`
   - ✅ `stage_progress`
   - ✅ `mentor_notes`
   - ✅ `audit_logs`

---

## Step 4: Create Your First Super Admin

After tables are created, you need to create a super admin account:

### Option A: Using Supabase Dashboard

1. Go to Authentication > Users
2. Click "Add user"
3. Enter:
   - Email: `admin@vendoura.com`
   - Password: (your secure password)
   - User Metadata (JSON):
   ```json
   {
     "user_type": "admin",
     "admin_role": "super_admin",
     "name": "Super Admin"
   }
   ```
4. Click "Create user"

5. **IMPORTANT:** Now create the admin_users record manually:
   - Go to Table Editor > admin_users
   - Click "Insert row"
   - Fill in:
     - `user_id`: (copy from auth.users table)
     - `email`: `admin@vendoura.com`
     - `name`: `Super Admin`
     - `role`: `super_admin`
     - `cohort_access`: `{all}`
     - `status`: `active`

### Option B: Using SQL (Easier!)

Run this in SQL Editor:

```sql
-- Replace YOUR_PASSWORD_HERE with your actual password
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@vendoura.com',
    crypt('YOUR_PASSWORD_HERE', gen_salt('bf')),
    NOW(),
    '{"user_type": "admin", "admin_role": "super_admin", "name": "Super Admin"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_user_id;

  -- Create admin_users record
  INSERT INTO public.admin_users (
    user_id,
    email,
    name,
    role,
    cohort_access,
    status
  )
  VALUES (
    new_user_id,
    'admin@vendoura.com',
    'Super Admin',
    'super_admin',
    ARRAY['all']::TEXT[],
    'active'
  );
END $$;
```

---

## Step 5: Test Your Setup

1. Go to your Vendoura app: http://localhost:5173/admin
2. Login with:
   - Email: `admin@vendoura.com`
   - Password: (the password you set)
3. Navigate to "Super Admin Control"
4. You should see real data loading (no more errors!)

---

## ✅ What This Sets Up

- **Admin Management**: Full role-based access control
- **System Settings**: Cohort program toggle
- **Founder Profiles**: All founder data
- **Waitlist**: When cohort program is inactive
- **Weekly Tracking**: Commits and reports
- **Stage Progress**: Stage unlocking system
- **Mentor Notes**: Private notes on founders
- **Audit Logs**: Complete action history

---

## 🔒 Security Notes

- All tables have Row Level Security (RLS) enabled
- Admins can only see data they have permission for
- Founders can only see their own data
- Audit logs track all important actions

---

## Need Help?

If you see errors:
1. Check that all tables were created successfully
2. Verify your super admin user exists in both `auth.users` and `admin_users`
3. Make sure the user metadata includes `"user_type": "admin"`

---

**After completing these steps, all your admin pages will work with real Supabase data!**
