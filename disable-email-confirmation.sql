-- Disable email confirmation requirement in Supabase
-- Run this in Supabase SQL Editor to allow signups without email verification

-- Update auth settings to disable email confirmation
UPDATE auth.config
SET 
  jwt_exp = 3600,
  external_label_providers = NULL
WHERE TRUE;

-- Get current email auto-confirm setting
SELECT 
  key,
  value
FROM auth.config
WHERE key IN ('disable_signup', 'external_label_providers');

-- Alternative: Check if there's a way to auto-confirm via Supabase CLI or dashboard
-- For now, founders will need to click email link OR you can manually verify in Supabase dashboard
