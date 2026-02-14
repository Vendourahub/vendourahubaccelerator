// Comprehensive Supabase Database Service
// Connects all dashboards and analytics to live data
import { supabase } from './api';

// Re-export supabase client for convenience
export { supabase };

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface FounderProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  business_name: string;
  business_description?: string;
  business_model?: string;
  cohort_id?: string;
  baseline_revenue_30d: number;
  baseline_revenue_90d: number;
  current_stage: number;
  current_week: number;
  account_status: 'active' | 'under_review' | 'removed';
  consecutive_misses: number;
  subscription_status: 'trial' | 'paid' | 'expired' | 'cancelled';
  subscription_expiry?: string;
  is_locked: boolean;
  lock_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyCommit {
  id: string;
  user_id: string;
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
  user_id: string;
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

export interface StageProgress {
  id: string;
  user_id: string;
  stage_number: number;
  status: 'locked' | 'in_progress' | 'complete';
  unlocked_at?: string;
  completed_at?: string;
  requirements_met: boolean;
}

export interface MentorNote {
  id: string;
  founder_id: string;
  mentor_id: string;
  mentor_name: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface CohortData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  current_week: number;
  status: 'active' | 'completed' | 'upcoming';
  total_founders: number;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  admin_id?: string;
  action_type: string;
  action_description: string;
  metadata?: any;
  created_at: string;
}

// ============================================
// FOUNDER DATA SERVICE
// ============================================

export const founderService = {
  // Get current founder's complete profile
  getMyProfile: async (): Promise<FounderProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching founder profile:', error);
      return null;
    }
  },

  // Get founder's weekly commits
  getMyCommits: async (): Promise<WeeklyCommit[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('weekly_commits')
        .select('*')
        .eq('user_id', user.id)
        .order('week_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching commits:', error);
      return [];
    }
  },

  // Get founder's weekly reports
  getMyReports: async (): Promise<WeeklyReport[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('week_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  // Get founder's stage progress
  getMyStageProgress: async (): Promise<StageProgress[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('stage_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('stage_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stage progress:', error);
      return [];
    }
  },

  // Submit weekly commit
  submitCommit: async (commit: Omit<WeeklyCommit, 'id' | 'user_id' | 'submitted_at'>): Promise<WeeklyCommit | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weekly_commits')
        .insert({
          user_id: user.id,
          ...commit,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting commit:', error);
      return null;
    }
  },

  // Submit weekly report
  submitReport: async (report: Omit<WeeklyReport, 'id' | 'user_id' | 'submitted_at'>): Promise<WeeklyReport | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculate dollar per hour and win rate
      const dollarPerHour = report.hours_spent > 0 ? report.revenue_generated / report.hours_spent : 0;
      
      // Get commit to calculate win rate
      const { data: commit } = await supabase
        .from('weekly_commits')
        .select('target_revenue')
        .eq('id', report.commit_id)
        .single();

      const winRate = commit ? (report.revenue_generated / commit.target_revenue) * 100 : 0;

      const { data, error } = await supabase
        .from('weekly_reports')
        .insert({
          user_id: user.id,
          ...report,
          dollar_per_hour: dollarPerHour,
          win_rate: winRate,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting report:', error);
      return null;
    }
  },

  // Update founder profile
  updateProfile: async (updates: Partial<FounderProfile>): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('founder_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
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

      const acceptedReports = reports.filter(r => r.status === 'accepted');
      const totalGenerated = acceptedReports.reduce((sum, r) => sum + r.revenue_generated, 0);
      const avgDollarPerHour = acceptedReports.length > 0
        ? acceptedReports.reduce((sum, r) => sum + (r.dollar_per_hour || 0), 0) / acceptedReports.length
        : 0;
      const avgWinRate = acceptedReports.length > 0
        ? acceptedReports.reduce((sum, r) => sum + (r.win_rate || 0), 0) / acceptedReports.length
        : 0;

      const current30d = profile.baseline_revenue_30d + totalGenerated;
      const growthPercent = ((current30d - profile.baseline_revenue_30d) / profile.baseline_revenue_30d) * 100;

      return {
        baseline30d: profile.baseline_revenue_30d,
        baseline90d: profile.baseline_revenue_90d,
        current30d,
        totalGenerated,
        growthPercent,
        avgDollarPerHour,
        avgWinRate
      };
    } catch (error) {
      console.error('Error calculating revenue metrics:', error);
      return null;
    }
  }
};

