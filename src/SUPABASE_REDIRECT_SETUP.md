# Supabase Redirect URLs - Exact Setup

## Go to Supabase Dashboard

URL: https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/auth/url-configuration

## Configuration Required

### 1. Site URL
Set this to:
```
http://localhost:3000
```

### 2. Redirect URLs
In the "Redirect URLs" section, you should have a list. Add these TWO URLs:

```
http://localhost:3000/
http://localhost:3000/**
```

**Important Notes:**
- The first one ends with just `/` (the root path)
- The second one ends with `/**` (wildcard for all paths)
- You need BOTH URLs
- Click the "Add" or "+" button for each one
- Then click "Save" at the bottom

## What It Should Look Like

After saving, you should see:
```
✓ http://localhost:3000/
✓ http://localhost:3000/**
```

Both with green checkmarks.

## Production Setup (Later)

When you deploy to production, you'll add:
```
https://yourdomain.com/
https://yourdomain.com/**
```

## Test After Setup

1. Wait 30 seconds after saving
2. Clear browser cache or use incognito window
3. Go to `http://localhost:3000/login`
4. Click "Continue with Google"
5. After authorization, you should be redirected back and automatically signed in
6. You'll end up at `/onboarding` or `/founder/dashboard`

## Current Status

- [x] Code fixed in `/App.tsx`
- [x] OAuth methods fixed in `/lib/api.ts`
- [ ] **YOU NEED TO**: Add redirect URLs in Supabase Dashboard (above)

---

**Only 2 URLs needed:**
1. `http://localhost:3000/`
2. `http://localhost:3000/**`

That's it!
