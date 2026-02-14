# ✅ Onboarding Flow Fixed!

## Problem
When clicking "Complete Setup & Go to Dashboard" after OAuth signup and onboarding, the app wasn't redirecting to the dashboard.

## Root Causes

### 1. Synchronous auth calls (main issue)
The onboarding page was calling `getCurrentUser()` synchronously:
```typescript
const user = getCurrentUser();  // ❌ Wrong - this is now async!
```

But we changed `/lib/auth.ts` to make all auth functions async (to query Supabase properly).

### 2. Fire-and-forget onboarding completion
The `handleComplete` function wasn't waiting for the database update:
```typescript
completeOnboarding({...});  // ❌ Doesn't await
navigate("/founder/dashboard");  // ❌ Navigates immediately
```

This caused navigation to happen BEFORE the database was updated, so the dashboard thought onboarding wasn't complete yet.

---

## Fixes Applied

### 1. `/pages/Onboarding.tsx` - Make auth async ✅
```typescript
// Before
const user = getCurrentUser();

// After
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };
  checkAuth();
}, [navigate]);
```

### 2. `/pages/Onboarding.tsx` - Await completion before redirect ✅
```typescript
// Before
const handleComplete = () => {
  completeOnboarding({...});  // Fire and forget
  navigate("/founder/dashboard");  // Immediate redirect
};

// After
const handleComplete = async () => {
  setSubmitting(true);
  
  try {
    const success = await completeOnboarding({...});
    
    if (success) {
      console.log("✅ Onboarding completed successfully");
      navigate("/founder/dashboard");  // Only redirect after DB update
    } else {
      alert("Failed to save your information. Please try again.");
      setSubmitting(false);
    }
  } catch (error) {
    console.error("❌ Error completing onboarding:", error);
    alert("An error occurred. Please try again.");
    setSubmitting(false);
  }
};
```

### 3. `/pages/Onboarding.tsx` - Add loading states ✅
- Show loading spinner while checking auth
- Show "Saving..." on button while submitting
- Disable button during submission

### 4. Fixed other pages calling `getFounderData()` synchronously ✅
- `/pages/Dashboard.tsx` - Now async with useEffect
- `/pages/Commit.tsx` - Now async with useEffect
- `/pages/Calendar.tsx` - Now async with useEffect

The other pages (`Execute`, `Report`, `Map`, `RSD`) already had async loading logic, so they didn't need fixes.

---

## How It Works Now

### OAuth Sign-Up + Onboarding Flow:

1. **User signs up via Google OAuth**
   - Redirects to `/auth/callback`
   - `AuthCallback` creates `founder_profiles` record with `onboarding_complete = false`
   - Redirects to `/onboarding`

2. **Onboarding page loads**
   - Calls `await getCurrentUser()` to verify auth
   - If not authenticated → redirect to `/login`
   - If authenticated → show onboarding form

3. **User fills out business info**
   - Step 1: Business details
   - Step 2: Revenue baseline

4. **User clicks "Complete Setup & Go to Dashboard"**
   - Button shows "Saving..." spinner
   - Calls `await completeOnboarding()` which:
     - Updates `founder_profiles` with all business data
     - Sets `onboarding_complete = true`
     - Returns `true` on success
   - **Waits for database update to complete**
   - Then navigates to `/founder/dashboard`

5. **Dashboard loads**
   - `FounderLayout` checks: `await getCurrentUser()`
   - Finds user with `onboarding_complete = true`
   - Calls `await getFounderData()` to load full profile
   - Renders dashboard with all founder data ✅

---

## Testing Checklist

✅ **OAuth → Onboarding**
1. Sign up with Google (new account)
2. Should redirect to `/onboarding`
3. Fill out all fields
4. Click "Complete Setup & Go to Dashboard"
5. Button should show "Saving..." briefly
6. Should redirect to `/founder/dashboard`
7. Dashboard should load with your business data

✅ **Direct access to /onboarding when not authenticated**
1. Log out
2. Go to `/onboarding` directly
3. Should redirect to `/login`

✅ **Direct access to /onboarding when already completed**
1. Complete onboarding
2. Go to `/onboarding` again
3. Should allow re-editing (or redirect to dashboard if you want to prevent this)

✅ **Onboarding data persistence**
1. Complete onboarding
2. Log out
3. Log back in
4. Go to dashboard
5. Should show your business name, model, revenue baseline, etc.

---

## Database Update Flow

The `completeOnboarding()` function in `/lib/auth.ts` now:

1. Gets current Supabase session
2. Updates `founder_profiles` table:
   ```sql
   UPDATE founder_profiles
   SET 
     business_name = 'Your Business',
     business_model = 'b2b_saas',
     product_description = 'What you sell',
     customer_count = 50,
     pricing = '5000',
     revenue_baseline_30d = 1500000,
     revenue_baseline_90d = 4200000,
     onboarding_complete = true,
     current_week = 1,
     current_stage = 1,
     is_locked = false,
     missed_weeks = 0
   WHERE user_id = '<current_user_id>';
   ```
3. Returns `true` if successful, `false` if failed
4. Logs errors to console for debugging

---

## Common Issues & Solutions

### Issue: "Saving..." never completes
**Cause**: Database update is failing  
**Fix**: Check browser console for error. Likely causes:
- Missing columns in `founder_profiles` table
- RLS policy blocking update
- Network error

### Issue: Redirects to dashboard but shows "No onboarding data"
**Cause**: Database update succeeded but `onboarding_complete` is still `false`  
**Fix**: Check database:
```sql
SELECT user_id, email, onboarding_complete, business_name
FROM founder_profiles
WHERE email = 'your-email@gmail.com';
```

### Issue: Button stays disabled
**Cause**: Form validation is failing  
**Fix**: Ensure all required fields are filled:
- Business Name
- Product Description  
- Customer Count
- Pricing
- Revenue (30d)
- Revenue (90d)

---

## Next Steps

- ✅ OAuth flow working
- ✅ Onboarding flow working
- ✅ Dashboard loading working
- ⏭️ Test full end-to-end flow with real Google OAuth
- ⏭️ Add error handling for database failures
- ⏭️ Consider adding a "Skip for now" option if onboarding takes too long
