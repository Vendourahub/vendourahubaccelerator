import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as community from "./community.ts";
import * as execution from "./execution.ts";

const app = new Hono();

// Log environment variables on startup (redacted)
console.log('🔧 Server starting with environment:', {
  SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
  HAS_SERVICE_ROLE_KEY: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  SERVICE_ROLE_KEY_PREFIX: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.substring(0, 20) + '...',
});

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Auth Middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    console.error('❌ No Authorization header provided');
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('❌ Invalid Authorization header format');
    return c.json({ error: 'Unauthorized: Invalid token format' }, 401);
  }

  console.log('🔑 Validating JWT token (first 50 chars):', token.substring(0, 50) + '...');

  try {
    // Split JWT into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format - expected 3 parts, got:', parts.length);
      return c.json({ error: 'Invalid JWT format' }, 401);
    }
    
    // Decode payload (base64url decode)
    let payload;
    try {
      // Base64url to base64: replace - with +, _ with /
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      
      // Decode and parse
      const jsonString = atob(base64);
      payload = JSON.parse(jsonString);
      
      console.log('✅ JWT decoded successfully');
    } catch (decodeError: any) {
      console.error('❌ JWT decode error:', decodeError.message);
      return c.json({ error: `Invalid JWT: ${decodeError.message}` }, 401);
    }
    
    console.log('🔍 JWT payload:', {
      sub: payload.sub,
      email: payload.email,
      exp: payload.exp,
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'no expiry'
    });
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      const expiredAt = new Date(payload.exp * 1000).toISOString();
      const nowISO = new Date().toISOString();
      console.error('❌ JWT expired:', { expiredAt, now: nowISO, secondsAgo: now - payload.exp });
      return c.json({ error: 'JWT expired - please refresh your session' }, 401);
    }
    
    // Validate required fields
    if (!payload.sub || !payload.email) {
      console.error('❌ JWT missing required fields:', { 
        hasSub: !!payload.sub, 
        hasEmail: !!payload.email,
        payload: JSON.stringify(payload)
      });
      return c.json({ error: 'Invalid JWT: Missing required fields' }, 401);
    }
    
    // Set user info from JWT payload
    c.set('userId', payload.sub);
    c.set('userEmail', payload.email);
    c.set('user', {
      id: payload.sub,
      email: payload.email,
      user_metadata: payload.user_metadata || {}
    });
    
    console.log('✅ JWT validated successfully for user:', payload.email);
    
    await next();
  } catch (err: any) {
    console.error('❌ Unexpected error in auth middleware:', {
      message: err.message,
      stack: err.stack
    });
    return c.json({ 
      error: `Auth error: ${err.message}`
    }, 500);
  }
};

// Health check endpoint
app.get("/make-server-eddbcb21/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Debug endpoint to check JWT
app.post("/make-server-eddbcb21/debug/jwt", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return c.json({ error: 'No token provided' }, 400);
    }

    // Try to validate token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    return c.json({
      tokenReceived: true,
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 30) + '...',
      supabaseUrl: Deno.env.get('SUPABASE_URL'),
      hasServiceRoleKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      validationSuccess: !!user,
      validationError: error?.message || null,
      userFound: user ? { id: user.id, email: user.email } : null
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Admin Signup
app.post("/make-server-eddbcb21/auth/admin/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    console.log(`Creating new admin user: ${email} with role: ${role}`);

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: role || 'observer',
        type: 'admin'
      },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Admin signup error:', error);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    // Store admin profile in KV store
    const adminProfile = {
      id: data.user.id,
      email,
      name,
      role: role || 'observer',
      cohortAccess: ['all'],
      permissions: {
        viewFounders: true,
        editFounders: role === 'super_admin' || role === 'mentor',
        sendNotifications: role === 'super_admin' || role === 'mentor',
        overrideLocks: role === 'super_admin' || role === 'mentor',
        removeFounders: role === 'super_admin' || role === 'mentor',
        exportData: true,
        manageAdmins: role === 'super_admin'
      },
      createdAt: new Date().toISOString()
    };

    console.log(`💾 Storing admin profile in KV with key: admin:${data.user.id}`);
    console.log(`📦 Admin profile data:`, JSON.stringify(adminProfile, null, 2));
    
    await kv.set(`admin:${data.user.id}`, adminProfile);
    
    console.log(`✅ Admin profile stored successfully`);

    return c.json({ 
      success: true, 
      user: adminProfile,
      message: 'Admin account created successfully'
    });
  } catch (error: any) {
    console.error('Admin signup error:', error);
    return c.json({ error: `Server error during signup: ${error.message}` }, 500);
  }
});

