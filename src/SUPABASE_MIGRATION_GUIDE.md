# 🔧 Supabase Migration - Add Missing Columns

## Why This Is Needed

Your app uses **Supabase Postgres** (which is the right choice!), but the `founder_profiles` table is missing some columns that the onboarding flow needs.

## Current Issue

The table has these columns:
```sql
- name                    (but code expects full_name)
- business_description    (but code expects product_description)
- baseline_revenue_30d    (✅ matches)
- baseline_revenue_90d    (✅ matches)
```

Missing columns:
```sql
- full_name              ❌
- onboarding_complete    ❌
- product_description    ❌
- customer_count         ❌
- pricing                ❌
```

---

## Step 1: Run Migration SQL

### Option A: Via Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Migration: Add missing onboarding columns to founder_profiles

-- Add missing columns
ALTER TABLE founder_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS customer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pricing TEXT;

-- Copy existing name to full_name
UPDATE founder_profiles 
SET full_name = name 
WHERE full_name IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_founder_profiles_onboarding 
ON founder_profiles(onboarding_complete);

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'founder_profiles'
ORDER BY ordinal_position;
```

5. Click **Run** (or press `Cmd/Ctrl + Enter`)
6. You should see output showing all columns including the new ones ✅

### Option B: Using the Migration File

The SQL is already saved in `/supabase/add_onboarding_columns.sql` in your project.

---

## Step 2: Verify Column Mapping

After running the migration, your code now correctly maps between:

| **Application Code** | **Database Column** |
|---------------------|-------------------|
| `businessName` | `business_name` |
| `businessModel` | `business_model` |
| `productDescription` | `product_description` ✅ |
| `customerCount` | `customer_count` ✅ |
| `pricing` | `pricing` ✅ |
| `revenueBaseline30d` | `baseline_revenue_30d` |
| `revenueBaseline90d` | `baseline_revenue_90d` |
| `onboardingComplete` | `onboarding_complete` ✅ |
| `currentWeek` | `current_week` |
| `currentStage` | `current_stage` |
| `isLocked` | `is_locked` |
| `missedWeeks` | `consecutive_misses` |
| `name` | `full_name` ✅ |

---

## Step 3: Test Onboarding Flow

1. **Sign up via OAuth**
   - Go to your app
   - Click "Continue with Google"
   - Complete OAuth flow

2. **Fill out onboarding**
   - Business details
   - Revenue baseline

3. **Check browser console**
   ```
   🔄 Starting onboarding completion...
   ✅ Session found for user: your-email@gmail.com
   📝 Updating founder_profiles with: { business_name: "...", ... }
   ✅ Onboarding completed successfully!
   ```

4. **Verify in database**
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

---

## What Changed in Code

### ✅ `/lib/auth.ts` - Reverted to Supabase

**Before** (KV store):
```typescript
const response = await fetch(`${API_BASE}/auth/me`, ...);
```

**After** (Supabase):
```typescript
const { data: founderData } = await supabase
  .from('founder_profiles')
  .select('*')
  .eq('user_id', session.user.id)
  .single();
```

### ✅ Proper Column Mapping

```typescript
// Reading from database
revenueBaseline30d: parseFloat(founderData.baseline_revenue_30d) || 0,
revenueBaseline90d: parseFloat(founderData.baseline_revenue_90d) || 0,
productDescription: founderData.product_description || '',
customerCount: founderData.customer_count || 0,

// Writing to database
baseline_revenue_30d: data.revenueBaseline30d,
baseline_revenue_90d: data.revenueBaseline90d,
product_description: data.productDescription,
customer_count: data.customerCount,
```

---

## Why Use Supabase Instead of KV Store?

### Supabase Advantages:
✅ **Structured data** - Enforces data types and constraints  
✅ **Relationships** - Can JOIN with other tables (cohorts, commits, reports)  
✅ **Row Level Security** - Built-in auth and permissions  
✅ **Queries** - Can filter, sort, aggregate with SQL  
✅ **Indexes** - Fast lookups on any column  
✅ **Migrations** - Track schema changes over time  
✅ **Real-time** - Built-in subscriptions for live updates  

### KV Store Advantages:
✅ **Simple** - Just key-value pairs  
✅ **Flexible** - No schema required  
✅ **Fast** - For single-key lookups  

**For your use case**: Supabase is the right choice because you have:
- Multiple related tables (founders, commits, reports, cohorts)
- Need to query across relationships
- Need RLS for security
- Admin dashboard that needs to filter/search founders

---

## Troubleshooting

### Error: "column does not exist"
**Fix**: Run the migration SQL to add missing columns

### Error: "permission denied for table founder_profiles"
**Fix**: Check Row Level Security policies:
```sql
-- View current policies
SELECT * FROM pg_policies WHERE tablename = 'founder_profiles';

-- Should have these policies:
CREATE POLICY "Founders can view own profile" ON founder_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Founders can update own profile" ON founder_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Error: "insert or update violates foreign key"
**Fix**: Make sure `user_id` matches an existing auth user:
```sql
SELECT id, email FROM auth.users WHERE id = 'your-user-id';
```

### Data not showing in dashboard
**Fix**: Check that `onboarding_complete = true`:
```sql
SELECT email, onboarding_complete FROM founder_profiles;
```

---

## Next Steps

1. ✅ Run the migration SQL in Supabase Dashboard
2. ✅ Test the onboarding flow end-to-end
3. ✅ Verify data is saved correctly
4. ⏭️ Delete the KV store backend endpoints (we don't need them anymore)
5. ⏭️ Continue building out the founder dashboard features

---

## Files to Keep

- ✅ `/lib/auth.ts` - Now uses Supabase correctly
- ✅ `/supabase/schema.sql` - Your main schema
- ✅ `/supabase/add_onboarding_columns.sql` - Migration to add missing columns

## Files You Can Delete (Optional)

- �� `/ONBOARDING_FIX_COMPLETE.md` - Was about KV store approach
- ❌ `/ONBOARDING_BACKEND_FIX.md` - Was about KV store approach
- ❌ The `/founders/onboarding` endpoint in `/supabase/functions/server/index.tsx` - Not needed anymore

---

**You're now using Supabase properly! 🎉**

The only thing you need to do is run the migration SQL to add the missing columns, then your onboarding flow will work perfectly.
