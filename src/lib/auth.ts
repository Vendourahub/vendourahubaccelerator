/**
 * Authentication Library - LocalStorage Based
 * All authentication now runs on client-side localStorage
 */

import * as storage from './localStorage';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  user_type: 'founder' | 'admin';
  user_metadata: any;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Re-export types from localStorage for backwards compatibility
export type { User, Founder, Admin } from './localStorage';

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  metadata: any
): Promise<AuthResult> {
  try {
    console.log('📝 Signing up:', email);
    
    const result = await storage.signUp(email, password, metadata);
    
    if (result.success && result.user) {
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        user_type: result.user.user_type,
        user_metadata: result.user.user_metadata,
      };
      
      console.log('✅ Sign up successful:', authUser.email);
      return { success: true, user: authUser };
    }
    
    console.error('❌ Sign up failed:', result.error);
    return { success: false, error: result.error };
  } catch (error: any) {
    console.error('❌ Sign up error:', error);
    return { success: false, error: error.message || 'Sign up failed' };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    console.log('🔑 Signing in:', email);
    
    const result = await storage.signIn(email, password);
    
    if (result.success && result.user) {
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        user_type: result.user.user_type,
        user_metadata: result.user.user_metadata,
      };
      
      console.log('✅ Sign in successful:', authUser.email);
      return { success: true, user: authUser };
    }
    
    console.error('❌ Sign in failed:', result.error);
    return { success: false, error: result.error };
  } catch (error: any) {
    console.error('❌ Sign in error:', error);
    return { success: false, error: error.message || 'Sign in failed' };
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  const user = storage.getCurrentUser();
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    user_metadata: user.user_metadata,
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Get current user type
 */
export function getUserType(): 'founder' | 'admin' | null {
  const user = getCurrentUser();
  return user?.user_type || null;
}

/**
 * Check if current user is a founder
 */
export function isFounder(): boolean {
  return getUserType() === 'founder';
}

/**
 * Check if current user is an admin
 */
export function isAdmin(): boolean {
  return getUserType() === 'admin';
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    console.log('🚪 Logging out...');
    
    storage.signOut();
    
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Error during logout:', error);
  }
}

/**
 * Complete disconnect - logout and redirect to home
 */
export async function disconnect(): Promise<void> {
  await logout();
  window.location.href = '/';
}

// ============================================================================
// FOUNDER PROFILE FUNCTIONS
// ============================================================================

/**
 * Get founder profile for current user
 */
export async function getFounderProfile(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    if (user.user_type !== 'founder') {
      return { success: false, error: 'User is not a founder' };
    }
    
    const founder = storage.getFounder(user.id);
    if (!founder) {
      return { success: false, error: 'Founder profile not found' };
    }
    
    return { success: true, data: founder };
  } catch (error: any) {
    console.error('❌ Error getting founder profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update founder profile
 */
export async function updateFounderProfile(updates: any): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    if (user.user_type !== 'founder') {
      return { success: false, error: 'User is not a founder' };
    }
    
    const success = storage.updateFounder(user.id, updates);
    
    if (success) {
      // Return the updated founder data
      const updatedFounder = storage.getFounder(user.id);
      return { success: true, data: updatedFounder };
    } else {
      return { success: false, error: 'Failed to update profile' };
    }
  } catch (error: any) {
    console.error('❌ Error updating founder profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(onboardingData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    if (user.user_type !== 'founder') {
      return { success: false, error: 'User is not a founder' };
    }
    
    const updates = {
      ...onboardingData,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      current_stage: 'stage_1',
      current_week: 1,
    };
    
    const success = storage.updateFounder(user.id, updates);
    
    if (success) {
      console.log('✅ Onboarding completed');
      return { success: true };
    } else {
      return { success: false, error: 'Failed to complete onboarding' };
    }
  } catch (error: any) {
    console.error('❌ Error completing onboarding:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const profile = await getFounderProfile();
  return profile.success && profile.data?.onboarding_completed === true;
}

/**
 * Get founder data (alias for getFounderProfile for compatibility)
 */
export async function getFounderData(): Promise<any> {
  const result = await getFounderProfile();
  if (result.success) {
    return result.data;
  }
  return null;
}

// ============================================================================
// OAUTH (Simulated for compatibility)
// ============================================================================

/**
 * Sign in with OAuth provider
 * Note: This is simulated for localStorage-only mode
 */
export async function signInWithOAuth(provider: 'google'): Promise<{ success: boolean; error?: string }> {
  console.warn('⚠️ OAuth not available in localStorage-only mode');
  return { 
    success: false, 
    error: 'OAuth authentication is not available in localStorage-only mode. Please use email/password login.' 
  };
}

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Get debug information about authentication state
 */
export function getAuthDebugInfo(): any {
  const user = getCurrentUser();
  const allFounders = storage.getAllFounders();
  const allAdmins = storage.getAllAdmins();
  
  return {
    timestamp: new Date().toISOString(),
    currentUser: user,
    isAuthenticated: isAuthenticated(),
    userType: getUserType(),
    isFounder: isFounder(),
    isAdmin: isAdmin(),
    totalFounders: allFounders.length,
    totalAdmins: allAdmins.length,
    storage: {
      mode: 'localStorage',
      keys: Object.keys(localStorage).filter(k => k.startsWith('vendoura')),
    },
  };
}

/**
 * Clear all auth data (for testing/debugging)
 */
export function clearAuthData(): void {
  storage.signOut();
  console.log('✅ Auth data cleared');
}