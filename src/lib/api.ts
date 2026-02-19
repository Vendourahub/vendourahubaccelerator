/**
 * API Layer - Supabase Integration
 * Real backend database with authentication
 */

import { createClient } from '@supabase/supabase-js';
import { getCurrentAdminSync } from './authManager';
import * as storage from './localStorage';

// Initialize Supabase client
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL as string;
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY as string;

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

async function requireAuthUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Not authenticated');
  }
  return user;
}

async function requireAdminUser() {
  const cachedAdmin = getCurrentAdminSync();
  if (!cachedAdmin) {
    throw new Error('Not authenticated as admin');
  }

  const user = await requireAuthUser();
  const { data: adminProfile, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !adminProfile) {
    throw new Error('Not authenticated as admin');
  }

  return { user, adminProfile };
}

// ============================================================================
// FOUNDER API
// ============================================================================

export async function getFounderProfile(): Promise<any> {
  const user = await requireAuthUser();
  const { data: founder, error } = await supabase
    .from('founder_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !founder) {
    throw new Error('Founder profile not found');
  }

  return founder;
}

export async function updateFounderProfile(updates: any): Promise<any> {
  const user = await requireAuthUser();
  const { data, error } = await supabase
    .from('founder_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error('Failed to update profile');
  }

  return data;
}

export async function completeOnboarding(data: any): Promise<any> {
  const user = await requireAuthUser();
  const updates = {
    business_name: data.business_name,
    business_model: data.business_model,
    product_description: data.product_description,
    customer_count: data.customer_count,
    pricing: data.pricing,
    baseline_revenue_30d: data.revenue_baseline_30d,
    baseline_revenue_90d: data.revenue_baseline_90d,
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
    current_stage: 1,
    current_week: 1,
    is_locked: false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('founder_profiles')
    .update(updates)
    .eq('user_id', user.id);

  if (error) {
    throw new Error('Failed to complete onboarding');
  }

  return { success: true };
}

// ============================================================================
// ADMIN API - FOUNDER MANAGEMENT
// ============================================================================

export async function adminGetAllFounders(): Promise<any[]> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('founder_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message || 'Failed to fetch founders');
  return data || [];
}

export async function adminGetFounder(founderId: string): Promise<any> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('founder_profiles')
    .select('*')
    .eq('id', founderId)
    .single();

  if (error || !data) {
    throw new Error('Founder not found');
  }

  return data;
}

export async function adminUpdateFounder(founderId: string, updates: any): Promise<any> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('founder_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', founderId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error('Failed to update founder');
  }

  return data;
}

export async function adminDeleteFounder(founderId: string): Promise<void> {
  await requireAdminUser();
  const { error } = await supabase
    .from('founder_profiles')
    .delete()
    .eq('id', founderId);

  if (error) {
    throw new Error('Failed to delete founder');
  }
}

// ============================================================================
// ADMIN API - COHORT MANAGEMENT
// ============================================================================

export async function adminGetAllCohorts(): Promise<any[]> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message || 'Failed to fetch cohorts');
  return data || [];
}

export async function adminGetCohort(cohortId: string): Promise<any> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .eq('id', cohortId)
    .single();

  if (error || !data) {
    throw new Error('Cohort not found');
  }

  return data;
}

export async function adminCreateCohort(cohortData: any): Promise<any> {
  const { adminProfile } = await requireAdminUser();
  const { data, error } = await supabase
    .from('cohorts')
    .insert({
    ...cohortData,
    created_by: adminProfile.id,
  })
    .select('*')
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to create cohort');
  return data;
}

export async function adminUpdateCohort(cohortId: string, updates: any): Promise<any> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('cohorts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', cohortId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error('Failed to update cohort');
  }

  return data;
}

export async function adminDeleteCohort(cohortId: string): Promise<void> {
  await requireAdminUser();
  const { error } = await supabase
    .from('cohorts')
    .delete()
    .eq('id', cohortId);

  if (error) {
    throw new Error('Failed to delete cohort');
  }
}

// ============================================================================
// ADMIN API - APPLICATION MANAGEMENT
// ============================================================================

export async function adminGetAllApplications(): Promise<any[]> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message || 'Failed to fetch applications');
  return data || [];
}

export async function adminGetApplication(applicationId: string): Promise<any> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (error || !data) {
    throw new Error('Application not found');
  }

  return data;
}

export async function adminUpdateApplication(applicationId: string, updates: any): Promise<any> {
  const { adminProfile } = await requireAdminUser();
  const updatedData = {
    ...updates,
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminProfile.id,
  };

  const { data, error } = await supabase
    .from('applications')
    .update(updatedData)
    .eq('id', applicationId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error('Failed to update application');
  }

  return data;
}

export async function adminDeleteApplication(applicationId: string): Promise<void> {
  await requireAdminUser();
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId);

  if (error) {
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
      status: applicationData?.status || 'pending',
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
  await requireAdminUser();
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message || 'Failed to fetch waitlist');
  return data || [];
}

export async function adminRemoveFromWaitlist(waitlistId: string): Promise<void> {
  await requireAdminUser();
  const { error } = await supabase
    .from('waitlist')
    .delete()
    .eq('id', waitlistId);

  if (error) {
    throw new Error('Failed to remove from waitlist');
  }
}

export async function adminMarkWaitlistNotified(waitlistId: string): Promise<void> {
  await requireAdminUser();
  const { error } = await supabase
    .from('waitlist')
    .update({ notified: true, notified_at: new Date().toISOString() })
    .eq('id', waitlistId);

  if (error) {
    throw new Error('Failed to mark as notified');
  }
}

