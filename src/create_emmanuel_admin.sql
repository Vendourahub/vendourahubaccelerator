-- ============================================
-- CREATE SUPER ADMIN: emmanuel@vendoura.com
-- ============================================
-- INSTRUCTIONS:
-- 1. First create the auth user in Supabase Dashboard:
--    https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users
--    Email: emmanuel@vendoura.com
--    Password: Alome!28$..
--    ✅ Check "Auto Confirm User"
-- 2. Then run this SQL script
-- ============================================

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'emmanuel@vendoura.com';

  -- Check if user exists
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '
❌ USER NOT FOUND!

You need to create the auth user first:
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users
2. Click "Add User"
3. Email: emmanuel@vendoura.com
4. Password: Alome!28$..
5. ✅ CHECK "Auto Confirm User"
6. Click "Create User"
7. Then run this script again
';
  END IF;

  RAISE NOTICE '✅ Found user: % (ID: %)', 'emmanuel@vendoura.com', v_user_id;

  -- Check if already admin
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = v_user_id) THEN
    RAISE NOTICE '⚠️  User is already an admin. Updating to super_admin role...';
    
    UPDATE admin_users
    SET 
      role = 'super_admin',
      name = 'Alome Emmanuel',
      status = 'active',
      cohort_access = ARRAY['all'],
      updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RAISE NOTICE '✅ Updated to Super Admin role!';
  ELSE
    -- Insert new admin user
    INSERT INTO admin_users (
      user_id,
      email,
      name,
      role,
      cohort_access,
      status,
      two_factor_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'emmanuel@vendoura.com',
      'Alome Emmanuel',
      'super_admin',
      ARRAY['all'],
      'active',
      false,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Super Admin created successfully!';
  END IF;

  -- Create founder profile if needed (allows admin to access founder features)
  IF NOT EXISTS (SELECT 1 FROM founder_profiles WHERE user_id = v_user_id) THEN
    RAISE NOTICE '📝 Creating founder profile for admin dashboard access...';
    
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
      v_user_id,
      'emmanuel@vendoura.com',
      'Alome Emmanuel',
      'Vendoura Hub - Admin',
      0,
      0,
      1,
      1,
      'active',
      0,
      'active',
      false,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Founder profile created!';
  ELSE
    RAISE NOTICE '✅ Founder profile already exists!';
  END IF;

  -- Display final info
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🎉 SUPER ADMIN SETUP COMPLETE!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '';
  RAISE NOTICE '👤 Admin Details:';
  RAISE NOTICE '   Email: emmanuel@vendoura.com';
  RAISE NOTICE '   Name: Alome Emmanuel';
  RAISE NOTICE '   Role: Super Admin (Full Access)';
  RAISE NOTICE '   User ID: %', v_user_id;
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Login Credentials:';
  RAISE NOTICE '   Email: emmanuel@vendoura.com';
  RAISE NOTICE '   Password: Alome!28$..';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Login URLs:';
  RAISE NOTICE '   Admin Portal: https://vendoura.com/admin';
  RAISE NOTICE '   Direct Login: https://vendoura.com/login';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Permissions Granted:';
  RAISE NOTICE '   • Full platform access';
  RAISE NOTICE '   • Manage all founders';
  RAISE NOTICE '   • Configure system settings';
  RAISE NOTICE '   • Manage payment gateways';
  RAISE NOTICE '   • Configure email/SMTP';
  RAISE NOTICE '   • Add/remove admins';
  RAISE NOTICE '   • Manage cohort program';
  RAISE NOTICE '   • View all analytics';
  RAISE NOTICE '   • Create interventions';
  RAISE NOTICE '   • Export all data';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next Steps:';
  RAISE NOTICE '   1. Login at https://vendoura.com/admin';
  RAISE NOTICE '   2. Check database: /admin/databasecheck';
  RAISE NOTICE '   3. Configure settings: /admin/superadmin';
  RAISE NOTICE '   4. Add payment keys (Paystack/Flutterwave)';
  RAISE NOTICE '   5. Set up email/SMTP configuration';
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '';
    RAISE NOTICE '❌ ERROR OCCURRED:';
    RAISE NOTICE '%', SQLERRM;
    RAISE NOTICE '';
    RAISE NOTICE '💡 Common Issues:';
    RAISE NOTICE '   1. User not created in Auth Dashboard yet';
    RAISE NOTICE '   2. admin_users table does not exist (run QUICK_FIX.sql first)';
    RAISE NOTICE '   3. Database connection issue';
    RAISE NOTICE '';
    RAISE;
END $$;
