/**
 * Founder Service - LocalStorage Mode
 * Provides founder-specific API functions using localStorage
 */

import * as storage from './localStorage';
import { getCurrentUser } from './auth';

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
  onboarding_completed_at?: string;
  current_stage?: string;
  current_week?: number;
  cohort_id?: string;
  is_locked?: boolean;
  lock_reason?: string;
}

export interface WeeklyCommit {
  id: string;
  founder_id: string;
  week_number: number;
  action_description: string;
  target_revenue: number;
  completion_date: string;
  submitted_at: string;
  deadline: string;
  is_late: boolean;
  status: 'pending' | 'complete' | 'missed';
}

export interface WeeklyReport {
  id: string;
  founder_id: string;
  week_number: number;
  commit_id: string;
  revenue_generated: number;
  hours_spent: number;
  narrative: string;
  evidence_urls: string[];
  submitted_at: string;
  deadline: string;
  is_late: boolean;
  status: 'submitted' | 'accepted' | 'rejected';
  dollar_per_hour?: number;
  win_rate?: number;
  rejection_reason?: string;
}

export const founderService = {
  // Get current founder's complete profile
  getMyProfile: async (): Promise<FounderProfile | null> => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error('No user found');
        return null;
      }

      const founder = storage.getFounder(user.id);
      return founder;
    } catch (error) {
      console.error('Error fetching founder profile:', error);
      return null;
    }
  },

  // Get founder's weekly commits
  getMyCommits: async (): Promise<WeeklyCommit[]> => {
    try {
      const user = getCurrentUser();
      if (!user) return [];

      // For now, return empty array - commits not yet implemented in localStorage
      console.log('ℹ️ Weekly commits not yet implemented in localStorage mode');
      return [];
    } catch (error) {
      console.error('Error fetching commits:', error);
      return [];
    }
  },

  // Get founder's weekly reports
  getMyReports: async (): Promise<WeeklyReport[]> => {
    try {
      const user = getCurrentUser();
      if (!user) return [];

      // For now, return empty array - reports not yet implemented in localStorage
      console.log('ℹ️ Weekly reports not yet implemented in localStorage mode');
      return [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  // Get founder's stage progress
  getMyStageProgress: async (): Promise<any[]> => {
    try {
      const user = getCurrentUser();
      if (!user) return [];

      // For now, return empty array - stage progress not yet implemented in localStorage
      console.log('ℹ️ Stage progress not yet implemented in localStorage mode');
      return [];
    } catch (error) {
      console.error('Error fetching stage progress:', error);
      return [];
    }
  },

  // Submit weekly commit
  submitCommit: async (commit: Omit<WeeklyCommit, 'id' | 'founder_id' | 'submitted_at'>): Promise<WeeklyCommit | null> => {
    try {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      console.log('ℹ️ Commit submission not yet implemented in localStorage mode');
      console.log('Commit data:', commit);
      
      return null;
    } catch (error) {
      console.error('Error submitting commit:', error);
      return null;
    }
  },

  // Submit weekly report
  submitReport: async (report: Omit<WeeklyReport, 'id' | 'founder_id' | 'submitted_at'>): Promise<WeeklyReport | null> => {
    try {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      console.log('ℹ️ Report submission not yet implemented in localStorage mode');
      console.log('Report data:', report);
      
      return null;
    } catch (error) {
      console.error('Error submitting report:', error);
      return null;
    }
  },

  // Update founder profile
  updateProfile: async (updates: Partial<FounderProfile>): Promise<boolean> => {
    try {
      const user = getCurrentUser();
      if (!user) return false;

      const success = storage.updateFounder(user.id, updates);
      return success;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  // Calculate revenue metrics
  getRevenueMetrics: async (): Promise<{
    baseline30d: number;
    baseline90d: number;
    current30d: number;
    totalGenerated: number;
    growthPercent: number;
    avgDollarPerHour: number;
    avgWinRate: number;
  } | null> => {
    try {
      const profile = await founderService.getMyProfile();
      const reports = await founderService.getMyReports();

      if (!profile) return null;

      // For localStorage mode, use placeholder values
      return {
        baseline30d: 0,
        baseline90d: 0,
        current30d: 0,
        totalGenerated: 0,
        growthPercent: 0,
        avgDollarPerHour: 0,
        avgWinRate: 0,
      };
    } catch (error) {
      console.error('Error calculating revenue metrics:', error);
      return null;
    }
  }
};
