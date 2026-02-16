-- Vendoura Hub Accelerator - Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- FOUNDER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS founder_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  business_description TEXT,
  business_stage TEXT,
  revenue TEXT,
  phone TEXT,
  country TEXT,
  baseline_revenue_30d NUMERIC DEFAULT 0,
  baseline_revenue_90d NUMERIC DEFAULT 0,
  current_stage INTEGER DEFAULT 1,
  current_week INTEGER DEFAULT 1,
  consecutive_misses INTEGER DEFAULT 0,
  cohort_id UUID,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  is_locked BOOLEAN DEFAULT false,
  lock_reason TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  admin_role TEXT NOT NULL CHECK (admin_role IN ('super_admin', 'program_manager', 'mentor', 'observer', 'operations')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COHORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_stage TEXT,
  revenue TEXT,
  phone TEXT,
  country TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES admin_users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WEEKLY COMMITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS weekly_commits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  action_description TEXT NOT NULL,
  target_revenue NUMERIC NOT NULL,
  completion_date DATE NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'missed')),
  is_late BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WEEKLY REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  commit_id UUID REFERENCES weekly_commits(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  revenue_generated NUMERIC NOT NULL,
  hours_spent NUMERIC NOT NULL,
  narrative TEXT NOT NULL,
  evidence_urls TEXT[],
  deadline TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  is_late BOOLEAN DEFAULT false,
  dollar_per_hour NUMERIC GENERATED ALWAYS AS (CASE WHEN hours_spent > 0 THEN revenue_generated / hours_spent ELSE 0 END) STORED,
  win_rate NUMERIC,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO system_settings (key, value) VALUES
  ('applications_open', 'true'::jsonb),
  ('current_cohort_id', 'null'::jsonb),
  ('program_start_date', '"2026-01-01"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Founder Profiles Policies
CREATE POLICY "Founders can view own profile" ON founder_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Founders can update own profile" ON founder_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON founder_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update all profiles" ON founder_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Admin Users Policies
CREATE POLICY "Admins can view all admins" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Super admins can manage admins" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND admin_role = 'super_admin')
  );

-- Weekly Commits Policies
CREATE POLICY "Founders can view own commits" ON weekly_commits
  FOR SELECT USING (
    founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Founders can insert own commits" ON weekly_commits
  FOR INSERT WITH CHECK (
    founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all commits" ON weekly_commits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Weekly Reports Policies
CREATE POLICY "Founders can view own reports" ON weekly_reports
  FOR SELECT USING (
    founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Founders can insert own reports" ON weekly_reports
  FOR INSERT WITH CHECK (
    founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all reports" ON weekly_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update reports" ON weekly_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Applications - Public insert, admin view
CREATE POLICY "Anyone can submit applications" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view applications" ON applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update applications" ON applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Waitlist - Public insert
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view waitlist" ON waitlist
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- System Settings - Admin only
CREATE POLICY "Admins can view settings" ON system_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Super admins can update settings" ON system_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND admin_role = 'super_admin')
  );

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_founder_profiles_user_id ON founder_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_email ON founder_profiles(email);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_cohort_id ON founder_profiles(cohort_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_commits_founder_id ON weekly_commits(founder_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_founder_id ON weekly_reports(founder_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON founder_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- You can manually create users via Supabase Auth dashboard
-- Then link them to profiles using the user_id

COMMENT ON TABLE founder_profiles IS 'Stores founder information and program tracking';
COMMENT ON TABLE admin_users IS 'Admin accounts with role-based access';
COMMENT ON TABLE cohorts IS 'Program cohorts and their schedules';
COMMENT ON TABLE applications IS 'Founder applications to join the program';
COMMENT ON TABLE weekly_commits IS 'Weekly action commitments from founders';
COMMENT ON TABLE weekly_reports IS 'Weekly progress reports from founders';
COMMENT ON TABLE waitlist IS 'Email waitlist for program announcements';
COMMENT ON TABLE system_settings IS 'Global application settings';
