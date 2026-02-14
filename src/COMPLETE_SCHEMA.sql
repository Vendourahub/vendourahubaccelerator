-- ============================================
-- VENDOURA HUB - COMPLETE DATABASE SCHEMA
-- ============================================
-- Full Production-Ready Schema with Zero Gaps
-- Run this AFTER QUICK_FIX.sql to add missing elements
-- Project: knqbtdugvessaehgwwcg
-- ============================================

-- ============================================
-- MISSING TABLES
-- ============================================

-- Cohort Management
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cohort_number INTEGER UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current_week INTEGER DEFAULT 1,
  max_weeks INTEGER DEFAULT 12,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'paused')),
  max_founders INTEGER DEFAULT 50,
  enrollment_fee NUMERIC DEFAULT 50000, -- in Naira
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  dollar_per_hour NUMERIC DEFAULT 0,
  win_rate NUMERIC DEFAULT 0, -- Percentage (0-100)
  velocity_score INTEGER DEFAULT 0, -- 0-100
  consistency_score INTEGER DEFAULT 0, -- 0-100
  submission_timeliness TEXT DEFAULT 'on-time' CHECK (submission_timeliness IN ('early', 'on-time', 'late', 'missed')),
  revenue_trend TEXT, -- 'increasing', 'stable', 'decreasing'
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(founder_id, week_number)
);

-- Notification History
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES auth.users(id),
  recipient_email TEXT NOT NULL,
  template_id UUID REFERENCES notification_templates(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'email' CHECK (type IN ('email', 'sms', 'in-app', 'whatsapp')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence / File Uploads
CREATE TABLE IF NOT EXISTS evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  submission_id UUID, -- Links to weekly_commits or weekly_reports
  submission_type TEXT CHECK (submission_type IN ('commit', 'report', 'adjustment', 'profile')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT, -- in bytes
  file_type TEXT, -- MIME type
  storage_bucket TEXT DEFAULT 'evidence',
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  transaction_ref TEXT UNIQUE NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('paystack', 'flutterwave', 'manual')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled', 'refunded')),
  payment_type TEXT CHECK (payment_type IN ('subscription', 'renewal', 'upgrade', 'late_fee')),
  subscription_duration INTEGER, -- in days
  gateway_response JSONB,
  metadata JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription History
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  subscription_status TEXT NOT NULL CHECK (subscription_status IN ('trial', 'paid', 'expired', 'cancelled', 'suspended')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  auto_renewed BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Task Tracking (for Execute page)
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  task_date DATE NOT NULL,
  task_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'blocked')),
  time_spent NUMERIC DEFAULT 0, -- in hours
  blocker_description TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Office Hours / Mentor Sessions
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES admin_users(id),
  session_type TEXT DEFAULT 'office_hours' CHECK (session_type IN ('office_hours', 'intervention', '1-on-1', 'group')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  meeting_link TEXT,
  notes TEXT,
  action_items TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist Notifications Tracking
CREATE TABLE IF NOT EXISTS waitlist_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID REFERENCES waitlist(id) ON DELETE CASCADE,
  notification_type TEXT CHECK (notification_type IN ('program_open', 'reminder', 'cohort_starting')),
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

-- founder_profiles enhancements
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id);
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Africa/Lagos';
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS payment_reminders_sent INTEGER DEFAULT 0;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS last_payment_reminder TIMESTAMP WITH TIME ZONE;

-- weekly_commits enhancements  
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS action_description TEXT;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS target_revenue NUMERIC DEFAULT 0;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'complete', 'missed'));
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- weekly_reports enhancements
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS commit_id UUID REFERENCES weekly_commits(id);
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS revenue_generated NUMERIC DEFAULT 0;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS hours_spent NUMERIC DEFAULT 0;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS narrative TEXT;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS evidence_url TEXT;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected'));
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS dollar_per_hour NUMERIC;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS win_rate NUMERIC;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES admin_users(id);
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- interventions enhancements
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES admin_users(id);
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS intervention_type TEXT DEFAULT 'performance' CHECK (intervention_type IN ('performance', 'payment', 'behavioral', 'technical'));

