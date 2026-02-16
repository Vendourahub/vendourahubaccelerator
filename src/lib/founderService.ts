/**
 * Founder Service - Supabase Integration
 * Provides founder-specific API functions using Supabase
 */

import { supabase } from './api';

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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('No user found:', authError);
        return null;
      }

      const { data, error } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching founder profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching founder profile:', error);
      return null;
    }
  },

  // Get founder's weekly commits
  getMyCommits: async (): Promise<WeeklyCommit[]> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return [];

      // Get founder profile to get founder_id
      const { data: profile } = await supabase
        .from('founder_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('weekly_commits')
        .select('*')
        .eq('founder_id', profile.id)
        .order('week_number', { ascending: false });

      if (error) {
        console.error('Error fetching commits:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching commits:', error);
      return [];
    }
  },

  // Get founder's weekly reports
  getMyReports: async (): Promise<WeeklyReport[]> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return [];

      // Get founder profile to get founder_id
      const { data: profile } = await supabase
        .from('founder_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('founder_id', profile.id)
        .order('week_number', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }

      return data || [];
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not authenticated');

      // Get founder profile to get founder_id
      const { data: profile } = await supabase
        .from('founder_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Founder profile not found');

      const { data, error } = await supabase
        .from('weekly_commits')
        .insert({
          founder_id: profile.id,
          ...commit
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting commit:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error submitting commit:', error);
      return null;
    }
  },

  // Submit weekly report
  submitReport: async (report: Omit<WeeklyReport, 'id' | 'founder_id' | 'submitted_at'>): Promise<WeeklyReport | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not authenticated');

      // Get founder profile to get founder_id
      const { data: profile } = await supabase
        .from('founder_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Founder profile not found');

      const { data, error } = await supabase
        .from('weekly_reports')
        .insert({
          founder_id: profile.id,
          ...report
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting report:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error submitting report:', error);
      return null;
    }
  },

  // Update founder profile
  updateProfile: async (updates: Partial<FounderProfile>): Promise<boolean> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return false;

      const { error } = await supabase
        .from('founder_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
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

      // Calculate total revenue from reports
      const totalGenerated = reports.reduce((sum, r) => sum + (r.revenue_generated || 0), 0);
      
      // Calculate average dollar per hour
      const totalHours = reports.reduce((sum, r) => sum + (r.hours_spent || 0), 0);
      const avgDollarPerHour = totalHours > 0 ? totalGenerated / totalHours : 0;
      
      // Calculate average win rate
      const avgWinRate = reports.reduce((sum, r) => sum + (r.win_rate || 0), 0) / (reports.length || 1);

      return {
        baseline30d: profile.baseline_revenue_30d || 0,
        baseline90d: profile.baseline_revenue_90d || 0,
        current30d: totalGenerated,
        totalGenerated,
        growthPercent: profile.baseline_revenue_30d 
          ? ((totalGenerated - profile.baseline_revenue_30d) / profile.baseline_revenue_30d) * 100
          : 0,
        avgDollarPerHour,
        avgWinRate,
      };
    } catch (error) {
      console.error('Error calculating revenue metrics:', error);
      return null;
    }
  }
};
