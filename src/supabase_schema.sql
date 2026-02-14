-- Vendoura Hub Database Schema
-- Complete schema for all features including super admin control

-- ============================================
-- SYSTEM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  cohort_program_active BOOLEAN NOT NULL DEFAULT true,
  current_cohort_name TEXT NOT NULL DEFAULT 'Cohort 1',
  current_cohort_week INT NOT NULL DEFAULT 1,
  waitlist_email_template TEXT,
  signup_redirect_url TEXT DEFAULT '/onboarding',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO public.system_settings (id, cohort_program_active, current_cohort_name, current_cohort_week)
VALUES (1, true, 'Cohort 3 - Feb 2026', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- WAITLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  notes TEXT,
  notified BOOLEAN NOT NULL DEFAULT false,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_notified_idx ON public.waitlist(notified);

-- ============================================
-- FOUNDER PROFILES TABLE (Already exists, but ensure schema)
-- ============================================
CREATE TABLE IF NOT EXISTS public.founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_model TEXT,
  cohort_id UUID,
  baseline_revenue_30d BIGINT NOT NULL DEFAULT 0,
  baseline_revenue_90d BIGINT NOT NULL DEFAULT 0,
  current_stage INT NOT NULL DEFAULT 1,
  current_week INT NOT NULL DEFAULT 1,
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'under_review', 'removed')),
  consecutive_misses INT NOT NULL DEFAULT 0,
  subscription_status TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'paid', 'expired', 'cancelled')),
  subscription_expiry TIMESTAMPTZ,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  lock_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS founder_profiles_user_id_idx ON public.founder_profiles(user_id);
CREATE INDEX IF NOT EXISTS founder_profiles_email_idx ON public.founder_profiles(email);
CREATE INDEX IF NOT EXISTS founder_profiles_account_status_idx ON public.founder_profiles(account_status);

-- ============================================
-- WEEKLY COMMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  action_description TEXT NOT NULL,
  target_revenue BIGINT NOT NULL,
  completion_date TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deadline TIMESTAMPTZ NOT NULL,
  is_late BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'missed')),
  UNIQUE(user_id, week_number)
);

CREATE INDEX IF NOT EXISTS weekly_commits_user_id_idx ON public.weekly_commits(user_id);
CREATE INDEX IF NOT EXISTS weekly_commits_week_idx ON public.weekly_commits(week_number);

-- ============================================
-- WEEKLY REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  commit_id UUID REFERENCES public.weekly_commits(id) ON DELETE SET NULL,
  revenue_generated BIGINT NOT NULL,
  hours_spent DECIMAL(10,2) NOT NULL,
  narrative TEXT NOT NULL,
  evidence_urls TEXT[],
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deadline TIMESTAMPTZ NOT NULL,
  is_late BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  dollar_per_hour DECIMAL(10,2),
  win_rate DECIMAL(5,2),
  rejection_reason TEXT,
  UNIQUE(user_id, week_number)
);

CREATE INDEX IF NOT EXISTS weekly_reports_user_id_idx ON public.weekly_reports(user_id);
CREATE INDEX IF NOT EXISTS weekly_reports_status_idx ON public.weekly_reports(status);

-- ============================================
-- STAGE PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.stage_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_number INT NOT NULL CHECK (stage_number BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'in_progress', 'complete')),
  unlocked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  requirements_met BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, stage_number)
);

CREATE INDEX IF NOT EXISTS stage_progress_user_id_idx ON public.stage_progress(user_id);

-- ============================================
-- MENTOR NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mentor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mentor_notes_founder_id_idx ON public.mentor_notes(founder_id);
CREATE INDEX IF NOT EXISTS mentor_notes_mentor_id_idx ON public.mentor_notes(mentor_id);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_type_idx ON public.audit_logs(action_type);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- System Settings: Read by all, write by super admins only
CREATE POLICY "Anyone can view system settings"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can update system settings"
  ON public.system_settings FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin'
  );

-- Waitlist: Read/Write by admins only
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Admins can insert to waitlist"
  ON public.waitlist FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Anyone can join waitlist (public signup)"
  ON public.waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Founder Profiles: Founders can read their own, admins can read all
CREATE POLICY "Founders can view own profile"
  ON public.founder_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Founders can update own profile"
  ON public.founder_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update any profile"
  ON public.founder_profiles FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "System can create profiles"
  ON public.founder_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Weekly Commits: Founders own data, admins can read all
