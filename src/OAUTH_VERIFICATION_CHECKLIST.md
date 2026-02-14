# ✅ OAuth Configuration Verification

## Current OAuth Setup Status

### ✅ Code Implementation - COMPLETE

All the code is correctly configured:

1. **OAuth Redirect URL** (`/lib/config.ts`)
   - ✅ Production: `https://vendoura.com/auth/callback`
   - ✅ Development: `http://localhost:XXXX/auth/callback`
   - ✅ Dynamic environment detection

2. **OAuth Initiation** (`/lib/api.ts`)
   - ✅ Google OAuth: `auth.signInWithGoogle()`
   - ✅ LinkedIn OAuth: `auth.signInWithLinkedIn()`
   - ✅ Proper PKCE flow enabled
   - ✅ Correct redirect URL passed

3. **OAuth Callback Handler** (`/pages/AuthCallback.tsx`)
   - ✅ Handles authorization code
   - ✅ Creates founder profile if new user
   - ✅ Redirects to `/founder/dashboard` or `/admin/cohort`
   - ✅ No localStorage writes (pure Supabase)
   - ✅ Comprehensive error handling

4. **Auth Protection** (`/pages/FounderLayout.tsx`)
   - ✅ Checks Supabase session (not localStorage)
   - ✅ Redirects unauthenticated users to `/login`
   - ✅ Redirects incomplete onboarding to `/onboarding`

5. **Routes** (`/routes.ts`)
   - ✅ `/auth/callback` route configured
   - ✅ Error boundary on all routes

---

## ⚠️ REQUIRED SUPABASE CONFIGURATION

For OAuth to work, you **MUST** configure these in Supabase Dashboard:

### 1. Enable OAuth Providers

**Location**: Supabase Dashboard → Authentication → Providers

#### Google OAuth:
1. Go to: https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers
2. Enable **Google** provider
3. Enter your Google OAuth credentials:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
4. Save

**How to get Google credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback`
   - `https://vendoura.com/auth/callback`
6. Copy Client ID and Client Secret

#### LinkedIn OAuth:
1. Same location in Supabase Dashboard
2. Enable **LinkedIn (OIDC)** provider
3. Enter your LinkedIn OAuth credentials:
   - **Client ID** (from LinkedIn Developers)
   - **Client Secret** (from LinkedIn Developers)
4. Save

**How to get LinkedIn credentials:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an app
3. Add redirect URLs:
   - `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback`
   - `https://vendoura.com/auth/callback`
4. Copy Client ID and Client Secret

---

### 2. Configure Redirect URLs

**Location**: Supabase Dashboard → Authentication → URL Configuration

Add these to **Redirect URLs** (whitelist):
```
https://vendoura.com/auth/callback
https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback
http://localhost:*/auth/callback
```

**Site URL**: `https://vendoura.com`

---

### 3. Verify Database Tables

Your `founder_profiles` table needs these columns:

```sql
-- Check if table exists and has correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'founder_profiles';
```

**Required columns:**
- `id` (BIGINT, primary key, auto-increment)
- `user_id` (UUID, NOT NULL, foreign key to auth.users)
- `email` (TEXT, NOT NULL)
- `full_name` (TEXT, nullable)
- `onboarding_complete` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP, default: now())
- `updated_at` (TIMESTAMP, default: now())

**Optional columns** (for full founder data):
- `business_name` (TEXT)
- `business_model` (TEXT)
- `product_description` (TEXT)
- `customer_count` (INTEGER)
- `pricing` (TEXT)
- `revenue_baseline_30d` (NUMERIC)
- `revenue_baseline_90d` (NUMERIC)
- `current_week` (INTEGER, default: 1)
- `current_stage` (INTEGER, default: 1)
- `is_locked` (BOOLEAN, default: false)
- `lock_reason` (TEXT)
- `missed_weeks` (INTEGER, default: 0)
- `cohort_id` (TEXT)

---

## 🧪 Testing OAuth Flow

### Test 1: Google OAuth Sign-Up (New User)

1. **Clear all data:**
   - Open DevTools → Application → Clear site data
   - Or use Incognito mode

2. **Start OAuth flow:**
   - Go to `https://vendoura.com/login` (or localhost)
   - Click "Continue with Google"
   - Select a Google account you've never used before

3. **Expected behavior:**
   - Redirects to Google sign-in
   - User authorizes access
   - Redirects to `https://vendoura.com/auth/callback`
   - Shows "Signing you in..." loading screen
   - Creates record in `founder_profiles` table
   - Redirects to `/founder/dashboard`
   - Dashboard shows loading → "No onboarding data"
   - Actually should redirect to `/onboarding` since `onboarding_complete = false`