// Founder Signup
app.post("/make-server-eddbcb21/auth/founder/signup", async (c) => {
  try {
    const { email, password, name, businessName, cohortId } = await c.req.json();

    if (!email || !password || !name || !businessName) {
      return c.json({ error: 'Email, password, name, and business name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        businessName,
        type: 'founder'
      },
      email_confirm: true
    });

    if (error) {
      console.error('Founder signup error:', error);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    // Store founder profile in KV store
    const founderProfile = {
      id: data.user.id,
      email,
      name,
      businessName,
      cohortId: cohortId || 'cohort3',
      currentStage: 'revenue_baseline',
      currentWeek: 1,
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isLocked: false,
      flags: [],
      revenueBaseline: 0,
      totalRevenue: 0,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    };

    await kv.set(`founder:${data.user.id}`, founderProfile);
    
    // Add to cohort founders list
    const cohortKey = `cohort:${cohortId || 'cohort3'}:founders`;
    const existingFounders = await kv.get(cohortKey) || [];
    await kv.set(cohortKey, [...existingFounders, data.user.id]);

    return c.json({ 
      success: true, 
      user: founderProfile,
      message: 'Founder account created successfully'
    });
  } catch (error: any) {
    console.error('Founder signup error:', error);
    return c.json({ error: `Server error during signup: ${error.message}` }, 500);
  }
});

// Create Founder Profile (for already authenticated users)
app.post("/make-server-eddbcb21/auth/founder/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const { name, businessName, cohortId } = await c.req.json();

    if (!businessName) {
      return c.json({ error: 'Business name is required' }, 400);
    }

    // Check if profile already exists
    const existingProfile = await kv.get(`founder:${userId}`);
    if (existingProfile) {
      return c.json({ success: true, user: existingProfile, message: 'Profile already exists' });
    }

    // Get user metadata from auth
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) {
      return c.json({ error: 'Failed to get user details' }, 400);
    }

    // Create founder profile
    const founderProfile = {
      id: userId,
      email: userEmail,
      name: name || user.user_metadata?.name || userEmail.split('@')[0],
      businessName,
      cohortId: cohortId || 'cohort3',
      currentStage: 'revenue_baseline',
      currentWeek: 1,
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isLocked: false,
      flags: [],
      revenueBaseline: 0,
      totalRevenue: 0,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    };

    await kv.set(`founder:${userId}`, founderProfile);
    
    // Add to cohort founders list
    const cohortKey = `cohort:${cohortId || 'cohort3'}:founders`;
    const existingFounders = await kv.get(cohortKey) || [];
    if (!existingFounders.includes(userId)) {
      await kv.set(cohortKey, [...existingFounders, userId]);
    }

    return c.json({ 
      success: true, 
      user: founderProfile,
      message: 'Founder profile created successfully'
    });
  } catch (error: any) {
    console.error('Create founder profile error:', error);
    return c.json({ error: `Error creating profile: ${error.message}` }, 500);
  }
});

// Get Current User Profile
app.get("/make-server-eddbcb21/auth/me", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    console.log(`🔍 Checking profile for user: ${userId}`);
    
    // Check if admin
    let profile = await kv.get(`admin:${userId}`);
    let userType = 'admin';
    
    console.log(`📦 Admin profile lookup result:`, profile ? 'FOUND' : 'NOT FOUND');
    
    // If not admin, check founder
    if (!profile) {
      profile = await kv.get(`founder:${userId}`);
      userType = 'founder';
      console.log(`📦 Founder profile lookup result:`, profile ? 'FOUND' : 'NOT FOUND');
    }

    if (!profile) {
      console.error(`❌ No profile found for user ${userId}`);
      return c.json({ success: false, error: 'User profile not found' }, 404);
    }

    console.log(`✅ Profile found - Type: ${userType}, Role: ${profile.role}`);
    return c.json({ success: true, user: profile, type: userType });
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return c.json({ success: false, error: `Error fetching profile: ${error.message}` }, 500);
  }
});

