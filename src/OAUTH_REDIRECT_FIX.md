# OAuth Redirect to Localhost - Complete Fix

## The Problem
OAuth is redirecting to `http://localhost:3000` instead of `https://vendoura.com`, even though the code uses `window.location.origin`.

## Root Cause
The redirect URL is configured in **THREE PLACES**, and ALL must match your production domain:

1. ✅ **Code** (Already correct - uses `window.location.origin`)
2. ❌ **Supabase Settings** (Likely set to localhost)
3. ❌ **OAuth Provider Settings** (Google/LinkedIn likely have localhost)

---

## STEP 1: Fix Supabase Settings

### Go to Supabase Dashboard:
**URL**: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/url-configuration

### Update Site URL:
Change from `http://localhost:3000` to:
```
https://vendoura.com
```

### Update Redirect URLs:
Add BOTH production AND development URLs:
```
https://vendoura.com/
https://vendoura.com/**
http://localhost:3000/
http://localhost:3000/**
```

**Click SAVE and wait 1 minute for changes to propagate.**

---

## STEP 2: Fix Google OAuth Settings

### Go to Google Cloud Console:
**URL**: https://console.cloud.google.com/apis/credentials

### Steps:
1. **Select your project** (the one with your OAuth client)
2. **Go to**: APIs & Services → Credentials
3. **Find**: OAuth 2.0 Client ID for Vendoura
4. **Click**: Edit (pencil icon)

### Update Authorized Redirect URIs:
**REMOVE** any localhost entries **OR** keep them for development.

**ADD** these two URIs:
```
https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
https://vendoura.com/
```

**Note**: The Supabase callback URL is the PRIMARY redirect. The vendoura.com URL is the final destination.

### Save Changes
Click **SAVE** at the bottom.

**Important**: Google takes 5-10 minutes to propagate changes. Wait before testing.

---

## STEP 3: Fix LinkedIn OAuth Settings

### Go to LinkedIn Developer Portal:
**URL**: https://www.linkedin.com/developers/apps

### Steps:
1. **Select your app**
2. **Go to**: Auth tab
3. **Find**: Redirect URLs section

### Update Redirect URLs:
**ADD** these two URLs:
```
https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
https://vendoura.com/
```

**Keep localhost URLs if you want local development to work:**
```
http://localhost:3000/
```

### Save Changes
Click **Update** button.

---

## STEP 4: Verify Configuration

### Check All Settings Match:

| Location | Site/Origin URL | Callback/Redirect URL |
|----------|----------------|----------------------|
| **Supabase** | `https://vendoura.com` | `https://vendoura.com/**` |
| **Google OAuth** | — | `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback` |
| **LinkedIn OAuth** | — | `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback` |
| **Code** | `window.location.origin` | (automatic) |

---

## STEP 5: Test the Flow

### Wait 5-10 minutes after making changes, then:

1. **Clear browser cache** or use **Incognito/Private mode**
2. **Go to**: `https://vendoura.com/login`
3. **Click**: "Continue with Google"
4. **Authorize the app**
5. **Expected flow**:
   ```
   Google → https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback?code=XXX
           ↓
   Supabase exchanges code for session
           ↓
   Redirects to: https://vendoura.com/?code=XXX
           ↓
   App.tsx exchanges code
           ↓
   Redirects to: https://vendoura.com/onboarding
   ```

6. **Check console logs** for:
   - ✅ "Current origin: https://vendoura.com"
   - ✅ "OAuth code detected, exchanging for session..."
   - ✅ "Code exchanged successfully"

---

## Common Issues

### Still redirecting to localhost?

1. **Clear ALL browser data** (cache, cookies, local storage)
2. **Check Supabase Site URL** is set to `https://vendoura.com`
3. **Wait 10 minutes** after saving Google/LinkedIn settings
4. **Verify OAuth providers** have the Supabase callback URL, not localhost

### Getting "redirect_uri_mismatch" error?

This means Google/LinkedIn don't have the correct callback URL.

**Fix**: Add `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback` to BOTH Google and LinkedIn OAuth settings.

### Code exchange fails?

Check browser console for errors. If you see CORS errors, verify:
- Supabase URL Configuration has your domain
- OAuth providers have Supabase callback URL

---

## How OAuth Flow Works (Correct)

```mermaid
User clicks "Sign in with Google" on https://vendoura.com/login
    ↓
Redirects to Google OAuth page
    ↓
User authorizes app
    ↓
Google redirects to: https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback?code=XXX
    ↓
Supabase backend:
  - Validates code with Google
  - Exchanges code for access token
  - Creates/updates user in auth.users
  - Generates session
    ↓
Supabase redirects to: https://vendoura.com/?code=XXX
    ↓
App.tsx (vendoura.com):
  - Detects code in URL
  - Calls exchangeCodeForSession()
  - Creates founder profile if new user
  - Redirects to /onboarding or /dashboard
```

---

## Why This Matters

**Security**: The PKCE flow prevents token exposure in URLs.
**Supabase**: Acts as the OAuth middleman to keep tokens secure.
**Your App**: Only receives a temporary code, never sees tokens directly.

---

## After Fixing

Once OAuth is working, **all new users** will:
1. ✅ Be created in Supabase Auth (`auth.users`)
2. ✅ Automatically get a profile in `founder_profiles` table
3. ✅ Be visible in the Admin Dashboard
4. ✅ Be redirected to `/onboarding` to complete setup

---

## Need Help?

If still having issues, share:
1. Screenshot of Supabase URL Configuration page
2. Screenshot of Google OAuth Redirect URIs
3. Console logs from browser when testing OAuth
4. The exact URL you're redirected to after authorizing