// ============================================
// ADMIN DATA SERVICE
// ============================================

export const adminService = {
  // Get all founders in cohort
  getAllFounders: async (cohortId?: string): Promise<FounderProfile[]> => {
    try {
      console.log('📡 Supabase Query: getAllFounders', cohortId ? `cohort: ${cohortId}` : 'all cohorts');
      
      let query = supabase
        .from('founder_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (cohortId) {
        query = query.eq('cohort_id', cohortId);
      }

      const { data, error } = await query;
      
      console.log('📊 Supabase Response:', { 
        data: data?.length || 0, 
        error: error?.message || null,
        code: error?.code || null
      });

      if (error) {
        console.error('❌ Supabase Error Details:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching founders:', error);
      return [];
    }
  },

  // Get founder by ID
  getFounderById: async (founderId: string): Promise<FounderProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('id', founderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching founder:', error);
      return null;
    }
  },

  // Get founder's complete weekly data
  getFounderWeeklyData: async (founderId: string): Promise<{
    commits: WeeklyCommit[];
    reports: WeeklyReport[];
  }> => {
    try {
      const [commitsResult, reportsResult] = await Promise.all([
        supabase
          .from('weekly_commits')
          .select('*')
          .eq('user_id', founderId)
          .order('week_number', { ascending: false }),
        supabase
          .from('weekly_reports')
          .select('*')
          .eq('user_id', founderId)
          .order('week_number', { ascending: false })
      ]);

      return {
        commits: commitsResult.data || [],
        reports: reportsResult.data || []
      };
    } catch (error) {
      console.error('Error fetching founder weekly data:', error);
      return { commits: [], reports: [] };
    }
  },

  // Get mentor notes for founder
  getMentorNotes: async (founderId: string): Promise<MentorNote[]> => {
    try {
      const { data, error } = await supabase
        .from('mentor_notes')
        .select('*')
        .eq('founder_id', founderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching mentor notes:', error);
      return [];
    }
  },

  // Add mentor note
  addMentorNote: async (founderId: string, note: string): Promise<MentorNote | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('mentor_notes')
        .insert({
          founder_id: founderId,
          mentor_id: user.id,
          mentor_name: user.user_metadata.name || user.email,
          note,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding mentor note:', error);
      return null;
    }
  },

  // Update founder (admin only)
  updateFounder: async (founderId: string, updates: Partial<FounderProfile>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('founder_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', founderId);

      if (error) throw error;

      // Log the action
      await adminService.logAction('founder_updated', `Updated founder ${founderId}`, { founderId, updates });
      return true;
    } catch (error) {
      console.error('Error updating founder:', error);
      return false;
    }
  },

  // Override lock (admin only)
  overrideLock: async (founderId: string, reason: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('founder_profiles')
        .update({
          is_locked: false,
          lock_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', founderId);

      if (error) throw error;

      // Log the action
      await adminService.logAction('lock_overridden', `Override lock for founder ${founderId}`, { founderId, reason });
      return true;
    } catch (error) {
      console.error('Error overriding lock:', error);
      return false;
    }
  },

  // Accept/Reject report
  updateReportStatus: async (
    reportId: string,
    status: 'accepted' | 'rejected',
    rejectionReason?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('weekly_reports')
        .update({
          status,
          rejection_reason: rejectionReason
        })
        .eq('id', reportId);

      if (error) throw error;

      // Log the action
      await adminService.logAction('report_reviewed', `Report ${status}`, { reportId, status, rejectionReason });
      return true;
    } catch (error) {
      console.error('Error updating report status:', error);
      return false;
    }
  },

  // Get cohort analytics
  getCohortAnalytics: async (cohortId?: string): Promise<{
    totalFounders: number;
    active: number;
    underReview: number;
    removed: number;
    excelling: number;
    onTrack: number;
    atRisk: number;
    locked: number;
    avgRevenueGrowth: number;
    totalRevenue: number;
    completionRate: number;
  }> => {
    try {
      const founders = await adminService.getAllFounders(cohortId);

      const stats = {
        totalFounders: founders.length,
        active: founders.filter(f => f.account_status === 'active').length,
        underReview: founders.filter(f => f.account_status === 'under_review').length,
        removed: founders.filter(f => f.account_status === 'removed').length,
        excelling: 0,
        onTrack: 0,
        atRisk: 0,
        locked: founders.filter(f => f.is_locked).length,
        avgRevenueGrowth: 0,
        totalRevenue: 0,
        completionRate: 0
      };

      // Calculate risk levels based on consecutive misses
      founders.forEach(founder => {
        if (founder.consecutive_misses === 0) {
          stats.onTrack++;
        } else if (founder.consecutive_misses === 1) {
          stats.atRisk++;
        } else if (founder.consecutive_misses >= 2) {
          stats.underReview++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting cohort analytics:', error);
      return {
        totalFounders: 0,
        active: 0,
        underReview: 0,
        removed: 0,
        excelling: 0,
        onTrack: 0,
        atRisk: 0,
        locked: 0,
        avgRevenueGrowth: 0,
        totalRevenue: 0,
        completionRate: 0
      };
    }
  },

  // Get revenue analytics for all founders
  getRevenueAnalytics: async (cohortId?: string): Promise<{
    totalRevenue: number;
    avgGrowth: number;
    topPerformers: Array<{ name: string; revenue: number; growth: number }>;
    weeklyTrend: Array<{ week: number; totalRevenue: number }>;
  }> => {
    try {
      const founders = await adminService.getAllFounders(cohortId);

      // Get all reports
      const { data: reports } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('status', 'accepted');

      const totalRevenue = reports?.reduce((sum, r) => sum + r.revenue_generated, 0) || 0;

      return {
        totalRevenue,
        avgGrowth: 0,
        topPerformers: [],
        weeklyTrend: []
      };
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      return {
        totalRevenue: 0,
        avgGrowth: 0,
        topPerformers: [],
        weeklyTrend: []
      };
    }
  },

  // Log admin action
  logAction: async (actionType: string, description: string, metadata?: any): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('audit_logs')
        .insert({
          admin_id: user.id,
          action_type: actionType,
          action_description: description,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  },

  // Get audit logs
  getAuditLogs: async (limit: number = 100): Promise<AuditLog[]> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export const realtimeService = {
  // Subscribe to founder profile changes
  subscribeToProfile: (userId: string, callback: (profile: FounderProfile) => void) => {
    return supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'founder_profiles',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as FounderProfile);
        }
      )
      .subscribe();
  },

  // Subscribe to cohort changes (for admin)
  subscribeToCohort: (cohortId: string, callback: (event: any) => void) => {
    return supabase
      .channel(`cohort:${cohortId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'founder_profiles',
          filter: `cohort_id=eq.${cohortId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to weekly activity
  subscribeToWeeklyActivity: (userId: string, callback: (event: any) => void) => {
    const commitChannel = supabase
      .channel(`commits:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_commits',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    const reportChannel = supabase
      .channel(`reports:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_reports',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return {
      unsubscribe: () => {
        commitChannel.unsubscribe();
        reportChannel.unsubscribe();
      }
    };
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const supabaseUtils = {
  // Check if tables exist and create if needed
  ensureTablesExist: async (): Promise<boolean> => {
    try {
      // Test if tables exist by querying them
      await Promise.all([
        supabase.from('founder_profiles').select('id').limit(1),
        supabase.from('weekly_commits').select('id').limit(1),
        supabase.from('weekly_reports').select('id').limit(1),
        supabase.from('stage_progress').select('id').limit(1)
      ]);
      return true;
    } catch (error) {
      console.error('Tables may not exist:', error);
      return false;
    }
  },

  // Initialize founder profile on signup
  initializeFounderProfile: async (
    userId: string,
    email: string,
    name: string,
    businessName: string,
    baseline30d: number,
    baseline90d: number
  ): Promise<FounderProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('founder_profiles')
        .insert({
          user_id: userId,
          email,
          name,
          business_name: businessName,
          baseline_revenue_30d: baseline30d,
          baseline_revenue_90d: baseline90d,
          current_stage: 1,
          current_week: 1,
          account_status: 'active',
          consecutive_misses: 0,
          subscription_status: 'trial',
          is_locked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Initialize stage progress
      for (let i = 1; i <= 5; i++) {
        await supabase.from('stage_progress').insert({
          user_id: userId,
          stage_number: i,
          status: i === 1 ? 'in_progress' : 'locked',
          requirements_met: false,
          unlocked_at: i === 1 ? new Date().toISOString() : null
        });
      }

      return data;
    } catch (error) {
      console.error('Error initializing founder profile:', error);
      return null;
    }
  }
};

// ============================================
// COHORT MANAGEMENT SERVICE
// ============================================

export const cohortService = {
  // Get all cohorts
  getAllCohorts: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .order('cohort_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cohorts:', error);
      return [];
    }
  },

  // Get active cohort
  getActiveCohort: async (): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active cohort:', error);
      return null;
    }
  },

  // Create cohort
  createCohort: async (cohortData: {
    name: string;
    cohort_number: number;
    start_date: string;
    end_date?: string;
    max_founders?: number;
  }): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .insert(cohortData)
        .select()
        .single();

      if (error) throw error;
      await adminService.logAction('cohort_created', `Created cohort ${cohortData.name}`, cohortData);
      return data;
    } catch (error) {
      console.error('Error creating cohort:', error);
      return null;
    }
  },

  // Update cohort
  updateCohort: async (cohortId: string, updates: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cohorts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', cohortId);

      if (error) throw error;
      await adminService.logAction('cohort_updated', `Updated cohort ${cohortId}`, { cohortId, updates });
      return true;
    } catch (error) {
      console.error('Error updating cohort:', error);
      return false;
    }
  },

  // Assign founder to cohort
  assignFounderToCohort: async (founderId: string, cohortId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('founder_profiles')
        .update({ cohort_id: cohortId })
        .eq('id', founderId);

      if (error) throw error;
      await adminService.logAction('founder_assigned_cohort', `Assigned founder ${founderId} to cohort ${cohortId}`, { founderId, cohortId });
      return true;
    } catch (error) {
      console.error('Error assigning founder to cohort:', error);
      return false;
    }
  },

  // Get cohort statistics
  getCohortStats: async (cohortId: string): Promise<{
    totalFounders: number;
    activeFounders: number;
    avgRevenue: number;
    completionRate: number;
  }> => {
    try {
      const { data: founders } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('cohort_id', cohortId);

      const totalFounders = founders?.length || 0;
      const activeFounders = founders?.filter(f => f.account_status === 'active').length || 0;
      const avgRevenue = founders?.reduce((sum, f) => sum + f.baseline_revenue_30d, 0) / totalFounders || 0;

      return {
        totalFounders,
        activeFounders,
        avgRevenue,
        completionRate: 0 // Calculate based on stage progress
      };
    } catch (error) {
      console.error('Error fetching cohort stats:', error);
      return { totalFounders: 0, activeFounders: 0, avgRevenue: 0, completionRate: 0 };
    }
  }
};