// Complete Social Auth Profile (Founder)
app.post("/make-server-eddbcb21/auth/social/complete/founder", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const { businessName, cohortId } = await c.req.json();

    if (!businessName) {
      return c.json({ error: 'Business name is required' }, 400);
    }

    // Check if profile already exists
    const existingProfile = await kv.get(`founder:${userId}`);
    if (existingProfile) {
      return c.json({ success: true, user: existingProfile, message: 'Profile already exists' });
    }

    // Get user metadata from auth
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) {
      return c.json({ error: 'Failed to get user details' }, 400);
    }

    // Create founder profile
    const founderProfile = {
      id: userId,
      email: userEmail,
      name: user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0],
      businessName,
      cohortId: cohortId || 'cohort3',
      currentStage: 'revenue_baseline',
      currentWeek: 1,
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isLocked: false,
      flags: [],
      revenueBaseline: 0,
      totalRevenue: 0,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      authProvider: user.app_metadata?.provider || 'google'
    };

    await kv.set(`founder:${userId}`, founderProfile);
    
    // Add to cohort founders list
    const cohortKey = `cohort:${cohortId || 'cohort3'}:founders`;
    const existingFounders = await kv.get(cohortKey) || [];
    await kv.set(cohortKey, [...existingFounders, userId]);

    // Update user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...user.user_metadata,
        type: 'founder',
        businessName,
        profileComplete: true
      }
    });

    return c.json({ 
      success: true, 
      user: founderProfile,
      message: 'Founder profile created successfully'
    });
  } catch (error: any) {
    console.error('Complete social profile error:', error);
    return c.json({ error: `Error completing profile: ${error.message}` }, 500);
  }
});

// Complete Social Auth Profile (Admin)
app.post("/make-server-eddbcb21/auth/social/complete/admin", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const { role } = await c.req.json();

    // Check if profile already exists
    const existingProfile = await kv.get(`admin:${userId}`);
    if (existingProfile) {
      return c.json({ success: true, user: existingProfile, message: 'Profile already exists' });
    }

    // Get user metadata from auth
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) {
      return c.json({ error: 'Failed to get user details' }, 400);
    }

    // Create admin profile
    const adminProfile = {
      id: userId,
      email: userEmail,
      name: user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0],
      role: role || 'observer',
      cohortAccess: ['all'],
      permissions: {
        viewFounders: true,
        editFounders: role === 'super_admin' || role === 'mentor',
        sendNotifications: role === 'super_admin' || role === 'mentor',
        overrideLocks: role === 'super_admin' || role === 'mentor',
        removeFounders: role === 'super_admin' || role === 'mentor',
        exportData: true,
        manageAdmins: role === 'super_admin'
      },
      createdAt: new Date().toISOString(),
      authProvider: user.app_metadata?.provider || 'google'
    };

    await kv.set(`admin:${userId}`, adminProfile);

    // Update user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...user.user_metadata,
        type: 'admin',
        role: role || 'observer',
        profileComplete: true
      }
    });

    return c.json({ 
      success: true, 
      user: adminProfile,
      message: 'Admin profile created successfully'
    });
  } catch (error: any) {
    console.error('Complete social admin profile error:', error);
    return c.json({ error: `Error completing profile: ${error.message}` }, 500);
  }
});

// ============================================
// FOUNDER ROUTES
// ============================================

// Get All Founders (Admin only)
app.get("/make-server-eddbcb21/founders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all founders
    const founders = await kv.getByPrefix('founder:');
    
    return c.json({ success: true, founders });
  } catch (error: any) {
    console.error('Get founders error:', error);
    return c.json({ error: `Error fetching founders: ${error.message}` }, 500);
  }
});

// Get Single Founder
app.get("/make-server-eddbcb21/founders/:founderId", requireAuth, async (c) => {
  try {
    const founderId = c.param('founderId');
    const founder = await kv.get(`founder:${founderId}`);
    
    if (!founder) {
      return c.json({ error: 'Founder not found' }, 404);
    }

    return c.json({ success: true, founder });
  } catch (error: any) {
    console.error('Get founder error:', error);
    return c.json({ error: `Error fetching founder: ${error.message}` }, 500);
  }
});

