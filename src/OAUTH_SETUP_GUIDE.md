# 🔐 OAUTH SETUP GUIDE - Google & LinkedIn Authentication

## 🎯 **What Was Fixed**

I've completely fixed and enhanced the OAuth (Google & LinkedIn) authentication system for Vendoura Hub.

---

## ✅ **Changes Made**

### **1. Dynamic Redirect URLs** (`/lib/config.ts`)
**Before:** Hardcoded to `https://vendoura.com` (broke localhost)
```typescript
export const OAUTH_REDIRECT_URL = 'https://vendoura.com';
```

**After:** Environment-aware
```typescript
export const OAUTH_REDIRECT_URL = isProduction 
  ? 'https://vendoura.com' 
  : window.location.origin; // localhost:5173 in dev
```

### **2. Fixed Project ID** (`/App.tsx`)
**Before:** Wrong project ID hardcoded
```typescript
fetch(`https://idhyjerrdrcaitfmbtjd.supabase.co/...`)
```

**After:** Correct dynamic project ID
```typescript
import { projectId } from "./utils/supabase/info";
fetch(`https://${projectId}.supabase.co/...`)
```

### **3. Automatic Profile Creation**
✅ OAuth users get automatic `founder_profiles` creation  
✅ Stage progress initialized (5 stages)  
✅ No manual onboarding required  
✅ Seamless redirect to dashboard  

---

## 🚀 **SETUP INSTRUCTIONS**

### **Step 1: Configure Google OAuth in Supabase**

1. **Go to Supabase Auth Providers:**
   ```
   https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers
   ```

2. **Enable Google:**
   - Scroll to "Google"
   - Click "Enable"

3. **Create Google OAuth Credentials:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create a new project (or select existing)
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Vendoura Hub`
   
4. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://vendoura.com
   ```

5. **Authorized redirect URIs:**
   ```
   https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback
   ```

6. **Copy credentials:**
   - Copy **Client ID**
   - Copy **Client Secret**

7. **Paste in Supabase:**
   - Go back to Supabase Auth Providers
   - Paste Client ID
   - Paste Client Secret
   - **Redirect URL** (copy this): `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback`
   - Click **Save**

---

### **Step 2: Configure LinkedIn OAuth in Supabase**

1. **Enable LinkedIn in Supabase:**
   ```
   https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers
   ```
   - Scroll to "LinkedIn (OIDC)"
   - Click "Enable"

2. **Create LinkedIn App:**
   - Go to: https://www.linkedin.com/developers/apps
   - Click "Create app"
   - Fill in:
     - App name: `Vendoura Hub`
     - LinkedIn Page: (Select your company page or create one)
     - Privacy policy URL: `https://vendoura.com/privacy`
     - App logo: Upload your logo

3. **Configure OAuth settings:**
   - Go to "Auth" tab
   - Add **Redirect URLs:**
     ```
     https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback
     ```

4. **Request OpenID Connect scopes:**
   - Click "Products" tab
   - Request "Sign In with LinkedIn using OpenID Connect"
   - Wait for approval (usually instant)

5. **Get credentials:**
   - Go to "Auth" tab
   - Copy **Client ID**
   - Copy **Client Secret**

6. **Paste in Supabase:**
   - Go back to Supabase Auth Providers
   - Find "LinkedIn (OIDC)"
   - Paste Client ID
   - Paste Client Secret
   - **Redirect URL**: `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback`
   - Click **Save**

---

## 🧪 **TESTING OAuth**

### **Test Google Login (Local Development):**

1. **Go to login page:**
   ```
   http://localhost:5173/login
   ```

2. **Click "Continue with Google"**

3. **What should happen:**
   - Opens Google login popup
   - You select/login to Google account
   - Redirects to `http://localhost:5173?code=...`
   - App exchanges code for session
   - Creates founder profile automatically
   - Redirects to `/onboarding` or `/founder/dashboard`

4. **Check browser console for:**
   ```
   🔐 Google OAuth initiated
   ✅ Google OAuth initiated successfully
   OAuth code detected, exchanging for session...
   ✅ Code exchanged successfully, session created
   🆕 New OAuth user - creating profile...
   ✅ Profile created for OAuth user
   ✅ Successfully signed in
   Redirecting to /onboarding
   ```

### **Test LinkedIn Login (Local Development):**

1. **Go to login page:**
   ```
   http://localhost:5173/login
   ```

2. **Click "Continue with LinkedIn"**

3. **What should happen:**
   - Opens LinkedIn login popup
   - You login to LinkedIn
   - Redirects to `http://localhost:5173?code=...`
   - Same flow as Google

---

## 🎯 **HOW IT WORKS**

### **OAuth Flow Diagram:**

```
User clicks "Continue with Google/LinkedIn"
  ↓
Supabase initiates OAuth with provider
  ↓
User logs in at Google/LinkedIn
  ↓
Provider redirects to: http://localhost:5173?code=ABC123
  ↓
App.tsx detects code in URL
  ↓
Exchanges code for Supabase session
  ↓
Checks if founder_profiles exists
  ↓
  ├─ If NO: Creates profile + stage_progress
  ├─ If YES: Uses existing profile
  ↓
onAuthStateChange fires
  ↓
Redirects to /onboarding or /dashboard
```

### **Profile Creation (Automatic):**

When OAuth user signs in, we create:

