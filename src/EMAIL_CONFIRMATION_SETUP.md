# Email Confirmation Setup for Supabase

## Issue: "Email not confirmed" error

By default, Supabase requires email confirmation before users can sign in. This is a security feature.

## Quick Fix: Disable Email Confirmation (for development)

1. Go to **Supabase Dashboard**
2. Your Project → **Authentication** → **Settings** (or **Email Auth**)
3. Find **"Confirm email"** setting
4. Toggle it **OFF** (or set to "Disabled")
5. Click **Save**

Now users can sign in immediately after signup without confirming their email.

## For Production: Keep Email Confirmation Enabled

If you want to keep email confirmation enabled (recommended for production):

### 1. Configure Email Templates
1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Customize the "Confirm signup" template
3. Make sure the confirmation link points to your app

### 2. Handle Confirmation in Your App
The confirmation link will redirect to your app. Handle it in your callback:

```typescript
// In /pages/auth/AuthCallback.tsx or similar
const handleEmailConfirmation = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    // Show error
    return;
  }
  
  if (data.session) {
    // Email confirmed! Redirect to dashboard
    navigate('/founder/dashboard');
  }
};
```

### 3. Show Helpful Message After Signup
Update the success screen to tell users to check their email:

```tsx
<div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
  <h3 className="font-bold mb-2">⚠️ Confirm Your Email</h3>
  <p className="text-sm">
    We sent a confirmation email to <strong>{formData.email}</strong>.
    Click the link in the email before signing in.
  </p>
  <p className="text-sm mt-2">
    Check your spam folder if you don't see it within 5 minutes.
  </p>
</div>
```

## Testing Email Confirmation

### Option 1: Use Supabase Email Testing (Development)
1. Supabase captures all emails in development
2. Go to **Supabase Dashboard** → **Authentication** → **Users**
3. Click on the user
4. You'll see a "Confirm User" button for manual confirmation

### Option 2: Configure SMTP (Production)
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Add your SMTP credentials (SendGrid, AWS SES, etc.)
3. Test the email flow

## Current Setup Recommendation

For development and testing:
```
✅ Disable email confirmation
✅ Users can sign in immediately after signup
✅ Faster testing and development
```

For production:
```
✅ Enable email confirmation
✅ Configure custom email templates
✅ Set up proper SMTP provider
✅ Test the full flow before launch
```

## Summary

**Right now:** The "Invalid login credentials" error is fixed! Authentication now works correctly with Supabase.

**If you get "Email not confirmed":** Disable email confirmation in Supabase Auth settings for development.

**For production:** Re-enable it and configure proper email delivery.