// Update Founder
app.put("/make-server-eddbcb21/founders/:founderId", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const founderId = c.param('founderId');
    const updates = await c.req.json();

    // Get existing founder
    const founder = await kv.get(`founder:${founderId}`);
    if (!founder) {
      return c.json({ error: 'Founder not found' }, 404);
    }

    // Check permissions (admin or self)
    const admin = await kv.get(`admin:${userId}`);
    if (!admin && userId !== founderId) {
      return c.json({ error: 'Unauthorized to update this founder' }, 403);
    }

    // Update founder
    const updatedFounder = {
      ...founder,
      ...updates,
      lastActivityAt: new Date().toISOString()
    };

    await kv.set(`founder:${founderId}`, updatedFounder);

    return c.json({ success: true, founder: updatedFounder });
  } catch (error: any) {
    console.error('Update founder error:', error);
    return c.json({ error: `Error updating founder: ${error.message}` }, 500);
  }
});

// Complete Founder Onboarding
app.post("/make-server-eddbcb21/founders/onboarding", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const user = c.get('user');
    const onboardingData = await c.req.json();

    console.log('📝 Completing onboarding for user:', userId, onboardingData);

    // Get existing founder profile or create a basic one
    let founder = await kv.get(`founder:${userId}`);
    
    if (!founder) {
      console.log('⚠️ No existing profile found, creating one for:', userId);
      
      // Create basic founder profile
      founder = {
        id: userId,
        userId: userId,
        email: userEmail,
        name: user.user_metadata?.name || user.user_metadata?.full_name || userEmail.split('@')[0],
        cohortId: 'cohort3',
        currentWeek: 1,
        currentStage: 1,
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isLocked: false,
        consecutiveMisses: 0,
        flags: [],
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        authProvider: user.user_metadata?.provider || 'email'
      };
    }

    // Update founder with onboarding data
    const updatedFounder = {
      ...founder,
      businessName: onboardingData.businessName,
      businessModel: onboardingData.businessModel,
      productDescription: onboardingData.productDescription,
      customerCount: onboardingData.customerCount,
      pricing: onboardingData.pricing,
      revenueBaseline30d: onboardingData.revenueBaseline30d,
      baselineRevenue30d: onboardingData.revenueBaseline30d, // Alias for compatibility
      revenueBaseline90d: onboardingData.revenueBaseline90d,
      baselineRevenue90d: onboardingData.revenueBaseline90d, // Alias for compatibility
      currentWeek: onboardingData.currentWeek || 1,
      currentStage: onboardingData.currentStage || 1,
      isLocked: onboardingData.isLocked || false,
      missedWeeks: onboardingData.missedWeeks || 0,
      consecutiveMisses: onboardingData.missedWeeks || 0, // Alias for compatibility
      onboardingComplete: true,
      lastActivityAt: new Date().toISOString(),
    };

    await kv.set(`founder:${userId}`, updatedFounder);

    // Update user metadata in Supabase Auth
    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...user.user_metadata,
          user_type: 'founder',
          onboarding_complete: true,
          business_name: onboardingData.businessName
        }
      });
      console.log('✅ Updated user_metadata in Supabase Auth');
    } catch (metadataError: any) {
      console.warn('⚠️ Failed to update user_metadata:', metadataError.message);
      // Don't fail the onboarding if metadata update fails
    }

    console.log('✅ Onboarding completed successfully for:', userId);

    return c.json({ 
      success: true, 
      founder: updatedFounder,
      message: 'Onboarding completed successfully'
    });
  } catch (error: any) {
    console.error('❌ Complete onboarding error:', error);
    return c.json({ error: `Error completing onboarding: ${error.message}` }, 500);
  }
});

// Delete Founder (Admin only)
app.delete("/make-server-eddbcb21/founders/:founderId", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const founderId = c.param('founderId');

    // Verify admin with removeFounders permission
    const admin = await kv.get(`admin:${userId}`);
    if (!admin || !admin.permissions.removeFounders) {
      return c.json({ error: 'Admin access with remove permission required' }, 403);
    }

    // Delete founder profile
    await kv.del(`founder:${founderId}`);

    // Delete from Supabase Auth
    await supabase.auth.admin.deleteUser(founderId);

    return c.json({ success: true, message: 'Founder deleted successfully' });
  } catch (error: any) {
    console.error('Delete founder error:', error);
    return c.json({ error: `Error deleting founder: ${error.message}` }, 500);
  }
});

// ============================================
// WEEKLY EXECUTION LOOP ROUTES
// ============================================

