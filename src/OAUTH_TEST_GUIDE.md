# OAuth Testing Guide - Google & LinkedIn

## Quick Test Checklist

### Pre-Test Setup

1. **Verify Supabase Redirect URLs**
   - Go to: https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg
   - Navigate to: Authentication → URL Configuration
   - Verify these URLs are listed:
     ```
     http://localhost:3000/auth/callback
     https://vendoura.com/auth/callback
     ```
   - If not, add them and save

2. **Clear Browser State**
   - Open DevTools (F12)
   - Application → Storage → Clear site data
   - Or use Incognito/Private window

3. **Open Console**
   - Keep DevTools Console open to see OAuth flow logs
   - Look for emoji indicators: 🔄 (processing), ✅ (success), ❌ (error)

---

## Test 1: Google OAuth (Founder Login)

### Steps

1. **Navigate to Login**
   ```
   http://localhost:3000/login
   ```

2. **Click "Continue with Google"**
   - Should redirect to Google sign-in page
   - Console should show: `🔐 Google OAuth initiated`

3. **Sign in with Google Account**
   - Choose a Google account
   - Grant permissions if prompted

4. **Verify Redirect**
   - Should redirect to: `http://localhost:3000/auth/callback?code=...`
   - Should see "Signing you in..." loading screen
   - Console should show:
     ```
     🔄 Processing OAuth callback...
     ✅ Code exchanged successfully
     ✅ Session created for user: [email]
     ```

5. **Verify Final Destination**
   
   **If existing founder:**
   - Routes to: `/founder/dashboard`
   - Console: `✅ Founder profile found, redirecting to dashboard`
   
   **If new user:**
   - Routes to: `/onboarding`
   - Console: `ℹ️ New OAuth user, redirecting to onboarding`

6. **Verify Session**
   - Check DevTools → Application → Local Storage
   - Should see `vendoura-auth` key with session data
   - User should be logged in

### Success Criteria

- ✅ No `?code=` stuck in URL
- ✅ User authenticated (check localStorage)
- ✅ Redirected to correct page
- ✅ No console errors
- ✅ Can navigate app as authenticated user

---

## Test 2: LinkedIn OAuth (Founder Login)

### Steps

1. **Navigate to Login**
   ```
   http://localhost:3000/login
   ```

2. **Click "Continue with LinkedIn"**
   - Should redirect to LinkedIn authorization page
   - Console should show: `🔐 LinkedIn OAuth initiated`

3. **Sign in with LinkedIn Account**
   - Enter LinkedIn credentials
   - Grant permissions if prompted

4. **Verify Redirect**
   - Should redirect to: `http://localhost:3000/auth/callback?code=...`
   - Should see "Signing you in..." loading screen
   - Console should show code exchange success

5. **Verify Final Destination**
   - Same routing logic as Google (founder/dashboard or onboarding)

6. **Verify Session**
   - Check localStorage for session
   - User should be logged in

### Success Criteria

- ✅ OAuth completes without errors
- ✅ Session created
- ✅ Correct routing
- ✅ No URL pollution

---

## Test 3: Error Scenarios

### Test 3A: User Denies Permission

1. Start OAuth flow
2. **Deny permissions** on OAuth provider screen
3. **Expected:**
   - Redirect to `/auth/callback`
   - Show error: "Authentication Failed"
   - Auto-redirect to `/login` after 3 seconds
   - Console shows error

### Test 3B: Network Interruption

1. Start OAuth flow
2. Disconnect internet during redirect
3. **Expected:**
   - Error message shown
   - Graceful fallback to login

### Test 3C: Invalid Code

1. Manually visit: `http://localhost:3000/auth/callback?code=invalid123`
2. **Expected:**
   - Error: "Authentication Failed"
   - Redirect to login
   - Console shows exchange error

---

## Console Log Examples

### Successful Flow

```
🔐 Google OAuth initiated: { userType: 'founder', redirectUrl: 'http://localhost:3000/auth/callback', ... }
✅ Google OAuth initiated successfully

[After redirect...]

🔄 Processing OAuth callback...
✅ Code exchanged successfully
✅ Session created for user: test@example.com
✅ Founder profile found, redirecting to dashboard
```

### Error Flow