CREATE POLICY "Founders can view own commits"
  ON public.weekly_commits FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Founders can create own commits"
  ON public.weekly_commits FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Weekly Reports: Founders own data, admins can read all
CREATE POLICY "Founders can view own reports"
  ON public.weekly_reports FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Founders can create own reports"
  ON public.weekly_reports FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update reports"
  ON public.weekly_reports FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- Stage Progress: Founders own data, admins can read all
CREATE POLICY "Founders can view own progress"
  ON public.stage_progress FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

-- Mentor Notes: Read by founder and admins, write by admins only
CREATE POLICY "Founders and admins can view notes"
  ON public.mentor_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_profiles
      WHERE id = mentor_notes.founder_id AND user_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Admins can create notes"
  ON public.mentor_notes FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- Audit Logs: Admins only
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "System can create audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_founder_profiles_updated_at
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_notes_updated_at
  BEFORE UPDATE ON public.mentor_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE ON public.system_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.waitlist TO authenticated;
GRANT ALL ON public.founder_profiles TO authenticated;
GRANT ALL ON public.weekly_commits TO authenticated;
GRANT ALL ON public.weekly_reports TO authenticated;
GRANT ALL ON public.stage_progress TO authenticated;
GRANT ALL ON public.mentor_notes TO authenticated;
GRANT ALL ON public.audit_logs TO authenticated;

-- Grant anon users access to waitlist
GRANT INSERT ON public.waitlist TO anon;

COMMENT ON TABLE public.system_settings IS 'Global system configuration including cohort program status';
COMMENT ON TABLE public.waitlist IS 'Users waiting to join when cohort program is inactive';
COMMENT ON TABLE public.founder_profiles IS 'Complete profile data for all founders';
COMMENT ON TABLE public.weekly_commits IS 'Weekly commitments made by founders';
COMMENT ON TABLE public.weekly_reports IS 'Weekly execution reports with evidence';
COMMENT ON TABLE public.stage_progress IS 'Stage unlocking and completion tracking';
COMMENT ON TABLE public.mentor_notes IS 'Private notes from mentors about founders';
COMMENT ON TABLE public.audit_logs IS 'System-wide audit trail for all actions';

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('trial', 'monthly', 'cohort')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMPTZ NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_reference TEXT,
  auto_renew BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_expiry_date_idx ON public.subscriptions(expiry_date);

-- ============================================
-- REVENUE TACTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.revenue_tactics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  tactic_name TEXT NOT NULL,
  revenue_generated NUMERIC NOT NULL DEFAULT 0,
  hours_spent NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS revenue_tactics_user_id_idx ON public.revenue_tactics(user_id);
CREATE INDEX IF NOT EXISTS revenue_tactics_week_number_idx ON public.revenue_tactics(week_number);
CREATE INDEX IF NOT EXISTS revenue_tactics_tactic_name_idx ON public.revenue_tactics(tactic_name);

-- ============================================
-- DAILY SNAPSHOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('monday_9am', 'friday_6pm', 'sunday_eod')),
  snapshot_date DATE NOT NULL,
  commits_submitted INTEGER NOT NULL DEFAULT 0,
  reports_submitted INTEGER NOT NULL DEFAULT 0,
  locks_triggered INTEGER NOT NULL DEFAULT 0,
  notifications_sent INTEGER NOT NULL DEFAULT 0,
  active_founders INTEGER NOT NULL DEFAULT 0,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_type, snapshot_date)
);

CREATE INDEX IF NOT EXISTS daily_snapshots_date_idx ON public.daily_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS daily_snapshots_type_idx ON public.daily_snapshots(snapshot_type);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'observer' CHECK (role IN ('super_admin', 'mentor', 'observer')),
  cohort_access TEXT[] NOT NULL DEFAULT ARRAY['all']::TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login TIMESTAMPTZ,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_method TEXT CHECK (two_factor_method IN ('app', 'sms', NULL)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for admin_users
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS admin_users_role_idx ON public.admin_users(role);

-- RLS Policies for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Super admins can view all admin users
CREATE POLICY "Super admins can view all admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Admins can view their own profile
CREATE POLICY "Admins can view own profile"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Super admins can update admin users
CREATE POLICY "Super admins can update admin users"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Admins can update their own last_login
CREATE POLICY "Admins can update own last_login"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Super admins can insert new admin users
CREATE POLICY "Super admins can insert admin users"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Super admins can delete admin users
CREATE POLICY "Super admins can delete admin users"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

COMMENT ON TABLE public.admin_users IS 'Admin users with role-based access control';