# ⚠️ DATABASE TABLES MISSING - QUICK FIX

## You're seeing the error screen because database tables are missing.

---

## 🚀 **3-STEP FIX (Takes 3 minutes):**

### **STEP 1:** Open Supabase SQL Editor
**Click this link:** https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new

### **STEP 2:** Copy the Setup Script
1. Open the file: **`/QUICK_FIX.sql`** (in this project)
2. Select **ALL** text (Ctrl+A or Cmd+A)
3. Copy **ALL** text (Ctrl+C or Cmd+C)

### **STEP 3:** Paste & Run
1. Paste the script into Supabase SQL Editor
2. Click the **"RUN"** button
3. Wait for **"✅ SUCCESS!"** message
4. Refresh your Vendoura Hub page

---

## ✅ **You'll know it worked when:**
- You see: `✅ SUCCESS! All 6 tables created successfully!`
- The verification query shows 6 tables
- The error screen disappears after refresh

---

## 📁 **Which file to use?**

Use: **`/QUICK_FIX.sql`** ← Recommended (6 core tables, ~300 lines)

Alternative: `/COMPLETE_SETUP.sql` ← Full version (11 tables, ~600 lines)

---

## 🆘 **Still stuck?**

### Common issues:

1. **"Could not find table"** = You haven't run the SQL script yet
   - Solution: Follow the 3 steps above

2. **"RLS policy violation"** = Run this first:
   ```sql
   ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
   ```

3. **"Foreign key constraint"** when adding admin = Create user in Dashboard first
   - Go to Authentication → Users
   - Click "Add User"
   - Then run `/CREATE_FIRST_ADMIN.sql`

---

## 📊 **What tables get created?**

✓ `system_settings` - Global cohort settings
✓ `founder_profiles` - All founder accounts  
✓ `waitlist` - Users waiting for next cohort
✓ `admin_users` - Admin team members
✓ `weekly_commits` - Weekly commitments
✓ `weekly_reports` - Revenue reports

---

## 🎯 **After setup:**

The error screen will **never show again**. Your database is ready!

Next: Create your first admin user with `/CREATE_FIRST_ADMIN.sql`
