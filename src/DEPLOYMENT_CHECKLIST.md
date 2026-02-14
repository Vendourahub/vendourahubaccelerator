# Vendoura Hub - Production Deployment Checklist

## 🎯 Overview
This checklist ensures your Vendoura Hub application is properly configured for production deployment at `https://vendoura.com`.

---

## 📋 Pre-Deployment Checklist

### **1. Database Setup** ✅ CRITICAL

#### **Run SQL Migration**
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/editor
2. Click **"SQL Editor"** → **"New Query"**
3. Copy contents of `/supabase_schema.sql`
4. Paste and click **"Run"**
5. Verify all tables created:
   - `system_settings`
   - `waitlist`
   - `founder_profiles`
   - `weekly_commits`
   - `weekly_reports`
   - `stage_progress`
   - `mentor_notes`
   - `audit_logs`

#### **Verify Row Level Security (RLS)**
1. In Supabase Dashboard, go to **Table Editor**
2. For each table, click the lock icon
3. Verify **"RLS enabled"** is checked ✅
4. Click **"View policies"** to see security rules

---

### **2. OAuth Configuration** ✅ CRITICAL

#### **A. Supabase Settings**

**Site URL Configuration**:
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/url-configuration
2. Set **"Site URL"**: `https://vendoura.com`
3. Click **Save**

**Redirect URLs**:
Add these URLs (one per line):
```
https://vendoura.com
https://vendoura.com/**
https://vendoura.com/onboarding
https://vendoura.com/founder/dashboard
https://vendoura.com/admin
https://vendoura.com/admin/cohort
```

**Additional Redirect URLs** (if using www):
```
https://www.vendoura.com
https://www.vendoura.com/**
```

#### **B. Google Cloud Console**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client
3. Under **"Authorized redirect URIs"**, add:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   ```
4. **Remove** any localhost URLs (unless needed for development)
5. Save changes

#### **C. LinkedIn Developer Portal**

1. Go to: https://www.linkedin.com/developers/apps
2. Select your application
3. Click **"Auth"** tab
4. Under **"Redirect URLs"**, add:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   ```
5. Save changes

#### **D. Supabase Provider Settings**

1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/providers
2. **Google**:
   - Enable: ✅ Yes
   - Client ID: `857434256696-b0p8kaio419oefu4o159e0h2v1gu73q4.apps.googleusercontent.com`
   - Client Secret: (your secret)
3. **LinkedIn (OIDC)**:
   - Enable: ✅ Yes
   - Client ID: (your LinkedIn client ID)
   - Client Secret: (your LinkedIn secret)

---

### **3. Create Super Admin Account** ✅ REQUIRED

You need at least one super admin to access the control panel.

#### **Option A: Via Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. After creation, click the user
5. Edit **"Raw User Meta Data"**
6. Set:
   ```json
   {
     "user_type": "admin",
     "admin_role": "super_admin",
     "name": "Your Name"
   }
   ```
7. Save

#### **Option B: Via SQL**
```sql
-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Update user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'user_type', 'admin',
  'admin_role', 'super_admin',
  'name', 'Your Name'
)
WHERE email = 'your-email@example.com';
```

---

### **4. System Settings** ✅ REQUIRED

The super admin control panel needs initial settings.

#### **Verify Default Settings**
```sql
SELECT * FROM system_settings;
```

Should return:
```
id | cohort_program_active | current_cohort_name | current_cohort_week
---|-----------------------|---------------------|--------------------
 1 | true                  | Cohort 3 - Feb 2026 | 4
```

If empty, insert:
```sql
INSERT INTO system_settings (id, cohort_program_active, current_cohort_name, current_cohort_week)
VALUES (1, true, 'Cohort 3 - Feb 2026', 4);
```

---

### **5. Email Configuration** ⚠️ OPTIONAL

For production, configure custom SMTP for transactional emails.

1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/templates
2. **Enable Custom SMTP** (optional but recommended)
3. Configure your email provider (SendGrid, AWS SES, etc.)
4. Customize email templates:
   - Confirmation email
   - Password reset
   - Magic link

---

### **6. Environment Variables** ✅ CHECK

Verify these are set correctly in your deployment platform (Vercel/Netlify/etc.):

```bash
# Supabase
VITE_SUPABASE_PROJECT_ID=idhyjerrdrcaitfmbtjd
VITE_SUPABASE_ANON_KEY=(your anon key)

# Application
VITE_APP_URL=https://vendoura.com
VITE_OAUTH_REDIRECT_URL=https://vendoura.com
```

---

## 🧪 Testing Checklist

### **Test 1: Email Signup**
1. Go to: `https://vendoura.com/apply`
2. Fill out application form
3. Check all commitment boxes
4. Submit
5. ✅ Should create account and show success screen

### **Test 2: Google OAuth**
1. Go to: `https://vendoura.com/apply`
2. Click **"Continue with Google"**
3. Select Google account
4. Authorize
5. ✅ Should redirect to `https://vendoura.com` (NOT localhost)
6. ✅ Profile should auto-create in database

### **Test 3: LinkedIn OAuth**
1. Go to: `https://vendoura.com/apply`
2. Click **"Continue with LinkedIn"**
3. Authorize
4. ✅ Should redirect to `https://vendoura.com`
5. ✅ Profile should auto-create

