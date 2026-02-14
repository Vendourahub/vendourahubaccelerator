-- Migration: Add missing onboarding columns to founder_profiles
-- Run this in Supabase SQL Editor

-- Add missing columns for onboarding
ALTER TABLE founder_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS customer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pricing TEXT;

-- Update existing name column to full_name for consistency
UPDATE founder_profiles 
SET full_name = name 
WHERE full_name IS NULL;

-- Add index for onboarding_complete
CREATE INDEX IF NOT EXISTS idx_founder_profiles_onboarding ON founder_profiles(onboarding_complete);
