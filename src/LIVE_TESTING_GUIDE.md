# Vendoura Hub - Live Testing Guide

This guide will help you test the complete live data flow across the entire application.

## Pre-Testing Checklist

### ✅ Database Setup
- [ ] Supabase project is created
- [ ] SQL schema from `/supabase/schema.sql` is executed
- [ ] All tables are created successfully
- [ ] RLS policies are enabled
- [ ] Default cohort exists

### ✅ Environment Configuration
- [ ] `/utils/supabase/info.tsx` has correct project ID
- [ ] `/utils/supabase/info.tsx` has correct anon key
- [ ] Supabase URL is accessible
- [ ] No CORS errors in browser console

### ✅ Authentication Setup
- [ ] Email authentication is enabled in Supabase
- [ ] Email confirmation is configured (or disabled for testing)
- [ ] Google OAuth configured (optional)
- [ ] LinkedIn OAuth configured (optional)

## Test Flow 1: Founder Signup & Onboarding

### Step 1: Apply to Vendoura
1. Navigate to `/apply`
2. Fill out application form:
   - Name: `Test Founder`
   - Email: `testfounder@example.com`
   - Password: `testpassword123`
   - Business Description: `B2B SaaS for marketing teams`
   - 30-day Revenue: `1500000`
   - 90-day Revenue: `4200000`
3. Check ALL commitment boxes
4. Click "Submit Application"

**Expected Result:**
- ✅ Account created in Supabase Auth
- ✅ Founder profile created in `founder_profiles` table
- ✅ Stage progress initialized (5 stages)
- ✅ Acceptance screen shows
- ✅ No errors in console

**Verification:**
```sql
-- Check if profile was created
SELECT * FROM founder_profiles WHERE email = 'testfounder@example.com';

-- Check stage progress
SELECT * FROM stage_progress WHERE user_id = (
  SELECT user_id FROM founder_profiles WHERE email = 'testfounder@example.com'
);
```

### Step 2: Sign In
1. Click "Sign In with Email"
2. Navigate to `/login`
3. Enter credentials:
   - Email: `testfounder@example.com`
   - Password: `testpassword123`
4. Click "Sign In"

**Expected Result:**
- ✅ Successfully logs in
- ✅ Redirects to `/founder/dashboard`
- ✅ Dashboard shows live data
- ✅ Welcome message shows founder name
- ✅ Revenue metrics display

**Check Browser Console:**
- No authentication errors
- Supabase session active
- Profile data loaded

### Step 3: Verify Dashboard Live Data
1. On dashboard, verify:
   - [ ] Welcome message shows correct name
   - [ ] Business name displays
   - [ ] Current week shows (Week 1)
   - [ ] Current stage shows (Stage 1)
   - [ ] Revenue baseline displays correctly
   - [ ] Lock status is false (not locked)

**Database Verification:**
```sql
-- Check founder data matches dashboard
SELECT 
  name,
  business_name,
  current_week,
  current_stage,
  baseline_revenue_30d,
  is_locked
FROM founder_profiles 
WHERE email = 'testfounder@example.com';
```

## Test Flow 2: Weekly Commit Submission

### Step 1: Submit Commit
1. Click "Commit" on dashboard
2. Fill out commit form:
   - Action: `Reach out to 50 qualified leads via LinkedIn`
   - Target Revenue: `200000`
   - Completion Date: Select Friday of current week
3. Click "Submit Commit"

**Expected Result:**
- ✅ Commit saved to `weekly_commits` table
- ✅ Success message shows
- ✅ Redirect to dashboard
- ✅ Dashboard shows commit status as "complete"

**Database Verification:**
```sql
-- Check commit was created
SELECT 
  week_number,
  action_description,
  target_revenue,
  is_late,
  status
FROM weekly_commits 
WHERE user_id = (
  SELECT user_id FROM founder_profiles WHERE email = 'testfounder@example.com'
);
```

## Test Flow 3: Weekly Report Submission

### Step 1: Submit Report
1. Navigate to `/founder/report`
2. Fill out report form:
   - Revenue Generated: `180000`
   - Hours Spent: `12`
   - Narrative: `Reached out to 50 leads, got 8 responses, 3 meetings booked. Closed 2 deals for ₦90K each.`
   - Upload evidence (screenshot/file)
