# 🚨 IMPORTANT: Database Setup Required

## Are you seeing "Could not find table" errors?

**You need to run the database setup script FIRST before using the app.**

---

## 🚀 Quick Setup (3 Steps - Takes 2 Minutes)

### **STEP 1: Open Supabase SQL Editor**

Click here: **https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new**

### **STEP 2: Copy & Paste the Setup Script**

1. Open the file: **`/QUICK_FIX.sql`**
2. Select ALL (Ctrl+A or Cmd+A)
3. Copy ALL (Ctrl+C or Cmd+C)
4. Paste into Supabase SQL Editor
5. Click **"RUN"**

### **STEP 3: Wait & Refresh**

1. Wait for "✅ SUCCESS!" message
2. Refresh your Vendoura Hub page
3. All errors should be gone!

---

## ✅ What This Does

Creates 6 essential database tables:

- ✅ `system_settings` - Cohort configuration
- ✅ `founder_profiles` - Founder accounts  
- ✅ `waitlist` - Waitlist management
- ✅ `admin_users` - Admin team
- ✅ `weekly_commits` - Weekly commitments
- ✅ `weekly_reports` - Revenue reports

**Without these tables, the app cannot function.**

---

## 📖 Detailed Instructions

See **`/START_HERE.md`** for detailed step-by-step guide with troubleshooting.

---

## 🆘 Still Having Issues?

### Error: "Could not find table 'public.system_settings'"
**Solution:** You haven't run the SQL script yet. Follow Steps 1-3 above.

### Error: "Could not find table 'public.founder_profiles'"  
**Solution:** You haven't run the SQL script yet. Follow Steps 1-3 above.

### Error: "Could not find table 'public.admin_users'"
**Solution:** You haven't run the SQL script yet. Follow Steps 1-3 above.

**All these errors = database tables missing = you need to run QUICK_FIX.sql**

---

## 🎯 After Database Setup

Once tables are created, create your first admin user:

1. Go to Supabase Dashboard → Authentication → Users
2. Create a new user
3. Copy the User ID
4. Edit `/CREATE_FIRST_ADMIN.sql` with your User ID
5. Run that script in SQL Editor

---

## 📂 Project Structure

```
/QUICK_FIX.sql           ← Run this FIRST
/COMPLETE_SETUP.sql      ← Alternative full setup
/CREATE_FIRST_ADMIN.sql  ← Run this SECOND
/START_HERE.md           ← Detailed instructions
/FIX_ALL_ERRORS.md       ← Troubleshooting guide
```

---

## 🚀 Ready to Start?

1. **Run `/QUICK_FIX.sql`** (2 minutes)
2. **Create admin user** (1 minute)
3. **Start building!** 🎉

---

**→ Open `/QUICK_FIX.sql` now and follow the instructions at the top!**
