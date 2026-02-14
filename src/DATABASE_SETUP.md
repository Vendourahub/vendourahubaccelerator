# Vendoura Hub - Database Setup Guide

This guide will help you set up the Supabase database for Vendoura Hub with live data connectivity.

## Prerequisites

1. A Supabase account and project
2. Access to Supabase SQL Editor
3. Project URL and anon key configured in `/utils/supabase/info.tsx`

## Step 1: Create Database Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste into a new query in SQL Editor
5. Click **Run** to execute

This will create:
- ✅ All database tables (founder_profiles, weekly_commits, weekly_reports, stage_progress, etc.)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for automated timestamp updates
- ✅ Views for analytics
- ✅ Default cohort data

## Step 2: Verify Tables

After running the schema, verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `founder_profiles`
- `weekly_commits`
- `weekly_reports`
- `stage_progress`
- `mentor_notes`
- `cohorts`
- `audit_logs`
- `mentor_notifications`
- `interventions`
- `revenue_system_documents`

## Step 3: Configure Storage for Evidence Uploads

1. Go to **Storage** in Supabase dashboard
2. Click **Create a new bucket**
3. Name it: `evidence`
4. Set it to **Public** (or **Private** with signed URLs)
5. Add RLS policies for evidence bucket:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'evidence');

-- Allow users to view own evidence
CREATE POLICY "Users can view own evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 4: Test Data Connectivity

The application will automatically:
- ✅ Connect to Supabase on load
- ✅ Create founder profiles during application signup
- ✅ Sync all dashboard data in real-time
- ✅ Log admin actions to audit_logs

To test manually:

```sql
-- Check if founder profiles exist
SELECT COUNT(*) FROM founder_profiles;

-- View cohort overview
SELECT * FROM cohort_overview;

-- Check revenue analytics
SELECT * FROM revenue_analytics;
```

## Step 5: Initialize Test Data (Optional)

For testing purposes, you can add sample data:

```sql
-- Create a test cohort
INSERT INTO cohorts (name, start_date, end_date, current_week, status)
VALUES ('Test Cohort - Feb 2026', '2026-02-03', '2026-04-28', 4, 'active');

-- Note: Founder profiles will be created automatically when users sign up
-- through the application
```

## Data Flow Architecture

### Founder Dashboard
```
Browser → founderService → Supabase → Real-time data
         ↓
    Dashboard displays:
    - Live profile data
    - Weekly commits
    - Weekly reports  
    - Revenue metrics
    - Stage progress
```

### Admin Dashboard
```
Browser → adminService → Supabase → Real-time data
         ↓
    Admin sees:
    - All founders
    - Cohort analytics
    - Revenue analytics
    - Audit logs
    - Mentor notes
```

### Automatic Updates

The system includes real-time subscriptions that automatically update:
- Founder profile changes
- New commits and reports
- Lock status changes
- Cohort metrics

Refresh intervals:
- **Dashboard**: Live (with real-time subscriptions)
- **Admin Cohort Overview**: Every 30 seconds
- **Analytics**: On-demand (with manual refresh option)

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies:

1. **Founders** can:
   - View and update their own profile
   - View and create their own commits/reports
   - View their own stage progress

2. **Admins** can:
   - View and update all founder data
   - View and create mentor notes
   - View audit logs
   - Manage cohorts

3. **System** automatically:
   - Creates mentor notifications on missed deadlines
   - Updates timestamps
   - Calculates metrics

### Authentication

The app uses Supabase Auth with:
- Email/password authentication
- OAuth (Google, LinkedIn)
- User metadata for role management (`user_type`: 'founder' | 'admin')

## Troubleshooting

### "Table does not exist" error
→ Run the schema.sql file in Supabase SQL Editor

### "Permission denied" error
→ Check RLS policies are created correctly

### "Cannot insert" error
→ Verify user is authenticated and has proper role

### No data showing
→ Check browser console for errors
→ Verify Supabase connection in `/utils/supabase/info.tsx`

### Real-time not working
→ Ensure Realtime is enabled for your database in Supabase dashboard
→ Check browser console for subscription errors

## Next Steps

After database setup:

1. ✅ Test founder signup flow
2. ✅ Verify profile creation
3. ✅ Test weekly commit submission
4. ✅ Test weekly report submission
5. ✅ Verify admin dashboard data
6. ✅ Test real-time updates
7. ✅ Configure email notifications

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Review browser console errors
3. Verify all environment variables are set
4. Ensure database schema is fully applied

---

**Important**: This database contains live production data. Always backup before making schema changes.