3. Click "Submit Report"

**Expected Result:**
- ✅ Report saved to `weekly_reports` table
- ✅ Dollar per hour calculated automatically
- ✅ Win rate calculated (revenue / target * 100)
- ✅ Evidence URLs stored
- ✅ Success message shows

**Database Verification:**
```sql
-- Check report with calculated metrics
SELECT 
  week_number,
  revenue_generated,
  hours_spent,
  dollar_per_hour,
  win_rate,
  narrative,
  status,
  is_late
FROM weekly_reports 
WHERE user_id = (
  SELECT user_id FROM founder_profiles WHERE email = 'testfounder@example.com'
);
```

## Test Flow 4: Admin Dashboard

### Step 1: Create Admin Account
```sql
-- Create admin directly in database for testing
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@vendoura.com', crypt('adminpass123', gen_salt('bf')), now());

-- Get the user_id
-- Update user metadata
UPDATE auth.users 
SET raw_user_meta_data = '{"user_type": "admin", "admin_role": "super_admin", "name": "Test Admin"}'::jsonb
WHERE email = 'admin@vendoura.com';
```

### Step 2: Sign In as Admin
1. Navigate to `/admin/login`
2. Enter:
   - Email: `admin@vendoura.com`
   - Password: `adminpass123`
3. Click "Access Admin Panel"

**Expected Result:**
- ✅ Logs in successfully
- ✅ Redirects to `/admin` (Cohort Overview)
- ✅ Shows all founders in cohort
- ✅ Live data loads

### Step 3: Verify Live Cohort Data
1. Check Cohort Overview page
2. Verify:
   - [ ] Founder appears in table
   - [ ] Stage and Week are correct
   - [ ] Commit/Report status shows
   - [ ] Missed weeks count is 0
   - [ ] Revenue delta shows
   - [ ] Risk level shows "On Track"

**Database Verification:**
```sql
-- Use the cohort_overview view
SELECT * FROM cohort_overview;
```

### Step 4: View Founder Detail
1. Click "View" on test founder row
2. Navigate to founder detail page
3. Verify:
   - [ ] Profile information shows
   - [ ] Weekly activity table displays
   - [ ] Revenue chart shows data
   - [ ] Can add mentor note

**Expected Result:**
- ✅ All data loads from Supabase
- ✅ Real-time updates when data changes
- ✅ No mock data visible

## Test Flow 5: Real-Time Updates

### Step 1: Test Profile Updates
1. Open dashboard in two browser windows
2. In Window 1: Update founder profile
3. In Window 2: Watch for automatic update

**Expected Result:**
- ✅ Changes appear in Window 2 within 1-2 seconds
- ✅ No page refresh needed
- ✅ Real-time subscription working

### Step 2: Test Admin Real-Time
1. Open admin cohort overview
2. Have another user submit a commit/report
3. Wait 30 seconds (auto-refresh interval)

**Expected Result:**
- ✅ New data appears automatically
- ✅ Stats update
- ✅ Founder status changes

## Test Flow 6: Lock Mechanism

### Step 1: Trigger Lock
```sql
-- Simulate missed deadline by updating founder profile
UPDATE founder_profiles 
SET 
  consecutive_misses = 2,
  is_locked = true,
  lock_reason = 'Missed Week 1 and Week 2 commits'
WHERE email = 'testfounder@example.com';
```

### Step 2: Verify Lock on Dashboard
1. Refresh founder dashboard
2. Verify:
   - [ ] Red lock warning appears at top
   - [ ] Lock reason shows
   - [ ] Dashboard indicates locked status

### Step 3: Admin Override Lock
1. Go to admin founder detail
2. Find "Override Lock" button
3. Click and confirm
4. Verify founder dashboard updates

**Expected Result:**
- ✅ Lock removed in database
- ✅ Dashboard updates automatically
- ✅ Audit log created

## Test Flow 7: Analytics & Reporting

### Step 1: Revenue Analytics
1. Navigate to `/admin/analytics`
2. Verify:
   - [ ] Total revenue calculates correctly
   - [ ] Growth percentages show
   - [ ] Charts display data
   - [ ] Week-over-week trends visible

