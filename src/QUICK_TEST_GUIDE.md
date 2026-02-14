# 🎯 QUICK START TESTING GUIDE

**Ready to test Vendoura Hub? Follow this 5-minute guide to verify everything works.**

---

## ✅ PRE-FLIGHT CHECK

Before testing, ensure:
1. ✅ Database schema deployed (run `/supabase/schema.sql`)
2. ✅ Supabase credentials configured in `/utils/supabase/info.tsx`
3. ✅ Application is running locally or deployed

---

## 🧪 TEST 1: Founder Signup & Onboarding (3 minutes)

### Step 1: Sign Up
1. Navigate to `/apply`
2. Fill out the application form:
   - Name: "Test Founder"
   - Email: "test@example.com"
   - Password: "TestPass123!"
   - Business: "Test Business Description"
   - Revenue 30d: 1500000
   - Revenue 90d: 4200000
3. Click **"Submit Application"**
4. **Expected**: Success screen with "Check your email" message

### Step 2: Login
1. Go to `/login`
2. Enter credentials from Step 1
3. Click **"Sign In"**
4. **Expected**: Redirect to `/onboarding` (first-time users)

### Step 3: Complete Onboarding
1. Fill onboarding form:
   - Business Name: "Test Corp"
   - Business Model: "B2B SaaS"
   - Product Description: "Marketing automation tool"
   - Customer Count: 50
   - Pricing: 5000 per hour
2. Click **"Complete Setup"**
3. **Expected**: Redirect to `/founder/dashboard`

### Step 4: Verify Dashboard
✅ Dashboard displays:
- Revenue metrics
- Stage 1 indicator
- Week 1 indicator
- "Submit Your First Commit" next action
- Weekly loop items (Commit, Execute, Report, Adjust)

**Result**: If all steps work → ✅ Signup flow PASSED

---

## 🧪 TEST 2: Weekly Execution Loop (5 minutes)

### Step 1: Submit Commit (Monday)
1. From dashboard, click **"Go to Weekly Commit"** or navigate to `/commit`
2. Enter action: "Call 20 leads from last month's webinar"
3. Enter target revenue: 150000
4. Click **"Submit Commit"**
5. **Expected**: Success message, commit saved

### Step 2: Log Execution (Daily)
1. Navigate to `/execute`
2. Start work timer or enter hours manually: 4.5
3. Enter description: "Called 15 leads, 3 booked demos"
4. Optional: Enter revenue impact: 75000
5. Click **"Log Hours"**
6. **Expected**: Hours logged, appears in execution log

### Step 3: Submit Report (Friday)
1. Navigate to `/report`
2. Enter total revenue: 150000
3. Add evidence URL: "https://imgur.com/abc123"
4. Enter evidence description: "Screenshot of bank alert for ₦150,000"
5. Click **"Submit Revenue Report"**
6. **Expected**: Report submitted, past reports visible

### Step 4: View Stage Map
1. Navigate to `/map`
2. **Expected**: 
   - Stage 1 shows "in-progress"
   - Stages 2-5 show "locked"
   - Current metrics displayed
   - Requirements checklist visible

### Step 5: Try RSD (Should be locked)
1. Navigate to `/rsd`
2. **Expected**: "Locked" screen with message about Stage 4 requirement

**Result**: If all steps work → ✅ Execution loop PASSED

---

## 🧪 TEST 3: Admin Dashboard (3 minutes)

### Step 1: Admin Login
1. Navigate to `/admin`
2. Login as admin (credentials from Dev Vault)
3. **Expected**: Cohort overview dashboard

### Step 2: View Founder
1. See test founder in founder list
2. Click on founder card
3. **Expected**: Founder detail page with:
   - Profile information
   - Weekly activity
   - Lock controls
   - Mentor notes section

### Step 3: Test Intervention
1. Click **"Send Message"**
2. Enter test message
3. Click **"Send"**
4. **Expected**: Message sent confirmation

### Step 4: Check Subscriptions
1. Navigate to `/admin/subscriptions`
2. Click on test founder
3. Try **"Record Payment"** action
4. Enter amount: 150000
5. **Expected**: Payment recorded successfully