```
🔐 Google OAuth initiated...
✅ Google OAuth initiated successfully

[After redirect...]

🔄 Processing OAuth callback...
❌ Code exchange failed: { error: "Invalid code", ... }
```

---

## Troubleshooting

### Issue: Stuck at `/?code=...`

**Cause:** OAuth completing but not exchanging code

**Fix:**
1. Verify `/auth/callback` route exists in routes.ts
2. Check redirect URL points to `/auth/callback`
3. Clear browser cache/localStorage
4. Try again

### Issue: "Authentication Failed" error

**Possible Causes:**
1. Redirect URL not whitelisted in Supabase
2. OAuth provider (Google/LinkedIn) credentials incorrect
3. User denied permissions
4. Code expired (took too long)

**Fix:**
1. Check Supabase URL configuration
2. Verify OAuth providers are enabled in Supabase
3. Try OAuth flow again (faster this time)

### Issue: Routes to wrong page

**Cause:** Profile not found in database

**Fix:**
- New users route to onboarding (expected)
- Existing users should have profile in `founder_users` table
- Check database for user record

### Issue: Session not persisting

**Cause:** localStorage not saving session

**Fix:**
1. Check browser privacy settings
2. Ensure cookies/localStorage enabled
3. Try different browser
4. Check Supabase PKCE configuration

---

## Production Testing

### Before Production Deploy

1. Update Supabase URLs:
   ```
   https://vendoura.com/auth/callback
   ```

2. Verify OAuth provider credentials:
   - Google Cloud Console: Check authorized redirect URIs
   - LinkedIn Developer Portal: Check redirect URLs

3. Deploy code to production

4. Test OAuth on production:
   ```
   https://vendoura.com/login
   ```

### Production Checklist

- [ ] Supabase redirect URL updated
- [ ] Google OAuth redirect URI includes production URL
- [ ] LinkedIn OAuth redirect URL includes production URL
- [ ] Code deployed to production
- [ ] Test Google OAuth on production
- [ ] Test LinkedIn OAuth on production
- [ ] Verify routing works correctly
- [ ] Check production console logs

---

## Database Verification

After successful OAuth login, verify user in database:

### Check Supabase Dashboard

1. Go to: Table Editor
2. Check `founder_users` table
3. Look for row with matching `user_id`

### Or Query Directly

```sql
-- Check if founder profile exists
SELECT * FROM founder_users WHERE email = 'test@example.com';

-- Check auth.users table
SELECT * FROM auth.users WHERE email = 'test@example.com';
```

---

## Common OAuth Provider Issues

### Google OAuth

**Error: "redirect_uri_mismatch"**
- Fix: Add `http://localhost:3000/auth/callback` to Google Cloud Console

**Error: "Access blocked: This app's request is invalid"**
- Fix: Verify OAuth consent screen configured in Google Cloud Console

### LinkedIn OAuth

**Error: "redirect_uri does not match"**
- Fix: Add callback URL to LinkedIn Developer app settings

**Error: "unauthorized_client"**
- Fix: Verify LinkedIn app credentials in Supabase match LinkedIn app

---

## Quick Debug Commands

### Check Current Session

```javascript
// In browser console
supabase.auth.getSession().then(({ data }) => console.log(data));
```

### Check User

```javascript
// In browser console
supabase.auth.getUser().then(({ data }) => console.log(data));
```

### Manual Sign Out

```javascript
// In browser console
supabase.auth.signOut().then(() => console.log('Signed out'));
```

---

## Support Checklist

If OAuth still not working after following guide:

1. [ ] Cleared browser cache/localStorage
2. [ ] Verified Supabase redirect URLs
3. [ ] Checked OAuth provider credentials
4. [ ] Reviewed console logs for errors
5. [ ] Tested in incognito mode
6. [ ] Verified `/auth/callback` route exists
7. [ ] Checked network tab for failed requests
8. [ ] Reviewed Supabase auth logs (Dashboard → Auth → Logs)

---

## Status After Fix

✅ OAuth callback implemented
✅ Dedicated route created (`/auth/callback`)
✅ Error handling in place
✅ Smart routing based on user type
✅ Console logging for debugging
✅ Loading states for UX
✅ Production-ready configuration

**Ready for testing!**
