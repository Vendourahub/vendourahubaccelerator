-- Add profile photo support for admin dashboards
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;