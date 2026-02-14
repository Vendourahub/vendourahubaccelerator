# ❌ FIXING YOUR ERROR

## **Error You're Seeing:**

```
Error loading templates: {
  "code": "PGRST205",
  "message": "Could not find the table 'public.notification_templates' in the schema cache"
}
```

---

## **What This Means:**

The `notification_templates` table **doesn't exist** in your database yet.

**Why:** You haven't run the database setup SQL scripts.

---

## ✅ **HOW TO FIX - 2 Minutes**

### **STEP 1: Run QUICK_FIX.sql** (Creates ALL tables)

1. **Go to Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
   ```

2. **Copy ALL content from `/QUICK_FIX.sql`**
   - Open the file in your project
   - Select ALL (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

3. **Paste into SQL Editor and click RUN**
   - Wait for completion
   - Should see: ✅ SUCCESS! All tables created successfully!

4. **Refresh your admin page**
   - The error should be GONE!

---

### **STEP 2: (Optional) Add Email Templates**

If you want the 14 pre-built email templates:

1. **Same SQL Editor**
2. **Copy ALL content from `/NOTIFICATION_TEMPLATES.sql`**
3. **Paste and RUN**
4. **Refresh page**

---

## 🔍 **What Tables Get Created:**

When you run `/QUICK_FIX.sql`, it creates these 10 tables:

1. ✅ `system_settings` - Cohort settings, payment keys
2. ✅ `founder_profiles` - Founder accounts
3. ✅ `waitlist` - Waitlist entries
4. ✅ `admin_users` - Admin accounts (needed for login!)
5. ✅ `weekly_commits` - Sunday commitments
6. ✅ `weekly_reports` - Friday reports
7. ✅ `notification_templates` - Email templates (this fixes your error!)
8. ✅ `interventions` - Intervention tracking
9. ✅ `intervention_actions` - Intervention history
10. ✅ `evidence_submissions` - Evidence uploads

---

## 🎯 **Complete Setup Process**

If you haven't set up Emmanuel's admin account yet, do ALL these steps:

### **1. Run QUICK_FIX.sql** (creates tables)
```
File: /QUICK_FIX.sql
Link: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
Action: Copy ALL → Paste → RUN
```

### **2. Create Auth User** (creates login)
```
Link: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users
Click: "Add User"
Email: emmanuel@vendoura.com
Password: Alome!28$..
✅ CHECK "Auto Confirm User"
Click: "Create User"
```

### **3. Run create_emmanuel_admin.sql** (makes you super admin)
```
File: /create_emmanuel_admin.sql
Link: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
Action: Copy ALL → Paste → RUN
```

### **4. (Optional) Run NOTIFICATION_TEMPLATES.sql** (adds email templates)
```
File: /NOTIFICATION_TEMPLATES.sql
Link: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
Action: Copy ALL → Paste → RUN
```

### **5. Login**
```
Link: https://vendoura.com/admin
Email: emmanuel@vendoura.com
Password: Alome!28$..
```

---

## 🔍 **Verify Tables Exist**

After running QUICK_FIX.sql, check if tables were created:

### **Option 1: Use Database Check Page**
```
https://vendoura.com/admin/databasecheck
```
Should show: **10/10 tables found** ✅

### **Option 2: Run SQL Query**
In SQL Editor, run this:
```sql
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Should see all 10 tables listed!

---

## ❌ **Common Issues**

### **"Permission denied" when running SQL**
**Fix:** Make sure you're logged into the correct Supabase project
- Project ID should be: `idhyjerrdrcaitfmbtjd`
- Check top-left corner of Supabase dashboard

### **"Already exists" errors**
**Fix:** This is OK! It means tables were created before. The script uses `CREATE TABLE IF NOT EXISTS` so it won't break.

### **SQL Editor shows errors in red**
**Fix:** Read the error message:
- If it says "already exists" - that's fine, ignore it
- If it says "permission denied" - check you're on the right project
- If it says "syntax error" - make sure you copied the ENTIRE file

### **Still seeing PGRST205 error after running script**
**Fix:** 
1. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Try in incognito/private window
4. Verify tables exist using SQL:
   ```sql
   SELECT COUNT(*) FROM notification_templates;
   ```
   Should return a number (0 if empty, more if templates added)

---

## 🎯 **Quick Fix Command**

**TL;DR - Just do this:**

1. Open: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
2. Copy `/QUICK_FIX.sql` → Paste → RUN
3. Refresh your admin page
4. Error GONE! ✅

---

## 📞 **Still Having Issues?**

If the error persists after running QUICK_FIX.sql:

1. **Check browser console** (F12 → Console tab)
   - Look for any red errors
   - Copy and share them

2. **Check SQL Editor output**
   - Did QUICK_FIX.sql run successfully?
   - Any red error messages?

3. **Verify table exists:**
   ```sql
   SELECT * FROM notification_templates LIMIT 1;
   ```
   - If error: Table doesn't exist, run QUICK_FIX.sql again
   - If success: Table exists, refresh browser

4. **Check Supabase RLS (Row Level Security):**
   - The QUICK_FIX.sql creates RLS policies
   - If you modified them, that might cause issues

---

## ✅ **Expected Result**

After running `/QUICK_FIX.sql`:

✅ Error message disappears  
✅ Notification page loads  
✅ Shows "No templates found" (if you haven't run NOTIFICATION_TEMPLATES.sql)  
✅ Shows template list (if you ran NOTIFICATION_TEMPLATES.sql)  

---

**🚀 Start with running `/QUICK_FIX.sql` and your error will be fixed!**
