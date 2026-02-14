// Secure Authentication Utilities
// CRITICAL: Always check DB roles, never trust JWT metadata alone

import { supabase } from './api';

export type UserRole = 'admin' | 'founder' | 'unknown';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  profileId?: string;
  isAdmin: boolean;
  isFounder: boolean;
}

/**
 * Get user role from DATABASE (not JWT metadata)
 * This prevents privilege escalation via OAuth metadata injection
 */
export async function getUserRole(userId: string): Promise<AuthUser> {
  try {
    // Check if user is in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('user_id', userId)
      .single();

    if (!adminError && adminData) {
      return {
        userId,
        email: adminData.email,
        role: 'admin',
        profileId: adminData.id,
        isAdmin: true,
        isFounder: false,
      };
    }

    // Check if user is in founder_profiles table
    const { data: founderData, error: founderError } = await supabase
      .from('founder_profiles')
      .select('id, email, user_id')
      .eq('user_id', userId)
      .single();

    if (!founderError && founderData) {
      return {
        userId,
        email: founderData.email,
        role: 'founder',
        profileId: founderData.id,
        isAdmin: false,
        isFounder: true,
      };
    }

    // User exists in auth but not in any profile table
    return {
      userId,
      email: '',
      role: 'unknown',
      isAdmin: false,
      isFounder: false,
    };
  } catch (error) {
    console.error('Error checking user role:', error);
    return {
      userId,
      email: '',
      role: 'unknown',
      isAdmin: false,
      isFounder: false,
    };
  }
}

/**
 * Create founder profile for OAuth user
 * Includes duplicate prevention and proper defaults
 */
export async function createFounderProfile(userId: string, email: string, name?: string) {
  try {
    // Double-check if profile already exists
    const { data: existing } = await supabase
      .from('founder_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      console.log('Profile already exists, skipping creation');
      return { success: true, profileId: existing.id };
    }

    // Check if user is an admin (prevent creating founder profile for admins)
    const { data: adminCheck } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (adminCheck) {
      console.log('User is an admin, not creating founder profile');
      return { success: false, error: 'User is an admin' };
    }

    // Create founder profile
    const { data: profile, error: profileError } = await supabase
      .from('founder_profiles')
      .insert({
        user_id: userId,
        email: email,
        name: name || email.split('@')[0],
        business_name: `${name || 'My'} Business`,
        baseline_revenue_30d: 0,
        baseline_revenue_90d: 0,
        current_stage: 1,
        current_week: 1,
        account_status: 'active',
        consecutive_misses: 0,
        subscription_status: 'trial',
        is_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating founder profile:', profileError);
      return { success: false, error: profileError.message };
    }

    // Initialize stage progress
    const stagePromises = [];
    for (let i = 1; i <= 5; i++) {
      stagePromises.push(
        supabase.from('stage_progress').insert({
          user_id: userId,
          stage_number: i,
          status: i === 1 ? 'in_progress' : 'locked',
          requirements_met: false,
          unlocked_at: i === 1 ? new Date().toISOString() : null,
        })
      );
    }

    await Promise.all(stagePromises);

    console.log('✅ Founder profile created successfully');
    return { success: true, profileId: profile.id };
  } catch (error) {
    console.error('Error in createFounderProfile:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Handle post-OAuth login
 * Creates founder profile if needed and returns proper route
 */
export async function handleOAuthCallback(userId: string, userEmail: string, userName?: string) {
  try {
    // Get user role from database
    const userRole = await getUserRole(userId);

    // If admin, route to admin dashboard
    if (userRole.isAdmin) {
      console.log('✅ Admin user authenticated');
      return { success: true, route: '/admin/cohort', role: 'admin' };
    }

    // If founder exists, route to dashboard
    if (userRole.isFounder) {
      console.log('✅ Founder user authenticated');
      return { success: true, route: '/founder/dashboard', role: 'founder' };
    }

    // Unknown user - create founder profile
    console.log('🆕 New OAuth user - creating founder profile');
    const result = await createFounderProfile(userId, userEmail, userName);

    if (result.success) {
      return { success: true, route: '/onboarding', role: 'founder' };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in handleOAuthCallback:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Verify admin access (use in protected routes)
 */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Verify founder access (use in protected routes)
 */
export async function verifyFounderAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('founder_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}
