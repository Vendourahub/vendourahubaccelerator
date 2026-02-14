// Application Configuration
// Central place for environment-specific settings

// Determine if we're in production
export const isProduction = 
  window.location.hostname === 'vendoura.com' || 
  window.location.hostname === 'www.vendoura.com';

// Base URLs
export const APP_URL = isProduction 
  ? 'https://vendoura.com' 
  : window.location.origin;

// OAuth Redirect URL - Dynamic based on environment
// For development: use localhost
// For production: use vendoura.com
export const OAUTH_REDIRECT_URL = isProduction 
  ? 'https://vendoura.com/auth/callback' 
  : `${window.location.origin}/auth/callback`;

// API Configuration
export const API_CONFIG = {
  baseUrl: APP_URL,
  timeout: 30000,
};

// Feature Flags
export const FEATURES = {
  enableOAuth: true,
  enableWaitlist: true,
  enableEmailVerification: false, // Set to true when email verification is configured
  enableDebugLogs: !isProduction, // Debug logs only in development
};

// Currency and Timezone
export const LOCALE_CONFIG = {
  currency: 'NGN',
  currencySymbol: '₦',
  timezone: 'Africa/Lagos', // WAT (UTC+1)
  locale: 'en-NG',
};

// Cohort Configuration
export const COHORT_CONFIG = {
  totalWeeks: 12,
  totalStages: 5,
  weeksPerStage: 2.4, // 12 weeks / 5 stages
};

// Deadlines (WAT time)
export const DEADLINES = {
  commit: {
    day: 1, // Monday
    hour: 9, // 9am WAT
  },
  report: {
    day: 5, // Friday
    hour: 18, // 6pm WAT
  },
};

// Logging helper
export const log = {
  info: (...args: any[]) => {
    if (FEATURES.enableDebugLogs) {
      console.log('ℹ️', ...args);
    }
  },
  success: (...args: any[]) => {
    if (FEATURES.enableDebugLogs) {
      console.log('✅', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('❌', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('⚠️', ...args);
  },
  oauth: (...args: any[]) => {
    if (FEATURES.enableDebugLogs) {
      console.log('🔐', ...args);
    }
  },
};

export default {
  isProduction,
  APP_URL,
  OAUTH_REDIRECT_URL,
  API_CONFIG,
  FEATURES,
  LOCALE_CONFIG,
  COHORT_CONFIG,
  DEADLINES,
  log,
};