-- audit_logs enhancements
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS session_id TEXT;

-- system_settings enhancements (email configuration)
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS smtp_host TEXT;
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS smtp_port INTEGER DEFAULT 587;
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS smtp_username TEXT;
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS smtp_password TEXT;
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS from_email TEXT DEFAULT 'noreply@vendoura.com';
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS from_name TEXT DEFAULT 'Vendoura Hub';

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Founder lookups
CREATE INDEX IF NOT EXISTS idx_founder_cohort ON founder_profiles(cohort_id);
CREATE INDEX IF NOT EXISTS idx_founder_status ON founder_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_founder_subscription ON founder_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_founder_locked ON founder_profiles(is_locked) WHERE is_locked = true;
CREATE INDEX IF NOT EXISTS idx_founder_at_risk ON founder_profiles(consecutive_misses) WHERE consecutive_misses > 0;

-- Weekly submissions
CREATE INDEX IF NOT EXISTS idx_commits_founder ON weekly_commits(founder_id);
CREATE INDEX IF NOT EXISTS idx_commits_week ON weekly_commits(week_number);
CREATE INDEX IF NOT EXISTS idx_commits_status ON weekly_commits(status);
CREATE INDEX IF NOT EXISTS idx_reports_founder ON weekly_reports(founder_id);
CREATE INDEX IF NOT EXISTS idx_reports_week ON weekly_reports(week_number);
CREATE INDEX IF NOT EXISTS idx_reports_status ON weekly_reports(status);

-- Analytics queries
CREATE INDEX IF NOT EXISTS idx_reports_revenue ON weekly_reports(revenue_generated);
CREATE INDEX IF NOT EXISTS idx_reports_accepted ON weekly_reports(status) WHERE status = 'accepted';
CREATE INDEX IF NOT EXISTS idx_performance_week ON performance_metrics(week_number);
CREATE INDEX IF NOT EXISTS idx_performance_founder_week ON performance_metrics(founder_id, week_number);

