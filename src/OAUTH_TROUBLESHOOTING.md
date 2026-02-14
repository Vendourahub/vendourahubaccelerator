# OAuth Social Login Troubleshooting Guide

## ✅ Quick Checklist

If your Google/LinkedIn social login buttons are not working, work through this checklist:

### 1. **Supabase Configuration**
- [ ] Go to Supabase Dashboard → Your Project → Authentication → Providers
- [ ] **Google** provider is toggled ON
- [ ] **LinkedIn (OIDC)** provider is toggled ON
- [ ] Client ID and Client Secret are filled in correctly
- [ ] Click "Save" after entering credentials

### 2. **Redirect URL Configuration (CRITICAL)**
The most common issue! You must add your application's redirect URL to Supabase:

- [ ] Go to: **Supabase Dashboard → Authentication → URL Configuration**
- [ ] Scroll to **"Redirect URLs"** section
- [ ] Add these URLs:
  ```
  http://localhost:5173/auth/callback
  https://your-production-domain.com/auth/callback
  ```
- [ ] Click **"Save"**

### 3. **Google Cloud Console**
- [ ] Created a Google Cloud Project
- [ ] Enabled **Google+ API**
- [ ] Created **OAuth 2.0 Client ID**
- [ ] Application type: **Web application**
- [ ] Authorized redirect URI includes:
  ```
  https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
  ```
- [ ] Copied Client ID and Client Secret to Supabase

### 4. **LinkedIn Developer Portal**
- [ ] Created LinkedIn App
- [ ] Requested **"Sign In with LinkedIn using OpenID Connect"** access
- [ ] Access approved (usually instant)
- [ ] In Auth tab, added redirect URI:
  ```
  https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
  ```
- [ ] Copied Client ID and Client Secret to Supabase

## 🔧 Diagnostic Tools

Visit these pages to diagnose your setup:

1. **Setup Guide**: `/auth/setup-guide`
   - Complete step-by-step OAuth configuration instructions

2. **Diagnostics**: `/auth/diagnostics`
   - Run automated tests to check your OAuth configuration
   - Copy critical URLs to clipboard
   - See detailed error messages

## 🐛 Common Errors & Solutions

### Error: "Provider is not enabled"
**Solution:** 
- Go to Supabase Dashboard → Authentication → Providers
- Toggle Google and LinkedIn (OIDC) to ON
- Enter Client ID and Secret
- Click Save

### Error: "redirect_uri_mismatch"
**Solution:** 
This is the #1 most common issue!

**In Supabase:**
1. Go to Authentication → URL Configuration
2. Add `http://localhost:5173/auth/callback` to Redirect URLs
3. Add your production URL: `https://yourdomain.com/auth/callback`
4. Click Save

**In Google Cloud Console:**
1. Go to APIs & Services → Credentials → Your OAuth Client
2. Under "Authorized redirect URIs", add:
   `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback`
3. Click Save

**In LinkedIn App:**
1. Go to Auth tab
2. Under "Authorized redirect URLs", add:
   `https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback`
3. Save

### Error: "Invalid client"
**Solution:**
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces when copying
- Re-copy from Google/LinkedIn and paste into Supabase
- Click Save in Supabase

### Error: "Access denied" from Google
**Solution:**
- Make sure your Google OAuth consent screen is configured
- If testing, add your email as a test user
- Check that authorized domain includes "supabase.co"

### Error: "This app hasn't been approved by LinkedIn"
**Solution:**
- Go to LinkedIn App → Products tab
- Request "Sign In with LinkedIn using OpenID Connect"
- Approval is usually instant
- If not approved within a few hours, contact LinkedIn support

### Buttons don't do anything when clicked
**Solution:**
1. Open browser console (F12) and check for errors
2. Most likely: Provider not enabled in Supabase
3. Check: Redirect URL not configured in Supabase
4. Verify: Client ID/Secret are correct

### OAuth redirects but shows "Profile not found"
**Solution:**
This is actually working! It means:
- OAuth authentication succeeded
- User needs to complete profile (expected behavior)
- Fill in the profile completion form

## 📋 Critical URLs Reference

Replace `idhyjerrdrcaitfmbtjd` with your actual Supabase project ID.

**Supabase Project URL:**
```
https://idhyjerrdrcaitfmbtjd.supabase.co
```

**OAuth Callback (for Google & LinkedIn):**
```
https://idhyjerrdrcaitfmbtjd.supabase.co/auth/v1/callback
```

**Application Callback (development):**
```
http://localhost:5173/auth/callback
```

**Application Callback (production):**
```
https://yourdomain.com/auth/callback
```

## 🧪 Testing the Integration

1. Go to `/auth/diagnostics` and click "Run Diagnostics"
2. If all tests pass, try logging in at `/login` or `/auth/login`
3. Click "Continue with Google" or "Continue with LinkedIn"
4. You should be redirected to the provider
5. After authorizing, you should return to `/auth/callback`
6. Complete your profile
7. You'll be redirected to your dashboard

## 🆘 Still Not Working?

1. **Check browser console** (F12 → Console tab) for error messages
2. **Run diagnostics** at `/auth/diagnostics`
3. **Review Supabase logs** (Supabase Dashboard → Logs → Auth Logs)
4. **Verify all URLs match exactly** (including https:// and no trailing slashes)
5. **Try incognito mode** to rule out browser cache issues
6. **Check Supabase Dashboard → Authentication → Users** to see if auth attempts are logging

## 📞 Support Resources

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Google OAuth Setup: https://developers.google.com/identity/protocols/oauth2
- LinkedIn OAuth Setup: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication

## ✨ When It's Working

You'll know OAuth is working when:
1. Clicking social login button redirects to Google/LinkedIn
2. After authorizing, you return to `/auth/callback`
3. You see a profile completion form (for new users)
4. After completing profile, you're redirected to your dashboard
5. You can see the user in Supabase Dashboard → Authentication → Users
