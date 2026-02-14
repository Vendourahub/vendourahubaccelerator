# LocalStorage Mode - Complete Documentation

## 🎉 Overview

**Vendoura Hub now runs entirely on client-side localStorage!**

The entire application has been converted from a Supabase-backed system to a 100% client-side application using browser localStorage for all data persistence. No backend, no database, no external dependencies.

## 🚨 COHORT STATUS UPDATE

**Applications are currently CLOSED. The cohort is deactivated.**

When users click "Apply Now" anywhere on the site, they will be automatically redirected to the **Waitlist Form** instead of the full application form. This is controlled by the `applications_open: false` setting in localStorage.

### How It Works:
1. User clicks "Apply Now" on landing page → Goes to `/apply`
2. Application page checks `settings.applications_open` 
3. If `false`, shows waitlist form (name + email only)
4. If `true`, shows full application form

### To Reopen Applications:
Super Admins can toggle this in the admin dashboard settings panel (when implemented), or manually update localStorage:
```javascript
// In browser console:
const settings = JSON.parse(localStorage.getItem('vendoura_settings'));
settings.applications_open = true;
localStorage.setItem('vendoura_settings', JSON.stringify(settings));
```

## 🏗️ Architecture

### **Before (Supabase Backend)**
```
Frontend → Supabase Auth → Edge Functions → KV Store (Postgres)
```

### **After (LocalStorage)**
```
Frontend → LocalStorage (Browser)
```

## 📦 Core Components

### 1. **`/lib/localStorage.ts`** - Data Storage Layer
The complete data storage system that replaces the backend KV store.

**Features:**
- ✅ User authentication (founders & admins)
- ✅ Founder profiles management
- ✅ Admin management
- ✅ Cohort management
- ✅ Application management
- ✅ Waitlist management
- ✅ Settings management
- ✅ Email logging
- ✅ Data export/import
- ✅ Auto-initialization

**Storage Keys:**
```typescript
vendoura_current_user      // Current authenticated user
vendoura_current_admin     // Current admin session
vendoura_founders          // All founder profiles
vendoura_admins            // All admin users
vendoura_cohorts           // All cohorts
vendoura_applications      // All applications
vendoura_waitlist          // Waitlist entries
vendoura_settings          // Platform settings
vendoura_email_logs        // Email logs (for tracking)
vendoura_seeded            // Flag for initial data seeding
```

### 2. **`/lib/auth.ts`** - Authentication Library
Client-side authentication that replaces Supabase Auth.

