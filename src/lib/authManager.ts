/**
 * Unified Authentication Manager - Supabase Integration
 * Centralized auth logic for both founders and admins
 */

import { supabase } from './api';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  user_type: 'founder' | 'admin';
  user_metadata?: any;
}

export interface FounderAuthResult {
  success: boolean;
  user?: AuthUser;
  profile?: any;
  error?: string;
}

export interface FounderProfileResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AdminAuthResult {
  success: boolean;
  user?: AuthUser;
  admin?: any;
  error?: string;
}

export interface AdminProfileResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// ============================================================================
// UNIFIED AUTHENTICATION
// ============================================================================

/**
 * Sign up a new founder
 */
export async function signUpFounder(
  email: string,
  password: string,
  metadata: any
): Promise<FounderAuthResult> {
  try {
    // Sign up with Supabase Auth
    // Disable email confirmation for now to work around rate limits
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'founder',
          ...metadata,
        },
        emailRedirectTo: 'https://vendourahubaccelerator.onrender.com/auth/callback',
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Sign up failed' };
    }

    // Create founder profile
    const { data: profile, error: profileError } = await supabase
      .from('founder_profiles')
      .insert({
        user_id: data.user.id,
        email: data.user.email,
        name: metadata.name || '',
        business_name: metadata.business_name || '',
        business_description: metadata.business_description || '',
        business_stage: metadata.business_stage || '',
        revenue: metadata.revenue || '',
        phone: metadata.phone || '',
        country: metadata.country || '',
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return {
        success: false,
        error: `Failed to create profile: ${profileError.message}. Please contact support.`,
      };
    }

    if (!profile) {
      return {
        success: false,
        error: 'Profile creation failed. Please contact support.',
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_type: 'founder',
      },
      profile,
    };
  } catch (error: any) {
    console.error('Founder signup error:', error);
    return { success: false, error: error.message || 'Sign up failed' };
  }
}

/**
 * Sign in a founder
 */
export async function signInFounder(
  email: string,
  password: string
): Promise<FounderAuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Sign in failed' };
    }

    // Clear any cached admin session to avoid role confusion
    localStorage.removeItem('vendoura_admin_session');

    // Get founder profile
    const { data: profile, error: profileError } = await supabase
      .from('founder_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError || !profile) {
      // Try to create missing profile automatically
      console.warn('Founder profile not found, attempting to create for user:', data.user.id);
      
      // Create profile directly with user data from sign in
      const { data: newProfile, error: createError } = await supabase
        .from('founder_profiles')
        .insert({
          user_id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || '',
          business_name: data.user.user_metadata?.business_name || '',
          business_description: data.user.user_metadata?.business_description || '',
          business_stage: 'ideation',
          revenue: '0',
          phone: '',
          country: '',
        })
        .select()
        .single();

      if (createError) {
        console.error('Profile creation error:', createError);
        return { 
          success: false, 
          error: `Profile creation failed: ${createError.message}. Please contact support.` 
        };
      }

      // Profile created successfully, continue
      console.log('✅ Profile created successfully for user:', data.user.id);
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          user_type: 'founder',
        },
        profile: newProfile,
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_type: 'founder',
      },
      profile,
    };
  } catch (error: any) {
    console.error('Founder signin error:', error);
    return { success: false, error: error.message || 'Sign in failed' };
  }
}

/**
 * Create a missing founder profile for existing users (recovery function)
 */
export async function createMissingFounderProfile(): Promise<FounderProfileResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('founder_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      return { success: true, data: existingProfile, error: 'Profile already exists' };
    }

    // Create new founder profile with minimal data
    const { data: newProfile, error: createError } = await supabase
      .from('founder_profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        business_name: user.user_metadata?.business_name || '',
        business_description: user.user_metadata?.business_description || '',
        business_stage: 'ideation',
        revenue: '0',
        phone: '',
        country: '',
      })
      .select()
      .single();

    if (createError) {
      console.error('Profile creation error:', createError);
      return { success: false, error: `Profile creation failed: ${createError.message}` };
    }

    return { success: true, data: newProfile };
  } catch (error: any) {
    console.error('Create missing profile error:', error);
    return { success: false, error: error.message || 'Failed to create profile' };
  }
}

/**
 * Sign in an admin
 */
export async function signInAdmin(
  email: string,
  password: string
): Promise<AdminAuthResult> {
  try {
    console.log('🔐 Attempting admin sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase auth error:', error);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      console.error('❌ No user data returned');
      return { success: false, error: 'Sign in failed' };
    }

    console.log('✅ Auth successful, user ID:', data.user.id);
    console.log('📊 Fetching admin profile...');

    // Get admin profile
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (adminError) {
      console.error('❌ Admin profile fetch error:', adminError);
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    if (!admin) {
      console.error('❌ No admin profile found for user:', data.user.id);
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    console.log('✅ Admin profile found:', admin.admin_role);
    
    // Store admin data in localStorage for quick access
    const adminData = {
      id: data.user.id,
      email: data.user.email,
      ...admin
    };
    localStorage.setItem('vendoura_admin_session', JSON.stringify(adminData));
    console.log('💾 Admin session stored in localStorage');

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_type: 'admin',
      },
      admin,
    };
  } catch (error: any) {
    console.error('❌ Admin signin error:', error);
    return { success: false, error: error.message || 'Sign in failed' };
  }
}