// ============================================
// PERFORMANCE METRICS SERVICE
// ============================================

export const performanceService = {
  // Get founder's performance metrics
  getFounderMetrics: async (founderId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('founder_id', founderId)
        .order('week_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  },

  // Calculate and save weekly metrics
  calculateWeeklyMetrics: async (
    founderId: string,
    weekNumber: number
  ): Promise<any | null> => {
    try {
      // Get the week's commit and report
      const [commitResult, reportResult] = await Promise.all([
        supabase
          .from('weekly_commits')
          .select('*')
          .eq('founder_id', founderId)
          .eq('week_number', weekNumber)
          .single(),
        supabase
          .from('weekly_reports')
          .select('*')
          .eq('founder_id', founderId)
          .eq('week_number', weekNumber)
          .single()
      ]);

      const commit = commitResult.data;
      const report = reportResult.data;

      if (!commit || !report) {
        return null;
      }

      // Calculate metrics
      const dollarPerHour = report.hours_spent > 0 ? report.revenue_generated / report.hours_spent : 0;
      const winRate = commit.target_revenue > 0 ? (report.revenue_generated / commit.target_revenue) * 100 : 0;
      
      // Determine submission timeliness
      let timeliness: 'early' | 'on-time' | 'late' | 'missed' = 'on-time';
      if (report.is_late) timeliness = 'late';
      if (!report.submitted_at) timeliness = 'missed';

      // Calculate velocity score (0-100)
      const velocityScore = Math.min(100, Math.round(winRate));

      // Calculate consistency score based on historical submissions
      const { data: historicalReports } = await supabase
        .from('weekly_reports')
        .select('week_number')
        .eq('founder_id', founderId)
        .lte('week_number', weekNumber);

      const expectedWeeks = weekNumber;
      const actualWeeks = historicalReports?.length || 0;
      const consistencyScore = Math.round((actualWeeks / expectedWeeks) * 100);

      // Determine revenue trend
      const { data: previousReport } = await supabase
        .from('weekly_reports')
        .select('revenue_generated')
        .eq('founder_id', founderId)
        .eq('week_number', weekNumber - 1)
        .single();

      let revenueTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (previousReport) {
        if (report.revenue_generated > previousReport.revenue_generated * 1.1) {
          revenueTrend = 'increasing';
        } else if (report.revenue_generated < previousReport.revenue_generated * 0.9) {
          revenueTrend = 'decreasing';
        }
      }

      // Save metrics
      const { data, error } = await supabase
        .from('performance_metrics')
        .upsert({
          founder_id: founderId,
          week_number: weekNumber,
          dollar_per_hour: dollarPerHour,
          win_rate: winRate,
          velocity_score: velocityScore,
          consistency_score: consistencyScore,
          submission_timeliness: timeliness,
          revenue_trend: revenueTrend,
          calculated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calculating weekly metrics:', error);
      return null;
    }
  },

  // Get aggregate performance stats
  getPerformanceStats: async (founderId: string): Promise<{
    avgDollarPerHour: number;
    avgWinRate: number;
    avgVelocity: number;
    consistencyScore: number;
    trend: string;
  }> => {
    try {
      const { data: metrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('founder_id', founderId);

      if (!metrics || metrics.length === 0) {
        return {
          avgDollarPerHour: 0,
          avgWinRate: 0,
          avgVelocity: 0,
          consistencyScore: 0,
          trend: 'stable'
        };
      }

      const avgDollarPerHour = metrics.reduce((sum, m) => sum + (m.dollar_per_hour || 0), 0) / metrics.length;
      const avgWinRate = metrics.reduce((sum, m) => sum + (m.win_rate || 0), 0) / metrics.length;
      const avgVelocity = metrics.reduce((sum, m) => sum + (m.velocity_score || 0), 0) / metrics.length;
      const latestMetric = metrics[0];

      return {
        avgDollarPerHour,
        avgWinRate,
        avgVelocity,
        consistencyScore: latestMetric.consistency_score || 0,
        trend: latestMetric.revenue_trend || 'stable'
      };
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      return {
        avgDollarPerHour: 0,
        avgWinRate: 0,
        avgVelocity: 0,
        consistencyScore: 0,
        trend: 'stable'
      };
    }
  }
};

// ============================================
// EVIDENCE & FILE UPLOAD SERVICE
// ============================================

export const evidenceService = {
  // Upload evidence file
  uploadEvidence: async (
    file: File,
    founderId: string,
    submissionType: 'commit' | 'report' | 'adjustment' | 'profile',
    submissionId?: string,
    description?: string
  ): Promise<any | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${founderId}/${submissionType}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save file record to database
      const { data, error } = await supabase
        .from('evidence_files')
        .insert({
          founder_id: founderId,
          submission_id: submissionId,
          submission_type: submissionType,
          file_path: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_bucket: 'evidence',
          description,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading evidence:', error);
      return null;
    }
  },

  // Get evidence files for a submission
  getEvidenceFiles: async (
    founderId: string,
    submissionType?: string,
    submissionId?: string
  ): Promise<any[]> => {
    try {
      let query = supabase
        .from('evidence_files')
        .select('*')
        .eq('founder_id', founderId)
        .order('uploaded_at', { ascending: false });

      if (submissionType) {
        query = query.eq('submission_type', submissionType);
      }
      if (submissionId) {
        query = query.eq('submission_id', submissionId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get signed URLs for each file
      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from('evidence')
            .createSignedUrl(file.file_path, 3600); // 1 hour expiry

          return {
            ...file,
            signed_url: urlData?.signedUrl
          };
        })
      );

      return filesWithUrls;
    } catch (error) {
      console.error('Error fetching evidence files:', error);
      return [];
    }
  },

  // Delete evidence file
  deleteEvidence: async (fileId: string): Promise<boolean> => {
    try {
      // Get file record
      const { data: file } = await supabase
        .from('evidence_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (!file) throw new Error('File not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('evidence')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error } = await supabase
        .from('evidence_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting evidence:', error);
      return false;
    }
  }
};

// ============================================
// NOTIFICATION SERVICE
// ============================================

export const notificationService = {
  // Get all notification templates
  getAllTemplates: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      return [];
    }
  },

  // Create notification template
  createTemplate: async (template: {
    name: string;
    subject: string;
    body: string;
    category?: string;
  }): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification template:', error);
      return null;
    }
  },

  // Send notification
  sendNotification: async (
    recipientIds: string[],
    templateId: string,
    templateData?: Record<string, any>
  ): Promise<boolean> => {
    try {
      // Get template
      const { data: template } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (!template) throw new Error('Template not found');

      // Get recipient details
      const { data: users } = await supabase
        .from('founder_profiles')
        .select('id, email, name, user_id')
        .in('user_id', recipientIds);

      if (!users) throw new Error('No recipients found');

      // Replace template variables
      const replaceVariables = (text: string, data: Record<string, any>) => {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
      };

      // Create notification history records
      const notifications = users.map(user => ({
        recipient_id: user.user_id,
        recipient_email: user.email,
        template_id: templateId,
        subject: replaceVariables(template.subject, { name: user.name, ...templateData }),
        body: replaceVariables(template.body, { name: user.name, ...templateData }),
        type: 'email',
        status: 'pending',
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('notification_history')
        .insert(notifications);

      if (error) throw error;

      // TODO: Integrate with actual email service (SendGrid, Postmark, etc.)
      // For now, just mark as sent
      await supabase
        .from('notification_history')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .in('recipient_id', recipientIds);

      await adminService.logAction('notification_sent', `Sent notification to ${users.length} recipients`, {
        templateId,
        recipientCount: users.length
      });

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  },

  // Get notification history
  getNotificationHistory: async (userId?: string, limit: number = 50): Promise<any[]> => {
    try {
      let query = supabase
        .from('notification_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('recipient_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notification history:', error);
      return [];
    }
  },

  // Update template
  updateTemplate: async (templateId: string, updates: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .update(updates)
        .eq('id', templateId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      return false;
    }
  },

  // Delete template
  deleteTemplate: async (templateId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }
};

// ============================================
// PAYMENT & SUBSCRIPTION SERVICE
// ============================================

export const paymentService = {
  // Create payment transaction
  createTransaction: async (transaction: {
    founder_id: string;
    transaction_ref: string;
    gateway: 'paystack' | 'flutterwave' | 'manual';
    amount: number;
    payment_type: string;
    subscription_duration?: number;
  }): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          ...transaction,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      await adminService.logAction('payment_initiated', `Payment initiated for ${transaction.amount}`, transaction);
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  },

  // Update transaction status
  updateTransactionStatus: async (
    transactionId: string,
    status: 'success' | 'failed' | 'cancelled',
    gatewayResponse?: any
  ): Promise<boolean> => {
    try {
      const updates: any = {
        status,
        gateway_response: gatewayResponse
      };

      if (status === 'success') {
        updates.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payment_transactions')
        .update(updates)
        .eq('id', transactionId);

      if (error) throw error;

      // If successful, update subscription
      if (status === 'success') {
        const { data: transaction } = await supabase
          .from('payment_transactions')
          .select('*, founder_id, subscription_duration')
          .eq('id', transactionId)
          .single();

        if (transaction) {
          await paymentService.updateSubscription(
            transaction.founder_id,
            'paid',
            transaction.subscription_duration || 30
          );
        }
      }

      await adminService.logAction('payment_updated', `Payment ${status}`, { transactionId, status });
      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }
  },

  // Get transaction history
  getTransactionHistory: async (founderId?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (founderId) {
        query = query.eq('founder_id', founderId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  },

  // Update subscription
  updateSubscription: async (
    founderId: string,
    status: 'trial' | 'paid' | 'expired' | 'cancelled',
    durationDays?: number
  ): Promise<boolean> => {
    try {
      const updates: any = {
        subscription_status: status
      };

      if (durationDays) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + durationDays);
        updates.subscription_expiry = expiryDate.toISOString();
      }

      const { error } = await supabase
        .from('founder_profiles')
        .update(updates)
        .eq('id', founderId);

      if (error) throw error;

      // Create subscription history record
      await supabase
        .from('subscription_history')
        .insert({
          founder_id: founderId,
          subscription_status: status,
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      await adminService.logAction('subscription_updated', `Subscription ${status} for founder ${founderId}`, {
        founderId,
        status,
        durationDays
      });

      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  },

  // Get subscription history
  getSubscriptionHistory: async (founderId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('founder_id', founderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      return [];
    }
  },

  // Check expired subscriptions (admin function)
  checkExpiredSubscriptions: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('subscription_status', 'paid')
        .lt('subscription_expiry', new Date().toISOString());

      if (error) throw error;

      // Mark as expired
      if (data && data.length > 0) {
        const founderIds = data.map(f => f.id);
        await supabase
          .from('founder_profiles')
          .update({ subscription_status: 'expired' })
          .in('id', founderIds);
      }

      return data || [];
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
      return [];
    }
  }
};

// ============================================
// DAILY TASKS SERVICE (for Execute page)
// ============================================

export const taskService = {
  // Get tasks for a specific date/week
  getTasksForWeek: async (founderId: string, weekNumber: number): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('founder_id', founderId)
        .eq('week_number', weekNumber)
        .order('task_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Create task
  createTask: async (task: {
    founder_id: string;
    week_number: number;
    task_date: string;
    task_description: string;
  }): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .insert({
          ...task,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // Update task
  updateTask: async (taskId: string, updates: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  },

  // Mark task complete
  completeTask: async (taskId: string, timeSpent: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({
          status: 'completed',
          time_spent: timeSpent,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  },

  // Delete task
  deleteTask: async (taskId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Get task statistics
  getTaskStats: async (founderId: string, weekNumber: number): Promise<{
    total: number;
    completed: number;
    pending: number;
    blocked: number;
    totalHours: number;
    completionRate: number;
  }> => {
    try {
      const tasks = await taskService.getTasksForWeek(founderId, weekNumber);

      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = tasks.filter(t => t.status === 'pending').length;
      const blocked = tasks.filter(t => t.status === 'blocked').length;
      const totalHours = tasks.reduce((sum, t) => sum + (t.time_spent || 0), 0);
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      return {
        total,
        completed,
        pending,
        blocked,
        totalHours,
        completionRate
      };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        blocked: 0,
        totalHours: 0,
        completionRate: 0
      };
    }
  }
};

// ============================================
// MENTOR SESSION SERVICE
// ============================================

export const mentorSessionService = {
  // Schedule session
  scheduleSession: async (session: {
    founder_id: string;
    mentor_id: string;
    session_type: string;
    scheduled_at: string;
    duration_minutes?: number;
    meeting_link?: string;
  }): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('mentor_sessions')
        .insert({
          ...session,
          status: 'scheduled',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      await adminService.logAction('session_scheduled', `Scheduled ${session.session_type} session`, session);
      return data;
    } catch (error) {
      console.error('Error scheduling session:', error);
      return null;
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async (founderId?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('mentor_sessions')
        .select('*, founder:founder_profiles(name, email), mentor:admin_users(name, email)')
        .gte('scheduled_at', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true });

      if (founderId) {
        query = query.eq('founder_id', founderId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      return [];
    }
  },

  // Complete session
  completeSession: async (
    sessionId: string,
    notes?: string,
    actionItems?: string[]
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('mentor_sessions')
        .update({
          status: 'completed',
          notes,
          action_items: actionItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      return false;
    }
  },

  // Cancel session
  cancelSession: async (sessionId: string, reason?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('mentor_sessions')
        .update({
          status: 'cancelled',
          notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling session:', error);
      return false;
    }
  }
};

// ============================================
// WAITLIST SERVICE
// ============================================

export const waitlistService = {
  // Add to waitlist
  addToWaitlist: async (data: {
    email: string;
    name: string;
    business_name?: string;
    phone?: string;
  }): Promise<any | null> => {
    try {
      const { data: waitlistEntry, error } = await supabase
        .from('waitlist')
        .insert({
          ...data,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return waitlistEntry;
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      return null;
    }
  },

  // Get all waitlist entries
  getAllWaitlist: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      return [];
    }
  },

  // Notify waitlist (mark as notified)
  notifyWaitlist: async (waitlistIds: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({
          notified: true,
          notified_at: new Date().toISOString()
        })
        .in('id', waitlistIds);

      if (error) throw error;

      // Create notification records
      await supabase
        .from('waitlist_notifications')
        .insert(
          waitlistIds.map(id => ({
            waitlist_id: id,
            notification_type: 'program_open',
            status: 'sent',
            sent_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }))
        );

      return true;
    } catch (error) {
      console.error('Error notifying waitlist:', error);
      return false;
    }
  },

  // Remove from waitlist
  removeFromWaitlist: async (waitlistId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', waitlistId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from waitlist:', error);
      return false;
    }
  }
};