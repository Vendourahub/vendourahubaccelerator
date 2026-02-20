-- Add profile_photo_url column to founder_profiles table
-- Run this in your Supabase SQL Editor

-- Add the column if it doesn't exist
ALTER TABLE founder_profiles
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN founder_profiles.profile_photo_url IS 'URL to the founder''s profile photo stored in Supabase Storage';
