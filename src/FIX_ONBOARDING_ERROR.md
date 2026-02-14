# 🔧 Fix: "Failed to save your information" Error

## Root Cause Identified

The error occurs because your `founder_profiles` table has **NOT NULL constraints** on columns that the onboarding form tries to populate:

```sql
name TEXT NOT NULL,              -- ❌ Required but not provided at signup
business_name TEXT NOT NULL,     -- ❌ Required but not provided at signup
```

These fields are collected during onboarding, but the table schema requires them upfront. This causes the UPDATE to fail.

Additionally, the table is missing columns that the onboarding form needs:
- `onboarding_complete`
- `product_description`
- `customer_count`
- `pricing`
- `full_name`

---

## The Fix: Run This SQL in Supabase

**Go to your Supabase Dashboard** → SQL Editor → New Query → Paste and Run:

```sql
-- Fix Schema: Make fields nullable + add onboarding columns
-- Run this in Supabase SQL Editor

-- 1. Make name and business_name nullable (collected during onboarding)
ALTER TABLE founder_profiles 
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN business_name DROP NOT NULL;

-- 2. Add missing onboarding columns
ALTER TABLE founder_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS customer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pricing TEXT;

-- 3. Copy existing name to full_name where it exists
UPDATE founder_profiles 
SET full_name = name 
WHERE full_name IS NULL AND name IS NOT NULL;

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_founder_profiles_onboarding 
ON founder_profiles(onboarding_complete);

-- 5. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'founder_profiles'
AND column_name IN ('name', 'business_name', 'full_name', 'onboarding_complete', 'product_description', 'customer_count', 'pricing')
ORDER BY ordinal_position;
```

---

## What Changed in Code

### 1. `/lib/auth.ts` - Fixed Column Mapping ✅

**Before:**
```typescript
// Wrong column names
revenue_baseline_30d: data.revenueBaseline30d,
revenue_baseline_90d: data.revenueBaseline90d,
```

**After:**
```typescript
// Correct column names matching schema
baseline_revenue_30d: data.revenueBaseline30d,
baseline_revenue_90d: data.revenueBaseline90d,
product_description: data.productDescription,
customer_count: data.customerCount,
onboarding_complete: true,
```

### 2. `/pages/AuthCallback.tsx` - Redirect to Onboarding ✅

**New users** → `/onboarding` (not dashboard)  
**Existing users with `onboarding_complete=false`** → `/onboarding`  
**Existing users with `onboarding_complete=true`** → `/founder/dashboard`

### 3. Added `/supabase/fix_schema.sql` ✅

The migration SQL is saved in your project for reference.

---

## Testing Steps

### Step 1: Run the Migration SQL
1. Open https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/sql
2. Click "New Query"
3. Copy the SQL from above (or from `/supabase/fix_schema.sql`)
4. Click "Run" (Cmd/Ctrl + Enter)
5. Verify the output shows all columns

### Step 2: Clear Your Existing Profile (if needed)
If you already created a profile during testing, delete it so you can test fresh:

```sql
DELETE FROM founder_profiles WHERE email = 'your-email@gmail.com';
```

### Step 3: Test OAuth Sign-Up
1. Log out of your app
2. Go to `/login`
3. Click "Continue with Google"
4. Complete OAuth flow
5. Should redirect to `/onboarding` ✅

### Step 4: Complete Onboarding
1. Fill out business details (Step 1)
2. Fill out revenue baseline (Step 2)
3. Click "Complete Setup & Go to Dashboard"

### Step 5: Check Console Logs
Open browser DevTools → Console. You should see:

```
🔄 Starting onboarding completion...
✅ Session found for user: your-email@gmail.com
📝 Updating founder_profiles with: { business_name: "...", baseline_revenue_30d: 1500000, onboarding_complete: true }
✅ Onboarding completed successfully!
```

**No errors!** ✅

### Step 6: Verify Data in Supabase
Run this query:

```sql
SELECT 
  email,
  full_name,
  business_name,
  product_description,
  customer_count,
  pricing,
  baseline_revenue_30d,
  baseline_revenue_90d,
  onboarding_complete
FROM founder_profiles
WHERE email = 'your-email@gmail.com';
```

Should show all your data ✅

---

## Expected Flow After Fix

### New User OAuth Sign-Up:
1. Google OAuth → `/auth/callback`
2. AuthCallback creates minimal profile:
   ```sql
   INSERT INTO founder_profiles (user_id, email)
   VALUES ('user-id', 'email@gmail.com')
   -- name and business_name are NULL (now allowed!)
   -- onboarding_complete defaults to false
   ```
3. Redirect to `/onboarding`
4. Fill out onboarding form
5. Click "Complete Setup"
6. Update profile:
   ```sql
   UPDATE founder_profiles SET
     business_name = 'Acme Corp',
     business_model = 'b2b_saas',
     product_description = 'Project management tool',
     customer_count = 50,
     pricing = '5000',
     baseline_revenue_30d = 1500000,
     baseline_revenue_90d = 4200000,
     onboarding_complete = true
   WHERE user_id = 'user-id'
   ```
7. Redirect to `/founder/dashboard` ✅
8. Dashboard loads with full data ✅

### Returning User:
1. Google OAuth → `/auth/callback`
2. Profile exists with `onboarding_complete = true`
3. Redirect directly to `/founder/dashboard` ✅

---

## Why This Error Happened

### Original Schema (Problematic):
```sql
CREATE TABLE founder_profiles (
  name TEXT NOT NULL,           -- ❌ Can't be NULL
  business_name TEXT NOT NULL,  -- ❌ Can't be NULL
  ...
)
```

### AuthCallback INSERT:
```sql
INSERT INTO founder_profiles (user_id, email)
VALUES ('...', '...')
-- name and business_name are missing!
-- But they're NOT NULL, so this FAILS ❌
```

### The Fix:
```sql
ALTER TABLE founder_profiles 
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN business_name DROP NOT NULL;
-- Now INSERT works! ✅
-- Onboarding UPDATE fills them in later
```

---

## Troubleshooting

### Still seeing "Failed to save your information"?

**Check Console Logs:**
```javascript
console.log('❌ Error completing onboarding:', updateError);
```

Common issues:
1. **Migration not run** - Run the SQL migration
2. **RLS blocking update** - Check policies allow `auth.uid() = user_id`
3. **Wrong column names** - Check the error message for which column is invalid

**Check RLS Policies:**
```sql
-- Should exist:
CREATE POLICY "Founders can update own profile" ON founder_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

**Test Update Directly:**
```sql
-- Test if the update works in SQL
UPDATE founder_profiles 
SET 
  business_name = 'Test Co',
  onboarding_complete = true
WHERE email = 'your-email@gmail.com';
```

If this fails, check the error message.

---

## Files Modified

- ✅ `/lib/auth.ts` - Fixed column name mapping
- ✅ `/pages/AuthCallback.tsx` - Redirect new users to onboarding
- ✅ `/supabase/fix_schema.sql` - Migration SQL (new file)

## Files You Can Delete (Optional)

- ❌ `/ONBOARDING_BACKEND_FIX.md` - Was about KV store (not used)
- ❌ `/supabase/add_onboarding_columns.sql` - Replaced by `fix_schema.sql`

---

## ✅ Summary

**Problem**: Table requires `name` and `business_name` at signup, but we don't collect them until onboarding.

**Solution**: Make those columns nullable + add missing onboarding columns.

**Next Step**: **Run the SQL migration** and test the flow!

Once the migration is complete, your onboarding should work perfectly. Let me know if you see any errors after running the SQL!