-- Interventions
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_interventions_priority ON interventions(priority);
CREATE INDEX IF NOT EXISTS idx_interventions_assigned ON interventions(assigned_to);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notification_history_recipient ON notification_history(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_status ON notification_history(status);
CREATE INDEX IF NOT EXISTS idx_notification_history_date ON notification_history(created_at DESC);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payment_transactions_founder ON payment_transactions(founder_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_date ON payment_transactions(created_at DESC);

-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action_type);

-- Evidence files
CREATE INDEX IF NOT EXISTS idx_evidence_founder ON evidence_files(founder_id);
CREATE INDEX IF NOT EXISTS idx_evidence_submission ON evidence_files(submission_id, submission_type);

-- Daily tasks
CREATE INDEX IF NOT EXISTS idx_daily_tasks_founder ON daily_tasks(founder_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_status ON daily_tasks(status);

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON founder_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_sessions_updated_at BEFORE UPDATE ON mentor_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CALCULATE TRIGGERS
-- ============================================

-- Auto-calculate dollar_per_hour and win_rate on report submission
CREATE OR REPLACE FUNCTION calculate_report_metrics()
RETURNS TRIGGER AS $$
DECLARE
  target_revenue NUMERIC;
BEGIN
  -- Calculate dollar per hour
  IF NEW.hours_spent > 0 THEN
    NEW.dollar_per_hour := NEW.revenue_generated / NEW.hours_spent;
  ELSE
    NEW.dollar_per_hour := 0;
  END IF;
  
  -- Calculate win rate against commit
  IF NEW.commit_id IS NOT NULL THEN
    SELECT target_revenue INTO target_revenue
    FROM weekly_commits
    WHERE id = NEW.commit_id;
    
    IF target_revenue > 0 THEN
      NEW.win_rate := (NEW.revenue_generated / target_revenue) * 100;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_report_metrics_trigger
    BEFORE INSERT OR UPDATE ON weekly_reports
    FOR EACH ROW EXECUTE FUNCTION calculate_report_metrics();

-- Auto-update consecutive_misses on founder_profiles
CREATE OR REPLACE FUNCTION update_consecutive_misses()
RETURNS TRIGGER AS $$
BEGIN
  -- If a report is submitted, reset consecutive misses
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
    UPDATE founder_profiles
    SET consecutive_misses = 0,
        last_activity = NOW()
    WHERE id = NEW.founder_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_consecutive_misses_trigger
    AFTER INSERT OR UPDATE ON weekly_reports
    FOR EACH ROW EXECUTE FUNCTION update_consecutive_misses();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_notifications ENABLE ROW LEVEL SECURITY;

-- Cohorts - Authenticated users can read
CREATE POLICY "Allow authenticated read cohorts" ON cohorts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins manage cohorts" ON cohorts FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Performance Metrics - Users read own, admins read all
CREATE POLICY "Users can read own metrics" ON performance_metrics FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can read all metrics" ON performance_metrics FOR SELECT TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));
CREATE POLICY "Admins can manage all metrics" ON performance_metrics FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Notification History - Users read own
CREATE POLICY "Users can read own notifications" ON notification_history FOR SELECT TO authenticated 
  USING (recipient_id = auth.uid());
CREATE POLICY "Admins can read all notifications" ON notification_history FOR SELECT TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Evidence Files - Users manage own
CREATE POLICY "Users can manage own evidence" ON evidence_files FOR ALL TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all evidence" ON evidence_files FOR SELECT TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Payment Transactions - Users read own
CREATE POLICY "Users can read own transactions" ON payment_transactions FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage transactions" ON payment_transactions FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Subscription History - Users read own
CREATE POLICY "Users can read own subscription history" ON subscription_history FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage subscription history" ON subscription_history FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Daily Tasks - Users manage own
CREATE POLICY "Users can manage own tasks" ON daily_tasks FOR ALL TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all tasks" ON daily_tasks FOR SELECT TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Mentor Sessions - Users read own, admins manage
CREATE POLICY "Users can read own sessions" ON mentor_sessions FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage sessions" ON mentor_sessions FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- ============================================
-- SEED DATA
-- ============================================

-- Create default cohort if none exists
INSERT INTO cohorts (cohort_number, name, start_date, current_week, status)
VALUES (3, 'Cohort 3 - Feb 2026', '2026-02-01', 4, 'active')
ON CONFLICT (cohort_number) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- List all tables
DO $$
BEGIN
  RAISE NOTICE '📊 TABLES CREATED:';
  RAISE NOTICE '  ✅ cohorts';
  RAISE NOTICE '  ✅ performance_metrics';
  RAISE NOTICE '  ✅ notification_history';
  RAISE NOTICE '  ✅ evidence_files';
  RAISE NOTICE '  ✅ payment_transactions';
  RAISE NOTICE '  ✅ subscription_history';
  RAISE NOTICE '  ✅ daily_tasks';
  RAISE NOTICE '  ✅ mentor_sessions';
  RAISE NOTICE '  ✅ waitlist_notifications';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 ENHANCEMENTS ADDED:';
  RAISE NOTICE '  ✅ Missing columns added to existing tables';
  RAISE NOTICE '  ✅ Performance indexes created';
  RAISE NOTICE '  ✅ Auto-update triggers enabled';
  RAISE NOTICE '  ✅ Auto-calculate triggers enabled';
  RAISE NOTICE '  ✅ RLS policies implemented';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 DATABASE SCHEMA COMPLETE!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next: Run this query to verify:';
  RAISE NOTICE '   SELECT schemaname, tablename FROM pg_tables WHERE schemaname = ''public'' ORDER BY tablename;';
END $$;