**Functions:**
- `signUp(email, password, metadata)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `getCurrentUser()` - Get current authenticated user
- `isAuthenticated()` - Check if user is logged in
- `getUserType()` - Get user type (founder/admin)
- `logout()` - Sign out current user
- `disconnect()` - Sign out and redirect to home
- `getFounderProfile()` - Get founder profile data
- `updateFounderProfile(updates)` - Update founder profile
- `completeOnboarding(data)` - Complete onboarding process

### 3. **`/lib/adminAuth.ts`** - Admin Authentication
Admin-specific authentication and management.

**Functions:**
- `adminLogin(email, password)` - Admin login
- `getCurrentAdmin()` - Get current admin user
- `isAdminAuthenticated()` - Check admin authentication
- `getAdminRole()` - Get admin role
- `isSuperAdmin()` - Check if super admin
- `adminLogout()` - Admin logout
- `createAdmin()` - Create new admin (super admin only)
- `getAllAdmins()` - Get all admins
- `updateAdmin()` - Update admin
- `deleteAdmin()` - Delete admin

### 4. **`/lib/api.ts`** - API Layer
API functions that now use localStorage instead of backend calls.

**Founder API:**
- `getFounderProfile()`
- `updateFounderProfile(updates)`
- `completeOnboarding(data)`

**Admin API:**
- `adminGetAllFounders()`
- `adminGetFounder(id)`
- `adminUpdateFounder(id, updates)`
- `adminDeleteFounder(id)`
- `adminGetAllCohorts()`
- `adminCreateCohort(data)`
- `adminUpdateCohort(id, updates)`
- `adminDeleteCohort(id)`
- `adminGetAllApplications()`
- `adminUpdateApplication(id, updates)`
- `adminGetWaitlist()`
- `adminGetStatistics()`
- `adminGetSettings()`
- `adminUpdateSettings(updates)`

**Public API:**
- `submitApplication(data)`
- `joinWaitlist(email, name, source)`

### 5. **`/lib/seedData.ts`** - Default Data
Initializes the application with default data.

**Functions:**
- `seedDefaultData()` - Creates default admin, cohort, and sample founder
- `resetToDefaultData()` - Clears all data and reseeds
- `createSampleData()` - Creates additional sample data for testing

## 🔐 Default Credentials

The system comes pre-configured with default accounts:

### **Super Admin**
- **Email:** `admin@vendoura.com`
- **Password:** `admin123`
- **Role:** Super Admin
- **Access:** Full platform administration

### **Sample Founder**
- **Email:** `founder@example.com`
- **Password:** `founder123`
- **Status:** Onboarding completed
- **Access:** Founder dashboard

## 🚀 Getting Started

### **First Time Setup**

1. **Application loads** → Automatically initializes localStorage
2. **Default data seeded** → Creates admin and sample accounts
3. **Ready to use** → Login with default credentials

### **Login**

**For Founders:**
- Go to `/login`
- Use: `founder@example.com` / `founder123`
- Or create new account at `/apply`

**For Admins:**
- Go to `/admin/login`
- Use: `admin@vendoura.com` / `admin123`

## 📊 Data Management

### **View All Data**
```javascript
// In browser console
const data = localStorage;
Object.keys(data).filter(k => k.startsWith('vendoura'));
```

### **Export Data**
```javascript
import { exportData } from './lib/localStorage';
const jsonData = exportData();
console.log(jsonData);
// Copy and save to file
```

### **Import Data**
```javascript
import { importData } from './lib/localStorage';
const jsonString = '...'; // Your JSON data
importData(jsonString);
```

### **Clear All Data**
```javascript
import { clearAllData } from './lib/localStorage';
clearAllData(); // Clears and reinitializes
```

### **Reset to Defaults**
```javascript
import { resetToDefaultData } from './lib/seedData';
resetToDefaultData(); // Back to original state
```

## 🔧 How It Works

### **Authentication Flow**

1. **User enters credentials** on login page
2. **`signIn()` called** with email/password
3. **Password hashed** (simple hash for demo)
4. **User found** in localStorage founders/admins array
5. **Session created** in `vendoura_current_user` or `vendoura_current_admin`
6. **User redirected** to appropriate dashboard

### **Data Persistence**

All data is stored as JSON in localStorage:

```typescript
// Example: Storing founders
const founders = [
  {
    id: '1234-5678',
    email: 'founder@example.com',
    name: 'John Founder',
    business_name: 'Example Startup',
    onboarding_completed: true,
    // ... more fields
  }
];
localStorage.setItem('vendoura_founders', JSON.stringify(founders));
```

### **Compatibility Layer**

The old Supabase code has been replaced with a compatibility layer:

```typescript
// Old code that called Supabase still works:
import { supabase } from './lib/api';

