-- Schema sync for founder_profiles (2026-02-19)
-- Adds columns used by the app but missing in DB

ALTER TABLE founder_profiles
  ADD COLUMN IF NOT EXISTS business_model TEXT,
  ADD COLUMN IF NOT EXISTS product_description TEXT,
  ADD COLUMN IF NOT EXISTS customer_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pricing TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS missed_weeks INTEGER DEFAULT 0;
