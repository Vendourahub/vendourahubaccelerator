/**
 * Admin Service - LocalStorage Based
 * Provides admin-level operations for managing founders, cohorts, and system settings
 */

import * as storage from './localStorage';
import { getCurrentAdmin } from './adminAuth';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function ensureAdminAuth() {
  const admin = getCurrentAdmin();
  if (!admin) {
    console.error('❌ No admin session found');
    throw new Error('Not authenticated as admin');
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
      ensureAdminAuth();
      const founders = storage.getAllFounders();
      
      // Map to expected format with additional fields
      return founders.map(f => ({
        id: f.id,
        email: f.email,
        name: f.name,
        business_name: f.business_name,
        business_description: f.business_description,
        business_stage: f.business_stage,
        business_model: f.business_stage, // Map to business_model for compatibility
        revenue: f.revenue,
        phone: f.phone,
        country: f.country,
        created_at: f.created_at,
        onboarding_completed: f.onboarding_completed,
        // Program tracking fields (with defaults)
        current_stage: 1,
        current_week: 1,
        consecutive_misses: 0,
        baseline_revenue_30d: parseFloat(f.revenue?.replace(/[^0-9.-]/g, '') || '0'),
        baseline_revenue_90d: parseFloat(f.revenue?.replace(/[^0-9.-]/g, '') || '0'),
        is_locked: false,
        lock_reason: null,
        subscription_status: 'active',
        subscription_expiry: null,
      }));
    } catch (error) {
      console.error('Error fetching founders:', error);
      return [];
    }
  },

  // Get single founder by ID
  async getFounder(founderId: string) {
    try {
      ensureAdminAuth();
      const founder = storage.getFounder(founderId);
      
      if (!founder) {
        return null;
      }
      
      return {
        id: founder.id,
        email: founder.email,
        name: founder.name,
        business_name: founder.business_name,
        business_description: founder.business_description,
        business_stage: founder.business_stage,
        business_model: founder.business_stage,
        revenue: founder.revenue,
        phone: founder.phone,
        country: founder.country,
        created_at: founder.created_at,
        onboarding_completed: founder.onboarding_completed,
        current_stage: 1,
        current_week: 1,
        consecutive_misses: 0,
        baseline_revenue_30d: parseFloat(founder.revenue?.replace(/[^0-9.-]/g, '') || '0'),
        baseline_revenue_90d: parseFloat(founder.revenue?.replace(/[^0-9.-]/g, '') || '0'),
        is_locked: false,
        lock_reason: null,
        subscription_status: 'active',
        subscription_expiry: null,
      };
    } catch (error) {
      console.error('Error fetching founder:', error);
      return null;
    }
  },

  // Get all admins
  async getAllAdmins() {
    try {
      ensureAdminAuth();
      return storage.getAllAdmins();
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  },

  // Get cohort analytics
  async getCohortAnalytics(cohortId?: string) {
    try {
      ensureAdminAuth();
      const founders = await this.getAllFounders();
      
      // Calculate analytics from founder data
      const totalFounders = founders.length;
      const activeFounders = founders.filter(f => f.subscription_status === 'active').length;
      const atRiskFounders = founders.filter(f => f.consecutive_misses >= 1).length;
      const lockedFounders = founders.filter(f => f.is_locked).length;
      
      const totalRevenue = founders.reduce((sum, f) => sum + (f.baseline_revenue_30d || 0), 0);
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
      ensureAdminAuth();
      const settings = storage.getSettings();
      return settings || getDefaultSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
      return getDefaultSettings();
    }
  },

  // Update system settings
  async updateSystemSettings(settings: any) {
    try {
      ensureAdminAuth();
      storage.setSettings(settings);
      return { success: true, settings };
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Get weekly tracking data (commits and reports)
  async getWeeklyTracking() {
    try {
      ensureAdminAuth();
      // For now, return empty arrays - these would come from weekly_commits and weekly_reports tables
      // In localStorage mode, we don't have this data structure yet
      return {
        commits: [],
        reports: []
      };
    } catch (error) {
      console.error('Error fetching weekly tracking:', error);
      return { commits: [], reports: [] };
    }
  },

  // Create founder (admin only)
  async createFounder(data: any) {
    try {
      ensureAdminAuth();
      
      // Use the storage signUp function to create a complete user + founder record
      const result = await storage.signUp(data.email, data.password, {
        user_type: 'founder',
        name: data.name,
        business_name: data.business_name,
        industry: data.industry,
        phone: data.phone,
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create founder');
      }
      
      // If there are additional updates, apply them
      if (result.user && (data.account_status || data.current_stage || data.subscription_status)) {
        await storage.updateFounder(result.user.id, {
          account_status: data.account_status,
          current_stage: data.current_stage,
          subscription_status: data.subscription_status,
        });
      }
      
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Error creating founder:', error);
      throw error;
    }
  },

  // Update founder
  async updateFounder(founderId: string, updates: any) {
    try {
      ensureAdminAuth();
      const success = storage.updateFounder(founderId, updates);
      if (success) {
        return { success: true };
      } else {
        throw new Error('Founder not found');
      }
    } catch (error) {
      console.error('Error updating founder:', error);
      throw error;
    }
  },

  // Delete founder
  async deleteFounder(founderId: string) {
    try {
      ensureAdminAuth();
      const success = storage.deleteFounder(founderId);
      if (success) {
        return { success: true };
      } else {
        throw new Error('Founder not found');
      }
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