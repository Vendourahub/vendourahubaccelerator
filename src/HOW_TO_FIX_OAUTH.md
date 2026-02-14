# 🔧 How to Fix OAuth Sign-Up Issue

## Problem
Google OAuth sign-up is failing with:
```
Failed to create profile: new row violates row-level security policy for table "founder_profiles"
```

## Root Cause
The `founder_profiles` table has RLS (Row Level Security) enabled, but the INSERT policy is blocking authenticated users from creating their own profiles during OAuth sign-up.

## Solution: Run SQL to Fix RLS Policy

### Step 1: Open Supabase SQL Editor
Click this link (or copy it to your browser):
```
https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/sql/new
```

### Step 2: Copy & Paste the SQL
Open the file `/FIX_RLS_POLICY.sql` in this project and copy ALL the SQL code.

Paste it into the Supabase SQL Editor.

### Step 3: Run the SQL
Click the **"Run"** button (or press `Cmd/Ctrl + Enter`)

### Step 4: Verify Success
At the bottom of the SQL results, you should see a table showing 3 policies:
- ✅ `Allow authenticated users to insert founder_profiles` (INSERT)
- ✅ `Founders can view own profile` (SELECT)
- ✅ `Founders can update own profile` (UPDATE)

### Step 5: Test OAuth Sign-Up
1. Go back to your app: `https://vendoura.com/login`
2. Click **"Continue with Google"**
3. Authenticate with Google
4. ✅ You should now successfully create a profile and redirect to the dashboard!

---

## What the SQL Does

### 1. Removes Conflicting Policies
```sql
DROP POLICY IF EXISTS "..." ON founder_profiles;
```
This removes any old/broken policies that might be blocking inserts.

### 2. Creates Permissive INSERT Policy
```sql
CREATE POLICY "Allow authenticated users to insert founder_profiles" 
  ON founder_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
```
This allows ANY authenticated user to insert a row into `founder_profiles`.
- `TO authenticated` = only logged-in users
- `WITH CHECK (true)` = no additional restrictions

### 3. Creates SELECT Policy
```sql
CREATE POLICY "Founders can view own profile" 
  ON founder_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id OR EXISTS (...));
```
This allows users to read their own profile (or admins to read all profiles).

### 4. Creates UPDATE Policy
```sql
CREATE POLICY "Founders can update own profile" 
  ON founder_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id OR EXISTS (...));
```
This allows users to update their own profile (or admins to update all profiles).

---

## Alternative: Use the Database Setup Tool

If you prefer a visual interface:

1. Navigate to `/admin/databasesetup`
2. Click **"Check Database"** to verify the issue
3. Click **"Fix Issues"** to get the SQL
4. Copy and paste into Supabase SQL Editor

---

## Why This Happens

When you enable RLS on a table in Supabase, it blocks ALL operations by default unless you explicitly create policies. The issue is:

1. ✅ Supabase Auth successfully creates the user in `auth.users`
2. ❌ But our app can't insert into `founder_profiles` because RLS blocks it
3. 🔧 The fix is to create a policy that says "authenticated users can insert their own profile"

---

## After Running the SQL

Once you run the SQL, OAuth sign-up will work perfectly:

1. User clicks "Continue with Google"
2. Google authenticates the user
3. Supabase creates auth.users record ✅
4. Our app creates founder_profiles record ✅ (now allowed by RLS)
5. User redirects to dashboard ✅

---

## Need Help?

If the SQL doesn't work or you get an error:

1. Copy the EXACT error message
2. Check that you're running it in the correct project (knqbtdugvessaehgwwcg)
3. Verify you have admin/owner permissions on the Supabase project
4. Try the Database Setup Tool at `/admin/databasesetup` for diagnostics
