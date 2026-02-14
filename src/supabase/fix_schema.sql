-- Fix Schema: Make fields nullable + add onboarding columns
-- Run this in Supabase SQL Editor

-- 1. Make name and business_name nullable (collected during onboarding)
ALTER TABLE founder_profiles 
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN business_name DROP NOT NULL;

-- 2. Add missing onboarding columns
ALTER TABLE founder_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS customer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pricing TEXT;

-- 3. Copy existing name to full_name where it exists
UPDATE founder_profiles 
SET full_name = name 
WHERE full_name IS NULL AND name IS NOT NULL;

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_founder_profiles_onboarding 
ON founder_profiles(onboarding_complete);

-- 5. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'founder_profiles'
AND column_name IN ('name', 'business_name', 'full_name', 'onboarding_complete', 'product_description', 'customer_count', 'pricing')
ORDER BY ordinal_position;
