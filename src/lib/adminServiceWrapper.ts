/**
 * Admin Service Wrapper - LocalStorage Mode
 * Provides admin-specific API functions using localStorage
 */

import * as storage from './localStorage';
import { getCurrentAdmin } from './adminAuth';

export interface FounderProfile {
  id: string;
  email: string;
  name: string;
  business_name?: string;
  business_description?: string;
  business_stage?: string;
  revenue?: string;
  phone?: string;
  country?: string;
  created_at: string;
  onboarding_completed: boolean;
  cohort_id?: string;
  current_stage?: string;
  current_week?: number;
  subscription_expiry?: string | null;
  subscription_status?: string;
}

export const adminService = {
  // Get all founders
  getAllFounders: async (cohortId?: string): Promise<FounderProfile[]> => {
    try {
      const admin = getCurrentAdmin();
      if (!admin) {
        console.error('Not authenticated as admin');
        return [];
      }

      const founders = storage.getAllFounders();
      
      if (cohortId) {
        return founders.filter(f => f.cohort_id === cohortId);
      }
      
      return founders;
    } catch (error) {
      console.error('Error fetching founders:', error);
      return [];
    }
  },

  // Get founder by ID
  getFounderById: async (founderId: string): Promise<FounderProfile | null> => {
    try {
      const admin = getCurrentAdmin();
      if (!admin) {
        console.error('Not authenticated as admin');
        return null;
      }

      return storage.getFounder(founderId);
    } catch (error) {
      console.error('Error fetching founder:', error);
      return null;
    }
  },

  // Get cohort analytics
  getCohortAnalytics: async (cohortId?: string): Promise<any> => {
    try {
      const admin = getCurrentAdmin();
      if (!admin) {
        console.error('Not authenticated as admin');
        return null;
      }

      const founders = await adminService.getAllFounders(cohortId);
      
      return {
        totalFounders: founders.length,
        active: founders.filter(f => f.cohort_id).length,
        onTrack: founders.filter(f => f.onboarding_completed).length,
        // Placeholder values for localStorage mode
        underReview: 0,
        removed: 0,
        excelling: 0,
        atRisk: 0,
        locked: 0,
        avgRevenueGrowth: 0,
        totalRevenue: 0,
        completionRate: 0,
      };
    } catch (error) {
      console.error('Error getting cohort analytics:', error);
      return null;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (cohortId?: string): Promise<any> => {
    try {
      const admin = getCurrentAdmin();
      if (!admin) {
        console.error('Not authenticated as admin');
        return null;
      }

      // Placeholder values for localStorage mode
      return {
        totalRevenue: 0,
        avgGrowth: 0,
        topPerformers: [],
        weeklyTrend: [],
      };
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      return null;
    }
  },

  // Update founder (admin only)
  updateFounder: async (founderId: string, updates: Partial<FounderProfile>): Promise<boolean> => {
    try {
      const admin = getCurrentAdmin();
      if (!admin) {
        console.error('Not authenticated as admin');
        return false;
      }

      return storage.updateFounder(founderId, updates);
    } catch (error) {
      console.error('Error updating founder:', error);
      return false;
    }
  },

  // Log admin action
  logAction: async (actionType: string, description: string, metadata?: any): Promise<void> => {
    try {
      const admin = getCurrentAdmin();
      if (!admin) return;

      console.log('📝 Admin action logged:', { actionType, description, metadata, admin: admin.email });
      // In localStorage mode, we just log to console
      // In production, this would save to an audit log
    } catch (error) {
      console.error('Error logging action:', error);
    }
  },
};