// Submit Weekly Commitment
app.post("/make-server-eddbcb21/weekly/commit", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { weekNumber, commitments } = await c.req.json();

    const commitmentData = {
      founderId: userId,
      weekNumber,
      commitments,
      status: 'committed',
      submittedAt: new Date().toISOString()
    };

    await kv.set(`commitment:${userId}:week${weekNumber}`, commitmentData);

    return c.json({ success: true, commitment: commitmentData });
  } catch (error: any) {
    console.error('Submit commitment error:', error);
    return c.json({ error: `Error submitting commitment: ${error.message}` }, 500);
  }
});

// Submit Weekly Report
app.post("/make-server-eddbcb21/weekly/report", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { weekNumber, revenue, evidence, actions } = await c.req.json();

    const reportData = {
      founderId: userId,
      weekNumber,
      revenue,
      evidence,
      actions,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    await kv.set(`report:${userId}:week${weekNumber}`, reportData);

    // Update founder's total revenue
    const founder = await kv.get(`founder:${userId}`);
    if (founder) {
      founder.totalRevenue = (founder.totalRevenue || 0) + revenue;
      founder.lastActivityAt = new Date().toISOString();
      await kv.set(`founder:${userId}`, founder);
    }

    return c.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error('Submit report error:', error);
    return c.json({ error: `Error submitting report: ${error.message}` }, 500);
  }
});

// Get Weekly Data
app.get("/make-server-eddbcb21/weekly/:founderId/:weekNumber", requireAuth, async (c) => {
  try {
    const founderId = c.param('founderId');
    const weekNumber = c.param('weekNumber');

    const commitment = await kv.get(`commitment:${founderId}:week${weekNumber}`);
    const report = await kv.get(`report:${founderId}:week${weekNumber}`);

    return c.json({ 
      success: true, 
      data: {
        commitment,
        report
      }
    });
  } catch (error: any) {
    console.error('Get weekly data error:', error);
    return c.json({ error: `Error fetching weekly data: ${error.message}` }, 500);
  }
});

// ============================================
// COHORT ROUTES
// ============================================

// Get Cohort Details
app.get("/make-server-eddbcb21/cohorts/:cohortId", requireAuth, async (c) => {
  try {
    const cohortId = c.param('cohortId');
    
    // Get cohort founders
    const founderIds = await kv.get(`cohort:${cohortId}:founders`) || [];
    const founders = await Promise.all(
      founderIds.map((id: string) => kv.get(`founder:${id}`))
    );

    const cohortData = {
      id: cohortId,
      name: cohortId === 'cohort3' ? 'Cohort 3 - 2026 Q1' : cohortId,
      startDate: '2026-01-06',
      currentWeek: 6,
      founders: founders.filter(f => f !== null),
      stats: {
        totalFounders: founders.length,
        activeFounders: founders.filter((f: any) => !f?.isLocked).length,
        flaggedFounders: founders.filter((f: any) => f?.flags?.length > 0).length
      }
    };

    return c.json({ success: true, cohort: cohortData });
  } catch (error: any) {
    console.error('Get cohort error:', error);
    return c.json({ error: `Error fetching cohort: ${error.message}` }, 500);
  }
});

// ============================================
// NOTIFICATION TEMPLATE ROUTES
// ============================================

// Get all notification templates
app.get("/make-server-eddbcb21/notification/templates", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const templates = await kv.getByPrefix('notification_template:');
    
    return c.json({ success: true, templates });
  } catch (error: any) {
    console.error('Get notification templates error:', error);
    return c.json({ error: `Error fetching templates: ${error.message}` }, 500);
  }
});

// Create notification template
app.post("/make-server-eddbcb21/notification/templates", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin || !admin.permissions.sendNotifications) {
      return c.json({ error: 'Admin access with notification permission required' }, 403);
    }

    const { name, subject, body, category } = await c.req.json();

    if (!name || !subject || !body) {
      return c.json({ error: 'Name, subject, and body are required' }, 400);
    }

    const templateId = crypto.randomUUID();
    const template = {
      id: templateId,
      name,
      subject,
      body,
      category: category || 'general',
      created_at: new Date().toISOString(),
      created_by: userId,
    };

    await kv.set(`notification_template:${templateId}`, template);

    return c.json({ success: true, template });
  } catch (error: any) {
    console.error('Create notification template error:', error);
    return c.json({ error: `Error creating template: ${error.message}` }, 500);
  }
});

