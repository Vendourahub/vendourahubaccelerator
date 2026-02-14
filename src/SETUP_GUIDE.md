# 🚀 SETUP GUIDE - Run This in Supabase SQL Editor

## ⚠️ IMPORTANT: Follow these steps in order!

### Step 1: Run the Complete Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the ENTIRE contents of `/supabase_migration.sql` file
5. Paste into the SQL Editor
6. Click **RUN** button
7. Wait for "Success. No rows returned" message

---

### Step 2: Create Your First Admin User

After running the migration, you need to create your first admin account.

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **Add User** → **Create New User**
3. Fill in:
   - Email: `admin@vendoura.com` (or your email)
   - Password: `YourSecurePassword123!`
   - Check **Auto Confirm User**
4. Click **Create User**
5. Copy the **User ID** (UUID) that appears

6. Go back to **SQL Editor**
7. Run this query (replace `YOUR_USER_ID_HERE` with the copied UUID):

```sql
-- Insert admin_users record
INSERT INTO public.admin_users (
  user_id,
  email,
  name,
  role,
  cohort_access,
  status
) VALUES (
  'YOUR_USER_ID_HERE'::uuid,
  'admin@vendoura.com',
  'Super Administrator',
  'super_admin',
  ARRAY['all']::TEXT[],
  'active'
);

-- Update user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'user_type', 'admin',
  'admin_role', 'super_admin',
  'name', 'Super Administrator'
)
WHERE id = 'YOUR_USER_ID_HERE'::uuid;
```

**Option B: All-in-One SQL (Alternative)**

Run this single query to create everything at once:

```sql
-- Create admin user with auth
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Note: This requires admin privileges
  -- You may need to create the user via Dashboard first, then run the INSERT below
  
  -- Insert into admin_users (replace with your actual user_id from auth.users)
  INSERT INTO public.admin_users (
    user_id,
    email,
    name,
    role,
    cohort_access,
    status
  ) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@vendoura.com' LIMIT 1),
    'admin@vendoura.com',
    'Super Administrator',
    'super_admin',
    ARRAY['all']::TEXT[],
    'active'
  )
  ON CONFLICT (user_id) DO NOTHING;
END $$;
```

---

### Step 3: Verify the Setup

Run this query to verify everything is set up correctly:

```sql
-- Check if tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'admin_users',
    'admin_preferences',
    'admin_activity_logs',
    'subscriptions',
    'revenue_tactics',
    'daily_snapshots',
    'notification_settings',
    'notification_templates',
    'intervention_resolutions'
  )
ORDER BY table_name;

-- Check if admin user was created
SELECT 
  id,
  email,
  name,
  role,
  status,
  created_at
FROM public.admin_users;

-- Check if notification templates were created
SELECT 
  name,
  type,
  active
FROM public.notification_templates
ORDER BY name;
```

Expected results:
- ✅ 9 tables should be listed
- ✅ 1 admin user should appear
- ✅ 6 notification templates should appear

---

### Step 4: Test Admin Login

1. Open your Vendoura Hub app: https://vendoura.com
2. Navigate to `/admin` or `/admin/profile`
3. Log in with your admin credentials:
   - Email: `admin@vendoura.com`
   - Password: (the password you set)
4. You should see the Admin Profile page load successfully!

---

## 🛠️ Troubleshooting

### Error: "Not authenticated"
**Solution:** Make sure you're logged in with the admin account you created.

```sql
-- Check if user metadata is set correctly
SELECT 
  id,
  email,
  raw_user_meta_data
FROM auth.users
WHERE email = 'admin@vendoura.com';
```

The `raw_user_meta_data` should contain:
```json
{
  "user_type": "admin",
  "admin_role": "super_admin",
  "name": "Super Administrator"
}
```

If not, run this update:
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'user_type', 'admin',
  'admin_role', 'super_admin',
  'name', 'Super Administrator'
)
WHERE email = 'admin@vendoura.com';
```

### Error: "Could not find the table 'public.admin_users'"
**Solution:** The migration hasn't been run yet. Go back to Step 1.

### Error: "new row violates row-level security policy"
**Solution:** RLS is blocking you. Temporarily disable RLS to insert the first admin:

```sql
-- Temporarily disable RLS for admin_users
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Insert your admin user
INSERT INTO public.admin_users (
  user_id,
  email,
  name,
  role,
  cohort_access,
  status
) VALUES (
  'YOUR_USER_ID_HERE'::uuid,
  'admin@vendoura.com',
  'Super Administrator',
  'super_admin',
  ARRAY['all']::TEXT[],
  'active'
);

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

### Cannot see admin pages after login
**Solution:** Check if the user metadata is set:

```sql
-- Verify user type
SELECT 
  email,
  (raw_user_meta_data->>'user_type') as user_type,
  (raw_user_meta_data->>'admin_role') as admin_role
FROM auth.users
WHERE email = 'admin@vendoura.com';
```

---

## 📋 Quick Reference

### All Tables Created:
1. ✅ `admin_users` - Admin accounts
2. ✅ `admin_preferences` - Admin notification preferences
3. ✅ `admin_activity_logs` - Audit trail
4. ✅ `subscriptions` - Founder subscriptions
5. ✅ `revenue_tactics` - Revenue tracking
6. ✅ `daily_snapshots` - System metrics
7. ✅ `notification_settings` - Email/Push/SMS config
8. ✅ `notification_templates` - Email templates (6 default templates)
9. ✅ `intervention_resolutions` - Intervention tracking

### RLS Policies Created:
- ✅ 35+ Row Level Security policies
- ✅ Admins can view their own data
- ✅ Super admins can manage everything
- ✅ Founders can only see their own data

---

## 🎉 Success Checklist

- [ ] Ran `/supabase_migration.sql` in Supabase SQL Editor
- [ ] Created first admin user via Dashboard
- [ ] Inserted admin_users record with user_id
- [ ] Updated user metadata with admin role
- [ ] Verified tables exist (9 tables)
- [ ] Verified admin user exists
- [ ] Verified 6 notification templates exist
- [ ] Logged in successfully to `/admin/profile`
- [ ] Can see admin profile data loading from database

Once all checkboxes are complete, your Vendoura Hub admin system is fully set up! 🚀
