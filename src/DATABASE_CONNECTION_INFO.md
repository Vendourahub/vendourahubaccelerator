# 🔌 Database Connection Information

## **YES - Your Application DOES Connect to That Database!**

The PostgreSQL connection string you provided:
```
postgresql://postgres:[YOUR-PASSWORD]@db.idhyjerrdrcaitfmbtjd.supabase.co:5432/postgres
```

This is the **same database** that your application uses, but the app connects to it in a **different way**.

---

## 🏗️ **How Your Application Connects**

### **Frontend (Browser):**
Uses the **Supabase JavaScript Client** with REST API:

```javascript
// From /lib/api.ts
const supabase = createClient(
  'https://idhyjerrdrcaitfmbtjd.supabase.co',  // Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Public Anon Key
);
```

**Connection Method:** HTTP/HTTPS (REST API)  
**Authentication:** JWT tokens (publicAnonKey)  
**Protocol:** REST over HTTPS

---

### **Backend Server (Supabase Edge Function):**
Uses both the **Supabase Client** AND can access the database:

```javascript
// From /supabase/functions/server/index.tsx
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),           // https://idhyjerrdrcaitfmbtjd.supabase.co
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')  // Service role key (full access)
);
```

**Connection Method:** HTTP/HTTPS (REST API) + PostgREST  
**Authentication:** Service Role Key (admin access)  
**Protocol:** REST over HTTPS

---

### **Direct SQL Access (What You Can Use):**

The PostgreSQL connection string is for **direct database access**:

```
postgresql://postgres:[YOUR-PASSWORD]@db.idhyjerrdrcaitfmbtjd.supabase.co:5432/postgres
```

**Connection Method:** Direct PostgreSQL connection  
**Authentication:** postgres user + password  
**Protocol:** PostgreSQL wire protocol (port 5432)  
**Used For:**
- Running SQL scripts in Supabase SQL Editor
- Direct database administration
- Database migrations
- Backups

---

## 📊 **Connection Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    VENDOURA HUB APP                     │
└─────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ Frontend │   │  Backend │   │  Admin   │
    │ (Browser)│   │  Server  │   │ (You)    │
    └──────────┘   └──────────┘   └──────────┘
            │              │              │
            │              │              │
    ┌───────┼──────────────┼──────────────┼───────┐
    │       │              │              │       │
    │       ▼              ▼              ▼       │
    │   REST API      REST API +     PostgreSQL  │
    │   (Anon Key)  (Service Key)   (Direct)     │
    │       │              │              │       │
    │       └──────────────┼──────────────┘       │
    │                      ▼                      │
    │     ┌─────────────────────────────┐        │
    │     │   SUPABASE PROJECT          │        │
    │     │   idhyjerrdrcaitfmbtjd      │        │
    │     │                             │        │
    │     │  ┌─────────────────────┐   │        │
    │     │  │  PostgreSQL DB      │   │        │
    │     │  │  Port: 5432         │   │        │
    │     │  └─────────────────────┘   │        │
    │     │                             │        │
    │     │  ┌─────────────────────┐   │        │
    │     │  │  PostgREST API      │   │        │
    │     │  │  (Auto-generated)   │   │        │
    │     │  └─────────────────────┘   │        │
    │     │                             │        │
    │     │  ┌─────────────────────┐   │        │
    │     │  │  Auth Service       │   │        │
    │     │  │  (User management)  │   │        │
    │     │  └─────────────────────┘   │        │
    │     │                             │        │
    │     │  ┌─────────────────────┐   │        │
    │     │  │  Storage Service    │   │        │
    │     │  │  (File uploads)     │   │        │
    │     │  └─────────────────────┘   │        │
    │     └─────────────────────────────┘        │
    └────────────────────────────────────────────┘
```

---

## 🔑 **Connection Details Breakdown**

### **1. Frontend Connection (What Users See):**

**URL:**
```
https://idhyjerrdrcaitfmbtjd.supabase.co
```

**Authentication:**
```javascript
publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**What It Can Do:**
- ✅ Sign up/login users
- ✅ Query data with Row Level Security (RLS)
- ✅ Upload files to storage
- ✅ Subscribe to real-time changes
- ❌ Cannot bypass RLS policies
- ❌ Cannot access admin-only data

**File:** `/lib/api.ts`

---

### **2. Backend Server Connection:**

**URL:**
```
https://idhyjerrdrcaitfmbtjd.supabase.co
```

**Authentication:**
```javascript
SUPABASE_SERVICE_ROLE_KEY (environment variable)
```

**What It Can Do:**
- ✅ Full database access (bypasses RLS)
- ✅ Create/delete users programmatically
- ✅ Access all tables
- ✅ Modify any data
- ✅ Admin operations

**File:** `/supabase/functions/server/index.tsx`

---

### **3. Direct PostgreSQL Connection (You):**

