-- ============================================
-- FIX: Add Missing Columns to system_settings
-- ============================================
-- Run this in Supabase SQL Editor
-- Project: knqbtdugvessaehgwwcg
-- ============================================

-- Add missing email configuration columns to system_settings
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS smtp_host TEXT,
ADD COLUMN IF NOT EXISTS smtp_port INTEGER DEFAULT 587,
ADD COLUMN IF NOT EXISTS smtp_username TEXT,
ADD COLUMN IF NOT EXISTS smtp_password TEXT,
ADD COLUMN IF NOT EXISTS from_email TEXT DEFAULT 'noreply@vendoura.com',
ADD COLUMN IF NOT EXISTS from_name TEXT DEFAULT 'Vendoura Hub';

-- Update existing row with default values if they're null
UPDATE public.system_settings
SET 
  from_email = COALESCE(from_email, 'noreply@vendoura.com'),
  from_name = COALESCE(from_name, 'Vendoura Hub'),
  smtp_port = COALESCE(smtp_port, 587)
WHERE id = 1;

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'system_settings' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- SUCCESS!
-- ============================================
-- The system_settings table now has:
-- - smtp_host
-- - smtp_port  
-- - smtp_username
-- - smtp_password
-- - from_email
-- - from_name
--
-- These are used by the Super Admin Control panel
-- for email configuration.
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ SYSTEM_SETTINGS TABLE UPDATED';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Added email configuration columns:';
  RAISE NOTICE '   - smtp_host';
  RAISE NOTICE '   - smtp_port';
  RAISE NOTICE '   - smtp_username';
  RAISE NOTICE '   - smtp_password';
  RAISE NOTICE '   - from_email (default: noreply@vendoura.com)';
  RAISE NOTICE '   - from_name (default: Vendoura Hub)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Super Admin Control panel will now work!';
  RAISE NOTICE '';
END $$;
