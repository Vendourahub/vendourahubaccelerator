# 🚀 FIX THE ERRORS - COMPLETE SETUP GUIDE

## ❌ Current Error:
```
Could not find the table 'public.admin_users' in the schema cache
```

## ✅ Solution: Run the SQL Scripts

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### **STEP 1: Run Quick Setup Script** ⚡

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd](https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd)

2. Click **"SQL Editor"** in the left sidebar

3. Click **"New Query"**

4. Open the file `/QUICK_SETUP.sql` from this project

5. **Copy the ENTIRE contents** of that file

6. **Paste** into the Supabase SQL Editor

7. Click the **"RUN"** button (or press Cmd/Ctrl + Enter)

8. Wait for the success message: **"Success. No rows returned"**

9. Scroll to the bottom of the results - you should see a table listing 7 tables:
   ```
   admin_users
   admin_preferences
   admin_activity_logs
   intervention_resolutions
   notification_settings
   notification_templates
   system_settings
   ```

✅ **If you see these 7 tables, proceed to Step 2!**

---

### **STEP 2: Create Your First Admin User** 👤

#### **Part A: Create Auth User**

1. In Supabase Dashboard, go to **"Authentication"** → **"Users"**

2. Click **"Add User"** → **"Create New User"**

3. Fill in the form:
   - **Email**: `admin@vendoura.com` (or your preferred email)
   - **Password**: `YourSecurePassword123!` (choose a strong password)
   - ✅ Check **"Auto Confirm User"**

4. Click **"Create User"**

5. **IMPORTANT**: After the user is created, you'll see a User ID (UUID format)
   - It looks like: `a1b2c3d4-e5f6-7890-1234-567890abcdef`
   - **Copy this ID!** You'll need it in the next step

#### **Part B: Link Admin Record**

1. Go back to **"SQL Editor"** in Supabase

2. Open the file `/CREATE_FIRST_ADMIN.sql` from this project

3. Find ALL occurrences of `'PASTE_USER_ID_HERE'` (there are 4 of them)

4. Replace each one with your copied User ID from Part A

   **Before:**
   ```sql
   'PASTE_USER_ID_HERE'::uuid
   ```

   **After:**
   ```sql
   'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid
   ```

5. Also replace the email and name if you used different values:
   ```sql
   'admin@vendoura.com',     -- Your email here
   'Super Administrator',     -- Your name here
   ```

6. **Copy the entire modified script**

7. **Paste** into Supabase SQL Editor (new query)

8. Click **"RUN"**

9. You should see your admin user details at the bottom!

✅ **If you see your admin user info, you're done!**

---

### **STEP 3: Test the Login** 🎉

1. Go to your app: [https://vendoura.com/admin/profile](https://vendoura.com/admin/profile)

2. Log in with:
   - **Email**: The email you used in Step 2
   - **Password**: The password you set in Step 2

3. You should see the Admin Profile page load successfully! 🎊

---

## 🔧 Troubleshooting

### Problem: "Success. No rows returned" but no table list appears

**Solution:** Scroll down in the SQL Editor results panel. The table list appears at the very bottom after all the CREATE statements.

---

### Problem: "duplicate key value violates unique constraint"

**Solution:** The user already exists. Use this alternative query instead:

```sql
-- Update existing user
UPDATE public.admin_users
SET 
  role = 'super_admin',
  status = 'active'
WHERE email = 'admin@vendoura.com';

-- Update metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'user_type', 'admin',
  'admin_role', 'super_admin',
  'name', 'Super Administrator'
)
WHERE email = 'admin@vendoura.com';
```

---

### Problem: "new row violates row-level security policy"

**Solution:** Temporarily disable RLS to create the first admin:

```sql
-- Disable RLS
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Insert your admin (run the INSERT from CREATE_FIRST_ADMIN.sql)
INSERT INTO public.admin_users (user_id, email, name, role, status)
VALUES ('YOUR_USER_ID'::uuid, 'admin@vendoura.com', 'Admin', 'super_admin', 'active');

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

---

### Problem: Still seeing "table not found" after running QUICK_SETUP.sql

**Solution:** Make sure you ran the ENTIRE script. Check that all 7 tables exist:

```sql
-- Run this query to check
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'admin_%' 
  OR table_name LIKE 'notification_%'
  OR table_name = 'system_settings'
ORDER BY table_name;
```

---

### Problem: Can't log in after creating admin user

**Solution:** Check if user metadata was set correctly:

```sql
-- Verify metadata
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

---

## ✅ Success Checklist

- [ ] Opened Supabase Dashboard
- [ ] Ran `/QUICK_SETUP.sql` in SQL Editor
- [ ] Saw 7 tables created successfully
- [ ] Created auth user in Authentication → Users
- [ ] Copied the User ID
- [ ] Modified `/CREATE_FIRST_ADMIN.sql` with User ID
- [ ] Ran modified SQL in SQL Editor
- [ ] Saw admin user details in results
- [ ] Logged in successfully at `/admin/profile`
- [ ] Can see admin dashboard with data from database

---

## 🎯 What These Scripts Do

### QUICK_SETUP.sql creates:
1. ✅ **admin_users** - Admin accounts (super admins, mentors, observers)
2. ✅ **admin_preferences** - Admin notification preferences
3. ✅ **admin_activity_logs** - Audit trail of admin actions
4. ✅ **intervention_resolutions** - Track founder interventions
5. ✅ **system_settings** - Cohort program settings
6. ✅ **notification_settings** - Email/SMS/Push configuration
7. ✅ **notification_templates** - 6 default email templates

### CREATE_FIRST_ADMIN.sql creates:
- Your first super admin user
- Links auth.users to admin_users table
- Sets proper user metadata for admin access
- Creates default notification preferences

---

## 📞 Need Help?

If you're still having issues:

1. Check the browser console for errors (F12 → Console tab)
2. Check the Supabase logs (Dashboard → Logs)
3. Make sure you're using the correct project ID: `idhyjerrdrcaitfmbtjd`
4. Verify you're logged in to the correct Supabase project

Once you complete these steps, all errors should be resolved! 🎉