**Connection String:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.idhyjerrdrcaitfmbtjd.supabase.co:5432/postgres
```

**Where to Get Password:**
```
1. Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/settings/database
2. Look for "Connection string" section
3. Click "Show" next to password
4. Copy the full connection string
```

**What You Can Do:**
- ✅ Run any SQL command
- ✅ Create/modify tables
- ✅ Create functions/triggers
- ✅ Manage database directly
- ✅ Run migrations
- ✅ Backup/restore database

**Used With:**
- Supabase SQL Editor (web interface)
- psql command-line tool
- pgAdmin, DBeaver, TablePlus
- Database migration tools

---

## 🎯 **Which Connection Method to Use?**

| Task | Method | Where |
|------|--------|-------|
| **Run setup SQL scripts** | Direct PostgreSQL | Supabase SQL Editor |
| **Create Emmanuel's admin** | Direct PostgreSQL | Supabase SQL Editor |
| **User authentication** | Frontend (Anon Key) | Browser app |
| **Query founder data** | Frontend/Backend | Supabase client |
| **Admin operations** | Backend (Service Key) | Edge function |
| **Database migrations** | Direct PostgreSQL | SQL Editor |
| **View raw data** | Direct PostgreSQL | SQL Editor |

---

## 📝 **To Access the Database Directly:**

### **Option 1: Supabase SQL Editor (Easiest)**

1. **Go to:**
   ```
   https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new
   ```

2. **Write SQL and click RUN:**
   ```sql
   -- Example: View all admin users
   SELECT * FROM admin_users;
   
   -- Example: Check if Emmanuel is an admin
   SELECT * FROM admin_users WHERE email = 'emmanuel@vendoura.com';
   ```

✅ **No connection string needed** - you're already logged into Supabase!

---

### **Option 2: Command Line (psql)**

1. **Get full connection string:**
   - Go to: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/settings/database
   - Copy "Connection string"
   - Replace `[YOUR-PASSWORD]` with actual password

2. **Connect:**
   ```bash
   psql "postgresql://postgres:[YOUR-PASSWORD]@db.idhyjerrdrcaitfmbtjd.supabase.co:5432/postgres"
   ```

3. **Run commands:**
   ```sql
   \dt -- List all tables
   SELECT * FROM admin_users;
   ```

---

### **Option 3: Database GUI (TablePlus, DBeaver, pgAdmin)**

**Connection Settings:**
```
Host: db.idhyjerrdrcaitfmbtjd.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [Get from Supabase dashboard]
SSL Mode: require
```

---

## ✅ **What Tables Exist?**

Run this in SQL Editor to see all tables:

```sql
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Vendoura Tables:**
1. `admin_users` - Admin accounts
2. `founder_profiles` - Founder information
3. `weekly_commits` - Sunday commitments
4. `weekly_reports` - Friday reports
5. `interventions` - Admin interventions
6. `notifications` - Notification history
7. `notification_templates` - Email templates
8. `cohort_settings` - Cohort configuration
9. `payment_gateways` - Paystack/Flutterwave keys
10. `email_settings` - SMTP configuration
11. `kv_store_eddbcb21` - Key-value store

---

## 🔐 **Security Notes**

### **Database Password:**
⚠️ **NEVER share the postgres password**  
⚠️ **NEVER commit it to Git**  
⚠️ **NEVER put it in frontend code**  

The postgres password gives **FULL DATABASE ACCESS** - treat it like a master key!

---

### **Service Role Key:**
⚠️ **NEVER expose in frontend**  
⚠️ **Only use in backend server**  
⚠️ **Stored as environment variable only**  

The service role key **bypasses all security policies** - only use server-side!

---

### **Public Anon Key:**
✅ **Safe to use in frontend**  
✅ **Safe to commit to Git**  
✅ **Limited by Row Level Security (RLS)**  

The anon key is public by design - it's protected by database RLS policies.

---

## 🎯 **For Your Setup:**

Since you're setting up Emmanuel's admin account:

1. ✅ **Use Supabase SQL Editor** (easiest)
2. ✅ **Run `/QUICK_FIX.sql`** to create tables
3. ✅ **Run `/create_emmanuel_admin.sql`** to make Emmanuel admin
4. ✅ **Login at** https://vendoura.com/admin

**You DON'T need the direct PostgreSQL connection string** - the SQL Editor works without it!

---

## 📞 **Quick Links**

| What | URL |
|------|-----|
| **SQL Editor** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new |
| **Database Settings** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/settings/database |
| **Table Editor** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/editor |
| **Auth Users** | https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/users |

---

## ✨ **Summary**

**YES!** Your app connects to that database, but:
- **Frontend** uses REST API (Supabase client)
- **Backend** uses REST API with service key
- **You (Admin)** use SQL Editor or direct PostgreSQL

All three methods connect to the **same PostgreSQL database**, just through different interfaces!

---

**For setting up Emmanuel's account, just use the Supabase SQL Editor - it's the easiest way!** 🚀
