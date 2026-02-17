/**
 * API Layer - Supabase Integration
 * Real backend database with authentication
 */

import { createClient } from '@supabase/supabase-js';
import { getCurrentAdminSync } from './authManager';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'NOT SET');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
} else {
  console.log('✅ Supabase client initialized successfully');
  console.log('📍 Supabase URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'vendoura-auth-token',
    storage: window.localStorage,
  }
});

// ============================================================================
// FOUNDER API
// ============================================================================

export async function getFounderProfile(): Promise<any> {
  const user = getCurrentUser();
  if (!user || user.user_type !== 'founder') {
    throw new Error('Not authenticated as founder');
  }
  
  const founder = storage.getFounder(user.id);
  if (!founder) {
    throw new Error('Founder profile not found');
  }
  
  return founder;
}

export async function updateFounderProfile(updates: any): Promise<any> {
  const user = getCurrentUser();
  if (!user || user.user_type !== 'founder') {
    throw new Error('Not authenticated as founder');
  }
  
  const success = storage.updateFounder(user.id, updates);
  if (!success) {
    throw new Error('Failed to update profile');
  }
  
  return storage.getFounder(user.id);
}

export async function completeOnboarding(data: any): Promise<any> {
  const user = getCurrentUser();
  if (!user || user.user_type !== 'founder') {
    throw new Error('Not authenticated as founder');
  }
  
  const updates = {
    ...data,
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
    current_stage: 'stage_1',
    current_week: 1,
  };
  
  const success = storage.updateFounder(user.id, updates);
  if (!success) {
    throw new Error('Failed to complete onboarding');
  }
  
  return { success: true };
}

// ============================================================================
// ADMIN API - FOUNDER MANAGEMENT
// ============================================================================

export async function adminGetAllFounders(): Promise<any[]> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.getAllFounders();
}

export async function adminGetFounder(founderId: string): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const founder = storage.getFounder(founderId);
  if (!founder) {
    throw new Error('Founder not found');
  }
  
  return founder;
}

export async function adminUpdateFounder(founderId: string, updates: any): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.updateFounder(founderId, updates);
  if (!success) {
    throw new Error('Failed to update founder');
  }
  
  return storage.getFounder(founderId);
}

export async function adminDeleteFounder(founderId: string): Promise<void> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.deleteFounder(founderId);
  if (!success) {
    throw new Error('Failed to delete founder');
  }
}

// ============================================================================
// ADMIN API - COHORT MANAGEMENT
// ============================================================================

export async function adminGetAllCohorts(): Promise<any[]> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.getAllCohorts();
}

export async function adminGetCohort(cohortId: string): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const cohort = storage.getCohort(cohortId);
  if (!cohort) {
    throw new Error('Cohort not found');
  }
  
  return cohort;
}

export async function adminCreateCohort(cohortData: any): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.createCohort({
    ...cohortData,
    created_by: admin.id,
  });
}

export async function adminUpdateCohort(cohortId: string, updates: any): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.updateCohort(cohortId, updates);
  if (!success) {
    throw new Error('Failed to update cohort');
  }
  
  return storage.getCohort(cohortId);
}

export async function adminDeleteCohort(cohortId: string): Promise<void> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.deleteCohort(cohortId);
  if (!success) {
    throw new Error('Failed to delete cohort');
  }
}

// ============================================================================
// ADMIN API - APPLICATION MANAGEMENT
// ============================================================================

export async function adminGetAllApplications(): Promise<any[]> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.getAllApplications();
}

export async function adminGetApplication(applicationId: string): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const application = storage.getApplication(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }
  
  return application;
}

export async function adminUpdateApplication(applicationId: string, updates: any): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const updatedData = {
    ...updates,
    reviewed_at: new Date().toISOString(),
    reviewed_by: admin.id,
  };
  
  const success = storage.updateApplication(applicationId, updatedData);
  if (!success) {
    throw new Error('Failed to update application');
  }
  
  return storage.getApplication(applicationId);
}

export async function adminDeleteApplication(applicationId: string): Promise<void> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.deleteApplication(applicationId);
  if (!success) {
    throw new Error('Failed to delete application');
  }
}

// ============================================================================
// PUBLIC API - APPLICATIONS
// ============================================================================

export async function submitApplication(applicationData: any): Promise<any> {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      ...applicationData,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting application:', error);
    throw new Error(error.message || 'Failed to submit application');
  }

  return data;
}

// ============================================================================
// PUBLIC API - WAITLIST
// ============================================================================

export async function joinWaitlist(email: string, name?: string, source?: string): Promise<any> {
  const { data, error } = await supabase
    .from('waitlist')
    .insert({ email, name, source })
    .select()
    .single();

  if (error) {
    console.error('Error joining waitlist:', error);
    throw new Error(error.message || 'Failed to join waitlist');
  }

  return data;
}

export async function adminGetWaitlist(): Promise<any[]> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.getAllWaitlist();
}

export async function adminRemoveFromWaitlist(waitlistId: string): Promise<void> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.removeFromWaitlist(waitlistId);
  if (!success) {
    throw new Error('Failed to remove from waitlist');
  }
}

export async function adminMarkWaitlistNotified(waitlistId: string): Promise<void> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const success = storage.markWaitlistNotified(waitlistId);
  if (!success) {
    throw new Error('Failed to mark as notified');
  }
}

// ============================================================================
// ADMIN API - SETTINGS
// ============================================================================

export async function adminGetSettings(): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.getSettings();
}

export async function adminUpdateSettings(updates: any): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  storage.updateSettings(updates);
  return storage.getSettings();
}

// ============================================================================
// ADMIN API - STATISTICS
// ============================================================================

export async function adminGetStatistics(): Promise<any> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  const founders = storage.getAllFounders();
  const cohorts = storage.getAllCohorts();
  const applications = storage.getAllApplications();
  const waitlist = storage.getAllWaitlist();
  
  return {
    total_founders: founders.length,
    active_founders: founders.filter(f => f.cohort_id).length,
    pending_applications: applications.filter(a => a.status === 'pending').length,
    total_applications: applications.length,
    total_cohorts: cohorts.length,
    active_cohorts: cohorts.filter(c => c.status === 'active').length,
    waitlist_size: waitlist.length,
    onboarding_completed: founders.filter(f => f.onboarding_completed).length,
  };
}

// ============================================================================
// EMAIL API (Simulated)
// ============================================================================

export async function sendEmail(to: string, subject: string, template: string, data?: any): Promise<void> {
  console.log('📧 Email simulation:', { to, subject, template });
  
  // Log the email
  storage.logEmail(to, subject, template, 'sent');
  
  // In a real app, this would send via an email service
  // For localStorage mode, we just log it
}

export async function adminGetEmailLogs(): Promise<any[]> {
  const admin = getCurrentAdminSync();
  if (!admin) {
    throw new Error('Not authenticated as admin');
  }
  
  return storage.getEmailLogs();
}

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

export function exportAllData(): string {
  return storage.exportData();
}

export function importAllData(jsonData: string): boolean {
  return storage.importData(jsonData);
}

export function clearAllData(): void {
  storage.clearAllData();
}