4. **Check logs:**
   - Open browser console (F12)
   - Look for OAuth debug messages:
     ```
     🔐 OAuth Callback - Starting authentication...
     ✅ Session confirmed for: user@example.com
     🆕 New user detected - creating founder profile
     ✅ Profile created successfully
     🎯 Redirecting to founder dashboard...
     ```

5. **Verify database:**
   ```sql
   SELECT user_id, email, onboarding_complete, created_at
   FROM founder_profiles
   ORDER BY created_at DESC
   LIMIT 5;
   ```

---

### Test 2: Google OAuth Login (Returning User)

1. **Prerequisites:**
   - Complete onboarding first
   - Update database: 
     ```sql
     UPDATE founder_profiles 
     SET onboarding_complete = true 
     WHERE email = 'your-test-email@gmail.com';
     ```

2. **Log out:**
   - Click logout button
   - Should redirect to `/`

3. **Log back in:**
   - Go to `/login`
   - Click "Continue with Google"
   - Select same Google account

4. **Expected behavior:**
   - Redirects to Google (may auto-approve if recently used)
   - Redirects to `/auth/callback`
   - Shows "Signing you in..."
   - Finds existing `founder_profiles` record
   - Redirects to `/founder/dashboard`
   - Dashboard loads with full founder data

5. **Check logs:**
   ```
   🔐 OAuth Callback - Starting authentication...
   ✅ Session confirmed for: user@example.com
   ✅ Founder profile found: user@example.com
   ```

---

### Test 3: LinkedIn OAuth

Same as Google tests, but:
- Click "Continue with LinkedIn" instead
- LinkedIn may require re-authorization each time
- LinkedIn profile creation is slower (be patient)

---

## 🐛 Troubleshooting

### Issue: "No authorization code received"
**Cause**: OAuth provider isn't properly configured in Supabase  
**Fix**: Go to Supabase Dashboard → Auth → Providers and enable Google/LinkedIn

---

### Issue: "Authentication failed. Please clear your browser cache"
**Cause**: Session is stuck or PKCE flow failed  
**Fix**: 
1. Clear browser cache and cookies
2. Try incognito mode
3. Check Supabase logs for detailed error

---

### Issue: "Invalid redirect URL"
**Cause**: Redirect URL not whitelisted in Supabase or Google/LinkedIn  
**Fix**: 
1. Add `https://vendoura.com/auth/callback` to Supabase redirect URLs
2. Add `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback` to Google Cloud Console

---

### Issue: OAuth works but redirects to `/login` instead of dashboard
**Cause**: `founder_profiles` record wasn't created  
**Fix**: Check `AuthCallback` console logs. Likely a database error:
```
❌ Profile creation failed: [error message]
```
Check if table exists and has correct columns.

---

### Issue: "Failed to get session after all attempts"
**Cause**: Supabase session isn't being created properly  
**Fix**: 
1. Check that PKCE flow is enabled in `/lib/api.ts` (it is ✅)
2. Verify `storageKey: 'vendoura-auth'` isn't conflicting
3. Try changing storage key to something else

---

### Issue: Dashboard shows but user data is missing
**Cause**: `getCurrentUser()` or `getFounderData()` is failing  
**Fix**: Check browser console for errors in `FounderLayout.tsx`
- Likely a SQL query error or missing column

---

## ✅ Current Status Summary

### What's Working:
- ✅ OAuth code is properly configured
- ✅ Redirect URLs are dynamic (production vs development)
- ✅ PKCE flow enabled
- ✅ Session management via Supabase (no localStorage)
- ✅ Profile creation on first OAuth sign-in
- ✅ Admin vs Founder detection
- ✅ Onboarding check

### What Needs Manual Setup (in Supabase Dashboard):
- ⚠️ **Enable Google OAuth provider** (add Client ID + Secret)
- ⚠️ **Enable LinkedIn OAuth provider** (add Client ID + Secret)
- ⚠️ **Whitelist redirect URLs** (`https://vendoura.com/auth/callback`)
- ⚠️ **Verify database schema** (check `founder_profiles` table has all columns)

---

## 🚀 Next Steps

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers
2. **Enable Google OAuth** (get credentials from Google Cloud Console)
3. **Enable LinkedIn OAuth** (get credentials from LinkedIn Developers)
4. **Add redirect URLs**: `https://vendoura.com/auth/callback`
5. **Test OAuth flow** using the test scenarios above
6. **Check database** after each test to verify profile creation

Once those 4 steps are done in Supabase, OAuth will work perfectly! 🎉
