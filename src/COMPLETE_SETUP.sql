-- ============================================
-- VENDOURA HUB - COMPLETE DATABASE SETUP
-- Run this ENTIRE script in Supabase SQL Editor
-- This creates ALL tables needed for the platform
-- ============================================

-- ============================================
-- 1. FOUNDER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  baseline_revenue_30d NUMERIC NOT NULL DEFAULT 0,
  baseline_revenue_90d NUMERIC NOT NULL DEFAULT 0,
  current_stage INTEGER NOT NULL DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
  current_week INTEGER NOT NULL DEFAULT 1,
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'locked', 'suspended', 'completed')),
  lock_reason TEXT,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS founder_profiles_user_id_idx ON public.founder_profiles(user_id);
CREATE INDEX IF NOT EXISTS founder_profiles_email_idx ON public.founder_profiles(email);
CREATE INDEX IF NOT EXISTS founder_profiles_account_status_idx ON public.founder_profiles(account_status);
CREATE INDEX IF NOT EXISTS founder_profiles_current_stage_idx ON public.founder_profiles(current_stage);

ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Founders can view own profile" ON public.founder_profiles;
CREATE POLICY "Founders can view own profile"
  ON public.founder_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Founders can update own profile" ON public.founder_profiles;
CREATE POLICY "Founders can update own profile"
  ON public.founder_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.founder_profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.founder_profiles FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.founder_profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.founder_profiles FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- 2. WAITLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  notified BOOLEAN NOT NULL DEFAULT false,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_notified_idx ON public.waitlist(notified);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON public.waitlist(created_at);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can manage waitlist" ON public.waitlist;
CREATE POLICY "Admins can manage waitlist"
  ON public.waitlist FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
CREATE POLICY "Public can join waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================
-- 3. ADMIN USERS TABLE
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

CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS admin_users_role_idx ON public.admin_users(role);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
CREATE POLICY "Admins can view all admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can view own profile" ON public.admin_users;
CREATE POLICY "Admins can view own profile"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Super admins can insert admin users" ON public.admin_users;
CREATE POLICY "Super admins can insert admin users"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

DROP POLICY IF EXISTS "Super admins can update admin users" ON public.admin_users;
CREATE POLICY "Super admins can update admin users"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_users;
CREATE POLICY "Admins can update own profile"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Super admins can delete admin users" ON public.admin_users;
CREATE POLICY "Super admins can delete admin users"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

-- ============================================
-- 4. SYSTEM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  cohort_program_active BOOLEAN NOT NULL DEFAULT true,
  current_cohort_name TEXT DEFAULT 'Cohort 3 - Feb 2026',
  current_cohort_week INT DEFAULT 4,
  waitlist_email_template TEXT,
  signup_redirect_url TEXT DEFAULT '/onboarding',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.system_settings (id, cohort_program_active, current_cohort_name, current_cohort_week) 
VALUES (1, true, 'Cohort 3 - Feb 2026', 4) 
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view system settings" ON public.system_settings;
CREATE POLICY "Admins can view system settings"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Super admins can update system settings" ON public.system_settings;
CREATE POLICY "Super admins can update system settings"
  ON public.system_settings FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

-- ============================================
-- 5. ADMIN PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  notification_types JSONB DEFAULT '{"locks": true, "interventions": true, "reports": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(admin_id)
);

