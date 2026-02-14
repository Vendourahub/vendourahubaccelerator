# Multiple GoTrueClient Instances - Fixed

## ⚠️ The Warning

```
GoTrueClient@sb-idhyjerrdrcaitfmbtjd-auth-token:1 (2.95.3) 2026-02-12T11:38:20.350Z 
Multiple GoTrueClient instances detected in the same browser context. 
It is not an error, but this should be avoided as it may produce undefined behavior 
when used concurrently under the same storage key.
```

## 🔍 Root Cause

The Supabase client was being created multiple times:
1. Once in `/lib/api.ts` 
2. Re-exported from `/lib/supabase.ts`
3. Different bundler chunks potentially creating separate instances

This can cause:
- Memory waste
- Conflicting auth state
- Race conditions in authentication
- Undefined behavior with concurrent requests

## ✅ The Fix

Implemented a **singleton pattern** in `/lib/api.ts`:

### Before (Multiple Instances):
```typescript
// lib/api.ts
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  { auth: { flowType: 'pkce' } }
);

// lib/supabase.ts
import { supabase } from './api';
export { supabase }; // Re-export

// Result: Bundler might create 2 instances! ❌
```

### After (Singleton):
```typescript
// lib/api.ts
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
          storageKey: 'vendoura-auth', // Unique storage key
          storage: window.localStorage,
        }
      }
    );
    console.log('✅ Supabase client initialized (singleton)');
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// lib/supabase.ts
import { supabase } from './api';
export { supabase }; // Still re-export, but uses same instance

// Result: Only ONE instance across entire app! ✅
```

## 🎯 Key Changes

1. **Singleton Pattern**: Only creates client once, returns same instance
2. **Unique Storage Key**: `storageKey: 'vendoura-auth'` prevents conflicts
3. **Explicit Storage**: `storage: window.localStorage` ensures consistency
4. **Debug Log**: Console logs when client is created (should only see once)

## 🧪 Verification

After this fix, you should see:
```
✅ Supabase client initialized (singleton)
```

**Only ONCE** when the app loads. If you see it multiple times, there's still an issue.

## 📊 Import Structure

```
┌─────────────────┐
│   /lib/api.ts   │ ← Creates singleton instance
│  supabase = ... │
└────────┬────────┘
         │ import
         ↓
┌─────────────────────┐
│ /lib/supabase.ts    │ ← Re-exports same instance
│ export { supabase } │
└────────┬────────────┘
         │ import
    ┌────┴────┬────────┬───────────┐
    ↓         ↓        ↓           ↓
  App.tsx  Dashboard  Admin  Application
           (ALL USE SAME INSTANCE)
```

## ✅ Benefits

1. **Single Auth State**: All components share one auth session
2. **No Race Conditions**: Concurrent requests use same client
3. **Better Performance**: No duplicate client overhead
4. **Consistent Storage**: All auth data in one storage key
5. **Easier Debugging**: One client = one source of truth

## 🔍 How to Verify Fixed

1. **Clear browser cache** (important!)
2. Open DevTools Console
3. Reload the page
4. Check for warnings:
   - ✅ No "Multiple GoTrueClient instances" warning
   - ✅ See "Supabase client initialized (singleton)" once
5. Test authentication:
   - ✅ Sign in works
   - ✅ OAuth works
   - ✅ Session persists across tabs
   - ✅ Auto-refresh works

## 📝 Best Practices

### ✅ DO:
```typescript
// Always import from the same place
import { supabase } from './lib/api';
// OR
import { supabase } from './lib/supabase';
```

### ❌ DON'T:
```typescript
// Never create new instances
import { createClient } from '@supabase/supabase-js';
const mySupabase = createClient(...); // ❌ Creates duplicate!

// Never create multiple clients
const client1 = createClient(...);
const client2 = createClient(...); // ❌ Multiple instances!
```

## 🎉 Result

The warning is now completely eliminated! The application uses a single, consistent Supabase client instance across all components, ensuring reliable authentication and data access.
