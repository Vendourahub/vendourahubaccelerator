-- ============================================
-- VENDOURA HUB - CREATE TEST USERS
-- ============================================
-- Run this in Supabase SQL Editor to create test accounts
-- Project: knqbtdugvessaehgwwcg
-- ============================================

-- 1. Create Super Admin User
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Insert admin into auth.users
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
  ON CONFLICT (email) DO UPDATE 
  SET encrypted_password = crypt('VendouraAdmin2026!', gen_salt('bf')),
      email_confirmed_at = NOW()
  RETURNING id INTO admin_user_id;

  -- Create admin_users record
  INSERT INTO admin_users (user_id, email, name, role, status, cohort_access)
  VALUES (
    admin_user_id,
    'admin@vendoura.com',
    'Super Admin',
    'super_admin',
    'active',
    ARRAY['all']
  )
  ON CONFLICT (user_id) DO UPDATE 
  SET status = 'active', role = 'super_admin';

  RAISE NOTICE '✅ Super Admin created/updated';
END $$;

-- 2. Create Test Founder
DO $$
DECLARE
  founder_user_id UUID;
  founder_profile_id UUID;
BEGIN
  -- Insert founder into auth.users
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
  ON CONFLICT (email) DO UPDATE 
  SET encrypted_password = crypt('Test1234!', gen_salt('bf')),
      email_confirmed_at = NOW()
  RETURNING id INTO founder_user_id;

  -- Create founder_profiles record
  INSERT INTO founder_profiles (
    user_id,
    email,
    name,
    business_name,
    business_description,
    baseline_revenue_30d,
    baseline_revenue_90d,
    current_stage,
    current_week,
    account_status,
    consecutive_misses,
    subscription_status,
    is_locked,
    profile_complete,
    created_at,
    updated_at
  ) VALUES (
    founder_user_id,
    'founder@test.com',
    'Test Founder',
    'Test Business Inc',
    'A test business for development',
    50000,
    120000,
    1,
    1,
    'active',
    0,
    'trial',
    false,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE 
  SET account_status = 'active', is_locked = false
  RETURNING id INTO founder_profile_id;

  -- Create stage progress (5 stages)
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
    ON CONFLICT (user_id, stage_number) DO UPDATE
    SET status = CASE WHEN i = 1 THEN 'in_progress' ELSE stage_progress.status END;
  END LOOP;

  RAISE NOTICE '✅ Test Founder created/updated';
END $$;

-- 3. Create Additional Test Founders (for testing cohort features)
DO $$
DECLARE
  founder_user_id UUID;
  test_emails TEXT[] := ARRAY[
    'founder2@test.com',
    'founder3@test.com',
    'founder4@test.com'
  ];
  test_names TEXT[] := ARRAY[
    'Sarah Johnson',
    'Michael Chen',
    'Amina Okafor'
  ];
  test_businesses TEXT[] := ARRAY[
    'SaaS Startup Co',
    'E-commerce Plus',
    'Consulting Services Ltd'
  ];
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(test_emails, 1) LOOP
    -- Insert into auth.users
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
      test_emails[i],
      crypt('Test1234!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('name', test_names[i], 'user_type', 'founder'),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    ON CONFLICT (email) DO UPDATE 
    SET email_confirmed_at = NOW()
    RETURNING id INTO founder_user_id;

    -- Create founder_profiles
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
      profile_complete,
      created_at,
      updated_at
    ) VALUES (
      founder_user_id,
      test_emails[i],
      test_names[i],
      test_businesses[i],
      (RANDOM() * 100000 + 20000)::INTEGER,
      (RANDOM() * 300000 + 50000)::INTEGER,
      1,
      1,
      'active',
      0,
      'trial',
      false,
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Create stage progress
    FOR j IN 1..5 LOOP
      INSERT INTO stage_progress (
        user_id,
        stage_number,
        status,
        unlocked_at,
        requirements_met
      ) VALUES (
        founder_user_id,
        j,
        CASE WHEN j = 1 THEN 'in_progress' ELSE 'locked' END,
        CASE WHEN j = 1 THEN NOW() ELSE NULL END,
        false
      )
      ON CONFLICT (user_id, stage_number) DO NOTHING;
    END LOOP;
  END LOOP;

  RAISE NOTICE '✅ Additional test founders created';
END $$;

-- 4. Verify All Users Created
SELECT 
  '🔐 ADMIN' as user_type,
  u.email,
  a.role,
  a.status,
  'Password: VendouraAdmin2026!' as credentials
FROM auth.users u
JOIN admin_users a ON u.id = a.user_id
WHERE u.email = 'admin@vendoura.com'

UNION ALL

SELECT 
  '👤 FOUNDER' as user_type,
  u.email,
  f.business_name as role,
  f.account_status as status,
  'Password: Test1234!' as credentials
FROM auth.users u
JOIN founder_profiles f ON u.id = f.user_id
WHERE u.email IN ('founder@test.com', 'founder2@test.com', 'founder3@test.com', 'founder4@test.com')
ORDER BY user_type, email;

-- ============================================
-- SUCCESS! Test users created.
-- ============================================
-- 
-- 🔐 ADMIN LOGIN:
--    URL: /admin
--    Email: admin@vendoura.com
--    Password: VendouraAdmin2026!
--
-- 👤 FOUNDER LOGIN:
--    URL: /login
--    Email: founder@test.com (or founder2/3/4@test.com)
--    Password: Test1234!
--
-- ============================================
-- NEXT STEPS:
-- 1. Go to http://localhost:5173/admin
-- 2. Login with admin credentials
-- 3. Verify you can see test founders
-- 4. Test founder login at /login
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ TEST USERS CREATED SUCCESSFULLY!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 ADMIN: admin@vendoura.com / VendouraAdmin2026!';
  RAISE NOTICE '👤 FOUNDER: founder@test.com / Test1234!';
  RAISE NOTICE '👤 FOUNDER: founder2@test.com / Test1234!';
  RAISE NOTICE '👤 FOUNDER: founder3@test.com / Test1234!';
  RAISE NOTICE '👤 FOUNDER: founder4@test.com / Test1234!';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Admin URL: /admin';
  RAISE NOTICE '🌐 Founder URL: /login';
  RAISE NOTICE '';
END $$;
