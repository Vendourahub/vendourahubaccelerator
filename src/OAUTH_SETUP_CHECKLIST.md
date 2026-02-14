# OAuth Setup Checklist - ACTION REQUIRED

## ⚠️ IMPORTANT: Supabase Configuration Needed

Your OAuth authentication fix is complete in the code, but you **MUST** configure the redirect URLs in your Supabase Dashboard for it to work.

## Step-by-Step Configuration

### 1. Go to Supabase Dashboard
Navigate to: https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]

### 2. Open Authentication Settings
- Click **Authentication** in the left sidebar
- Click **URL Configuration**

### 3. Add Redirect URLs

In the **Redirect URLs** section, add:

**For Development:**
```
http://localhost:3000/auth/callback
```

**For Production (when you deploy):**
```
https://yourdomain.com/auth/callback
```

Click **Save** after adding each URL.

### 4. Verify OAuth Providers

Make sure your OAuth providers are enabled:

**Google OAuth:**
- Go to **Authentication** → **Providers**
- Find **Google** and ensure it's **Enabled**
- Verify the Client ID and Client Secret are set
- The Redirect URI shown should be: `https://[PROJECT-ID].supabase.co/auth/v1/callback`

**LinkedIn OAuth:**
- Go to **Authentication** → **Providers**
- Find **LinkedIn (OIDC)** and ensure it's **Enabled**
- Verify the Client ID and Client Secret are set
- The Redirect URI shown should be: `https://[PROJECT-ID].supabase.co/auth/v1/callback`

## Testing After Configuration

### Test Flow:
1. Go to `http://localhost:3000/login`
2. Click "Continue with Google" or "Continue with LinkedIn"
3. You'll be redirected to the OAuth provider
4. After authorization, you'll be redirected to `/auth/callback`
5. You should see a loading screen briefly
6. Then you'll be redirected to either:
   - `/onboarding` (if new user)
   - `/founder/dashboard` (if existing user)

### ✅ Success Indicators:
- No tokens in the URL
- Clean redirect with no hash fragments
- Seamless authentication experience

### ❌ Error Indicators:
- "Redirect URL not allowed" error
- Stuck on OAuth provider page
- 404 error after OAuth callback

If you see errors, double-check the redirect URLs in Supabase Dashboard.

## What Was Fixed

### Before:
```
http://localhost:3000/#access_token=eyJh...&expires_at=...&refresh_token=...
```
❌ Tokens exposed in URL (insecure)

### After:
```
http://localhost:3000/auth/callback?code=...&type=founder
↓
http://localhost:3000/onboarding
```
✅ Clean redirect with no token exposure

## Files Changed
1. `/pages/AuthCallback.tsx` - **NEW** - OAuth callback handler
2. `/routes.ts` - Added `/auth/callback` route
3. `/lib/api.ts` - Configured PKCE flow
4. `/OAUTH_FIX_COMPLETE.md` - Complete documentation
5. `/OAUTH_SETUP_CHECKLIST.md` - **THIS FILE** - Setup instructions

## Next Steps

1. ✅ Code changes are complete (already done)
2. ⏳ **Configure redirect URLs in Supabase Dashboard** (YOU NEED TO DO THIS)
3. ⏳ Test OAuth login with Google
4. ⏳ Test OAuth login with LinkedIn
5. ⏳ Deploy to production and add production redirect URL

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify redirect URLs are exact match (including protocol: http/https)
3. Check Supabase Auth logs in Dashboard
4. Review `/OAUTH_FIX_COMPLETE.md` for detailed information

---

**Status:** 🟡 Code ready, configuration pending
**Action Required:** Add redirect URLs to Supabase Dashboard
