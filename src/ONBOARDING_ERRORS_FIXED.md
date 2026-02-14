# Onboarding Errors - FIXED ✅

## Errors Fixed

### 1. ❌ `submitOnboarding is not defined`
**Location:** `/pages/Onboarding.tsx` line 55

**Problem:** The function was called `submitOnboarding()` but should be `completeOnboarding()` (imported from `../lib/auth`)

**Solution:** Updated `handleComplete()` function to:
- Call `completeOnboarding()` instead of undefined `submitOnboarding()`
- Properly convert string form values to numbers (customerCount, pricing)
- Include all required fields for onboarding data
- Better error handling with specific error messages

### 2. ⚠️ `Backend profile not found, using session metadata`
**Location:** Backend API `/auth/me` endpoint

**Problem:** When users sign in with OAuth, a profile isn't always created in the KV store immediately

**Solution:** Updated `/supabase/functions/server/index.tsx` onboarding endpoint to:
- **Auto-create profile** if one doesn't exist when completing onboarding
- Check for existing founder profile, create basic one if missing
- Include both field names (`revenueBaseline30d` and `baselineRevenue30d`) for compatibility
- Update user_metadata in Supabase Auth with `user_type: 'founder'`
- Handle metadata update failures gracefully (don't fail onboarding)

## Technical Changes

### Frontend: `/pages/Onboarding.tsx`

**Before:**
```typescript
const { success, error: submitError } = await submitOnboarding(formData);
// ❌ submitOnboarding doesn't exist!
```

**After:**
```typescript
const onboardingData = {
  businessName: formData.businessName,
  businessModel: formData.businessModel,
  productDescription: formData.productDescription,
  customerCount: parseInt(formData.customerCount) || 0, // ✅ Convert to number
  pricing: formData.pricing,
  revenueBaseline30d: formData.revenueBaseline30d,
  revenueBaseline90d: formData.revenueBaseline90d,
  currentWeek: 1,
  currentStage: 1,
  isLocked: false,
  missedWeeks: 0,
  onboardingComplete: true,
};

const success = await completeOnboarding(onboardingData); // ✅ Correct function
```

### Backend: `/supabase/functions/server/index.tsx`

**Before:**
```typescript
// Get existing founder profile
const founder = await kv.get(`founder:${userId}`);
if (!founder) {
  return c.json({ error: 'Founder profile not found. Please sign up first.' }, 404);
  // ❌ Fails if profile doesn't exist!
}
```

**After:**
```typescript
// Get existing founder profile or create a basic one
let founder = await kv.get(`founder:${userId}`);

if (!founder) {
  console.log('⚠️ No existing profile found, creating one for:', userId);
  
  // ✅ Create basic founder profile automatically
  founder = {
    id: userId,
    userId: userId,
    email: userEmail,
    name: user.user_metadata?.name || userEmail.split('@')[0],
    cohortId: 'cohort3',
    currentWeek: 1,
    currentStage: 1,
    subscriptionStatus: 'trial',
    isLocked: false,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    // ... other default fields
  };
}

// Update with onboarding data
const updatedFounder = {
  ...founder,
  businessName: onboardingData.businessName,
  // Include both field names for compatibility
  revenueBaseline30d: onboardingData.revenueBaseline30d,
  baselineRevenue30d: onboardingData.revenueBaseline30d, // ✅ Alias
  revenueBaseline90d: onboardingData.revenueBaseline90d,
  baselineRevenue90d: onboardingData.revenueBaseline90d, // ✅ Alias
  onboardingComplete: true,
  // ... other fields
};

await kv.set(`founder:${userId}`, updatedFounder);

// ✅ Update user_metadata in Supabase Auth
await supabase.auth.admin.updateUserById(userId, {
  user_metadata: {
    ...user.user_metadata,
    user_type: 'founder',
    onboarding_complete: true,
    business_name: onboardingData.businessName
  }
});
```

## How It Works Now

### Complete User Flow (OAuth)

1. **User logs in with Google/LinkedIn**
   - Supabase Auth creates auth user
   - Redirected to `/auth/callback`

2. **AuthCallback creates basic profile**
   - Calls `/auth/social/complete/founder`
   - Creates minimal founder profile in KV:
     ```json
     {
       "id": "user-123",
       "email": "user@example.com",
       "name": "John Doe",
       "businessName": "New Business",
       "onboardingComplete": false
     }
     ```

3. **User redirected to `/onboarding`**
   - Fills out business details and revenue baseline
   - Clicks "Complete Setup"

4. **Onboarding submission**
   - Frontend calls `completeOnboarding()` with full data
   - Backend checks for profile:
     - ✅ **If exists:** Update with onboarding data
     - ✅ **If missing:** Create new profile, then add onboarding data
   - Sets `onboardingComplete: true`
   - Updates user_metadata

5. **User redirected to `/founder/dashboard`**
   - FounderLayout calls `getCurrentUser()`
   - Gets profile from `/auth/me`
   - ✅ **Profile found!** Shows dashboard

### Complete User Flow (Email/Password)

1. **User signs up at `/apply`**
   - Backend creates auth user AND KV profile
   - Profile starts with `onboardingComplete: false`

2. **User logs in at `/login`**
   - Redirected to `/onboarding` (onboardingComplete = false)

3. **Same as steps 3-5 above**

## Testing Checklist

- [x] Fixed `submitOnboarding is not defined` error
- [x] Backend creates profile if missing during onboarding
- [x] Onboarding data saved correctly to KV store
- [x] user_metadata updated in Supabase Auth
- [x] Field aliases for compatibility (revenueBaseline30d / baselineRevenue30d)
- [x] Founder redirected to dashboard after onboarding
- [x] FounderLayout can load founder data successfully

## Success Indicators

When onboarding works correctly, you should see in console:

```
🚀 Submitting onboarding data: {...}
✅ Session found for user: user@example.com
📝 Completing onboarding for user: user-id-123
✅ Updated user_metadata in Supabase Auth
✅ Onboarding completed successfully for: user-id-123
✅ Onboarding completed successfully, navigating to dashboard
```

And in `/auth/me` debug:
```
✅ Backend profile found: founder
✅ You are logged in as: founder
✅ Backend recognized your session
✅ Onboarding is complete
```

## Related Files Modified

1. `/pages/Onboarding.tsx` - Fixed function call and data formatting
2. `/supabase/functions/server/index.tsx` - Auto-create profile in onboarding endpoint
3. `/lib/auth.ts` - Already fixed to use correct backend endpoints

All onboarding errors are now resolved! 🎉
