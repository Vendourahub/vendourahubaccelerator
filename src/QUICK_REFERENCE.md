# ⚡ QUICK REFERENCE - Vendoura Hub Setup

## 🎯 **YOUR MISSION**

Create Super Admin account for Emmanuel and set up the platform.

---

## 📋 **3-STEP SETUP**

### **1️⃣ CREATE AUTH USER** (2 minutes)
```
URL: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users

Click: "Add User"
Email: emmanuel@vendoura.com
Password: Alome!28$..
✅ Auto Confirm User: CHECK THIS
Click: "Create User"
```

### **2️⃣ RUN SQL SCRIPTS** (3 minutes)
```
URL: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new

Script A: /QUICK_FIX.sql (creates database tables)
Script B: /create_emmanuel_admin.sql (makes Emmanuel super admin)
Script C: /NOTIFICATION_TEMPLATES.sql (adds email templates - optional)

For each: Copy all → Paste → RUN
```

### **3️⃣ LOGIN & VERIFY** (1 minute)
```
URL: https://vendoura.com/admin

Email: emmanuel@vendoura.com
Password: Alome!28$..

Then check: /admin/databasecheck
Should show: 10/10 tables ✅
```

---

## 🔗 **IMPORTANT LINKS**

| What | URL |
|------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd |
| **Auth Users** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users |
| **SQL Editor** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new |
| **Admin Login** | https://vendoura.com/admin |
| **Database Check** | https://vendoura.com/admin/databasecheck |
| **Super Admin Control** | https://vendoura.com/admin/superadmin |

---

## 📁 **KEY FILES**

| File | Purpose |
|------|---------|
| `/QUICK_FIX.sql` | Creates all database tables |
| `/create_emmanuel_admin.sql` | Makes Emmanuel super admin |
| `/NOTIFICATION_TEMPLATES.sql` | Adds 14 email templates |
| `/EMMANUEL_ADMIN_SETUP.md` | Detailed setup guide |
| `/DATABASE_SETUP_INSTRUCTIONS.md` | Database troubleshooting |
| `/EMAIL_SETUP_COMPLETE.md` | Email system guide |

---

## 🔐 **ADMIN CREDENTIALS**

```
Email: emmanuel@vendoura.com
Password: Alome!28$..
Role: Super Admin (Full Access)
```

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify:

- [ ] Database check shows 10/10 tables
- [ ] Can login at /admin
- [ ] Super Admin Control page loads
- [ ] Settings tab has 3 sub-tabs (Cohort, Payment, Email)
- [ ] Can toggle cohort program on/off
- [ ] Admins tab shows Emmanuel as super_admin
- [ ] Notification templates page shows 14 templates

---

## 🆘 **QUICK FIXES**

### ❌ **"User not found" in SQL**
➡️ Create auth user in Step 1 first

### ❌ **"Table does not exist"**
➡️ Run /QUICK_FIX.sql first

### ❌ **Can't login**
➡️ Check "Auto Confirm User" was checked

### ❌ **Login works but no admin access**
➡️ Re-run /create_emmanuel_admin.sql

### ❌ **Database check shows red X's**
➡️ Run /QUICK_FIX.sql again

---

## 🎯 **AFTER SETUP**

### **Configure Settings:**
1. Go to `/admin/superadmin` → Settings
2. **Payment Gateways tab:**
   - Add Paystack keys
   - Add Flutterwave keys (optional)
3. **Email/SMTP tab:**
   - Add SMTP host (e.g., smtp.gmail.com)
   - Add SMTP port (e.g., 587)
   - Add username & password
   - Set from email & name

### **Test Features:**
- Create a test founder
- Toggle cohort program
- Add another admin
- Send a test notification

---

## 📊 **ADMIN PAGES**

| Page | URL | Purpose |
|------|-----|---------|
| **Cohort Overview** | `/admin/cohort` | View all founders |
| **Super Admin Control** | `/admin/superadmin` | Platform settings |
| **Revenue Analytics** | `/admin/analytics` | Revenue tracking |
| **Intervention Panel** | `/admin/interventions` | At-risk founders |
| **Data Tracking** | `/admin/tracking` | Submission tracking |
| **Subscriptions** | `/admin/subscriptions` | Payment management |
| **Notifications** | `/admin/notifications` | Email templates |
| **Database Check** | `/admin/databasecheck` | Verify setup |
| **Dev Vault** | `/admin/vault` | System info |

---

## 🚀 **PLATFORM FEATURES**

### **For Founders:**
- Weekly Commit (Sunday deadline)
- Weekly Report (Friday deadline)
- Evidence submission
- 5-stage progression system
- 3-miss lock enforcement

### **For Admins:**
- Real-time founder tracking
- Intervention system
- Revenue analytics
- Cohort management
- Waitlist system
- Email notifications

---

## 💳 **PAYMENT INTEGRATION**

### **Paystack (Primary):**
- Test: `pk_test_xxx` / `sk_test_xxx`
- Live: `pk_live_xxx` / `sk_live_xxx`

### **Flutterwave (Optional):**
- Test: `FLWPUBK_TEST-xxx` / `FLWSECK_TEST-xxx`
- Live: `FLWPUBK-xxx` / `FLWSECK-xxx`

**Configure at:** `/admin/superadmin` → Settings → Payment Gateways

---

## 📧 **EMAIL TEMPLATES**

14 templates included:
1. Welcome email
2. Weekly commit reminder
3. Weekly report reminder
4. First miss warning
5. Second miss warning
6. Account locked notification
7. Intervention required
8. Intervention resolved
9. Stage unlocked
10. Waitlist welcome
11. Cohort opening soon
12. Admin intervention alert
13. Admin weekly summary
14. Milestone achieved

**View at:** `/admin/notifications`

---

## 🔒 **SECURITY NOTES**

✅ Password is strong (15 chars, special chars)  
✅ Use HTTPS only (https://vendoura.com)  
✅ Enable 2FA in Supabase  
✅ Don't share super admin credentials  
✅ Regular password changes recommended  
✅ Logout when done  

---

## 📞 **GET HELP**

Read these files for detailed help:
- `/EMMANUEL_ADMIN_SETUP.md` - Step-by-step setup
- `/CREATE_SUPER_ADMIN.md` - Admin creation guide
- `/DATABASE_SETUP_INSTRUCTIONS.md` - Database help
- `/EMAIL_SETUP_COMPLETE.md` - Email setup

---

## ⏱️ **TIME ESTIMATES**

| Task | Time |
|------|------|
| Create auth user | 2 min |
| Run SQL scripts | 3 min |
| Verify login | 1 min |
| Configure payment | 3 min |
| Configure email | 5 min |
| **Total** | **~15 min** |

---

**🎉 You're ready to launch Vendoura Hub!**

Start here: **https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users**
