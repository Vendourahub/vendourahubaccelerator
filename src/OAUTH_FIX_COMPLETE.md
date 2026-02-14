# OAuth Redirect Fix - Complete Guide

## Problem
OAuth (Google/LinkedIn) was redirecting to `localhost:3000` instead of `https://vendoura.com` after authentication.

## Root Cause
Two issues were causing this:
1. **Application Code**: `redirectTo: window.location.origin` was using localhost during local development
2. **Supabase Settings**: Site URL in Supabase dashboard was set to localhost

## ✅ Solution Implemented

### 1. **Application Code Fixed** (`/lib/api.ts`)

**Before**:
```typescript
signInWithGoogle: async (userType: 'founder' | 'admin' = 'founder') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // ❌ Uses localhost in dev
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}
```

**After**:
```typescript
signInWithGoogle: async (userType: 'founder' | 'admin' = 'founder') => {
  // ALWAYS use production URL for OAuth redirects
  const redirectUrl = 'https://vendoura.com';
  
  console.log('🔐 Google OAuth initiated:', {
    userType,
    redirectUrl,
    currentOrigin: window.location.origin
  });
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl, // ✅ Always uses production URL
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'email profile',
    },
  });
}
```

Same fix applied to `signInWithLinkedIn`.

### 2. **Supabase Dashboard Settings** (YOU MUST DO THIS)

Go to Supabase Dashboard and update these settings:

#### **Step 1: Update Site URL**
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/url-configuration
2. Find **"Site URL"** field
3. Change from: `http://localhost:3000`
4. Change to: `https://vendoura.com`
5. Click **Save**

#### **Step 2: Update Redirect URLs**
In the same page, update **"Redirect URLs"**:

**Add these URLs** (one per line):
```
https://vendoura.com
https://vendoura.com/**
https://vendoura.com/onboarding
https://vendoura.com/founder/dashboard
https://vendoura.com/admin
https://vendoura.com/admin/cohort
http://localhost:3000/**
```

**Remove** any localhost-only URLs if you're done with development.

#### **Step 3: Verify OAuth Provider Settings**

**Google OAuth**:
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/providers
2. Find "Google" provider
3. Verify these settings:
   - ✅ **Enabled**: Yes
   - ✅ **Client ID**: (your Google client ID)
   - ✅ **Client Secret**: (your Google client secret)
   - ✅ **Redirect URL**: Copy this and add to Google Cloud Console

**LinkedIn OAuth**:
1. In same Providers page, find "LinkedIn (OIDC)"
2. Verify:
   - ✅ **Enabled**: Yes
   - ✅ **Client ID**: (your LinkedIn client ID)
   - ✅ **Client Secret**: (your LinkedIn client secret)
   - ✅ **Redirect URL**: Copy this and add to LinkedIn Developer Portal

#### **Step 4: Update Google Cloud Console**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client
3. Edit **Authorized redirect URIs**
4. Add:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   https://vendoura.com
   ```
5. **Remove** `http://localhost:3000` if no longer needed
6. Save changes

#### **Step 5: Update LinkedIn Developer Portal**

1. Go to: https://www.linkedin.com/developers/apps
2. Select your app
3. Go to "Auth" tab
4. Update **Redirect URLs**:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   https://vendoura.com
   ```
5. Save changes

---

## 🧪 Testing the Fix

### **Test 1: Google Sign In**
1. Go to: https://vendoura.com/apply
2. Click "Continue with Google"
3. Select Google account
4. After authentication, you should be redirected to:
   - ✅ `https://vendoura.com` (not localhost!)
5. Check browser console for:
   ```
   🔐 Google OAuth initiated: { userType: 'founder', redirectUrl: 'https://vendoura.com', ... }
   ✅ Google OAuth initiated successfully
   ```

### **Test 2: LinkedIn Sign In**
1. Go to: https://vendoura.com/apply
2. Click "Continue with LinkedIn"
3. Authorize the app
4. Should redirect to:
   - ✅ `https://vendoura.com` (not localhost!)
5. Check browser console for:
   ```
   🔐 LinkedIn OAuth initiated: { userType: 'founder', redirectUrl: 'https://vendoura.com', ... }
   ✅ LinkedIn OAuth initiated successfully
   ```

### **Test 3: Complete Flow**
1. Sign in with Google/LinkedIn
2. Redirected to `https://vendoura.com` with code parameter
3. App detects auth session
4. Creates founder profile automatically (from App.tsx)
5. Redirects to `/onboarding` or `/founder/dashboard`

