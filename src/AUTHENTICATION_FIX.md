# Authentication Fix - Connected to Supabase

## ✅ What Was Fixed

### **Problem:**
The login and signup were using a **mock authentication system** (`/lib/auth.ts`) that accepted any credentials and stored data in localStorage. This meant:
- ❌ Anyone could "sign in" with any email/password combination
- ❌ No actual accounts were created in Supabase
- ❌ Users weren't connected to your backend
- ❌ OAuth (Google/LinkedIn) was configured but not properly integrated

### **Solution:**
Removed the mock authentication fallback and connected everything **directly to Supabase**.

---

## 🔧 Changes Made

### **1. Updated `/pages/Login.tsx`**
- ✅ Removed fallback to mock `login()` function
- ✅ Now **only uses** `auth.signIn()` from Supabase
- ✅ Shows proper error messages when credentials are invalid
- ✅ Added OAuth diagnostic links

**Before:**
```typescript
try {
  await auth.signIn(email, password);
  // ...
} catch (err: any) {
  // FALLBACK TO MOCK AUTH - BAD!
  const user = login(email, password);
  if (user) {
    navigate("/founder/dashboard");
  }
}
```

**After:**
```typescript
try {
  await auth.signIn(email, password);
  const { user, type } = await auth.getMe();
  // Redirect based on user type
} catch (err: any) {
  // Show real error - NO FALLBACK
  setError("Invalid email or password. Please sign up first.");
}
```

### **2. Updated `/pages/Application.tsx` (Signup)**
- ✅ Added **password field** to application form
- ✅ Now calls `auth.signupFounder()` to create real Supabase accounts
- ✅ Only shows success screen after account is created
- ✅ Shows error messages if signup fails

**What happens now:**
1. User fills out application form
2. If all commitments are accepted, calls `auth.signupFounder()`
3. Creates account in Supabase with:
   - Email
   - Password
   - Name
   - Business description
4. User can then sign in with those credentials

### **3. Created Diagnostic Tools**

#### **`/pages/auth/OAuthDiagnostics.tsx`**
A diagnostic page at `/auth/diagnostics` that:
- ✅ Tests Supabase connection
- ✅ Tests Google OAuth configuration
- ✅ Tests LinkedIn OAuth configuration
- ✅ Shows exact error messages
- ✅ Provides copy-to-clipboard for all critical URLs
- ✅ Highlights common configuration issues

#### **`/OAUTH_TROUBLESHOOTING.md`**
Complete troubleshooting guide with:
- ✅ Configuration checklist
- ✅ Common errors and solutions
- ✅ Step-by-step debugging guide
- ✅ Critical URLs reference

---

## 📋 How It Works Now

### **Signup Flow:**
1. User visits `/apply`
2. Fills out application form (including password)
3. Accepts all commitment requirements
4. Clicks "Submit Application"
5. → **Creates account in Supabase** via `auth.signupFounder()`
6. Shows success screen
7. User can now sign in at `/login`

### **Login Flow:**
1. User visits `/login`
2. Enters email and password
3. Clicks "Sign In"
4. → **Authenticates with Supabase** via `auth.signIn()`
5. If valid: Redirects to dashboard
6. If invalid: Shows error message

### **OAuth Flow (Google/LinkedIn):**
1. User clicks "Continue with Google"
2. → **Redirects to Google** for authorization
3. User approves access
4. → **Returns to** `/auth/callback`
5. Profile completion if needed
6. Redirects to dashboard

---

## 🚨 Critical Setup Required

### **For Email/Password Authentication:**
✅ **Already working!** Uses Supabase auth system automatically.

### **For OAuth (Google/LinkedIn):**
⚠️ **Requires configuration** - see below.

---

## 🔐 OAuth Setup Checklist

### **1. Add Redirect URL to Supabase**
This is **the #1 most common issue!**

1. Go to **Supabase Dashboard**
2. Your project → **Authentication** → **URL Configuration**
3. Scroll to **"Redirect URLs"**
4. Add these URLs:
   ```
   http://localhost:5173/auth/callback
   https://your-production-domain.com/auth/callback
   ```
5. Click **"Save"**

❌ **Without this, OAuth will fail with "redirect_uri_mismatch" error!**

### **2. Configure Google OAuth**
1. Go to **Google Cloud Console**
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Secret
5. Paste into **Supabase Dashboard** → **Authentication** → **Providers** → **Google**

### **3. Configure LinkedIn OAuth**
1. Go to **LinkedIn Developer Portal**
2. Create app
3. Request "Sign In with LinkedIn using OpenID Connect"
4. Add redirect URI:
   ```
   https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
   ```
5. Copy Client ID and Secret
6. Paste into **Supabase Dashboard** → **Authentication** → **Providers** → **LinkedIn (OIDC)**

---

## 🧪 Testing Authentication

### **Test Email/Password:**
1. Go to `/apply`
2. Fill out form with test data:
   - Name: Test User
   - Email: test@example.com
   - Password: testpassword123
   - Business: Test business
   - Revenue: 100000
3. Accept all commitments
4. Submit
5. Go to `/login`
6. Sign in with test@example.com / testpassword123
7. ✅ Should redirect to onboarding

### **Test OAuth:**
1. Visit `/auth/diagnostics`
2. Click "Run Diagnostics"
3. Check results:
   - ✅ Green = OAuth is configured correctly
   - ❌ Red = Configuration error (follow the fix)
4. Go to `/login`
5. Click "Continue with Google"
6. Should redirect to Google for authorization

---

## 📊 Verify Users in Supabase

After signup, check that users are actually created:

1. Go to **Supabase Dashboard**
2. Your project → **Authentication** → **Users**
3. You should see the user listed with:
   - Email
   - Created timestamp
   - Provider (email or google/linkedin_oidc)

---

## 🆘 Troubleshooting

### **"Invalid email or password" when signing in**
✅ **This is correct behavior!** It means:
- The user hasn't signed up yet
- Or the password is wrong

**Solution:** Sign up first at `/apply`

### **OAuth buttons don't work**
1. Open browser console (F12)
2. Check for errors
3. Most likely: Provider not enabled in Supabase
4. Or: Redirect URL not configured

**Solution:** Visit `/auth/diagnostics` to identify the issue

### **Can sign in but get errors after login**
- This means auth is working!
- The error is likely in the onboarding or dashboard pages
- Check browser console for details

---

## 📁 Files Modified

1. `/pages/Login.tsx` - Removed mock auth fallback
2. `/pages/Application.tsx` - Added password field, calls Supabase signup
3. `/pages/auth/OAuthDiagnostics.tsx` - NEW diagnostic tool
4. `/OAUTH_TROUBLESHOOTING.md` - NEW troubleshooting guide
5. `/routes.ts` - Added `/auth/diagnostics` route

## 📁 Files No Longer Used

- `/lib/auth.ts` - Mock authentication (can be deleted or kept for type definitions)

---

## ✅ Summary

**Before:** Mock authentication that accepted any credentials
**After:** Real Supabase authentication with proper account creation

**Email/Password:** ✅ Fully working
**OAuth (Google/LinkedIn):** ⚠️ Requires setup (use diagnostics tool)

**Next Steps:**
1. Test email/password signup and login
2. If using OAuth: Configure providers and test with diagnostics
3. Verify users appear in Supabase Dashboard → Authentication → Users
