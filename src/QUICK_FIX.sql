-- ============================================
-- VENDOURA HUB - QUICK DATABASE SETUP
-- ============================================
-- Run this in Supabase SQL Editor to create all required tables
-- Project: idhyjerrdrcaitfmbtjd

-- ============================================
-- 1. SYSTEM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  cohort_program_active BOOLEAN DEFAULT true,
  current_cohort_name TEXT DEFAULT 'Cohort 3 - Feb 2026',
  current_cohort_week INTEGER DEFAULT 4,
  
  -- Payment Settings
  paystack_public_key TEXT,
  paystack_secret_key TEXT,
  flutterwave_public_key TEXT,
  flutterwave_secret_key TEXT,
  
  -- Email Settings
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_username TEXT,
  smtp_password TEXT,
  from_email TEXT DEFAULT 'noreply@vendoura.com',
  from_name TEXT DEFAULT 'Vendoura Hub',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Insert default settings
INSERT INTO system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. FOUNDER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  
  -- Business Info
  business_name TEXT NOT NULL,
  business_model TEXT,
  business_description TEXT,
  industry TEXT,
  
  -- Progress Tracking
  current_stage INTEGER DEFAULT 1,
  current_week INTEGER DEFAULT 1,
  consecutive_misses INTEGER DEFAULT 0,
  
  -- Revenue Tracking
  baseline_revenue_30d NUMERIC DEFAULT 0,
  baseline_revenue_90d NUMERIC DEFAULT 0,
  
  -- Account Status
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'locked', 'suspended', 'completed')),
  is_locked BOOLEAN DEFAULT false,
  lock_reason TEXT,
  
  -- Subscription
  subscription_status TEXT DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'expired')),
  subscription_expiry TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_founder_profiles_user_id ON founder_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_email ON founder_profiles(email);

-- ============================================
-- 3. WAITLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- ============================================
-- 4. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'mentor', 'observer')),
  cohort_access TEXT[] DEFAULT ARRAY['all'],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  two_factor_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- ============================================
-- 5. WEEKLY COMMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  activities TEXT NOT NULL,
  goals TEXT,
  evidence_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(founder_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_weekly_commits_founder ON weekly_commits(founder_id);

-- ============================================
-- 6. WEEKLY REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  revenue NUMERIC NOT NULL DEFAULT 0,
  wins TEXT,
  challenges TEXT,
  evidence_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(founder_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_weekly_reports_founder ON weekly_reports(founder_id);

-- ============================================
-- 7. NOTIFICATION TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. INTERVENTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  
  reason TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in-progress', 'resolved', 'escalated')) DEFAULT 'pending',
  
  -- Details
  missed_weeks INTEGER DEFAULT 0,
  revenue_baseline NUMERIC DEFAULT 0,
  current_revenue NUMERIC DEFAULT 0,
  
  -- Actions
  admin_notes TEXT,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES admin_users(id),
  
  -- Timestamps
  flagged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interventions_founder ON interventions(founder_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);

-- ============================================
-- 9. INTERVENTION ACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS intervention_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID REFERENCES interventions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'message_sent', 'call_scheduled', 'meeting_held', 'warning_issued'
  action_details TEXT,
  performed_by UUID REFERENCES admin_users(id),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intervention_actions_intervention ON intervention_actions(intervention_id);

-- ============================================
-- 10. EVIDENCE SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS evidence_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  submission_type TEXT CHECK (submission_type IN ('commit', 'report', 'adjustment')) NOT NULL,
  week_number INTEGER NOT NULL,
  
  -- Evidence Details
  evidence_type TEXT, -- 'screenshot', 'document', 'link', 'video'
  evidence_url TEXT,
  evidence_description TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES admin_users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_founder ON evidence_submissions(founder_id);
CREATE INDEX IF NOT EXISTS idx_evidence_week ON evidence_submissions(week_number);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - Allow authenticated users to access
-- (You can refine these based on your security needs)
-- ============================================

-- System Settings - Read only for authenticated
CREATE POLICY "Allow authenticated read system_settings" ON system_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update system_settings" ON system_settings FOR UPDATE TO authenticated USING (true);

-- Founder Profiles - Users can read their own, admins can read all
CREATE POLICY "Founders can view own profile" ON founder_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Founders can update own profile" ON founder_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert founder_profiles" ON founder_profiles FOR INSERT TO authenticated WITH CHECK (true);

-- Waitlist - Public insert, authenticated read
CREATE POLICY "Allow public insert waitlist" ON waitlist FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated read waitlist" ON waitlist FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete waitlist" ON waitlist FOR DELETE TO authenticated USING (true);

-- Admin Users - Authenticated can read
CREATE POLICY "Allow authenticated read admin_users" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert admin_users" ON admin_users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update admin_users" ON admin_users FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete admin_users" ON admin_users FOR DELETE TO authenticated USING (true);

-- Weekly Commits - Founders can CRUD their own
CREATE POLICY "Founders can manage own commits" ON weekly_commits FOR ALL TO authenticated USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));

-- Weekly Reports - Founders can CRUD their own
CREATE POLICY "Founders can manage own reports" ON weekly_reports FOR ALL TO authenticated USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));

-- Notification Templates
CREATE POLICY "Allow authenticated read templates" ON notification_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage templates" ON notification_templates FOR ALL TO authenticated USING (true);

-- Interventions
CREATE POLICY "Allow authenticated manage interventions" ON interventions FOR ALL TO authenticated USING (true);

-- Intervention Actions
CREATE POLICY "Allow authenticated manage actions" ON intervention_actions FOR ALL TO authenticated USING (true);

-- Evidence Submissions
CREATE POLICY "Founders can manage own evidence" ON evidence_submissions FOR ALL TO authenticated USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ SUCCESS! All tables created successfully!';
  RAISE NOTICE '📊 Tables created:';
  RAISE NOTICE '  - system_settings';
  RAISE NOTICE '  - founder_profiles';
  RAISE NOTICE '  - waitlist';
  RAISE NOTICE '  - admin_users';
  RAISE NOTICE '  - weekly_commits';
  RAISE NOTICE '  - weekly_reports';
  RAISE NOTICE '  - notification_templates';
  RAISE NOTICE '  - interventions';
  RAISE NOTICE '  - intervention_actions';
  RAISE NOTICE '  - evidence_submissions';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now refresh the Super Admin Control page!';
END $$;