**Result**: If all steps work → ✅ Admin dashboard PASSED

---

## 🧪 TEST 4: Navigation & Links (2 minutes)

### Test All Founder Pages:
- [ ] `/founder/dashboard` - Dashboard loads
- [ ] `/commit` - Commit page loads
- [ ] `/execute` - Execute page loads
- [ ] `/report` - Report page loads
- [ ] `/map` - Map page loads
- [ ] `/rsd` - RSD page loads (shows lock for Stage 1)
- [ ] `/calendar` - Calendar loads
- [ ] `/community` - Community loads

### Test All Admin Pages:
- [ ] `/admin` - Cohort overview loads
- [ ] `/admin/analytics` - Analytics loads
- [ ] `/admin/interventions` - Interventions loads
- [ ] `/admin/tracking` - Tracking loads
- [ ] `/admin/subscriptions` - Subscriptions loads
- [ ] `/admin/notifications` - Notifications loads
- [ ] `/admin/accounts` - Accounts loads
- [ ] `/admin/profile` - Profile loads
- [ ] `/admin/vault` - Dev Vault loads
- [ ] `/admin/paystack` - Paystack config loads
- [ ] `/admin/flutterwave` - Flutterwave config loads

**Result**: All pages load → ✅ Navigation PASSED

---

## 🧪 TEST 5: Responsive Design (1 minute)

### Desktop (1920px)
1. Open application in full screen
2. Check all pages render properly
3. **Expected**: Full layout, no overflow

### Mobile (375px)
1. Open DevTools, switch to mobile view
2. Navigate through key pages
3. **Expected**: 
   - Hamburger menu works
   - Forms are usable
   - Tables scroll horizontally
   - No broken layouts

**Result**: Both views work → ✅ Responsive PASSED

---

## 🧪 TEST 6: Database Verification

### Check Data Saved:
```sql
-- Check founder profile created
SELECT * FROM founder_profiles WHERE email = 'test@example.com';

-- Check commit saved
SELECT * FROM weekly_commits WHERE user_id = '[user_id_from_above]';

-- Check report saved
SELECT * FROM weekly_reports WHERE user_id = '[user_id_from_above]';
```

**Expected**: All queries return data

**Result**: Data exists → ✅ Database PASSED

---

## ✅ FINAL CHECKLIST

After completing all tests:

- [ ] Founder signup works
- [ ] Login redirects correctly
- [ ] Onboarding saves data
- [ ] Dashboard displays live data
- [ ] Commit submission works
- [ ] Execute page logs hours
- [ ] Report submission works
- [ ] Map displays stages
- [ ] RSD locks until Stage 4
- [ ] Admin can view founders
- [ ] Admin can intervene
- [ ] Subscriptions management works
- [ ] All navigation links work
- [ ] Mobile responsive
- [ ] Database stores data

---

## 🎉 SUCCESS CRITERIA

### ✅ READY FOR PRODUCTION if:
- All 6 tests pass
- All checklist items checked
- No critical errors in console
- Data flows from UI → Database → UI

### ⚠️ NEEDS ATTENTION if:
- Any test fails
- Console shows errors
- Data not saving to database
- Links broken or going nowhere

---

## 🚨 TROUBLESHOOTING

### "Login fails"
→ Check Supabase credentials in `/utils/supabase/info.tsx`

### "Dashboard shows no data"
→ Check RLS policies enabled in Supabase

### "Commit/Report not saving"
→ Check browser console for errors
→ Verify database tables exist

### "Admin dashboard empty"
→ Sign up at least one founder first

---

## 📞 SUPPORT

If tests fail, check:
1. `/CROSS_CHECK_RESULTS.md` - System status
2. `/FINAL_VERIFICATION.md` - Feature audit
3. `/QUICK_START.md` - Setup guide
4. Browser console for errors

---

## 🎯 EXPECTED TEST TIME

- Test 1: 3 minutes
- Test 2: 5 minutes
- Test 3: 3 minutes
- Test 4: 2 minutes
- Test 5: 1 minute
- Test 6: 1 minute

**Total**: ~15 minutes for complete system verification

---

**Ready? Start with Test 1 and work through sequentially!** 🚀
