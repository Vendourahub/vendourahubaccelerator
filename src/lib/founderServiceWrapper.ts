/**
 * Founder Service Wrapper - LocalStorage Mode
 * Adapts founderService to work with localStorage authentication
 */

import { founderService, WeeklyCommit, WeeklyReport, FounderProfile } from './founderService';
import { getCurrentUser } from './auth';
import * as storage from './localStorage';

// Storage keys for founder data
const KEYS = {
  WEEKLY_COMMITS: 'vendoura_weekly_commits',
  WEEKLY_REPORTS: 'vendoura_weekly_reports',
};

// Initialize storage if needed
function initStorage() {
  if (!localStorage.getItem(KEYS.WEEKLY_COMMITS)) {
    localStorage.setItem(KEYS.WEEKLY_COMMITS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.WEEKLY_REPORTS)) {
    localStorage.setItem(KEYS.WEEKLY_REPORTS, JSON.stringify([]));
  }
}

// Get all commits from localStorage
function getAllCommits(): WeeklyCommit[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.WEEKLY_COMMITS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading commits from localStorage:', error);
    return [];
  }
}

// Save all commits to localStorage
function saveAllCommits(commits: WeeklyCommit[]): void {
  try {
    localStorage.setItem(KEYS.WEEKLY_COMMITS, JSON.stringify(commits));
  } catch (error) {
    console.error('Error saving commits to localStorage:', error);
  }
}

// Get all reports from localStorage
function getAllReports(): WeeklyReport[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.WEEKLY_REPORTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading reports from localStorage:', error);
    return [];
  }
}

// Save all reports to localStorage
function saveAllReports(reports: WeeklyReport[]): void {
  try {
    localStorage.setItem(KEYS.WEEKLY_REPORTS, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving reports to localStorage:', error);
  }
}

/**
 * Wrapped founder service that works with localStorage mode
 */
export const wrappedFounderService = {
  // Get current founder's profile
  getMyProfile: async (): Promise<FounderProfile | null> => {
    try {
      const user = getCurrentUser();
      if (!user || user.user_type !== 'founder') {
        return null;
      }

      // Get founder from localStorage
      const founder = storage.getFounder(user.id);
      if (!founder) {
        return null;
      }

      // Map localStorage founder to FounderProfile format
      return {
        id: founder.id,
        email: founder.email,
        name: founder.name,
        business_name: founder.business_name,
        business_description: founder.business_description,
        business_stage: founder.business_stage,
        revenue: founder.revenue,
        phone: founder.phone,
        country: founder.country,
        created_at: founder.created_at,
        onboarding_completed: founder.onboarding_completed,
        onboarding_completed_at: founder.onboarding_completed_at,
        current_stage: founder.current_stage,
        current_week: founder.current_week,
        cohort_id: founder.cohort_id,
        is_locked: founder.is_locked,
        lock_reason: founder.lock_reason,
      };
    } catch (error) {
      console.error('Error getting founder profile:', error);
      return null;
    }
  },

  // Get founder's weekly commits
  getMyCommits: async (): Promise<WeeklyCommit[]> => {
    try {
      const user = getCurrentUser();
      if (!user || user.user_type !== 'founder') {
        return [];
      }

      const allCommits = getAllCommits();
      return allCommits
        .filter(c => c.founder_id === user.id)
        .sort((a, b) => b.week_number - a.week_number);
    } catch (error) {
      console.error('Error getting commits:', error);
      return [];
    }
  },

  // Submit a new weekly commit
  submitCommit: async (commitData: Omit<WeeklyCommit, 'id' | 'founder_id' | 'submitted_at'>): Promise<WeeklyCommit | null> => {
    try {
      const user = getCurrentUser();
      if (!user || user.user_type !== 'founder') {
        throw new Error('Not authenticated as founder');
      }

      const allCommits = getAllCommits();
      
      // Check if commit already exists for this week
      const existingCommit = allCommits.find(
        c => c.founder_id === user.id && c.week_number === commitData.week_number
      );

      if (existingCommit) {
        // Update existing commit
        existingCommit.action_description = commitData.action_description;
        existingCommit.target_revenue = commitData.target_revenue;
        existingCommit.completion_date = commitData.completion_date;
        existingCommit.deadline = commitData.deadline;
        existingCommit.is_late = commitData.is_late;
        existingCommit.status = commitData.status;
        saveAllCommits(allCommits);
        return existingCommit;
      }

      // Create new commit
      const newCommit: WeeklyCommit = {
        id: `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        founder_id: user.id,
        submitted_at: new Date().toISOString(),
        ...commitData,
      };

      allCommits.push(newCommit);
      saveAllCommits(allCommits);
      return newCommit;
    } catch (error) {
      console.error('Error submitting commit:', error);
      return null;
    }
  },

  // Get founder's weekly reports
  getMyReports: async (): Promise<WeeklyReport[]> => {
    try {
      const user = getCurrentUser();
      if (!user || user.user_type !== 'founder') {
        return [];
      }

      const allReports = getAllReports();
      return allReports
        .filter(r => r.founder_id === user.id)
        .sort((a, b) => b.week_number - a.week_number);
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  },

  // Submit a weekly report
  submitReport: async (reportData: Omit<WeeklyReport, 'id' | 'founder_id' | 'submitted_at'>): Promise<WeeklyReport | null> => {
    try {
      const user = getCurrentUser();
      if (!user || user.user_type !== 'founder') {
        throw new Error('Not authenticated as founder');
      }

      const allReports = getAllReports();
      
      // Check if report already exists
      const existingReport = allReports.find(
        r => r.founder_id === user.id && r.week_number === reportData.week_number
      );

      if (existingReport) {
        // Update existing report
        Object.assign(existingReport, {
          ...reportData,
          submitted_at: new Date().toISOString(),
        });
        saveAllReports(allReports);
        return existingReport;
      }

      // Create new report
      const newReport: WeeklyReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        founder_id: user.id,
        submitted_at: new Date().toISOString(),
        ...reportData,
      };

      allReports.push(newReport);
      saveAllReports(allReports);
      return newReport;
    } catch (error) {
      console.error('Error submitting report:', error);
      return null;
    }
  },
};
