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

-- ============================================
-- ADMIN USERS RLS
-- ============================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "Admins can view own profile"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can insert admin users"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

CREATE POLICY "Super admins can update admin users"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

CREATE POLICY "Admins can update own profile"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can delete admin users"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin');

COMMENT ON TABLE public.admin_users IS 'Admin user accounts and permissions';

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
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Subscriptions RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- Revenue Tactics RLS
ALTER TABLE public.revenue_tactics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can view own tactics"
  ON public.revenue_tactics FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin'
  );

CREATE POLICY "Founders can insert own tactics"
  ON public.revenue_tactics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all tactics"
  ON public.revenue_tactics FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- Daily Snapshots RLS
ALTER TABLE public.daily_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view snapshots"
  ON public.daily_snapshots FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "Admins can create snapshots"
  ON public.daily_snapshots FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

COMMENT ON TABLE public.subscriptions IS 'Founder subscription and payment tracking';
COMMENT ON TABLE public.revenue_tactics IS 'Revenue generation tactics used by founders';
COMMENT ON TABLE public.daily_snapshots IS 'Daily system snapshots for monitoring';

-- ============================================
-- NOTIFICATION SETTINGS TABLE
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

-- ============================================
-- NOTIFICATION TEMPLATES TABLE
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

-- ============================================
-- NOTIFICATION SETTINGS RLS
-- ============================================
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notification settings"
  ON public.notification_settings FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "Super admins can update notification settings"
  ON public.notification_settings FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

-- ============================================
-- NOTIFICATION TEMPLATES RLS
-- ============================================
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view templates"
  ON public.notification_templates FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "Super admins can manage templates"
  ON public.notification_templates FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

COMMENT ON TABLE public.notification_settings IS 'Notification service configuration (email, push, SMS)';
COMMENT ON TABLE public.notification_templates IS 'Email/Push/SMS templates for automated notifications';

-- ============================================
-- INTERVENTION RESOLUTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.intervention_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_name TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  resolution_notes TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'removed', 'ongoing')),
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS intervention_resolutions_founder_id_idx ON public.intervention_resolutions(founder_id);
CREATE INDEX IF NOT EXISTS intervention_resolutions_resolved_at_idx ON public.intervention_resolutions(resolved_at);
CREATE INDEX IF NOT EXISTS intervention_resolutions_outcome_idx ON public.intervention_resolutions(outcome);

-- ============================================
-- INTERVENTION RESOLUTIONS RLS
-- ============================================
ALTER TABLE public.intervention_resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view resolutions"
  ON public.intervention_resolutions FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

CREATE POLICY "Admins can create resolutions"
  ON public.intervention_resolutions FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

COMMENT ON TABLE public.intervention_resolutions IS 'Track interventions and resolutions for flagged founders';

-- ============================================
-- ADMIN PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  email_digest BOOLEAN DEFAULT true,
  founder_flags BOOLEAN DEFAULT true,
  system_alerts BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(admin_id)
);

CREATE INDEX IF NOT EXISTS admin_preferences_admin_id_idx ON public.admin_preferences(admin_id);

-- ============================================
-- ADMIN ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_activity_logs_admin_id_idx ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS admin_activity_logs_created_at_idx ON public.admin_activity_logs(created_at);

-- ============================================
-- ADMIN PREFERENCES RLS
-- ============================================
ALTER TABLE public.admin_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own preferences"
  ON public.admin_preferences FOR SELECT
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update own preferences"
  ON public.admin_preferences FOR ALL
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- ADMIN ACTIVITY LOGS RLS
-- ============================================
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own activity logs"
  ON public.admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM public.admin_users WHERE user_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'admin_role' = 'super_admin'
  );

CREATE POLICY "Admins can create activity logs"
  ON public.admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'admin');

COMMENT ON TABLE public.admin_preferences IS 'Admin notification preferences';
COMMENT ON TABLE public.admin_activity_logs IS 'Log of all admin actions for audit trail';

-- ============================================
-- COMPLETED!
-- ============================================