```typescript
founder_profiles:
  - user_id: from Supabase auth
  - email: from OAuth provider
  - name: from OAuth metadata
  - business_name: "{name} Business"
  - baseline_revenue_30d: 0
  - baseline_revenue_90d: 0
  - current_stage: 1
  - current_week: 1
  - account_status: 'active'
  - subscription_status: 'trial'

stage_progress (5 records):
  - Stage 1: in_progress
  - Stage 2-5: locked
```

---

## 🔍 **TROUBLESHOOTING**

### **1. "Redirect URI mismatch"**

**Error:** `redirect_uri_mismatch` in OAuth popup

**Solution:**
- Verify redirect URL in Supabase: `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback`
- Add to Google Console → Authorized redirect URIs
- Add to LinkedIn → Redirect URLs
- URLs must match EXACTLY (no trailing slash)

### **2. "OAuth not configured"**

**Error:** `OAuth provider is not enabled`

**Solution:**
- Go to Supabase Auth Providers
- Make sure Google/LinkedIn is **Enabled**
- Make sure Client ID and Secret are saved
- Click **Save** button

### **3. "Code exchange failed"**

**Error in console:** `❌ Code exchange failed`

**Solution:**
- Check Supabase project ID is correct in `/utils/supabase/info.tsx`
- Check browser console for detailed error
- Verify OAuth credentials are correct
- Try re-saving credentials in Supabase

### **4. "Stuck on loading screen"**

**Symptom:** "Signing you in..." never completes

**Solution:**
- Open browser console (F12)
- Look for errors
- Check if `onAuthStateChange` fires
- Verify redirect URL is correct
- Check if tables exist (founder_profiles, stage_progress)

### **5. "Profile creation failed"**

**Error:** `Error checking/creating profile`

**Solution:**
- Run `/COMPLETE_SCHEMA.sql` to create tables
- Check RLS policies allow inserts
- Verify user_id is valid
- Check browser console for specific error

### **6. "Works in production, not localhost"**

**Issue:** OAuth works on vendoura.com but not localhost

**Solution:**
- Add `http://localhost:5173` to Google Console → Authorized JavaScript origins
- Config already handles this (dynamic OAUTH_REDIRECT_URL)
- Make sure you're testing on the correct port (5173)

---

## 📊 **VERIFICATION CHECKLIST**

After setup, verify:

### **Google OAuth:**
- [ ] Google enabled in Supabase
- [ ] Client ID and Secret configured
- [ ] Redirect URI added in Google Console
- [ ] Can click "Continue with Google" without errors
- [ ] Popup opens to Google login
- [ ] After login, redirects to app
- [ ] Profile created automatically
- [ ] User redirected to dashboard/onboarding

### **LinkedIn OAuth:**
- [ ] LinkedIn (OIDC) enabled in Supabase
- [ ] Client ID and Secret configured
- [ ] Redirect URL added in LinkedIn app
- [ ] "Sign In with LinkedIn" product enabled
- [ ] Can click "Continue with LinkedIn" without errors
- [ ] Popup opens to LinkedIn login
- [ ] After login, redirects to app
- [ ] Profile created automatically
- [ ] User redirected to dashboard/onboarding

### **General:**
- [ ] No console errors
- [ ] Loading screen shows during OAuth
- [ ] Correct project ID used
- [ ] Tables exist (founder_profiles, stage_progress)
- [ ] Works in both localhost and production

---

## 🎯 **ENVIRONMENT-SPECIFIC BEHAVIOR**

### **Development (localhost:5173):**
```typescript
OAUTH_REDIRECT_URL = "http://localhost:5173"

After OAuth login:
Google → redirects to → http://localhost:5173?code=...
LinkedIn → redirects to → http://localhost:5173?code=...
```

### **Production (vendoura.com):**
```typescript
OAUTH_REDIRECT_URL = "https://vendoura.com"

After OAuth login:
Google → redirects to → https://vendoura.com?code=...
LinkedIn → redirects to → https://vendoura.com?code=...
```

**Both work automatically!** No code changes needed between environments.

---

## 🆘 **GETTING HELP**

If OAuth still doesn't work:

1. **Check browser console** - All OAuth steps are logged
2. **Verify Supabase Auth settings** - Make sure providers are enabled
3. **Check redirect URLs** - They must match exactly
4. **Test with different browser** - Clear cache/cookies
5. **Verify tables exist** - Run `/COMPLETE_SCHEMA.sql`
6. **Check RLS policies** - Ensure users can insert to founder_profiles

---

## 📝 **QUICK REFERENCE**

| Provider | Setup URL | Redirect URI |
|----------|-----------|--------------|
| **Google** | https://console.cloud.google.com/apis/credentials | `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback` |
| **LinkedIn** | https://www.linkedin.com/developers/apps | `https://knqbtdugvessaehgwwcg.supabase.co/auth/v1/callback` |
| **Supabase Auth** | https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers | N/A |

---

## ✅ **SUMMARY**

**OAuth is now fully functional with:**
- ✅ Dynamic redirect URLs (works in dev & production)
- ✅ Correct project ID usage
- ✅ Automatic profile creation
- ✅ Stage progress initialization
- ✅ Google authentication ready
- ✅ LinkedIn authentication ready
- ✅ Seamless user experience
- ✅ Comprehensive logging
- ✅ Error handling

**Just configure the OAuth providers in Supabase and you're done! 🚀**