---

## 🔍 Debugging

If it still redirects to localhost after these changes:

### **Check 1: Clear Browser Cache**
```
1. Open DevTools (F12)
2. Go to Application > Storage
3. Click "Clear site data"
4. Close all tabs
5. Restart browser
6. Try again
```

### **Check 2: Verify Supabase Settings Saved**
```
1. Go to Supabase Dashboard > Auth > URL Configuration
2. Verify Site URL shows: https://vendoura.com
3. Wait 5 minutes for changes to propagate
4. Try OAuth again
```

### **Check 3: Check Console Logs**
Open browser console (F12) and look for:
```
✅ Good signs:
🔐 Google OAuth initiated: { redirectUrl: 'https://vendoura.com' }
✅ Google OAuth initiated successfully

❌ Bad signs:
🔐 Google OAuth initiated: { redirectUrl: 'http://localhost:3000' }
```

If you see localhost in the logs, the code didn't update properly. Hard refresh (Ctrl+Shift+R).

### **Check 4: Verify OAuth Callback URL**
In the OAuth redirect URL you provided:
```
https://accounts.google.com/v3/signin/accountchooser?...
&redirect_uri=https%3A%2F%2Fidhyjerrdrcaitfmbtjd.supabase.co%2Fauth%2Fv1%2Fcallback
&redirect_to=https%3A%2F%2Fwww.vendoura.com
```

The `redirect_to` parameter should show `vendoura.com` (not localhost).

---

## 📊 OAuth Flow Diagram

```
User clicks "Sign in with Google"
↓
App calls auth.signInWithGoogle()
↓
Supabase SDK sends request with redirectTo: 'https://vendoura.com'
↓
Google OAuth consent screen
↓
User authorizes
↓
Google redirects to: https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback?code=...
↓
Supabase processes OAuth callback
↓
Supabase redirects to: https://vendoura.com?code=...
↓
App.tsx detects session
↓
Creates founder profile if needed
↓
Redirects to /onboarding or /founder/dashboard
```

---

## ⚠️ Common Mistakes

### **Mistake 1: Forgetting to Save Supabase Settings**
- After changing Site URL, you MUST click "Save"
- Wait 5 minutes for changes to propagate globally

### **Mistake 2: Using www vs non-www**
- Decide on one: `https://vendoura.com` OR `https://www.vendoura.com`
- Use the same one everywhere (code, Supabase, Google Console, LinkedIn)
- Add both to redirect URLs if needed

### **Mistake 3: Not Clearing Browser Cache**
- OAuth tokens can be cached
- Always clear cache after making changes
- Use incognito mode for testing

### **Mistake 4: Mixing Production and Development**
If you need BOTH production and local development:

**In code** (`/lib/api.ts`):
```typescript
// Detect environment
const isProduction = window.location.hostname === 'vendoura.com' || 
                     window.location.hostname === 'www.vendoura.com';

const redirectUrl = isProduction 
  ? 'https://vendoura.com' 
  : 'http://localhost:3000';
```

**In Supabase Redirect URLs**, add both:
```
https://vendoura.com/**
http://localhost:3000/**
```

---

## ✅ Verification Checklist

Before testing, verify ALL of these:

- [ ] `/lib/api.ts` has `redirectUrl = 'https://vendoura.com'`
- [ ] Supabase Site URL = `https://vendoura.com`
- [ ] Supabase Redirect URLs includes `https://vendoura.com/**`
- [ ] Google Cloud Console redirect URI includes Supabase callback URL
- [ ] LinkedIn Developer Portal redirect URI includes Supabase callback URL
- [ ] Browser cache cleared
- [ ] Tested in incognito mode
- [ ] Console shows correct redirectUrl in logs

---

## 🎯 Summary

**What was changed**:
1. ✅ Updated OAuth code to use `https://vendoura.com` (not `window.location.origin`)
2. ✅ Added debug logging to track OAuth flow
3. ✅ Added proper scopes for Google and LinkedIn

**What YOU need to do**:
1. ⚠️ Update Supabase Site URL to `https://vendoura.com`
2. ⚠️ Update Supabase Redirect URLs
3. ⚠️ Verify Google Cloud Console settings
4. ⚠️ Verify LinkedIn Developer Portal settings
5. ⚠️ Clear browser cache and test

After completing these steps, OAuth will redirect to `https://vendoura.com` instead of localhost! 🚀
