/**
 * Unified Authentication Manager
 * Centralized auth logic for both founders and admins
 */

import * as storage from './localStorage';

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
    const result = await storage.signUp(email, password, metadata);
    
    if (result.success && result.user) {
      const profile = storage.getFounder(result.user.id);
      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          user_type: 'founder',
        },
        profile,
      };
    }
    
    return { success: false, error: result.error || 'Sign up failed' };
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
    const result = await storage.signIn(email, password);
    
    if (result.success && result.user) {
      // Verify it's a founder
      if (result.user.user_type !== 'founder') {
        await storage.signOut();
        return { success: false, error: 'Invalid founder account' };
      }
      
      const profile = storage.getFounder(result.user.id);
      
      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          user_type: 'founder',
        },
        profile,
      };
    }
    
    return { success: false, error: result.error || 'Sign in failed' };
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
    const result = await storage.signIn(email, password);
    
    if (result.success && result.user) {
      // Verify it's an admin
      if (result.user.user_type !== 'admin') {
        await storage.signOut();
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }
      
      const admin = storage.getAdmin(result.user.id);
      if (!admin) {
        return { success: false, error: 'Admin profile not found' };
      }
      
      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          user_type: 'admin',
        },
        admin,
      };
    }
    
    return { success: false, error: result.error || 'Sign in failed' };
  } catch (error: any) {
    console.error('Admin signin error:', error);
    return { success: false, error: error.message || 'Sign in failed' };
  }
}

/**
 * Get current authenticated user (founder or admin)
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem('vendoura_current_user');
    if (!stored) return null;
    
    const user = JSON.parse(stored);
    if (!user.id || !user.email) return null;
    
    return {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    };
  } catch {
    return null;
  }
}

/**
 * Get current founder profile (if logged in as founder)
 */
export function getCurrentFounder(): any | null {
  const user = getCurrentUser();
  if (!user || user.user_type !== 'founder') return null;
  
  return storage.getFounder(user.id) || null;
}

/**
 * Get current admin profile (if logged in as admin)
 */
export function getCurrentAdmin(): any | null {
  const user = getCurrentUser();
  if (!user || user.user_type !== 'admin') return null;
  
  return storage.getAdmin(user.id) || null;
}

/**
 * Check if user is authenticated as founder
 */
export function isFounderAuthenticated(): boolean {
  const user = getCurrentUser();
  return user?.user_type === 'founder';
}

/**
 * Check if user is authenticated as admin
 */
export function isAdminAuthenticated(): boolean {
  const user = getCurrentUser();
  return user?.user_type === 'admin';
}

/**
 * Get admin role (if logged in as admin)
 */
export function getAdminRole(): string | null {
  const admin = getCurrentAdmin();
  return admin?.admin_role || null;
}

/**
 * Check if current admin is super admin
 */
export function isSuperAdmin(): boolean {
  return getAdminRole() === 'super_admin';
}

/**
 * Sign out current user (founder or admin)
 */
export async function signOut(): Promise<void> {
  storage.signOut();
}
