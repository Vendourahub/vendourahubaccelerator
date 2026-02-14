# Fix: Application Redirecting to localhost:3000

## The Problem
After OAuth login (Google/LinkedIn), you're being redirected to `http://localhost:3000` instead of `https://vendoura.com`.

## Root Cause
Your **code is correct** (uses `window.location.origin`), but **Supabase Dashboard settings** have `localhost:3000` hardcoded as the Site URL.

---

## 🔧 STEP-BY-STEP FIX

### 1. Update Supabase Site URL

**Go to**: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/url-configuration

**Find**: "Site URL" field (usually at the top)

**Current value (WRONG)**:
```
http://localhost:3000
```

**Change to**:
```
https://vendoura.com
```

**Click**: SAVE

**⏱️ Wait**: 1-2 minutes for changes to propagate

---

### 2. Update Redirect URLs

**Same page**: Scroll to "Redirect URLs" section

**Add BOTH** (production and development):
```
https://vendoura.com/
https://vendoura.com/**
http://localhost:3000/
http://localhost:3000/**
```

**Note**: The `/**` wildcard allows all sub-paths.

**Click**: SAVE

---

### 3. Verify OAuth Provider Settings

#### Google OAuth Console
**URL**: https://console.cloud.google.com/apis/credentials

1. Select your project
2. Go to: **APIs & Services → Credentials**
3. Click on your **OAuth 2.0 Client ID**
4. **Authorized redirect URIs** should have:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   ```
5. **Authorized JavaScript origins** should have:
   ```
   https://vendoura.com
   ```
6. Click **SAVE**

#### LinkedIn OAuth Settings
**URL**: https://www.linkedin.com/developers/apps

1. Select your app
2. Go to: **Auth** tab
3. **Redirect URLs** should have:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   ```
4. Click **Update**

---

### 4. Clear Browser Cache

**Important**: Old redirects may be cached!

**Option A - Clear Everything**:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

**Option B - Use Incognito**:
1. Open new Incognito/Private window
2. Test OAuth flow fresh

---

### 5. Test the Flow

**Wait 5-10 minutes** after making changes, then:

1. Go to: `https://vendoura.com/login`
2. Click: "Continue with Google"
3. Authorize the app
4. **Expected redirect flow**:
   ```
   Google OAuth
   ↓
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback?code=XXX
   ↓
   https://vendoura.com/?code=XXX
   ↓
   https://vendoura.com/onboarding
   ```

5. **Check browser console** for:
   ```
   ✅ Current origin: https://vendoura.com
   ✅ OAuth code detected, exchanging for session...
   ✅ Code exchanged successfully
   ```

---

## 🐛 Still Not Working?

### Issue: Still redirects to localhost

**Cause**: Site URL in Supabase is still set to localhost

**Fix**:
1. Go back to Supabase URL Configuration
2. **Double-check** Site URL is `https://vendoura.com`
3. Click SAVE again
4. **Wait 5 minutes**
5. Clear browser cache completely
6. Test in Incognito mode

### Issue: "redirect_uri_mismatch" error

**Cause**: Google/LinkedIn don't have the correct callback URL

**Fix**:
1. Verify OAuth providers have: `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback`
2. **NOT**: `https://vendoura.com/auth/callback`
3. The Supabase URL is the OAuth callback, your domain is the final redirect

### Issue: Code in URL but not exchanging

**Cause**: PKCE flow not completing

**Fix**:
1. Check browser console for errors
2. Verify Supabase Redirect URLs include `https://vendoura.com/**`
3. Make sure you're not blocking third-party cookies
4. Try different browser

---

## ✅ How to Verify It's Fixed

### Before (WRONG):
```
User clicks "Sign in with Google"
↓
Redirects to: http://localhost:3000/?code=XXX
❌ Wrong domain
```

### After (CORRECT):
```
User clicks "Sign in with Google"
↓
Redirects to: https://vendoura.com/?code=XXX
↓
Redirects to: https://vendoura.com/onboarding
✅ Correct domain
```

---

## 📋 Quick Checklist

- [ ] Supabase Site URL = `https://vendoura.com`
- [ ] Supabase Redirect URLs include `https://vendoura.com/**`
- [ ] Google OAuth has `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback`
- [ ] LinkedIn OAuth has `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback`
- [ ] Waited 5 minutes after saving changes
- [ ] Cleared browser cache
- [ ] Tested in Incognito mode

---

## 🔍 Debug Mode

Add this to your `/App.tsx` to see exactly what's happening:

```typescript
useEffect(() => {
  console.log('🌍 Current origin:', window.location.origin);
  console.log('🔗 Full URL:', window.location.href);
  console.log('📍 Pathname:', window.location.pathname);
  console.log('🔎 Search params:', window.location.search);
}, []);
```

This will show you:
- Where you are
- What URL you landed on
- If there's a code parameter

---

## Why This Happens

The OAuth flow has **3 redirect steps**:

1. **Your app** → OAuth Provider (Google/LinkedIn)
   - Controlled by: Your code ✅
   - Uses: `window.location.origin` ✅

2. **OAuth Provider** → Supabase Callback
   - Controlled by: OAuth provider settings
   - Uses: Configured redirect URI
   - Must be: `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback`

3. **Supabase** → Your app (final redirect)
   - Controlled by: **Supabase Site URL** ⚠️
   - This is where localhost is coming from!
   - Must be: `https://vendoura.com`

---

## Need More Help?

If still not working after following ALL steps above, share:

1. Screenshot of Supabase URL Configuration page
2. Screenshot of Google OAuth Redirect URIs
3. The exact URL you see after OAuth authorization
4. Browser console logs during OAuth flow

The issue is 100% in configuration, not code!
