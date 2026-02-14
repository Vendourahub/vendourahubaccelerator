# Email Rate Limit Fix Guide

## ⚠️ Issue: "Email rate limit exceeded"

Supabase has email rate limits to prevent spam and abuse. During development, you may hit these limits when testing authentication.

---

## 🚀 **Immediate Solutions**

### **1. Wait It Out (Quickest)**
- **Cooldown period:** 60 seconds (1 hour for repeated attempts)
- Rate limits reset automatically
- Try again after waiting

### **2. Use Different Test Emails**
Instead of testing with the same email, use variations:
```
john.doe+test1@example.com
john.doe+test2@example.com
john.doe+test3@example.com
```
These all deliver to `john.doe@example.com` but count as different addresses.

### **3. Disable Email Confirmation (Development Only)**
In Supabase Dashboard:
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off **"Confirm email"**
3. This prevents confirmation emails from being sent
4. ⚠️ **Remember to re-enable for production!**

---

## 🔧 **Long-term Solutions**

### **Option 1: Configure Custom SMTP (Recommended)**
Use your own email service to bypass Supabase limits:

1. **Get SMTP Credentials** from:
   - SendGrid (100 emails/day free)
   - Mailgun (5,000 emails/month free)
   - AWS SES (62,000 emails/month free)

2. **Configure in Supabase:**
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Enter your SMTP credentials
   - Test the connection

3. **Benefits:**
   - Higher rate limits
   - Custom email templates
   - Better deliverability
   - Your branding

### **Option 2: Upgrade Supabase Plan**
- **Free tier:** 4 emails/hour
- **Pro tier:** Higher limits
- **Enterprise:** Custom limits

### **Option 3: Use OAuth for Testing**
- Google/LinkedIn login doesn't send emails
- No rate limits on OAuth providers
- Better user experience

---

## ✅ **What We've Already Fixed**

### **Better Error Messages**
Both login pages now show user-friendly rate limit messages:

```typescript
// Before:
setError(err.message); // "Email rate limit exceeded"

// After:
setError("⏳ Too many attempts. Please wait a few minutes before trying again.");
```

### **Updated Files:**
- ✅ `/pages/Login.tsx` - Main login page
- ✅ `/pages/auth/Login.tsx` - Alternative login page

### **Error Handling Now Covers:**
- ❌ Invalid credentials
- 📧 Email not confirmed
- ⏳ Rate limit exceeded
- 👤 User already registered
- 🔧 Generic errors

---

## 🧪 **Testing Strategy**

### **During Development:**
```typescript
// Use email variations
const testEmails = [
  'founder+1@test.com',
  'founder+2@test.com',
  'founder+3@test.com',
];

// Or use OAuth
await auth.signInWithGoogle('founder');
```

### **For QA/Staging:**
1. Disable email confirmation
2. Use test email service (Mailtrap, Ethereal)
3. Configure custom SMTP

### **For Production:**
1. Enable email confirmation
2. Use custom SMTP (SendGrid/Mailgun)
3. Monitor rate limits via Supabase dashboard

---

## 📊 **Supabase Rate Limits**

| Plan | Email Limit | Cooldown |
|------|-------------|----------|
| Free | 4/hour | 60 seconds |
| Pro | Higher | Configurable |
| Enterprise | Custom | Custom |

---

## 🛠️ **Quick Fix Commands**

### **Check if rate limited:**
```bash
# Monitor Supabase logs
# Dashboard → Logs → Auth logs
```

### **Clear test data:**
```bash
# Delete test users in Dashboard
# Authentication → Users → Delete
```

### **Test without emails:**
```typescript
// In your code, temporarily use OAuth
const handleTestLogin = () => {
  auth.signInWithGoogle('founder');
};
```

---

## 📖 **Recommended Setup for Vendoura**

### **Development:**
1. Disable email confirmation
2. Use OAuth for quick testing
3. Use email variations for email/password tests

### **Staging:**
1. Enable email confirmation
2. Configure Mailtrap or test SMTP
3. Test with real email flow

### **Production:**
1. Enable email confirmation
2. Configure SendGrid/Mailgun
3. Monitor usage and errors
4. Have fallback OAuth options

---

## 🔗 **Resources**

- [Supabase Auth Rate Limits](https://supabase.com/docs/guides/platform/going-into-prod#auth-rate-limits)
- [Configure SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [SendGrid Setup](https://sendgrid.com/)
- [Mailgun Setup](https://www.mailgun.com/)

---

## ✅ **Current Status**

✅ Error messages updated with rate limit handling  
✅ User-friendly feedback ("⏳ Too many attempts...")  
✅ OAuth alternatives available (Google/LinkedIn)  
⏳ **Action needed:** Configure custom SMTP for production  
⏳ **Action needed:** Disable email confirmation for development  

---

## 🎯 **Next Steps**

1. **Immediate:** Disable email confirmation in Supabase Dashboard (Development)
2. **Short-term:** Sign up for SendGrid and configure SMTP
3. **Long-term:** Monitor auth usage and upgrade plan if needed

---

## 💡 **Pro Tip**

For Vendoura, since you're targeting Nigerian founders:
- Consider using a service with good Nigerian delivery rates
- SendGrid and Mailgun both have good coverage in Africa
- Test email deliverability to common Nigerian email providers (Gmail, Yahoo, Outlook)
