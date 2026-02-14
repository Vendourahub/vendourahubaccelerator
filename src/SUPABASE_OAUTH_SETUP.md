# Supabase OAuth Setup - Action Required

## ⚠️ IMPORTANT: Update Redirect URLs

To enable Google and LinkedIn OAuth, you **MUST** add the callback URL to Supabase.

---

## Step-by-Step Instructions

### 1. Open Supabase Dashboard

Go to: **https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg**

### 2. Navigate to Authentication Settings

1. Click **"Authentication"** in left sidebar
2. Click **"URL Configuration"** tab

### 3. Add Redirect URLs

In the **"Redirect URLs"** section, add these URLs:

#### For Development
```
http://localhost:3000/auth/callback
```

#### For Production
```
https://vendoura.com/auth/callback
```

### 4. Save Changes

Click **"Save"** button at the bottom

---

## Visual Guide

### Where to Find It

```
Supabase Dashboard
  └─ Your Project (knqbtdugvessaehgwwcg)
      └─ Authentication (left sidebar)
          └─ URL Configuration (tab)
              └─ Redirect URLs (section)
                  └─ Add URL button
```

### What It Should Look Like

**Redirect URLs section should contain:**
```
✅ http://localhost:3000/auth/callback
✅ https://vendoura.com/auth/callback
```

---

## Why This is Required

### PKCE OAuth Flow

When users sign in with Google or LinkedIn:

1. User clicks "Continue with Google/LinkedIn"
2. Redirects to OAuth provider (Google/LinkedIn)
3. User authenticates
4. **Provider redirects back to YOUR app**
5. App exchanges code for session

**Step 4 requires the redirect URL to be whitelisted in Supabase.**

Without this, Supabase will reject the redirect and OAuth will fail with:
```
Error: redirect_uri_mismatch
```

---

## Verification

### How to Verify It's Working

1. **Check Supabase Dashboard**
   - URLs should be visible in "Redirect URLs" section
   - Status should show as "Active" or "Enabled"

2. **Test OAuth Flow**
   ```bash
   # Start development server
   npm run dev
   
   # Navigate to
   http://localhost:3000/login
   
   # Click "Continue with Google"
   
   # Should redirect to:
   http://localhost:3000/auth/callback?code=...
   
   # Then redirect to:
   http://localhost:3000/founder/dashboard
   ```

3. **Check Console**
   - Should see: `✅ Code exchanged successfully`
   - Should NOT see: `❌ redirect_uri_mismatch`

---

## Common Issues

### Issue 1: "redirect_uri_mismatch" Error

**Cause:** Callback URL not added to Supabase

**Fix:**
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add `http://localhost:3000/auth/callback`
4. Save changes
5. Try OAuth again

### Issue 2: OAuth Works in Dev, Fails in Production

**Cause:** Production URL not added to Supabase

**Fix:**
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add `https://vendoura.com/auth/callback`
4. Save changes
5. Try OAuth on production

### Issue 3: "Invalid redirect URL" Error

**Cause:** Typo in URL or missing protocol

**Fix:**
- Ensure URL includes `http://` or `https://`
- Check for typos
- Ensure URL matches exactly: `http://localhost:3000/auth/callback`

---

## OAuth Provider Setup

After updating Supabase, you may also need to update OAuth providers:

### Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Click your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3000/auth/callback
   https://vendoura.com/auth/callback
   ```
6. Save

### LinkedIn Developer Portal

1. Go to: https://www.linkedin.com/developers/apps
2. Select your app
3. Go to: Auth tab
4. Under "Redirect URLs", add:
   ```
   http://localhost:3000/auth/callback
   https://vendoura.com/auth/callback
   ```
5. Update

---

## Testing Checklist

After setup:

- [ ] Added `http://localhost:3000/auth/callback` to Supabase
- [ ] Added `https://vendoura.com/auth/callback` to Supabase (for production)
- [ ] Saved changes in Supabase dashboard
- [ ] Updated Google Cloud Console (if using Google OAuth)
- [ ] Updated LinkedIn Developer Portal (if using LinkedIn OAuth)
- [ ] Tested Google OAuth in development
- [ ] Tested LinkedIn OAuth in development
- [ ] Tested Google OAuth in production (after deploy)
- [ ] Tested LinkedIn OAuth in production (after deploy)

---

## Current Configuration

**Project ID:** knqbtdugvessaehgwwcg

**Required Redirect URLs:**
- Development: `http://localhost:3000/auth/callback`
- Production: `https://vendoura.com/auth/callback`

**OAuth Providers:**
- Google OAuth (enabled)
- LinkedIn OIDC (enabled)

**Auth Flow:**
- Type: PKCE (Proof Key for Code Exchange)
- Storage: localStorage
- Storage Key: `vendoura-auth`
- Auto Refresh: Enabled
- Session Detection: Enabled

---

## Quick Start

### Immediate Action Required

```bash
# 1. Go to Supabase Dashboard
https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg

# 2. Authentication → URL Configuration

# 3. Add redirect URLs:
http://localhost:3000/auth/callback
https://vendoura.com/auth/callback

# 4. Save

# 5. Test OAuth
npm run dev
# Visit: http://localhost:3000/login
# Click: "Continue with Google"
```

---

## Support

If OAuth still not working after setup:

1. **Check Supabase Logs**
   - Dashboard → Authentication → Logs
   - Look for OAuth-related errors

2. **Check Browser Console**
   - F12 → Console
   - Look for error messages

3. **Verify Redirect URLs**
   - Supabase Dashboard → Authentication → URL Configuration
   - Ensure URLs match exactly (including protocol)

4. **Test in Incognito**
   - Clear browser cache issues
   - Fresh OAuth flow

5. **Review Documentation**
   - See: `/OAUTH_CALLBACK_FIXED.md`
   - See: `/OAUTH_TEST_GUIDE.md`

---

## Status After Setup

Once redirect URLs are added:

✅ OAuth callback route exists (`/auth/callback`)
✅ OAuth configuration updated in code
✅ Redirect URLs whitelisted in Supabase
✅ OAuth providers configured
✅ Ready for testing
✅ Production-ready

**OAuth should work perfectly!** 🎉

---

## Next Steps

1. ✅ Add redirect URLs to Supabase (THIS STEP)
2. 🔲 Test Google OAuth in development
3. 🔲 Test LinkedIn OAuth in development
4. 🔲 Deploy to production
5. 🔲 Test OAuth in production
6. 🔲 Monitor auth logs