ALTER TABLE public.admin_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own preferences" ON public.admin_preferences;
CREATE POLICY "Admins can view own preferences"
  ON public.admin_preferences FOR SELECT
  TO authenticated
  USING (admin_id IN (SELECT id FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update own preferences" ON public.admin_preferences;
CREATE POLICY "Admins can update own preferences"
  ON public.admin_preferences FOR ALL
  TO authenticated
  USING (admin_id IN (SELECT id FROM public.admin_users WHERE user_id = auth.uid()));

-- ============================================
-- 6. ADMIN ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_activity_logs_admin_id_idx ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS admin_activity_logs_created_at_idx ON public.admin_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS admin_activity_logs_action_type_idx ON public.admin_activity_logs(action_type);

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can insert activity logs"
  ON public.admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- 7. NOTIFICATION SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email_provider TEXT DEFAULT 'sendgrid',
  email_api_key TEXT,
  email_smtp_host TEXT,
  email_smtp_port TEXT,
  email_smtp_username TEXT,
  email_smtp_password TEXT,
  email_from TEXT DEFAULT 'notifications@vendoura.com',
  email_from_name TEXT DEFAULT 'Vendoura Team',
  email_reply_to TEXT DEFAULT 'support@vendoura.com',
  push_provider TEXT DEFAULT 'firebase',
  push_server_key TEXT,
  push_enabled BOOLEAN DEFAULT false,
  sms_provider TEXT DEFAULT 'twilio',
  sms_account_sid TEXT,
  sms_auth_token TEXT,
  sms_from_number TEXT,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.notification_settings (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view notification settings" ON public.notification_settings;
CREATE POLICY "Admins can view notification settings"
  ON public.notification_settings FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can update notification settings" ON public.notification_settings;
CREATE POLICY "Admins can update notification settings"
  ON public.notification_settings FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- 8. NOTIFICATION TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'push', 'sms')),
  active BOOLEAN NOT NULL DEFAULT true,
  last_edited TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notification_templates_type_idx ON public.notification_templates(type);
CREATE INDEX IF NOT EXISTS notification_templates_active_idx ON public.notification_templates(active);

-- Insert default templates
INSERT INTO public.notification_templates (name, subject, body, type, active, last_edited)
VALUES 
  ('Welcome Email', 'Welcome to Vendoura Hub!', 'Hi {founder_name},

Welcome to Vendoura Hub! We''re excited to have you join our revenue-focused accelerator program.

Your journey begins now. Log in to access your dashboard and start Week 1.

Platform: {platform_url}

Let''s build revenue together,
The Vendoura Team', 'email', true, NOW()),

  ('Commit Reminder', 'Week {week_number} Commit Due Monday 9am WAT', 'Hi {founder_name},

Reminder: Your Week {week_number} commitment is due Monday at 9:00 AM WAT.

Submit your commit before the deadline to stay on track.

Dashboard: {platform_url}

- Vendoura Team', 'email', true, NOW()),

  ('Report Deadline Warning', 'Week {week_number} Report Due Friday 6pm WAT', 'Hi {founder_name},

Your Week {week_number} revenue report is due Friday at 6:00 PM WAT.

Don''t forget to submit your report with evidence.

Dashboard: {platform_url}

- Vendoura Team', 'email', true, NOW()),

  ('Lock Notification', '⚠️ Account Locked - Missed Deadline', 'Hi {founder_name},

Your account has been locked due to a missed deadline.

You cannot submit new work until the next cycle. Please contact your mentor for support.

- Vendoura Team', 'email', true, NOW()),

  ('Stage Unlock Celebration', '🎉 Stage {stage_number} Unlocked!', 'Hi {founder_name},

Congratulations! You''ve unlocked Stage {stage_number}!

Your hard work is paying off. Keep pushing forward.

Dashboard: {platform_url}

- Vendoura Team', 'email', true, NOW()),

  ('Weekly Digest', 'Your Week {week_number} Summary', 'Hi {founder_name},

Here''s your weekly summary:

• Stage: {stage_number}
• Week: {week_number}
• Status: On track

Keep up the great work!

Dashboard: {platform_url}

- Vendoura Team', 'email', true, NOW())
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view templates" ON public.notification_templates;
CREATE POLICY "Admins can view templates"
  ON public.notification_templates FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can manage templates" ON public.notification_templates;
CREATE POLICY "Admins can manage templates"
  ON public.notification_templates FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- 9. INTERVENTION RESOLUTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.intervention_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id),
  intervention_type TEXT NOT NULL CHECK (intervention_type IN ('lock', 'warning', 'support', 'escalation')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  notes TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS intervention_resolutions_founder_id_idx ON public.intervention_resolutions(founder_id);
CREATE INDEX IF NOT EXISTS intervention_resolutions_admin_id_idx ON public.intervention_resolutions(admin_id);
CREATE INDEX IF NOT EXISTS intervention_resolutions_status_idx ON public.intervention_resolutions(status);

ALTER TABLE public.intervention_resolutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view interventions" ON public.intervention_resolutions;
CREATE POLICY "Admins can view interventions"
  ON public.intervention_resolutions FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

DROP POLICY IF EXISTS "Admins can manage interventions" ON public.intervention_resolutions;
CREATE POLICY "Admins can manage interventions"
  ON public.intervention_resolutions FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- 10. WEEKLY COMMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  stage_number INTEGER NOT NULL,
  commitment TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS weekly_commits_founder_id_idx ON public.weekly_commits(founder_id);
CREATE INDEX IF NOT EXISTS weekly_commits_week_number_idx ON public.weekly_commits(week_number);
CREATE INDEX IF NOT EXISTS weekly_commits_status_idx ON public.weekly_commits(status);

ALTER TABLE public.weekly_commits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Founders can view own commits" ON public.weekly_commits;
CREATE POLICY "Founders can view own commits"
  ON public.weekly_commits FOR SELECT
  TO authenticated
  USING (founder_id = auth.uid());

DROP POLICY IF EXISTS "Founders can insert own commits" ON public.weekly_commits;
CREATE POLICY "Founders can insert own commits"
  ON public.weekly_commits FOR INSERT
  TO authenticated
  WITH CHECK (founder_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all commits" ON public.weekly_commits;
CREATE POLICY "Admins can view all commits"
  ON public.weekly_commits FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- 11. WEEKLY REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  stage_number INTEGER NOT NULL,
  revenue_generated NUMERIC NOT NULL DEFAULT 0,
  evidence_url TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS weekly_reports_founder_id_idx ON public.weekly_reports(founder_id);
CREATE INDEX IF NOT EXISTS weekly_reports_week_number_idx ON public.weekly_reports(week_number);
CREATE INDEX IF NOT EXISTS weekly_reports_status_idx ON public.weekly_reports(status);

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Founders can view own reports" ON public.weekly_reports;
CREATE POLICY "Founders can view own reports"
  ON public.weekly_reports FOR SELECT
  TO authenticated
  USING (founder_id = auth.uid());

DROP POLICY IF EXISTS "Founders can insert own reports" ON public.weekly_reports;
CREATE POLICY "Founders can insert own reports"
  ON public.weekly_reports FOR INSERT
  TO authenticated
  WITH CHECK (founder_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all reports" ON public.weekly_reports;
CREATE POLICY "Admins can view all reports"
  ON public.weekly_reports FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- VERIFICATION QUERY
-- ============================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name AND columns.table_schema = 'public') as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'founder_profiles',
    'waitlist',
    'admin_users',
    'system_settings',
    'admin_preferences',
    'admin_activity_logs',
    'notification_settings',
    'notification_templates',
    'intervention_resolutions',
    'weekly_commits',
    'weekly_reports'
  )
ORDER BY table_name;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ SUCCESS! All tables created.';
  RAISE NOTICE 'Next step: Create your first admin user.';
  RAISE NOTICE 'Run CREATE_FIRST_ADMIN.sql after creating a user in Authentication → Users';
END $$;
