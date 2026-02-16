/**
 * Admin Service - Supabase Integration
 * Provides admin-level operations for managing founders, cohorts, and system settings
 */

import { supabase } from './api';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function ensureAdminAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.error('❌ No admin session found');
    throw new Error('Not authenticated as admin');
  }

  // Verify admin status
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (adminError || !admin) {
    throw new Error('Access denied. Admin privileges required.');
  }

  return admin;
}

// ============================================================================
// ADMIN SERVICE
// ============================================================================

export const adminService = {
  // Get all founders
  async getAllFounders() {
    try {
      await ensureAdminAuth();
      
      const { data, error } = await supabase
        .from('founder_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching founders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching founders:', error);
      return [];
    }
  },

  // Get single founder by ID
  async getFounder(founderId: string) {
    try {
      await ensureAdminAuth();
      
      const { data, error } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('id', founderId)
        .single();

      if (error) {
        console.error('Error fetching founder:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching founder:', error);
      return null;
    }
  },

  // Get all admins
  async getAllAdmins() {
    try {
      await ensureAdminAuth();
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admins:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  },

  // Get cohort analytics
  async getCohortAnalytics(cohortId?: string) {
    try {
      await ensureAdminAuth();
      const founders = await this.getAllFounders();
      
      // Calculate analytics from founder data
      const totalFounders = founders.length;
      const activeFounders = founders.filter(f => f.subscription_status === 'active' || f.subscription_status === 'trial').length;
      const atRiskFounders = founders.filter(f => f.consecutive_misses >= 1).length;
      const lockedFounders = founders.filter(f => f.is_locked).length;
      
      const totalRevenue = founders.reduce((sum, f) => sum + (Number(f.baseline_revenue_30d) || 0), 0);
      const avgRevenue = totalFounders > 0 ? totalRevenue / totalFounders : 0;
      
      return {
        total_founders: totalFounders,
        active_founders: activeFounders,
        at_risk_founders: atRiskFounders,
        locked_founders: lockedFounders,
        total_revenue: totalRevenue,
        average_revenue: avgRevenue,
        cohort_name: 'Cohort 3 - Feb 2026',
        current_week: 4,
      };
    } catch (error) {
      console.error('Error calculating cohort analytics:', error);
      return {
        total_founders: 0,
        active_founders: 0,
        at_risk_founders: 0,
        locked_founders: 0,
        total_revenue: 0,
        average_revenue: 0,
        cohort_name: 'Cohort 3 - Feb 2026',
        current_week: 4,
      };
    }
  },

  // Get system settings
  async getSystemSettings() {
    try {
      await ensureAdminAuth();
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) {
        console.error('Error fetching settings:', error);
        return getDefaultSettings();
      }

      // Convert array of key-value pairs to object
      const settingsObj: any = {};
      data?.forEach(item => {
        settingsObj[item.key] = item.value;
      });

      return { ...getDefaultSettings(), ...settingsObj };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return getDefaultSettings();
    }
  },

  // Update system settings
  async updateSystemSettings(settings: any) {
    try {
      await ensureAdminAuth();
      
      // Update each setting key-value pair
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({ key, value: value as any }, { onConflict: 'key' });

        if (error) {
          console.error(`Error updating setting ${key}:`, error);
        }
      }

      return { success: true, settings };
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Get weekly tracking data (commits and reports)
  async getWeeklyTracking() {
    try {
      await ensureAdminAuth();
      
      const { data: commits, error: commitsError } = await supabase
        .from('weekly_commits')
        .select(`
          *,
          founder:founder_profiles(name, email)
        `)
        .order('week_number', { ascending: false });

      const { data: reports, error: reportsError } = await supabase
        .from('weekly_reports')
        .select(`
          *,
          founder:founder_profiles(name, email)
        `)
        .order('week_number', { ascending: false });

      if (commitsError) console.error('Error fetching commits:', commitsError);
      if (reportsError) console.error('Error fetching reports:', reportsError);

      return {
        commits: commits || [],
        reports: reports || []
      };
    } catch (error) {
      console.error('Error fetching weekly tracking:', error);
      return { commits: [], reports: [] };
    }
  },

  // Create founder (admin only)
  async createFounder(data: any) {
    try {
      await ensureAdminAuth();
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { user_type: 'founder', name: data.name },
        },
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Failed to create auth user');
      }

      // Create founder profile
      const { data: profile, error: profileError } = await supabase
        .from('founder_profiles')
        .insert({
          user_id: authData.user.id,
          email: data.email,
          name: data.name,
          business_name: data.business_name,
          business_stage: data.business_stage,
          phone: data.phone,
          country: data.country,
          current_stage: data.current_stage || 1,
          subscription_status: data.subscription_status || 'trial',
        })
        .select()
        .single();

      if (profileError) {
        throw new Error(profileError.message || 'Failed to create founder profile');
      }

      return { success: true, user: authData.user, profile };
    } catch (error: any) {
      console.error('Error creating founder:', error);
      throw error;
    }
  },

  // Update founder
  async updateFounder(founderId: string, updates: any) {
    try {
      await ensureAdminAuth();
      
      const { error } = await supabase
        .from('founder_profiles')
        .update(updates)
        .eq('id', founderId);

      if (error) {
        throw new Error(error.message || 'Failed to update founder');
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating founder:', error);
      throw error;
    }
  },

  // Delete founder
  async deleteFounder(founderId: string) {
    try {
      await ensureAdminAuth();
      
      // Get founder profile to get user_id
      const { data: profile } = await supabase
        .from('founder_profiles')
        .select('user_id')
        .eq('id', founderId)
        .single();

      if (profile?.user_id) {
        // Delete auth user (will cascade to founder_profiles due to ON DELETE CASCADE)
        const { error: authError } = await supabase.auth.admin.deleteUser(profile.user_id);
        
        if (authError) {
          // If auth deletion fails, at least delete the profile
          const { error } = await supabase
            .from('founder_profiles')
            .delete()
            .eq('id', founderId);

          if (error) throw error;
        }
      } else {
        // Just delete profile if no user_id found
        const { error } = await supabase
          .from('founder_profiles')
          .delete()
          .eq('id', founderId);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting founder:', error);
      throw error;
    }
  },
};

// Default settings
function getDefaultSettings() {
  return {
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
}

// Founder service (for backwards compatibility with CohortOverview)
export const founderService = {
  getAllFounders: () => adminService.getAllFounders(),
  getFounderById: (id: string) => adminService.getFounder(id),
  getCohortAnalytics: (cohortId?: string) => adminService.getCohortAnalytics(cohortId),
  getMentorNotes: (founderId: string) => {
    // Return empty array for now - this will be enhanced later
    return [];
  },
  addMentorNote: (note: any) => {
    // Store in localStorage later
    console.log('Note added:', note);
  },
  overrideLock: (founderId: string) => {
    // Override lock functionality
    console.log('Lock overridden for:', founderId);
  },
};