// Delete notification template
app.delete("/make-server-eddbcb21/notification/templates/:templateId", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const templateId = c.param('templateId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin || !admin.permissions.sendNotifications) {
      return c.json({ error: 'Admin access with notification permission required' }, 403);
    }

    await kv.del(`notification_template:${templateId}`);

    return c.json({ success: true, message: 'Template deleted successfully' });
  } catch (error: any) {
    console.error('Delete notification template error:', error);
    return c.json({ error: `Error deleting template: ${error.message}` }, 500);
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// Create Missing Admin Profile (for fixing broken accounts)
app.post("/make-server-eddbcb21/admin/create-profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const { name, role } = await c.req.json();

    console.log(`🔧 Attempting to create admin profile for user: ${userId}`, {
      userId,
      userEmail,
      requestedName: name,
      requestedRole: role
    });

    // Check if profile already exists
    const existingProfile = await kv.get(`admin:${userId}`);
    if (existingProfile) {
      console.log(`⚠️ Admin profile already exists for ${userId}`);
      return c.json({ 
        success: true, 
        admin: existingProfile,
        message: 'Profile already exists' 
      });
    }

    // Create admin profile
    const adminProfile = {
      id: userId,
      email: userEmail,
      name: name || 'Admin User',
      role: role || 'super_admin',
      cohortAccess: ['all'],
      permissions: {
        viewFounders: true,
        editFounders: role === 'super_admin' || role === 'mentor',
        sendNotifications: role === 'super_admin' || role === 'mentor',
        overrideLocks: role === 'super_admin' || role === 'mentor',
        removeFounders: role === 'super_admin' || role === 'mentor',
        exportData: true,
        manageAdmins: role === 'super_admin'
      },
      createdAt: new Date().toISOString()
    };

    console.log(`💾 Creating admin profile with key: admin:${userId}`);
    console.log(`📝 Profile data:`, JSON.stringify(adminProfile, null, 2));
    
    await kv.set(`admin:${userId}`, adminProfile);
    
    // Verify it was saved
    const verification = await kv.get(`admin:${userId}`);
    if (!verification) {
      console.error(`❌ Verification failed - profile not found after save!`);
      throw new Error('Profile creation verification failed');
    }
    
    console.log(`✅ Admin profile created and verified successfully for ${userId}`);

    return c.json({ 
      success: true, 
      admin: adminProfile,
      message: 'Admin profile created successfully'
    });
  } catch (error: any) {
    console.error('Create admin profile error:', {
      message: error.message,
      stack: error.stack,
      error
    });
    return c.json({ error: `Error creating profile: ${error.message}` }, 500);
  }
});

// Get All Admins
app.get("/make-server-eddbcb21/admins", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify super admin
    const admin = await kv.get(`admin:${userId}`);
    if (!admin || !admin.permissions.manageAdmins) {
      return c.json({ error: 'Super admin access required' }, 403);
    }

    const admins = await kv.getByPrefix('admin:');
    
    return c.json({ success: true, admins });
  } catch (error: any) {
    console.error('Get admins error:', error);
    return c.json({ error: `Error fetching admins: ${error.message}` }, 500);
  }
});

// Update Admin
app.put("/make-server-eddbcb21/admins/:adminId", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminId = c.param('adminId');
    const updates = await c.req.json();

    // Get the requesting admin
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Allow admins to update their own profile, or require manageAdmins permission to update others
    if (userId !== adminId && !admin.permissions.manageAdmins) {
      return c.json({ error: 'You can only update your own profile, or need super admin access to update others' }, 403);
    }

    // Get existing admin
    const targetAdmin = await kv.get(`admin:${adminId}`);
    if (!targetAdmin) {
      return c.json({ error: 'Admin not found' }, 404);
    }

    // If updating someone else's profile, don't allow changing critical fields without permission
    if (userId !== adminId) {
      // Only super admins can change role, permissions, cohortAccess
      if (updates.role || updates.permissions || updates.cohortAccess) {
        if (!admin.permissions.manageAdmins) {
          return c.json({ error: 'Super admin access required to change role or permissions' }, 403);
        }
      }
    }

    // Update admin (merge updates into existing data)
    const updatedAdmin = { ...targetAdmin, ...updates };
    await kv.set(`admin:${adminId}`, updatedAdmin);

    return c.json({ success: true, admin: updatedAdmin });
  } catch (error: any) {
    console.error('Update admin error:', error);
    return c.json({ error: `Error updating admin: ${error.message}` }, 500);
  }
});

