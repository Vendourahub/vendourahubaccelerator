-- Comprehensive RLS setup for all founder-related tables
-- Run this in Supabase SQL Editor to enable founder signup and dashboard functionality

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist;

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allows_insert_waitlist" ON waitlist
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "admins_view_waitlist" ON waitlist
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- ============================================================================
-- WEEKLY_COMMITS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own commits" ON weekly_commits;
DROP POLICY IF EXISTS "Users can insert own commits" ON weekly_commits;
DROP POLICY IF EXISTS "Admins can view all commits" ON weekly_commits;
DROP POLICY IF EXISTS "Admins can update commits" ON weekly_commits;

ALTER TABLE weekly_commits ENABLE ROW LEVEL SECURITY;

-- Founders can view their own commits
CREATE POLICY "founders_view_own_commits" ON weekly_commits
  FOR SELECT
  USING (
    founder_id IN (
      SELECT id FROM founder_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Founders can insert their own commits
CREATE POLICY "founders_insert_commits" ON weekly_commits
  FOR INSERT
  WITH CHECK (
    founder_id IN (
      SELECT id FROM founder_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Admins can view all commits
CREATE POLICY "admins_view_all_commits" ON weekly_commits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- ============================================================================
-- WEEKLY_REPORTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own reports" ON weekly_reports;
DROP POLICY IF EXISTS "Users can insert own reports" ON weekly_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON weekly_reports;
DROP POLICY IF EXISTS "Admins can update reports" ON weekly_reports;

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- Founders can view their own reports
CREATE POLICY "founders_view_own_reports" ON weekly_reports
  FOR SELECT
  USING (
    founder_id IN (
      SELECT id FROM founder_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Founders can insert their own reports
CREATE POLICY "founders_insert_reports" ON weekly_reports
  FOR INSERT
  WITH CHECK (
    founder_id IN (
      SELECT id FROM founder_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Founders can update their own reports
CREATE POLICY "founders_update_own_reports" ON weekly_reports
  FOR UPDATE
  USING (
    founder_id IN (
      SELECT id FROM founder_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Admins can view all reports
CREATE POLICY "admins_view_all_reports" ON weekly_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admins can update reports
CREATE POLICY "admins_update_reports" ON weekly_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- ============================================================================
-- SYSTEM_SETTINGS (Allow public read)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view settings" ON system_settings;

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view system settings (for app configuration)
CREATE POLICY "public_view_settings" ON system_settings
  FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "admins_update_settings" ON system_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('applications', 'waitlist', 'weekly_commits', 'weekly_reports', 'system_settings')
GROUP BY tablename
ORDER BY tablename;

SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('applications', 'waitlist', 'weekly_commits', 'weekly_reports', 'system_settings')
ORDER BY tablename;
