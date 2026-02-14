/**
 * Admin Authentication Library - LocalStorage Based
 */

import * as storage from './localStorage';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  admin_role: 'super_admin' | 'program_manager' | 'operations';
}

export interface AdminAuthResult {
  success: boolean;
  admin?: AdminUser;
  error?: string;
}

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================

/**
 * Admin login
 */
export async function adminLogin(email: string, password: string): Promise<AdminAuthResult> {
  try {
    console.log('🔐 Admin login attempt:', email);
    
    // Sign in using storage
    const result = await storage.signIn(email, password);
    
    if (!result.success || !result.user) {
      return { success: false, error: result.error || 'Invalid credentials' };
    }
    
    // Check if user is an admin
    if (result.user.user_type !== 'admin') {
      console.error('❌ User is not an admin');
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }
    
    // Get full admin profile
    const adminProfile = storage.getAdmin(result.user.id);
    if (!adminProfile) {
      console.error('❌ Admin profile not found');
      return { success: false, error: 'Admin profile not found' };
    }
    
    const admin: AdminUser = {
      id: adminProfile.id,
      email: adminProfile.email,
      name: adminProfile.name,
      admin_role: adminProfile.admin_role,
    };
    
    console.log('✅ Admin login successful:', admin.email, 'Role:', admin.admin_role);
    return { success: true, admin };
    
  } catch (error: any) {
    console.error('❌ Admin login error:', error);
    return { success: false, error: error.message || 'Login failed' };
  }
}

/**
 * Get current admin user
 */
export function getCurrentAdmin(): AdminUser | null {
  try {
    const user = storage.getCurrentAdmin();
    
    if (!user) {
      console.log('🔍 No admin session found in localStorage');
      return null;
    }
    
    if (user.user_type !== 'admin') {
      console.log('🔍 User is not an admin, type:', user.user_type);
      return null;
    }
    
    const adminProfile = storage.getAdmin(user.id);
    if (!adminProfile) {
      console.error('❌ Admin profile not found for user:', user.id);
      console.log('📦 Available admins:', storage.getAllAdmins().map(a => ({ id: a.id, email: a.email })));
      return null;
    }
    
    // Return the admin user object
    return {
      id: adminProfile.id,
      email: adminProfile.email,
      name: adminProfile.name,
      admin_role: adminProfile.admin_role,
    };
  } catch (error) {
    console.error('❌ Error in getCurrentAdmin:', error);
    return null;
  }
}

/**
 * Check if current user is authenticated as admin
 */
export function isAdminAuthenticated(): boolean {
  return getCurrentAdmin() !== null;
}

/**
 * Get admin role
 */
export function getAdminRole(): 'super_admin' | 'program_manager' | 'operations' | null {
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
 * Admin logout
 */
export async function adminLogout(): Promise<void> {
  console.log('🚪 Admin logging out...');
  storage.signOut();
  console.log('✅ Admin logout successful');
}

// ============================================================================
// ADMIN MANAGEMENT (Super Admin Only)
// ============================================================================

/**
 * Create a new admin (super admin only)
 */
export async function createAdmin(
  email: string,
  password: string,
  name: string,
  admin_role: 'super_admin' | 'program_manager' | 'operations'
): Promise<AdminAuthResult> {
  try {
    // Check if current user is super admin
    if (!isSuperAdmin()) {
      return { success: false, error: 'Only super admins can create new admins' };
    }
    
    // Check if admin already exists
    const existing = storage.getAdminByEmail(email);
    if (existing) {
      return { success: false, error: 'Admin with this email already exists' };
    }
    
    // Create user account
    const result = await storage.signUp(email, password, {
      user_type: 'admin',
      name,
      admin_role,
    });
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Get the created admin
    const adminProfile = storage.getAdmin(result.user!.id);
    if (!adminProfile) {
      return { success: false, error: 'Failed to create admin profile' };
    }
    
    const admin: AdminUser = {
      id: adminProfile.id,
      email: adminProfile.email,
      name: adminProfile.name,
      admin_role: adminProfile.admin_role,
    };
    
    console.log('✅ Admin created:', admin.email);
    return { success: true, admin };
    
  } catch (error: any) {
    console.error('❌ Error creating admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all admins
 */
export function getAllAdmins(): AdminUser[] {
  const admins = storage.getAllAdmins();
  return admins.map(a => ({
    id: a.id,
    email: a.email,
    name: a.name,
    admin_role: a.admin_role,
  }));
}

/**
 * Update admin
 */
export async function updateAdmin(
  adminId: string,
  updates: Partial<AdminUser>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if current user is super admin
    if (!isSuperAdmin()) {
      return { success: false, error: 'Only super admins can update admins' };
    }
    
    const success = storage.updateAdmin(adminId, updates);
    
    if (success) {
      console.log('✅ Admin updated:', adminId);
      return { success: true };
    } else {
      return { success: false, error: 'Admin not found' };
    }
  } catch (error: any) {
    console.error('❌ Error updating admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete admin
 */
export async function deleteAdmin(adminId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if current user is super admin
    if (!isSuperAdmin()) {
      return { success: false, error: 'Only super admins can delete admins' };
    }
    
    // Don't allow deleting self
    const currentAdmin = getCurrentAdmin();
    if (currentAdmin?.id === adminId) {
      return { success: false, error: 'Cannot delete your own admin account' };
    }
    
    const success = storage.deleteAdmin(adminId);
    
    if (success) {
      console.log('✅ Admin deleted:', adminId);
      return { success: true };
    } else {
      return { success: false, error: 'Admin not found' };
    }
  } catch (error: any) {
    console.error('❌ Error deleting admin:', error);
    return { success: false, error: error.message };
  }
}