# 🔐 CREATE SUPER ADMIN - Emmanuel@vendoura.com

## **Quick Setup Guide**

### **Step 1: Create Auth User in Supabase Dashboard**

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users
   ```

2. **Click "Add User" button** (top right, green button)

3. **Fill in the form:**
   - **Email:** `emmanuel@vendoura.com`
   - **Password:** `Alome!28$..`
   - **Auto Confirm User:** ✅ CHECK THIS BOX (important!)
   - **Send user a magic link:** ❌ UNCHECK THIS

4. **Click "Create User"**

5. **Copy the User ID** that appears (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

### **Step 2: Run SQL Script to Make Them Super Admin**

After creating the auth user above, run this SQL script:

1. **Go to SQL Editor:**
   ```
   https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
   ```

2. **Copy and paste this entire script:**

```sql
-- ============================================
-- CREATE SUPER ADMIN: emmanuel@vendoura.com
-- ============================================

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'emmanuel@vendoura.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found! Create the user in Auth Dashboard first.';
  END IF;

  -- Check if already admin
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = v_user_id) THEN
    RAISE NOTICE 'User is already an admin. Updating to super_admin role...';
    
    UPDATE admin_users
    SET 
      role = 'super_admin',
      status = 'active',
      updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RAISE NOTICE '✅ Updated to Super Admin!';
  ELSE
    -- Insert new admin user
    INSERT INTO admin_users (
      user_id,
      email,
      name,
      role,
      cohort_access,
      status,
      two_factor_enabled
    ) VALUES (
      v_user_id,
      'emmanuel@vendoura.com',
      'Alome Emmanuel',
      'super_admin',
      ARRAY['all'],
      'active',
      false
    );
    
    RAISE NOTICE '✅ Super Admin created successfully!';
  END IF;

  -- Create founder profile if needed (for testing/access)
  IF NOT EXISTS (SELECT 1 FROM founder_profiles WHERE user_id = v_user_id) THEN
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
      is_locked
    ) VALUES (
      v_user_id,
      'emmanuel@vendoura.com',
      'Alome Emmanuel',
      'Vendoura Hub',
      0,
      0,
      1,
      1,
      'active',
      0,
      'active',
      false
    );
    
    RAISE NOTICE '✅ Founder profile created for admin access!';
  END IF;

  -- Display final info
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '✅ SUPER ADMIN SETUP COMPLETE!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Email: emmanuel@vendoura.com';
  RAISE NOTICE 'Name: Alome Emmanuel';
  RAISE NOTICE 'Role: Super Admin';
  RAISE NOTICE 'User ID: %', v_user_id;
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Login at: https://vendoura.com/admin';
  RAISE NOTICE '===========================================';
END $$;
```

3. **Click RUN**

4. **You should see:**
   ```
   ✅ Super Admin created successfully!
   ✅ Founder profile created for admin access!
   ✅ SUPER ADMIN SETUP COMPLETE!
   ```

---

### **Step 3: Test Login**

1. **Go to Admin Login:**
   ```
   https://vendoura.com/admin
   ```

2. **Login with:**
   - **Email:** `emmanuel@vendoura.com`
   - **Password:** `Alome!28$..`

3. **You should have full Super Admin access!** 🎉

---

## **Alternative: Use Google OAuth**

If you want to use Google Sign-In instead:

1. **Go to:**
   ```
   https://vendoura.com/login
   ```

2. **Click "Continue with Google"**

3. **Sign in with your Google account**

4. **Then run this SQL to make your Google account a Super Admin:**

```sql
-- Replace 'your-google-email@gmail.com' with your actual email
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'your-google-email@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found! Sign in with Google first.';
  END IF;

  INSERT INTO admin_users (
    user_id,
    email,
    name,
    role,
    cohort_access,
    status,
    two_factor_enabled
  ) VALUES (
    v_user_id,
    'your-google-email@gmail.com',
    'Your Name',
    'super_admin',
    ARRAY['all'],
    'active',
    false
  )
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'super_admin';

  RAISE NOTICE '✅ Google account is now Super Admin!';
END $$;
```

---

## **Troubleshooting**

### ❌ "User not found" error
**Solution:** You haven't created the auth user yet. Go to Step 1 above.

### ❌ "duplicate key value violates unique constraint"
**Solution:** User is already an admin. The script will update their role instead.

### ❌ "relation 'admin_users' does not exist"
**Solution:** Run `/QUICK_FIX.sql` first to create database tables.

### ❌ Can't login after creating user
**Solution:** Make sure you checked "Auto Confirm User" when creating the auth user.

---

## **What This Gives You:**

✅ Full Super Admin access  
✅ Can manage all founders  
✅ Can view/edit all settings  
✅ Can add/remove other admins  
✅ Can manage cohort program  
✅ Can configure payment gateways  
✅ Can set up email/SMTP  
✅ Can manage waitlist  
✅ Can create interventions  
✅ Can export all data  

---

## **Security Notes:**

🔐 **Password Strength:** Your password `Alome!28$..` is strong (15+ characters, special chars, numbers)  
🔐 **Super Admin Role:** Has unrestricted access - protect this account  
🔐 **Two-Factor:** Consider enabling 2FA in Supabase for extra security  
🔐 **Email Access:** Make sure only you can access emmanuel@vendoura.com  

---

## **Next Steps After Login:**

1. ✅ Run database check: `/admin/databasecheck`
2. ✅ Configure settings: `/admin/superadmin` → Settings tab
3. ✅ Add payment keys (Paystack/Flutterwave)
4. ✅ Set up email/SMTP
5. ✅ Add other admin users if needed
6. ✅ Create notification templates

---

**Need Help?** Check `/DATABASE_SETUP_INSTRUCTIONS.md` for full database setup guide.