/**
 * Get current authenticated user (founder or admin)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Only trust cached admin if it matches the active Supabase user
    const cachedAdmin = getCurrentAdminSync();
    if (cachedAdmin) {
      const cachedUserId = cachedAdmin.user_id || cachedAdmin.id;
      if (cachedUserId === user.id) {
        return {
          id: user.id,
          email: user.email!,
          user_type: 'admin',
          user_metadata: user.user_metadata,
        };
      }

      // Stale admin cache; clear it
      localStorage.removeItem('vendoura_admin_session');
    }

    // Check if admin
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      user_type: admin ? 'admin' : 'founder',
      user_metadata: user.user_metadata,
    };
  } catch {
    return null;
  }
}

/**
 * Get current founder profile (if logged in as founder)
 */
export async function getCurrentFounder(): Promise<any | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: profile } = await supabase
      .from('founder_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return profile || null;
  } catch {
    return null;
  }
}

/**
 * Get founder profile result wrapper
 */
export async function getFounderProfile(): Promise<FounderProfileResult> {
  try {
    const profile = await getCurrentFounder();
    if (!profile) {
      return { success: false, error: 'Founder profile not found' };
    }

    return { success: true, data: profile };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load founder profile' };
  }
}

/**
 * Update current founder profile
 */
export async function updateFounderProfile(updates: any): Promise<FounderProfileResult> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error: updateError } = await supabase
      .from('founder_profiles')
      .update(payload)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (updateError || !data) {
      return { success: false, error: updateError?.message || 'Failed to update profile' };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}

/**
 * Complete founder onboarding
 */
export async function completeFounderOnboarding(onboardingData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const payload = {
      business_name: onboardingData.business_name,
      business_model: onboardingData.business_model,
      product_description: onboardingData.product_description,
      customer_count: onboardingData.customer_count,
      pricing: onboardingData.pricing,
      baseline_revenue_30d: onboardingData.revenue_baseline_30d,
      baseline_revenue_90d: onboardingData.revenue_baseline_90d,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      current_stage: 1,
      current_week: 1,
      is_locked: false,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('founder_profiles')
      .update(payload)
      .eq('user_id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to complete onboarding' };
  }
}

/**
 * Get current admin profile (if logged in as admin)
 */
/**
 * Get current admin SYNCHRONOUSLY from localStorage
 * Used by API layer for quick access checks
 */
export function getCurrentAdminSync(): any | null {
  try {
    const cachedSession = localStorage.getItem('vendoura_admin_session');
    if (cachedSession) {
      const admin = JSON.parse(cachedSession);
      console.log('✅ Retrieved cached admin session:', admin.email);
      return admin;
    }
    console.log('⚠️ No cached admin session found');
    return null;
  } catch (error: any) {
    console.error('❌ Error reading cached admin session:', error);
    return null;
  }
}

export async function getCurrentAdmin(): Promise<any | null> {
  try {
    // First, check if admin session is cached in localStorage
    const cachedSession = localStorage.getItem('vendoura_admin_session');
    if (cachedSession) {
      try {
        const admin = JSON.parse(cachedSession);
        console.log('✅ Admin session found in localStorage:', admin.email);
        
        // Validate that Supabase session is still active
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.warn('⚠️ Cached session exists but Supabase session is invalid, clearing cache');
          localStorage.removeItem('vendoura_admin_session');
          return null;
        }
        
        // Session is valid, return cached admin data
        return admin;
      } catch (e) {
        console.warn('⚠️ Failed to parse cached admin session');
        localStorage.removeItem('vendoura_admin_session');
      }
    }

    console.log('📊 No cached session, fetching from Supabase...');
    
    // If no cached session, fetch from Supabase
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.warn('⚠️ No authenticated user found');
      return null;
    }

    console.log('✅ Found authenticated user:', user.email);

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !admin) {
      console.warn('⚠️ Admin profile not found:', adminError?.message);
      return null;
    }

    // Cache the admin session
    const adminData = {
      id: user.id,
      email: user.email,
      ...admin
    };
    localStorage.setItem('vendoura_admin_session', JSON.stringify(adminData));
    console.log('💾 Admin session cached in localStorage');

    return adminData;
  } catch (error: any) {
    console.error('❌ Error getting admin:', error.message);
    return null;
  }
}

/**
 * Update current admin profile
 */
export async function updateAdminProfile(updates: any): Promise<AdminProfileResult> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error: updateError } = await supabase
      .from('admin_users')
      .update(payload)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (updateError || !data) {
      return { success: false, error: updateError?.message || 'Failed to update admin profile' };
    }

    // refresh cached admin session
    const adminData = {
      id: user.id,
      email: user.email,
      ...data,
    };
    localStorage.setItem('vendoura_admin_session', JSON.stringify(adminData));

    return { success: true, data: adminData };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update admin profile' };
  }
}

/**
 * Check if user is authenticated as founder
 */
export async function isFounderAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.user_type === 'founder';
}

/**
 * Check if user is authenticated as admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  // Check cached admin session first (instant)
  const cachedAdmin = getCurrentAdminSync();
  if (cachedAdmin) {
    return true;
  }
  
  // Fallback to full check
  const user = await getCurrentUser();
  return user?.user_type === 'admin';
}

/**
 * Get admin role (if logged in as admin)
 */
export async function getAdminRole(): Promise<string | null> {
  const admin = await getCurrentAdmin();
  return admin?.admin_role || null;
}

/**
 * Check if current admin is super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const role = await getAdminRole();
  return role === 'super_admin';
}

/**
 * Sign out current user (founder or admin)
 */
export async function signOut(): Promise<void> {
  try {
    // Clear admin session from localStorage
    localStorage.removeItem('vendoura_admin_session');
    console.log('🔓 Admin session cleared from localStorage');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    console.log('🔓 Signed out from Supabase');
  } catch (error: any) {
    console.error('Error signing out:', error);
  }
}
