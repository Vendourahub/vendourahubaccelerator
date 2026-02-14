-- Vendoura Hub Database Schema
-- Execute this in Supabase SQL Editor to create all required tables

-- ============================================
-- FOUNDER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_model TEXT,
  cohort_id UUID,
  baseline_revenue_30d DECIMAL(12, 2) NOT NULL DEFAULT 0,
  baseline_revenue_90d DECIMAL(12, 2) NOT NULL DEFAULT 0,
  current_stage INTEGER NOT NULL DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 5),
  current_week INTEGER NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 12),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'under_review', 'removed')),
  consecutive_misses INTEGER NOT NULL DEFAULT 0,
  subscription_status TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'paid', 'expired', 'cancelled')),
  subscription_expiry TIMESTAMPTZ,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  lock_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for founder_profiles
CREATE INDEX IF NOT EXISTS idx_founder_profiles_user_id ON founder_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_email ON founder_profiles(email);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_cohort_id ON founder_profiles(cohort_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_account_status ON founder_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_is_locked ON founder_profiles(is_locked);

-- ============================================
-- WEEKLY COMMITS
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  action_description TEXT NOT NULL CHECK (length(action_description) >= 20),
  target_revenue DECIMAL(12, 2) NOT NULL CHECK (target_revenue > 0),
  completion_date DATE NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deadline TIMESTAMPTZ NOT NULL,
  is_late BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'missed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_number)
);

-- Indexes for weekly_commits
CREATE INDEX IF NOT EXISTS idx_weekly_commits_user_id ON weekly_commits(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_commits_week_number ON weekly_commits(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_commits_status ON weekly_commits(status);
CREATE INDEX IF NOT EXISTS idx_weekly_commits_submitted_at ON weekly_commits(submitted_at);

-- ============================================
-- WEEKLY REPORTS
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  commit_id UUID NOT NULL REFERENCES weekly_commits(id) ON DELETE CASCADE,
  revenue_generated DECIMAL(12, 2) NOT NULL CHECK (revenue_generated >= 0),
  hours_spent DECIMAL(6, 2) NOT NULL CHECK (hours_spent > 0),
  narrative TEXT NOT NULL CHECK (length(narrative) >= 50),
  evidence_urls TEXT[] NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deadline TIMESTAMPTZ NOT NULL,
  is_late BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  dollar_per_hour DECIMAL(12, 2),
  win_rate DECIMAL(5, 2),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_number),
  CONSTRAINT evidence_required CHECK (array_length(evidence_urls, 1) >= 1)
);

-- Indexes for weekly_reports
CREATE INDEX IF NOT EXISTS idx_weekly_reports_user_id ON weekly_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week_number ON weekly_reports(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_status ON weekly_reports(status);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_submitted_at ON weekly_reports(submitted_at);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_commit_id ON weekly_reports(commit_id);

-- ============================================
-- STAGE PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS stage_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'in_progress', 'complete')),
  requirements_met BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, stage_number)
);

-- Indexes for stage_progress
CREATE INDEX IF NOT EXISTS idx_stage_progress_user_id ON stage_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_stage_progress_stage_number ON stage_progress(stage_number);
CREATE INDEX IF NOT EXISTS idx_stage_progress_status ON stage_progress(status);

-- ============================================
-- MENTOR NOTES
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for mentor_notes
CREATE INDEX IF NOT EXISTS idx_mentor_notes_founder_id ON mentor_notes(founder_id);
CREATE INDEX IF NOT EXISTS idx_mentor_notes_mentor_id ON mentor_notes(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_notes_created_at ON mentor_notes(created_at);

-- ============================================
-- COHORTS
-- ============================================
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  current_week INTEGER NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 12),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for cohorts
CREATE INDEX IF NOT EXISTS idx_cohorts_status ON cohorts(status);
CREATE INDEX IF NOT EXISTS idx_cohorts_start_date ON cohorts(start_date);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- MENTOR NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('missed_commit', 'missed_report', 'late_submission', 'no_evidence', 'removal_review')),
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Indexes for mentor_notifications
CREATE INDEX IF NOT EXISTS idx_mentor_notifications_founder_id ON mentor_notifications(founder_id);
CREATE INDEX IF NOT EXISTS idx_mentor_notifications_type ON mentor_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_mentor_notifications_created_at ON mentor_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_mentor_notifications_read_at ON mentor_notifications(read_at);

-- ============================================
-- INTERVENTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for interventions
CREATE INDEX IF NOT EXISTS idx_interventions_founder_id ON interventions(founder_id);
CREATE INDEX IF NOT EXISTS idx_interventions_admin_id ON interventions(admin_id);
CREATE INDEX IF NOT EXISTS idx_interventions_scheduled_at ON interventions(scheduled_at);