### **Test 4: Admin Access**
1. Go to: `https://vendoura.com/admin`
2. Sign in with super admin credentials
3. ✅ Should see Cohort Overview dashboard
4. ✅ Should see founder(s) if any signed up

### **Test 5: Super Admin Control**
1. Sign in as super admin
2. Go to: `https://vendoura.com/admin/superadmin`
3. ✅ Should see 3 tabs: Settings, Users, Waitlist
4. Click **"Active"** toggle
5. ✅ Should toggle to "Inactive"
6. Visit `/apply` in new tab
7. ✅ Should show "Join Waitlist" form

### **Test 6: Waitlist Flow**
1. Ensure cohort program is **inactive**
2. Go to: `https://vendoura.com/apply`
3. Fill out waitlist form (name, email)
4. Submit
5. ✅ Should show "You're on the Waitlist" message
6. Check Supabase **waitlist** table
7. ✅ Entry should exist

### **Test 7: Database Connection**
1. Sign in as admin
2. Go to: `https://vendoura.com/admin/cohort`
3. Open browser console (F12)
4. Look for logs:
   ```
   🔄 Fetching cohort data from Supabase...
   📡 Supabase Query: getAllFounders all cohorts
   📊 Supabase Response: { data: X, error: null }
   ✅ Founders fetched: X
   ```
5. ✅ No permission errors

---

## 🚨 Troubleshooting

### **Problem: OAuth redirects to localhost**

**Solution**:
1. Clear browser cache completely
2. Verify Supabase Site URL = `https://vendoura.com`
3. Wait 5 minutes for changes to propagate
4. Try in incognito mode
5. Check console logs for `redirectUrl` value

### **Problem: "Permission denied" in database**

**Solution**:
1. Check RLS is enabled on table
2. Verify user has correct metadata (`user_type`, `admin_role`)
3. Check RLS policies are created
4. Run this to verify user metadata:
   ```sql
   SELECT id, email, raw_user_meta_data 
   FROM auth.users 
   WHERE email = 'your-email@example.com';
   ```

### **Problem: No founders showing in admin dashboard**

**Solution**:
1. Database is empty - sign up a test user
2. Check browser console for errors
3. Verify Supabase queries are running:
   ```
   📡 Supabase Query: getAllFounders
   📊 Supabase Response: { data: 0, error: null }
   ```
4. If error, check RLS policies

### **Problem: Super admin can't see control panel**

**Solution**:
1. Verify user metadata has `admin_role: "super_admin"`
2. Check admin is logged in (not founder)
3. Try logging out and back in
4. Clear localStorage and retry

### **Problem: Waitlist toggle doesn't work**

**Solution**:
1. Check `system_settings` table exists
2. Verify RLS policy allows super admins to update
3. Check browser console for errors
4. Try running SQL directly:
   ```sql
   UPDATE system_settings 
   SET cohort_program_active = false 
   WHERE id = 1;
   ```

---

## 📊 Monitoring

### **Check Database Health**
```sql
-- Count users by type
SELECT 
  raw_user_meta_data->>'user_type' as user_type,
  COUNT(*) as count
FROM auth.users
GROUP BY user_type;

-- Count founders
SELECT COUNT(*) FROM founder_profiles;

-- Count waitlist
SELECT COUNT(*) FROM waitlist WHERE notified = false;

-- Recent signups
SELECT email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### **Check System Status**
```sql
-- Current cohort settings
SELECT * FROM system_settings;

-- Recent audit logs
SELECT * FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

---

## ✅ Final Verification

Before going live, verify ALL of these:

**Database**:
- [ ] All tables created from migration
- [ ] RLS enabled on all tables
- [ ] System settings initialized
- [ ] At least one super admin exists

**OAuth**:
- [ ] Supabase Site URL = `https://vendoura.com`
- [ ] Supabase Redirect URLs configured
- [ ] Google OAuth provider enabled with correct credentials
- [ ] LinkedIn OAuth provider enabled
- [ ] Google Cloud Console redirect URI added
- [ ] LinkedIn Developer Portal redirect URI added

**Application**:
- [ ] `/lib/api.ts` uses `OAUTH_REDIRECT_URL` from config
- [ ] Environment variables set correctly
- [ ] Debug logging enabled (check `/lib/config.ts`)

**Testing**:
- [ ] Email signup works
- [ ] Google OAuth works and redirects correctly
- [ ] LinkedIn OAuth works
- [ ] Admin can access dashboard
- [ ] Super admin can access control panel
- [ ] Cohort toggle works
- [ ] Waitlist flow works

---

## 🎉 Launch!

Once all checkboxes are complete:
1. Deploy to production
2. Test all flows one more time
3. Monitor error logs for first 24 hours
4. Be ready to rollback if issues arise

**Support Contacts**:
- Supabase Support: support@supabase.io
- Google OAuth: https://support.google.com/cloud
- LinkedIn: https://www.linkedin.com/help/linkedin

---

## 📚 Documentation References

- `/OAUTH_FIX_COMPLETE.md` - Complete OAuth redirect fix guide
- `/SUPABASE_INTEGRATION_COMPLETE.md` - Supabase integration guide
- `/supabase_schema.sql` - Database schema and RLS policies
- `/lib/config.ts` - Application configuration

**Good luck with your launch! 🚀**