// ============================================================================
// ADMIN API - SETTINGS
// ============================================================================

export async function adminGetSettings(): Promise<any> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('system_settings')
    .select('*');

  if (error) throw new Error(error.message || 'Failed to fetch settings');
  return data || [];
}

export async function adminUpdateSettings(updates: any): Promise<any> {
  await requireAdminUser();

  for (const [key, value] of Object.entries(updates || {})) {
    const { error } = await supabase
      .from('system_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      throw new Error(error.message || `Failed to update setting: ${key}`);
    }
  }

  return adminGetSettings();
}

// ============================================================================
// ADMIN API - STATISTICS
// ============================================================================

export async function adminGetStatistics(): Promise<any> {
  await requireAdminUser();

  const [foundersRes, cohortsRes, applicationsRes, waitlistRes] = await Promise.all([
    supabase.from('founder_profiles').select('id,cohort_id,onboarding_completed'),
    supabase.from('cohorts').select('id,status'),
    supabase.from('applications').select('id,status'),
    supabase.from('waitlist').select('id'),
  ]);

  const founders = foundersRes.data || [];
  const cohorts = cohortsRes.data || [];
  const applications = applicationsRes.data || [];
  const waitlist = waitlistRes.data || [];

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

  const payload = {
    to_email: to,
    subject,
    template_name: template,
    payload: data || {},
    status: 'sent',
    sent_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('email_logs').insert(payload);
  if (error) {
    console.warn('Unable to persist email log to Supabase:', error.message);
  }
}

export async function adminGetEmailLogs(): Promise<any[]> {
  await requireAdminUser();
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) throw new Error(error.message || 'Failed to fetch email logs');
  return data || [];
}

// ============================================================================
// EMAIL VERIFICATION - RATE LIMITED RESEND
// ============================================================================

const RESEND_RATE_LIMIT = {
  maxAttemptsPerHour: 5,
  cooldownSeconds: 60, // Must wait this long between attempts
};

export async function resendFounderVerificationRateLimited(email: string): Promise<{
  success: boolean;
  error?: string;
  retryAfter?: number; // Seconds until next attempt allowed
}> {
  try {
    // Check recent attempts in the last 60 seconds from last attempt or hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const lastAttemptTime = new Date(Date.now() - RESEND_RATE_LIMIT.cooldownSeconds * 1000);

    // Get recent attempts from this email
    const { data: recentAttempts, error: queryError } = await supabase
      .from('email_resend_attempts')
      .select('attempted_at')
      .eq('email', email)
      .gte('attempted_at', oneHourAgo.toISOString())
      .order('attempted_at', { ascending: false });

    if (queryError) {
      console.error('Failed to check rate limit:', queryError);
      // Don't block on query error; log it but continue
    }

    const attempts = recentAttempts || [];

    // Check if exceeded hourly limit
    if (attempts.length >= RESEND_RATE_LIMIT.maxAttemptsPerHour) {
      // Log this attempt as rate-limited
      await supabase
        .from('email_resend_attempts')
        .insert({
          email,
          attempted_at: new Date().toISOString(),
          success: false,
          error_message: 'Rate limit exceeded',
        });

      // Calculate retry time (when oldest attempt expires)
      const oldestAttempt = new Date(attempts[attempts.length - 1].attempted_at);
      const retryTime = new Date(oldestAttempt.getTime() + 60 * 60 * 1000); // 1 hour after oldest
      const retryAfter = Math.max(1, Math.ceil((retryTime.getTime() - Date.now()) / 1000));

      return {
        success: false,
        error: `Too many resend attempts. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      };
    }

    // Check cooldown (must wait 60 seconds since last attempt)
    if (attempts.length > 0) {
      const lastAttempt = new Date(attempts[0].attempted_at);
      const timeSinceLastAttempt = (Date.now() - lastAttempt.getTime()) / 1000;

      if (timeSinceLastAttempt < RESEND_RATE_LIMIT.cooldownSeconds) {
        const retryAfter = Math.ceil(
          RESEND_RATE_LIMIT.cooldownSeconds - timeSinceLastAttempt
        );

        // Log this attempt as rate-limited
        await supabase
          .from('email_resend_attempts')
          .insert({
            email,
            attempted_at: new Date().toISOString(),
            success: false,
            error_message: `Cooldown period active. Retry in ${retryAfter}s`,
          });

        return {
          success: false,
          error: `Please wait ${retryAfter} seconds before trying again.`,
          retryAfter,
        };
      }
    }

    // Rate limit check passed; attempt resend
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      // Log failed attempt
      await supabase
        .from('email_resend_attempts')
        .insert({
          email,
          attempted_at: new Date().toISOString(),
          success: false,
          error_message: 'User not authenticated',
        });

      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Call Supabase resend
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (resendError) {
      // Log failed attempt
      await supabase
        .from('email_resend_attempts')
        .insert({
          email,
          attempted_at: new Date().toISOString(),
          success: false,
          error_message: resendError.message,
        });

      return {
        success: false,
        error: resendError.message || 'Failed to resend verification email',
      };
    }

    // Log successful attempt
    await supabase
      .from('email_resend_attempts')
      .insert({
        email,
        attempted_at: new Date().toISOString(),
        success: true,
      });

    return { success: true };
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to resend verification email',
    };
  }
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