// ============================================
// COMMUNITY ROUTES
// ============================================

// Get All Community Posts
app.get("/make-server-eddbcb21/community/posts", community.getAllPosts);

// Get Single Post
app.get("/make-server-eddbcb21/community/posts/:id", community.getPost);

// Create New Post (requires auth)
app.post("/make-server-eddbcb21/community/posts", requireAuth, community.createPost);

// Like/Unlike Post (requires auth)
app.post("/make-server-eddbcb21/community/posts/:id/like", requireAuth, community.toggleLikePost);

// Get Replies for Post
app.get("/make-server-eddbcb21/community/posts/:id/replies", community.getReplies);

// Create Reply (requires auth)
app.post("/make-server-eddbcb21/community/posts/:id/replies", requireAuth, community.createReply);

// ============================================
// EXECUTION LOG ROUTES
// ============================================

// Get execution logs for a founder's week
app.get("/make-server-eddbcb21/execution/logs/:founderId/:weekNumber", execution.getExecutionLogs);

// Create new execution log
app.post("/make-server-eddbcb21/execution/logs", execution.createExecutionLog);

// Update execution log
app.put("/make-server-eddbcb21/execution/logs/:id", execution.updateExecutionLog);

// Delete execution log
app.delete("/make-server-eddbcb21/execution/logs/:id", execution.deleteExecutionLog);

// Get week totals
app.get("/make-server-eddbcb21/execution/totals/:founderId/:weekNumber", execution.getWeekTotalHours);

// ============================================
// ADMIN API ENDPOINTS (for admin dashboard)
// ============================================

// Get all founders
app.get("/make-server-eddbcb21/admin/founders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const founders = await kv.getByPrefix('founder:');
    
    return c.json({ success: true, founders });
  } catch (error: any) {
    console.error('Get founders error:', error);
    return c.json({ error: `Error fetching founders: ${error.message}` }, 500);
  }
});

// Get all admins
app.get("/make-server-eddbcb21/admin/admins", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const admins = await kv.getByPrefix('admin:');
    
    return c.json({ success: true, admins });
  } catch (error: any) {
    console.error('Get admins error:', error);
    return c.json({ error: `Error fetching admins: ${error.message}` }, 500);
  }
});

// Get cohort analytics
app.get("/make-server-eddbcb21/admin/cohorts/:cohortId/analytics", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const cohortId = c.req.param('cohortId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all founders in this cohort
    const cohortKey = `cohort:${cohortId}:founders`;
    const founderIds = await kv.get(cohortKey) || [];
    
    const founders = [];
    for (const founderId of founderIds) {
      const founder = await kv.get(`founder:${founderId}`);
      if (founder) {
        founders.push(founder);
      }
    }

    // Calculate analytics
    const analytics = {
      totalFounders: founders.length,
      activeFounders: founders.filter(f => f.status === 'active').length,
      averageRevenue: 0,
      completionRate: 0
    };
    
    return c.json({ success: true, analytics });
  } catch (error: any) {
    console.error('Get cohort analytics error:', error);
    return c.json({ error: `Error fetching analytics: ${error.message}` }, 500);
  }
});

// Get system settings
app.get("/make-server-eddbcb21/admin/settings", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    let settings = await kv.get('system:settings');
    
    // If no settings exist, create defaults
    if (!settings) {
      settings = {
        cohort_program_active: true,
        current_cohort_name: 'Cohort 3 - Feb 2026',
        current_cohort_week: 4,
        max_cohort_size: 20,
        week_duration_days: 7,
        from_email: 'noreply@vendoura.com',
        support_email: 'support@vendoura.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await kv.set('system:settings', settings);
    }
    
    return c.json({ success: true, settings });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return c.json({ error: `Error fetching settings: ${error.message}` }, 500);
  }
});

// Update system settings
app.put("/make-server-eddbcb21/admin/settings", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify super admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin || admin.role !== 'super_admin') {
      return c.json({ error: 'Super admin access required' }, 403);
    }

    const updates = await c.req.json();
    
    let settings = await kv.get('system:settings') || {};
    settings = {
      ...settings,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    await kv.set('system:settings', settings);
    
    return c.json({ success: true, settings });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return c.json({ error: `Error updating settings: ${error.message}` }, 500);
  }
});

