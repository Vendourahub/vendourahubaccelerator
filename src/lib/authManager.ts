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

export interface AdminAuthResult {
  success: boolean;
  user?: AuthUser;
  admin?: any;
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'founder',
          ...metadata,
        },
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

    // Get founder profile
    const { data: profile, error: profileError } = await supabase
      .from('founder_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Founder profile not found. Please use admin login if you are an admin.' };
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
 * Get current admin profile (if logged in as admin)
 */
export async function getCurrentAdmin(): Promise<any | null> {
  try {
    // First, check if admin session is cached in localStorage
    const cachedSession = localStorage.getItem('vendoura_admin_session');
    if (cachedSession) {
      try {
        const admin = JSON.parse(cachedSession);
        console.log('✅ Admin session found in localStorage:', admin.email);
        return admin;
      } catch (e) {
        console.warn('⚠️ Failed to parse cached admin session');
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

    return admin || null;
  } catch (error: any) {
    console.error('❌ Error getting admin:', error.message);
    return null;
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