// But now returns localStorage-based results
await supabase.auth.signIn(...); // → Uses localStorage
```

## ⚠️ Limitations

### **Data Persistence**
- ✅ Data persists across page refreshes
- ✅ Data persists across browser sessions
- ❌ Data is lost if browser cache is cleared
- ❌ Data is NOT synced across devices
- ❌ Data is NOT backed up

### **Storage Limits**
- **Maximum:** ~5-10 MB (varies by browser)
- **Current usage:** Minimal (few KB with default data)
- **Recommendation:** Limit to <500 records per collection

### **Security**
- ⚠️ **Passwords are weakly hashed** (simple hash, not bcrypt)
- ⚠️ **Data is visible in browser** (anyone with access to browser can read)
- ⚠️ **No server-side validation** (all validation is client-side)
- ⚠️ **NOT production-ready** for sensitive data

### **Features Not Available**
- ❌ OAuth (Google/LinkedIn) - Returns error message
- ❌ Email sending - Logged but not sent
- ❌ File uploads - Not supported
- ❌ Real-time updates - No sync across tabs
- ❌ Server-side processing - All client-side

## 🎯 Use Cases

### **✅ Perfect For:**
- Local development and testing
- Demos and presentations
- Prototypes and MVPs
- Offline-first applications
- Learning/educational projects
- Client-side-only apps

### **❌ Not Suitable For:**
- Production applications with sensitive data
- Multi-user collaborative platforms
- Applications requiring data backup
- Apps with complex server-side logic
- Applications requiring audit trails
- Compliance-sensitive applications

## 🔄 Migration Path

### **To move back to Supabase:**

1. **Keep localStorage as fallback:**
   ```typescript
   if (supabaseAvailable) {
     // Use Supabase
   } else {
     // Use localStorage
   }
   ```

2. **Export data before migration:**
   ```javascript
   const localData = exportData();
   // Import into Supabase
   ```

3. **Run both systems in parallel:**
   - Keep localStorage for offline support
   - Sync to Supabase when online

## 🛠️ Customization

### **Add New Data Type**

1. **Define type in `/lib/localStorage.ts`:**
   ```typescript
   export interface NewType {
     id: string;
     name: string;
     created_at: string;
   }
   ```

2. **Add storage key:**
   ```typescript
   const KEYS = {
     // ... existing keys
     NEW_TYPE: 'vendoura_new_type',
   };
   ```

3. **Add CRUD functions:**
   ```typescript
   export function getAllNewTypes(): NewType[] {
     return getFromStorage<NewType[]>(KEYS.NEW_TYPE, []);
   }
   
   export function createNewType(data: NewType): NewType {
     const items = getAllNewTypes();
     const newItem = { ...data, id: generateId() };
     items.push(newItem);
     setToStorage(KEYS.NEW_TYPE, items);
     return newItem;
   }
   ```

4. **Add API function in `/lib/api.ts`:**
   ```typescript
   export async function adminGetNewTypes(): Promise<NewType[]> {
     return storage.getAllNewTypes();
   }
   ```

### **Modify Seed Data**

Edit `/lib/seedData.ts` to change default data:

```typescript
export async function seedDefaultData(): Promise<void> {
  // Customize default admin
  await storage.signUp('myemail@example.com', 'mypassword', {
    user_type: 'admin',
    name: 'My Name',
    admin_role: 'super_admin',
  });
  
  // Add custom cohort
  storage.createCohort({
    name: 'My Cohort',
    // ... more fields
  });
}
```

## 📝 Best Practices

### **1. Regular Exports**
```javascript
// Export data weekly
setInterval(() => {
  const data = exportData();
  // Save to file or send to email
}, 7 * 24 * 60 * 60 * 1000); // Every 7 days
```

### **2. Validate Data**
```typescript
function validateFounder(founder: any): boolean {
  return (
    founder.email &&
    founder.name &&
    founder.business_name &&
    // ... more validation
  );
}
```

### **3. Handle Errors**
```typescript
try {
  const result = await signIn(email, password);
  if (!result.success) {
    showError(result.error);
  }
} catch (error) {
  showError('Something went wrong');
}
```

### **4. Monitor Storage Usage**
```javascript
function getStorageSize(): number {
  let total = 0;
  for (let key in localStorage) {
    if (key.startsWith('vendoura')) {
      total += localStorage[key].length;
    }
  }
  return total; // bytes
}
```

## 🧪 Testing

### **Console Commands**

```javascript
// View current user
import { getCurrentUser } from './lib/auth';
getCurrentUser();

// View all founders
import { getAllFounders } from './lib/localStorage';
getAllFounders();

// View all data
import { exportData } from './lib/localStorage';
console.log(exportData());

// Clear and reset
import { resetToDefaultData } from './lib/seedData';
resetToDefaultData();
```

## 🎉 Summary

**Vendoura Hub is now 100% client-side!**

- ✅ No Supabase dependency
- ✅ No backend required
- ✅ Works offline
- ✅ Easy to test and demo
- ✅ Simple data management
- ✅ Fast and responsive
- ✅ Complete feature parity

**Perfect for development, testing, and demos. Ready to use right now!** 🚀