// Get weekly tracking data
app.get("/make-server-eddbcb21/admin/tracking/weekly", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all commitments and reports from KV
    const commits = await kv.getByPrefix('commitment:');
    const reports = await kv.getByPrefix('report:');
    
    return c.json({ success: true, commits, reports });
  } catch (error: any) {
    console.error('Get weekly tracking error:', error);
    return c.json({ error: `Error fetching tracking data: ${error.message}` }, 500);
  }
});

// ============================================
// MIGRATION/SYNC UTILITY ROUTES
// ============================================

// Sync all Supabase Auth users to KV store
app.post("/make-server-eddbcb21/admin/sync-users", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Verify super admin access
    const admin = await kv.get(`admin:${userId}`);
    if (!admin || admin.role !== 'super_admin') {
      return c.json({ error: 'Super admin access required' }, 403);
    }

    console.log('🔄 Starting user sync from Supabase Auth to KV store...');

    // Get all users from Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return c.json({ error: `Failed to list users: ${listError.message}` }, 500);
    }

    console.log(`📊 Found ${users.length} users in Supabase Auth`);

    let syncedFounders = 0;
    let syncedAdmins = 0;
    let skipped = 0;
    const errors = [];

    for (const user of users) {
      try {
        const userType = user.user_metadata?.type || user.user_metadata?.role === 'super_admin' || user.user_metadata?.role === 'mentor' || user.user_metadata?.role === 'observer' ? 'admin' : 'founder';
        
        console.log(`\n👤 Processing user: ${user.email} (${userType})`);

        if (userType === 'admin') {
          // Check if admin already exists
          const existingAdmin = await kv.get(`admin:${user.id}`);
          if (existingAdmin) {
            console.log(`  ⏭️  Admin already exists, skipping`);
            skipped++;
            continue;
          }

          const role = user.user_metadata?.role || 'observer';
          const adminProfile = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0],
            role,
            cohortAccess: ['all'],
            permissions: {
              viewFounders: true,
              editFounders: role === 'super_admin' || role === 'mentor',
              sendNotifications: role === 'super_admin' || role === 'mentor',
              overrideLocks: role === 'super_admin' || role === 'mentor',
              removeFounders: role === 'super_admin' || role === 'mentor',
              exportData: true,
              manageAdmins: role === 'super_admin'
            },
            createdAt: user.created_at || new Date().toISOString()
          };

          await kv.set(`admin:${user.id}`, adminProfile);
          console.log(`  ✅ Created admin profile for ${user.email}`);
          syncedAdmins++;
        } else {
          // Check if founder already exists
          const existingFounder = await kv.get(`founder:${user.id}`);
          if (existingFounder) {
            console.log(`  ⏭️  Founder already exists, skipping`);
            skipped++;
            continue;
          }

          const founderProfile = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0],
            businessName: user.user_metadata?.businessName || 'Business',
            cohortId: 'cohort3',
            currentStage: 'revenue_baseline',
            currentWeek: 1,
            subscriptionStatus: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            isLocked: false,
            flags: [],
            revenueBaseline: 0,
            totalRevenue: 0,
            onboardingComplete: false,
            createdAt: user.created_at || new Date().toISOString(),
            lastActivityAt: new Date().toISOString()
          };

          await kv.set(`founder:${user.id}`, founderProfile);
          
          // Add to cohort founders list
          const cohortKey = 'cohort:cohort3:founders';
          const existingFounders = await kv.get(cohortKey) || [];
          if (!existingFounders.includes(user.id)) {
            await kv.set(cohortKey, [...existingFounders, user.id]);
          }

          console.log(`  ✅ Created founder profile for ${user.email}`);
          syncedFounders++;
        }
      } catch (userError: any) {
        console.error(`  ❌ Error syncing user ${user.email}:`, userError);
        errors.push({ email: user.email, error: userError.message });
      }
    }

    const summary = {
      total: users.length,
      syncedFounders,
      syncedAdmins,
      skipped,
      errors: errors.length,
      errorDetails: errors
    };

    console.log('\n📊 Sync Summary:', summary);

    return c.json({ 
      success: true, 
      message: 'User sync completed',
      summary 
    });
  } catch (error: any) {
    console.error('User sync error:', error);
    return c.json({ error: `Error syncing users: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);