**Database Verification:**
```sql
-- Use revenue analytics view
SELECT * FROM revenue_analytics;

-- Check aggregate metrics
SELECT 
  SUM(revenue_generated) as total_revenue,
  AVG(dollar_per_hour) as avg_dph,
  AVG(win_rate) as avg_win_rate
FROM weekly_reports 
WHERE status = 'accepted';
```

### Step 2: Export Data
1. Go to Cohort Overview
2. Click "Export Weekly Report"
3. Select export type
4. Download JSON file

**Expected Result:**
- ✅ File downloads successfully
- ✅ Contains real Supabase data
- ✅ Properly formatted

## Test Flow 8: Data Integrity

### Verify Constraints
```sql
-- Try to create duplicate commit (should fail)
INSERT INTO weekly_commits (user_id, week_number, action_description, target_revenue, deadline)
SELECT user_id, 1, 'Test', 100000, now() + interval '1 week'
FROM founder_profiles 
WHERE email = 'testfounder@example.com';
-- Expected: ERROR: duplicate key value violates unique constraint

-- Try to create report with less than 50 chars narrative (should fail)
INSERT INTO weekly_reports (user_id, week_number, commit_id, revenue_generated, hours_spent, narrative, evidence_urls, deadline)
VALUES ('uuid', 1, 'commit_uuid', 100000, 10, 'Short', ARRAY['url'], now());
-- Expected: ERROR: check constraint violation
```

### Verify RLS Policies
```sql
-- Try to access another founder's data (should return empty)
SET LOCAL auth.uid = 'different_user_id';
SELECT * FROM weekly_commits WHERE user_id = 'original_user_id';
-- Expected: 0 rows (unless admin)
```

## Test Flow 9: Error Handling

### Test Network Failures
1. Open browser DevTools
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to load dashboard

**Expected Result:**
- ✅ Graceful error message
- ✅ Retry mechanism activates
- ✅ No app crash

### Test Invalid Data
1. Try to submit commit with empty fields
2. Try to submit report with invalid evidence URLs
3. Try to update profile with invalid email

**Expected Result:**
- ✅ Validation errors show
- ✅ User-friendly messages
- ✅ No database corruption

## Performance Benchmarks

### Dashboard Load Time
- **Target**: < 2 seconds for initial load
- **Test**: Measure time from navigation to data display
- **Check**: Browser Network tab, Performance tab

### Real-Time Update Latency
- **Target**: < 2 seconds for subscription updates
- **Test**: Update data in database, measure time to UI update
- **Check**: Console timestamps

### Admin Cohort Query
- **Target**: < 1 second for 100 founders
- **Test**: Query cohort_overview view with many founders
- **Check**: Supabase dashboard query performance

## Troubleshooting Common Issues

### "Cannot read property of undefined"
→ Check if Supabase data is loading before render
→ Add loading states to all components

### "Permission denied" on queries
→ Verify RLS policies are correct
→ Check user authentication status
→ Verify user_type in metadata

### Data not updating
→ Check real-time subscriptions are connected
→ Verify Realtime is enabled in Supabase project
→ Check browser console for subscription errors

### Slow queries
→ Add indexes to frequently queried columns
→ Use views for complex queries
→ Consider caching for admin dashboard

## Success Criteria

Application is ready for live testing when:

- [ ] All 9 test flows pass without errors
- [ ] Real-time updates work consistently
- [ ] Data persists correctly in Supabase
- [ ] No mock data is visible
- [ ] Lock mechanisms enforce correctly
- [ ] Admin can manage all founders
- [ ] Performance meets benchmarks
- [ ] Error handling is graceful
- [ ] Database constraints prevent invalid data
- [ ] RLS policies secure data properly

## Next Steps After Testing

1. ✅ Configure production environment variables
2. ✅ Set up automated backups in Supabase
3. ✅ Configure email notifications
4. ✅ Set up monitoring and alerts
5. ✅ Document API endpoints
6. ✅ Create admin user guide
7. ✅ Prepare founder onboarding guide
8. ✅ Set up analytics tracking

---

**Ready for Production?** All test flows passing = ✅ Launch ready!
