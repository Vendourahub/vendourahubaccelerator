# 🔍 SUPABASE INTEGRATION AUDIT & EXECUTION PLAN

## Project: Vendoura Hub
**Project ID:** `knqbtdugvessaehgwwcg`  
**Date:** February 12, 2026  
**Status:** Partial Integration → Full Production Integration

---

## 📋 CURRENT STATE ANALYSIS

### ✅ **What's Already Connected:**

#### **1. Database Schema (Partial)**
- ✅ `founder_profiles` - Basic structure exists
- ✅ `weekly_commits` - Basic structure exists
- ✅ `weekly_reports` - Basic structure exists
- ✅ `stage_progress` - Basic structure exists
- ✅ `admin_users` - Recently added
- ✅ `mentor_notes` - Referenced in code
- ✅ `audit_logs` - Referenced in code
- ✅ `system_settings` - From QUICK_FIX.sql
- ✅ `waitlist` - From QUICK_FIX.sql
- ✅ `notification_templates` - From QUICK_FIX.sql
- ✅ `interventions` - From QUICK_FIX.sql

#### **2. Authentication**
- ✅ Supabase Auth initialized
- ✅ Email/password login
- ✅ OAuth (Google, LinkedIn) configured
- ✅ Admin authentication with database verification
- ✅ Session management with PKCE flow

#### **3. Data Services**
- ✅ `/lib/supabase.ts` - Comprehensive service layer
- ✅ Founder service with CRUD operations
- ✅ Admin service with analytics queries
- ✅ Realtime subscriptions configured
- ✅ Singleton Supabase client pattern

#### **4. Admin Dashboard**
- ✅ CohortOverview - Connected to live data
- ✅ RevenueAnalytics - Connected to live data
- ✅ FounderDetail - Partial connection
- ⚠️ InterventionPanel - Needs full integration
- ⚠️ DataTracking - Needs verification
- ⚠️ SubscriptionManagement - Needs verification
- ⚠️ NotificationSetup - Needs verification

---

## ❌ **MISSING / INCOMPLETE INTEGRATIONS:**

### **1. Database Schema Gaps**