-- ============================================
-- REVENUE SYSTEM DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_system_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  sections JSONB NOT NULL DEFAULT '{}',
  completion_percentage INTEGER NOT NULL DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for revenue_system_documents
CREATE INDEX IF NOT EXISTS idx_rsd_user_id ON revenue_system_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_rsd_completion ON revenue_system_documents(completion_percentage);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON founder_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stage_progress_updated_at BEFORE UPDATE ON stage_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_notes_updated_at BEFORE UPDATE ON mentor_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsd_updated_at BEFORE UPDATE ON revenue_system_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check and update late submissions
CREATE OR REPLACE FUNCTION check_late_submission()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_late = NEW.submitted_at > NEW.deadline;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for late submission checks
CREATE TRIGGER check_commit_late BEFORE INSERT ON weekly_commits
  FOR EACH ROW EXECUTE FUNCTION check_late_submission();

CREATE TRIGGER check_report_late BEFORE INSERT ON weekly_reports
  FOR EACH ROW EXECUTE FUNCTION check_late_submission();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_system_documents ENABLE ROW LEVEL SECURITY;

-- Policies for founder_profiles
CREATE POLICY "Founders can view own profile" ON founder_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Founders can update own profile" ON founder_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON founder_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON founder_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Policies for weekly_commits
CREATE POLICY "Founders can view own commits" ON weekly_commits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Founders can insert own commits" ON weekly_commits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all commits" ON weekly_commits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Policies for weekly_reports
CREATE POLICY "Founders can view own reports" ON weekly_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Founders can insert own reports" ON weekly_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reports" ON weekly_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

CREATE POLICY "Admins can update reports" ON weekly_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Policies for stage_progress
CREATE POLICY "Founders can view own stage progress" ON stage_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stage progress" ON stage_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

CREATE POLICY "Admins can update stage progress" ON stage_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Policies for mentor_notes
CREATE POLICY "Founders can view own notes" ON mentor_notes
  FOR SELECT USING (auth.uid() = founder_id);

CREATE POLICY "Admins can view all notes" ON mentor_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

CREATE POLICY "Admins can insert notes" ON mentor_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Policies for cohorts
CREATE POLICY "Everyone can view cohorts" ON cohorts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cohorts" ON cohorts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Insert default cohort
INSERT INTO cohorts (name, start_date, end_date, current_week, status)
VALUES ('Cohort 3 - Feb 2026', '2026-02-03', '2026-04-28', 4, 'active')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View for cohort overview
CREATE OR REPLACE VIEW cohort_overview AS
SELECT 
  c.id as cohort_id,
  c.name as cohort_name,
  c.current_week,
  COUNT(fp.id) as total_founders,
  COUNT(fp.id) FILTER (WHERE fp.account_status = 'active') as active_founders,
  COUNT(fp.id) FILTER (WHERE fp.account_status = 'under_review') as under_review,
  COUNT(fp.id) FILTER (WHERE fp.account_status = 'removed') as removed_founders,
  COUNT(fp.id) FILTER (WHERE fp.is_locked = true) as locked_founders,
  COUNT(fp.id) FILTER (WHERE fp.consecutive_misses = 0) as on_track,
  COUNT(fp.id) FILTER (WHERE fp.consecutive_misses = 1) as at_risk,
  COUNT(fp.id) FILTER (WHERE fp.consecutive_misses >= 2) as removal_review
FROM cohorts c
LEFT JOIN founder_profiles fp ON fp.cohort_id = c.id
GROUP BY c.id, c.name, c.current_week;

-- View for revenue analytics
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
  fp.id as founder_id,
  fp.name as founder_name,
  fp.business_name,
  fp.baseline_revenue_30d,
  fp.baseline_revenue_90d,
  COALESCE(SUM(wr.revenue_generated) FILTER (WHERE wr.status = 'accepted'), 0) as total_revenue_generated,
  COUNT(wr.id) FILTER (WHERE wr.status = 'accepted') as reports_accepted,
  COUNT(wr.id) FILTER (WHERE wr.status = 'rejected') as reports_rejected,
  AVG(wr.dollar_per_hour) FILTER (WHERE wr.status = 'accepted') as avg_dollar_per_hour,
  AVG(wr.win_rate) FILTER (WHERE wr.status = 'accepted') as avg_win_rate
FROM founder_profiles fp
LEFT JOIN weekly_reports wr ON wr.user_id = fp.user_id
GROUP BY fp.id, fp.name, fp.business_name, fp.baseline_revenue_30d, fp.baseline_revenue_90d;

-- Grant access to views
GRANT SELECT ON cohort_overview TO authenticated;
GRANT SELECT ON revenue_analytics TO authenticated;

-- ============================================
-- COMPLETE
-- ============================================
-- Schema created successfully!
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Configure Storage bucket for evidence uploads
-- 3. Set up email templates for notifications
