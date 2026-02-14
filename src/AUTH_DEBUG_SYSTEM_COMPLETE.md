# Authentication Debug System - Complete

## Summary
Fixed the authentication system errors and added comprehensive debugging tools to both login pages.

## Issues Fixed

### 1. **FounderLayout Error - CRITICAL FIX**
**Problem:** FounderLayout was using old `auth.ts` that tried to query non-existent Supabase database tables (`admin_users`, `founder_profiles`).

**Solution:** Completely rewrote `/lib/auth.ts` to work with KV-based backend:
- `getCurrentUser()` now calls `/auth/me` endpoint to get profile from KV store
- `getFounderData()` retrieves full founder data from KV backend
- `completeOnboarding()` uses correct endpoint `/founders/onboarding`
- `updateFounderData()` calls backend API to update KV store
- All functions include fallback to session metadata if backend unavailable

### 2. **Authentication Debug Tools**
Added comprehensive debug modals to both login pages that diagnose authentication issues.

## New Debug Features

### **Admin Login Page (`/admin/login`)**
**Button:** "🔍 Full Authentication Debug"

**Diagnoses:**
- ✅ Environment (hostname, production detection, project ID)
- ✅ Supabase session status (active/expired, user details)
- ✅ Admin role verification via user_metadata
- ✅ Backend connectivity test (`/auth/me` endpoint)
- ✅ LocalStorage inspection
- ✅ Smart recommendations based on detected issues

**Actions:**
- 📋 Copy debug data to clipboard
- 🗑️ Clear LocalStorage
- 🚪 Sign out from Supabase

### **Founder Login Page (`/login`)**
**Button:** "🔍 Debug Authentication Status"

**Diagnoses:**
- ✅ URL parameters (OAuth code, error messages)
- ✅ OAuth redirect URL configuration
- ✅ Supabase session status
- ✅ User type detection (founder/admin)
- ✅ Backend profile check
- ✅ Onboarding completion status
- ✅ Environment detection

**Actions:**
- 📋 Copy debug data to clipboard
- 🗑️ Clear LocalStorage
- 🚪 Sign out
- 🔄 Retry OAuth callback (if on callback page)

## How to Use the Debug Tools

### Scenario 1: Can't Access Admin Panel
1. Go to `/admin/login`
2. Click "🔍 Full Authentication Debug"
3. Check "Diagnosis & Recommendations" section
4. Look for:
   - ❌ "No active Supabase session found" → Need to log in first
   - ✅ "You are logged in as an admin" → Session is valid
   - ⚠️ "Logged in as FOUNDER not admin" → Wrong account type
   - ❌ "Backend could not authenticate" → JWT/backend issue

### Scenario 2: OAuth "No Authorization Code" Error
1. After OAuth redirect fails, you'll see error page
2. Click "View Debug Info (for troubleshooting)"
3. OR go to `/login` and click "🔍 Debug Authentication Status"
4. Check URL Parameters section:
   - `hasCode: false` → OAuth didn't return code
   - `error: "..."` → OAuth provider error
5. Check OAuth redirect URL matches Supabase dashboard config

### Scenario 3: Can't Access Founder Dashboard
1. Go to `/login`
2. Click "🔍 Debug Authentication Status"
3. Look for:
   - "Session Active" badge → Session exists
   - "Backend recognized your session" → Backend works
   - "Onboarding not complete" → Redirect to onboarding needed
   - Backend errors → API connectivity issue

## Technical Changes

### `/lib/auth.ts` - Complete Rewrite
```typescript
// OLD (broken) - Queried database tables
const { data: founderData } = await supabase
  .from('founder_profiles')
  .select('*')
  .eq('user_id', session.user.id)

// NEW (working) - Calls KV backend
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-eddbcb21/auth/me`,
  {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  }
);
```

### `/pages/AdminLogin.tsx`
- Added `performFullDebug()` function
- Added debug modal with comprehensive diagnostics
- Tests backend `/auth/me` endpoint
- Checks user_metadata for admin role

### `/pages/Login.tsx`
- Added `performFullDebug()` function
- Added debug modal with OAuth diagnostics
- Checks URL parameters for OAuth errors
- Validates OAuth redirect URL configuration
- Includes retry button for failed OAuth

## Common Issues & Solutions

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| "No active session found" | No Supabase session | Log in with credentials or OAuth |
| "No authorization code received" | OAuth callback missing code | Check Supabase OAuth settings, verify redirect URL |
| "Backend could not authenticate" | JWT validation failed | Session may be expired, sign out and sign in again |
| "Logged in as FOUNDER not admin" | Wrong user type | Use admin credentials, not founder account |
| "Onboarding not complete" | Founder profile incomplete | Complete onboarding flow |
| Backend API errors | Network or server issue | Check backend logs, verify Supabase function is running |

## Debug Report Structure

```json
{
  "timestamp": "2026-02-13T...",
  "environment": {
    "hostname": "vendoura.com",
    "isProduction": true,
    "projectId": "knqbtdugvessaehgwwcg",
    "oauthRedirectUrl": "https://vendoura.com/auth/callback"
  },
  "supabaseAuth": {
    "hasSession": true,
    "sessionDetails": {
      "userEmail": "user@example.com",
      "userId": "...",
      "expiresAt": "...",
      "provider": "google"
    }
  },
  "adminStatus": {
    "isLoggedIn": true,
    "adminRole": "super_admin",
    "backendProfile": { ... }
  },
  "recommendations": [
    "✅ You are logged in as an admin via Supabase Auth",
    "✅ Backend recognized your session",
    ...
  ]
}
```

## Next Steps

1. **Test on Production:**
   - Go to `https://vendoura.com/admin/login`
   - Click debug button
   - Share the recommendations section

2. **If Still Getting Errors:**
   - Copy full debug JSON (📋 button)
   - Check browser console for detailed logs
   - Look for specific error messages in backend logs

3. **OAuth Issues:**
   - Verify Supabase Auth providers are enabled
   - Check redirect URLs match exactly
   - Ensure no localhost URLs in production

## Files Modified

1. `/lib/auth.ts` - Complete rewrite for KV backend compatibility
2. `/pages/AdminLogin.tsx` - Added comprehensive debug modal
3. `/pages/Login.tsx` - Added OAuth-focused debug modal

## Success Indicators

When everything works correctly, debug report will show:
- ✅ Session Active badge (green)
- ✅ "You are logged in as: admin" or "founder"
- ✅ "Backend recognized your session"
- ✅ "Onboarding is complete" (for founders)
- No ❌ red error messages in recommendations

The debug tools are now ready to help identify exactly what's wrong with authentication!