#### **Missing Tables:**
```sql
-- Performance tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  dollar_per_hour NUMERIC DEFAULT 0,
  win_rate NUMERIC DEFAULT 0,
  velocity_score INTEGER DEFAULT 0,
  consistency_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications history
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES auth.users(id),
  recipient_email TEXT NOT NULL,
  template_id UUID REFERENCES notification_templates(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'email', -- 'email', 'sms', 'in-app'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered'
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads / Evidence storage
CREATE TABLE IF NOT EXISTS evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  submission_id UUID, -- Links to weekly_commits or weekly_reports
  submission_type TEXT, -- 'commit' or 'report'
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_bucket TEXT DEFAULT 'evidence',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Cohort management
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cohort_number INTEGER UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current_week INTEGER DEFAULT 1,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed'
  max_founders INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  transaction_ref TEXT UNIQUE NOT NULL,
  gateway TEXT NOT NULL, -- 'paystack' or 'flutterwave'
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed'
  payment_type TEXT, -- 'subscription', 'renewal', 'upgrade'
  subscription_duration INTEGER, -- in days
  metadata JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription history
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  subscription_status TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Missing Columns in Existing Tables:**

**founder_profiles:**
```sql
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id);
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1;
```

**weekly_commits:**
```sql
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS action_description TEXT;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS target_revenue NUMERIC DEFAULT 0;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false;
ALTER TABLE weekly_commits ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
```

**weekly_reports:**
```sql
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS commit_id UUID REFERENCES weekly_commits(id);
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS revenue_generated NUMERIC DEFAULT 0;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS hours_spent NUMERIC DEFAULT 0;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS narrative TEXT;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS evidence_url TEXT;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS dollar_per_hour NUMERIC GENERATED ALWAYS AS (CASE WHEN hours_spent > 0 THEN revenue_generated / hours_spent ELSE 0 END) STORED;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS win_rate NUMERIC;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
```

#### **Missing Indexes:**
```sql
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_founder_cohort ON founder_profiles(cohort_id);
CREATE INDEX IF NOT EXISTS idx_founder_status ON founder_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_founder_subscription ON founder_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_weekly_commits_week ON weekly_commits(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week ON weekly_reports(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_status ON weekly_reports(status);
CREATE INDEX IF NOT EXISTS idx_interventions_priority ON interventions(priority);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_history_status ON notification_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
```

#### **Missing Triggers:**
```sql
-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON founder_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### **2. UI Elements Not Connected**

#### **Founder Dashboard (`/pages/Dashboard.tsx`):**
- ❌ Stage progression metrics
- ❌ Weekly timeline chart
- ❌ Dollar-per-hour tracking
- ❌ Win rate visualization
- ❌ Evidence upload status

#### **Commit Page (`/pages/Commit.tsx`):**
- ❌ Historical commits display
- ❌ Target revenue input
- ❌ Completion date picker
- ❌ Evidence file upload

#### **Report Page (`/pages/Report.tsx`):**
- ❌ Hours spent input
- ❌ Revenue generated input
- ❌ Narrative/reflection field
- ❌ Evidence links
- ❌ Auto-calculated metrics

#### **Execute Page (`/pages/Execute.tsx`):**
- ❌ Daily task tracking
- ❌ Progress updates
- ❌ Blocker logging

#### **Map Page (`/pages/Map.tsx`):**
- ❌ Stage progression view
- ❌ Lock/unlock status
- ❌ Requirements checklist

#### **Admin - Intervention Panel:**
- ⚠️ Manual intervention actions need database persistence
- ⚠️ Resolution tracking
- ⚠️ Escalation workflow

#### **Admin - Subscription Management:**
- ❌ Payment gateway integration
- ❌ Transaction history
- ❌ Renewal tracking

#### **Admin - Notification Setup:**
- ⚠️ Template CRUD needs verification
- ❌ Send history tracking
- ❌ Delivery status

---

### **3. Missing RLS Policies**

```sql
-- Cohorts - Authenticated can read
CREATE POLICY "Allow authenticated read cohorts" ON cohorts FOR SELECT TO authenticated USING (true);

-- Performance metrics - Users can read own, admins can read all
CREATE POLICY "Users can read own metrics" ON performance_metrics FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can read all metrics" ON performance_metrics FOR SELECT TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Notification history - Users can read own
CREATE POLICY "Users can read own notifications" ON notification_history FOR SELECT TO authenticated 
  USING (recipient_id = auth.uid());

-- Evidence files - Users can manage own
CREATE POLICY "Users can manage own evidence" ON evidence_files FOR ALL TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));

-- Payment transactions - Users can read own
CREATE POLICY "Users can read own transactions" ON payment_transactions FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));

-- Subscription history - Users can read own
CREATE POLICY "Users can read own subscription history" ON subscription_history FOR SELECT TO authenticated 
  USING (founder_id IN (SELECT id FROM founder_profiles WHERE user_id = auth.uid()));
```

---

### **4. Missing API Endpoints**

#### **Founder APIs:**
```typescript
// Performance tracking
founderService.getPerformanceMetrics(founderId: string)
founderService.updatePerformanceMetrics(weekNumber: number, metrics: object)

// Evidence management
founderService.uploadEvidence(file: File, type: 'commit' | 'report', weekNumber: number)
founderService.getEvidenceFiles(weekNumber: number)

// Subscription
founderService.getSubscriptionStatus()
founderService.getPaymentHistory()
```

#### **Admin APIs:**
```typescript
// Intervention management
adminService.createIntervention(founderId: string, data: object)
adminService.updateInterventionStatus(interventionId: string, status: string)
adminService.addInterventionAction(interventionId: string, action: object)
adminService.getInterventions(filters: object)

// Notification system
adminService.sendNotification(recipients: string[], template: string, data: object)
adminService.getNotificationHistory(founderId?: string)
adminService.createNotificationTemplate(template: object)

// Payment & subscription
adminService.processPayment(founderId: string, amount: number, gateway: string)
adminService.updateSubscription(founderId: string, status: string, duration: number)
adminService.getTransactionHistory(founderId?: string)

// Cohort management
adminService.createCohort(data: object)
adminService.updateCohort(cohortId: string, updates: object)
adminService.assignFounderToCohort(founderId: string, cohortId: string)
```

---

### **5. Missing Realtime Features**

```typescript
// Notification subscriptions
realtimeService.subscribeToNotifications(userId: string, callback)

// Intervention alerts
realtimeService.subscribeToInterventions(callback)

// Submission deadlines
realtimeService.subscribeToDeadlines(userId: string, callback)

// Revenue updates
realtimeService.subscribeToRevenueChanges(founderId: string, callback)
```

---

### **6. Missing File Storage Integration**

**Supabase Storage Buckets Needed:**
```typescript
// Buckets to create
'evidence' - Evidence files (screenshots, documents)
'profile-photos' - User profile pictures
'admin-uploads' - Admin uploaded resources

// Storage policies needed
- Founders can upload to their own folders
- Admins can view all files
- Public read for profile photos
```

---

### **7. Missing Error Handling**

- ❌ Global error boundary improvements
- ❌ Network failure recovery
- ❌ Offline state handling
- ❌ Validation error displays
- ❌ Transaction rollback logic

---

### **8. Missing Performance Optimizations**

- ❌ Query result caching
- ❌ Pagination on large lists
- ❌ Virtual scrolling for tables
- ❌ Debounced search inputs
- ❌ Optimistic UI updates

---

### **9. Missing Audit/Logging**

```sql
-- Enhanced audit logging
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Data change triggers
CREATE TRIGGER log_founder_updates AFTER UPDATE ON founder_profiles
    FOR EACH ROW EXECUTE FUNCTION log_data_change();

CREATE TRIGGER log_payment_changes AFTER INSERT OR UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION log_payment_event();
```

---

## 🎯 EXECUTION PLAN

### **Phase 1: Database Completion (Priority: CRITICAL)**

**Tasks:**
1. ✅ Create missing tables schema
2. ✅ Add missing columns to existing tables
3. ✅ Create all indexes
4. ✅ Create triggers for auto-timestamps
5. ✅ Implement all RLS policies
6. ✅ Create audit logging triggers

**Files to Create:**
- `/COMPLETE_SCHEMA.sql` - Complete database setup
- `/SCHEMA_MIGRATIONS.sql` - Migration for existing database

---

### **Phase 2: Complete Data Services (Priority: HIGH)**

**Tasks:**
1. ✅ Extend `/lib/supabase.ts` with missing functions
2. ✅ Add performance metrics service
3. ✅ Add evidence management service
4. ✅ Add notification service
5. ✅ Add payment/subscription service
6. ✅ Add cohort management service

**Files to Update:**
- `/lib/supabase.ts` - Add all missing services
- `/lib/storage.ts` - NEW: Supabase Storage helper
- `/lib/notifications.ts` - NEW: Notification service
- `/lib/payments.ts` - NEW: Payment integration

---

### **Phase 3: Connect All UI Elements (Priority: HIGH)**

**Founder Pages:**
- Update `/pages/Dashboard.tsx` - Connect all metrics
- Update `/pages/Commit.tsx` - Full CRUD integration
- Update `/pages/Report.tsx` - Full CRUD integration
- Update `/pages/Execute.tsx` - Task tracking integration
- Update `/pages/Map.tsx` - Stage progress integration

**Admin Pages:**
- Update `/pages/admin/InterventionPanel.tsx` - Full CRUD
- Update `/pages/admin/SubscriptionManagement.tsx` - Full integration
- Update `/pages/admin/NotificationSetup.tsx` - Full integration
- Update `/pages/admin/DataTracking.tsx` - Live data integration

---

### **Phase 4: File Upload Integration (Priority: MEDIUM)**

**Tasks:**
1. ✅ Create Supabase Storage buckets
2. ✅ Configure storage policies
3. ✅ Create upload helper functions
4. ✅ Add file upload UI components
5. ✅ Connect to evidence_files table

**Files:**
- `/lib/storage.ts` - NEW
- `/components/FileUploader.tsx` - NEW
- `/components/EvidenceViewer.tsx` - NEW

---

### **Phase 5: Realtime Features (Priority: MEDIUM)**

**Tasks:**
1. ✅ Enable realtime for all critical tables
2. ✅ Add realtime subscriptions to dashboards
3. ✅ Add notification toast system
4. ✅ Add live activity indicators

**Files to Update:**
- `/lib/supabase.ts` - Extend realtime service
- `/components/RealtimeIndicator.tsx` - NEW
- `/components/NotificationToast.tsx` - NEW

---

### **Phase 6: Payment Integration (Priority: MEDIUM)**

**Tasks:**
1. ✅ Integrate Paystack SDK
2. ✅ Integrate Flutterwave SDK
3. ✅ Create payment flow UI
4. ✅ Add transaction tracking
5. ✅ Add subscription renewal logic

**Files:**
- `/lib/payments/paystack.ts` - NEW
- `/lib/payments/flutterwave.ts` - NEW
- `/pages/Subscription.tsx` - NEW (for founders)
- `/components/PaymentModal.tsx` - NEW

---

### **Phase 7: Error Handling & Performance (Priority: MEDIUM)**

**Tasks:**
1. ✅ Enhance global error boundary
2. ✅ Add retry logic for failed requests
3. ✅ Implement query caching
4. ✅ Add pagination to all lists
5. ✅ Add loading skeletons
6. ✅ Optimize bundle size

**Files to Update:**
- `/components/ErrorBoundary.tsx` - Enhance
- `/lib/queryCache.ts` - NEW
- `/hooks/usePagination.ts` - NEW
- `/components/LoadingSkeleton.tsx` - NEW

---

### **Phase 8: Testing & Validation (Priority: HIGH)**

**Tasks:**
1. ✅ Test all CRUD operations
2. ✅ Test RLS policies
3. ✅ Test file uploads
4. ✅ Test realtime subscriptions
5. ✅ Test payment flows
6. ✅ Load testing
7. ✅ Security audit

---

### **Phase 9: Deployment Preparation (Priority: CRITICAL)**

**Tasks:**
1. ✅ Environment variables documentation
2. ✅ Database migration scripts
3. ✅ Backup procedures
4. ✅ Monitoring setup
5. ✅ Error logging (Sentry/similar)
6. ✅ Performance monitoring

**Files to Create:**
- `/DEPLOYMENT_GUIDE.md`
- `/ENV_SETUP.md`
- `/MIGRATION_GUIDE.md`
- `/MONITORING_SETUP.md`

---

## 📊 COMPLETION CHECKLIST

### **Database Layer:**
- [ ] All tables created
- [ ] All columns mapped
- [ ] All relationships defined
- [ ] All indexes created
- [ ] All RLS policies active
- [ ] All triggers implemented
- [ ] Audit logging complete

### **Service Layer:**
- [ ] All CRUD operations
- [ ] All analytics queries
- [ ] File storage functions
- [ ] Notification system
- [ ] Payment integration
- [ ] Realtime subscriptions
- [ ] Error handling

### **UI Layer:**
- [ ] All founder pages connected
- [ ] All admin pages connected
- [ ] All forms persist data
- [ ] All charts show live data
- [ ] All filters query database
- [ ] All exports work
- [ ] File uploads work

### **Features:**
- [ ] Authentication (email + OAuth)
- [ ] Weekly execution loop (Commit → Execute → Report)
- [ ] Stage progression system
- [ ] Intervention management
- [ ] Subscription tracking
- [ ] Payment processing
- [ ] Notification system
- [ ] Admin controls
- [ ] Realtime updates
- [ ] File uploads
- [ ] Audit logging

### **Quality:**
- [ ] No mock data anywhere
- [ ] No console errors
- [ ] No 404s or failed requests
- [ ] Fast page loads (<2s)
- [ ] Responsive design
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Empty states designed
- [ ] Security tested
- [ ] Performance tested

---

## 🚀 READY TO BEGIN

**Next Steps:**
1. Review and approve this audit
2. Start with Phase 1: Database Completion
3. Execute phases sequentially
4. Test after each phase
5. Document all changes

**Estimated Timeline:**
- Phase 1: 2 hours
- Phase 2: 4 hours  
- Phase 3: 8 hours
- Phase 4: 3 hours
- Phase 5: 3 hours
- Phase 6: 4 hours
- Phase 7: 3 hours
- Phase 8: 4 hours
- Phase 9: 2 hours

**Total: ~33 hours of focused development**

---

**Shall I proceed with Phase 1: Database Completion?**
