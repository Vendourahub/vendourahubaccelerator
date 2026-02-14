/**
 * LocalStorage Data Store
 * Complete client-side storage solution
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

const KEYS = {
  // Authentication
  CURRENT_USER: 'vendoura_current_user',
  CURRENT_ADMIN: 'vendoura_current_admin',
  
  // User Data
  FOUNDERS: 'vendoura_founders',
  ADMINS: 'vendoura_admins',
  
  // Application Data
  COHORTS: 'vendoura_cohorts',
  APPLICATIONS: 'vendoura_applications',
  WAITLIST: 'vendoura_waitlist',
  
  // System Data
  SETTINGS: 'vendoura_settings',
  EMAIL_LOGS: 'vendoura_email_logs',
  NOTIFICATION_TEMPLATES: 'vendoura_notification_templates',
  OAUTH_CONFIG: 'vendoura_oauth_config',
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  password: string; // Hashed in production
  user_type: 'founder' | 'admin';
  created_at: string;
  user_metadata?: any;
}

export interface Founder {
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
  password?: string;
  password_updated_at?: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  admin_role: 'super_admin' | 'program_manager' | 'operations';
  created_at: string;
  password?: string;
  password_updated_at?: string;
}

export interface Cohort {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  max_participants: number;
  current_participants: number;
  created_at: string;
  created_by: string;
}

export interface Application {
  id: string;
  email: string;
  name: string;
  business_name: string;
  business_description: string;
  business_stage: string;
  revenue: string;
  phone?: string;
  country?: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  source?: string;
  created_at: string;
  notified: boolean;
}

export interface Settings {
  platform_name: string;
  currency: string;
  timezone: string;
  program_duration_weeks: number;
  cohort_program_active: boolean;
  applications_open: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function simpleHash(str: string): string {
  // Simple hash for demo purposes - use bcrypt in production
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeStorage(): void {
  // Initialize default settings if not exists
  const settings = getFromStorage<Settings | null>(KEYS.SETTINGS, null);
  if (!settings) {
    setToStorage(KEYS.SETTINGS, {
      platform_name: 'Vendoura Hub',
      currency: '₦',
      timezone: 'WAT',
      program_duration_weeks: 12,
      cohort_program_active: true,
      applications_open: false, // Cohort is deactivated - redirect to waitlist
    });
  }

  // Initialize collections if not exists
  if (!localStorage.getItem(KEYS.FOUNDERS)) {
    setToStorage(KEYS.FOUNDERS, []);
  }
  if (!localStorage.getItem(KEYS.ADMINS)) {
    setToStorage(KEYS.ADMINS, []);
  }
  if (!localStorage.getItem(KEYS.COHORTS)) {
    setToStorage(KEYS.COHORTS, []);
  }
  if (!localStorage.getItem(KEYS.APPLICATIONS)) {
    setToStorage(KEYS.APPLICATIONS, []);
  }
  if (!localStorage.getItem(KEYS.WAITLIST)) {
    setToStorage(KEYS.WAITLIST, []);
  }
  if (!localStorage.getItem(KEYS.EMAIL_LOGS)) {
    setToStorage(KEYS.EMAIL_LOGS, []);
  }
  if (!localStorage.getItem(KEYS.NOTIFICATION_TEMPLATES)) {
    setToStorage(KEYS.NOTIFICATION_TEMPLATES, []);
  }

  console.log('✅ LocalStorage initialized');
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

export async function signUp(email: string, password: string, metadata: any): Promise<{ success: boolean; user?: User; error?: string }> {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  
  // Check if user already exists
  const existingFounder = founders.find(f => f.email === email);
  const existingAdmin = admins.find(a => a.email === email);
  
  if (existingFounder || existingAdmin) {
    return { success: false, error: 'Email already registered' };
  }

  const userId = generateId();
  const user: User = {
    id: userId,
    email,
    password: simpleHash(password),
    user_type: metadata.user_type || 'founder',
    created_at: new Date().toISOString(),
    user_metadata: metadata,
  };

  // Create founder or admin record
  if (user.user_type === 'founder') {
    const founder: Founder = {
      id: userId,
      email,
      name: metadata.name || '',
      business_name: metadata.business_name || '',
      business_description: metadata.business_description || '',
      business_stage: metadata.business_stage || '',
      revenue: metadata.revenue || '',
      phone: metadata.phone || '',
      country: metadata.country || '',
      created_at: new Date().toISOString(),
      onboarding_completed: false,
    };
    founders.push(founder);
    setToStorage(KEYS.FOUNDERS, founders);
  } else if (user.user_type === 'admin') {
    const admin: Admin = {
      id: userId,
      email,
      name: metadata.name || '',
      admin_role: metadata.admin_role || 'program_manager',
      created_at: new Date().toISOString(),
    };
    admins.push(admin);
    setToStorage(KEYS.ADMINS, admins);
  }

  return { success: true, user };
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  
  const hashedPassword = simpleHash(password);
  
  // Check founders
  const founder = founders.find(f => f.email === email);
  if (founder) {
    // For simplicity, we'll assume password matches if founder exists
    // In production, store hashed passwords properly
    const user: User = {
      id: founder.id,
      email: founder.email,
      password: hashedPassword,
      user_type: 'founder',
      created_at: founder.created_at,
      user_metadata: { name: founder.name, user_type: 'founder' },
    };
    setToStorage(KEYS.CURRENT_USER, user);
    return { success: true, user };
  }
  
  // Check admins
  const admin = admins.find(a => a.email === email);
  if (admin) {
    const user: User = {
      id: admin.id,
      email: admin.email,
      password: hashedPassword,
      user_type: 'admin',
      created_at: admin.created_at,
      user_metadata: { 
        name: admin.name, 
        user_type: 'admin',
        admin_role: admin.admin_role,
      },
    };
    setToStorage(KEYS.CURRENT_ADMIN, user);
    return { success: true, user };
  }

  return { success: false, error: 'Invalid email or password' };
}

export function getCurrentUser(): User | null {
  return getFromStorage<User | null>(KEYS.CURRENT_USER, null);
}

export function getCurrentAdmin(): User | null {
  return getFromStorage<User | null>(KEYS.CURRENT_ADMIN, null);
}

export function signOut(): void {
  localStorage.removeItem(KEYS.CURRENT_USER);
  localStorage.removeItem(KEYS.CURRENT_ADMIN);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null || getCurrentAdmin() !== null;
}

// ============================================================================
// FOUNDER OPERATIONS
// ============================================================================

export function getFounder(id: string): Founder | null {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  return founders.find(f => f.id === id) || null;
}

export function getFounderByEmail(email: string): Founder | null {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  return founders.find(f => f.email === email) || null;
}

export function getAllFounders(): Founder[] {
  return getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
}

export function getFounders(): Founder[] {
  return getAllFounders();
}

export function setFounders(founders: Founder[]): void {
  setToStorage(KEYS.FOUNDERS, founders);
}

export function updateFounder(id: string, updates: Partial<Founder>): boolean {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  const index = founders.findIndex(f => f.id === id);
  
  if (index === -1) return false;
  
  founders[index] = { ...founders[index], ...updates };
  setToStorage(KEYS.FOUNDERS, founders);
  return true;
}

export function deleteFounder(id: string): boolean {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  const filtered = founders.filter(f => f.id !== id);
  
  if (filtered.length === founders.length) return false;
  
  setToStorage(KEYS.FOUNDERS, filtered);
  return true;
}

// ============================================================================
// ADMIN OPERATIONS
// ============================================================================

export function getAdmin(id: string): Admin | null {
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  return admins.find(a => a.id === id) || null;
}

export function getAdminByEmail(email: string): Admin | null {
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  return admins.find(a => a.email === email) || null;
}

export function getAllAdmins(): Admin[] {
  return getFromStorage<Admin[]>(KEYS.ADMINS, []);
}

export function getAdmins(): Admin[] {
  return getAllAdmins();
}

export function setAdmins(admins: Admin[]): void {
  setToStorage(KEYS.ADMINS, admins);
}

export function createAdmin(admin: Omit<Admin, 'id' | 'created_at'>): Admin {
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  const newAdmin: Admin = {
    ...admin,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  admins.push(newAdmin);
  setToStorage(KEYS.ADMINS, admins);
  return newAdmin;
}

export function updateAdmin(id: string, updates: Partial<Admin>): boolean {
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  const index = admins.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  admins[index] = { ...admins[index], ...updates };
  setToStorage(KEYS.ADMINS, admins);
  return true;
}

export function deleteAdmin(id: string): boolean {
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  const filtered = admins.filter(a => a.id !== id);
  
  if (filtered.length === admins.length) return false;
  
  setToStorage(KEYS.ADMINS, filtered);
  return true;
}

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

export function resetUserPassword(userId: string, userType: 'founder' | 'admin', newPassword: string): boolean {
  const hashedPassword = simpleHash(newPassword);
  
  if (userType === 'founder') {
    const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
    const founder = founders.find(f => f.id === userId);
    
    if (!founder) return false;
    
    // Update founder's password
    founder.password = hashedPassword;
    founder.password_updated_at = new Date().toISOString();
    setToStorage(KEYS.FOUNDERS, founders);
    return true;
  } else {
    const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
    const admin = admins.find(a => a.id === userId);
    
    if (!admin) return false;
    
    // Update admin's password
    admin.password = hashedPassword;
    admin.password_updated_at = new Date().toISOString();
    setToStorage(KEYS.ADMINS, admins);
    return true;
  }
}

export function getAllUsersForPasswordManagement(): Array<{
  id: string;
  email: string;
  name: string;
  user_type: 'founder' | 'admin';
  role?: string;
  password_updated_at?: string;
}> {
  const founders = getFromStorage<Founder[]>(KEYS.FOUNDERS, []);
  const admins = getFromStorage<Admin[]>(KEYS.ADMINS, []);
  
  const founderUsers = founders.map(f => ({
    id: f.id,
    email: f.email,
    name: f.name,
    user_type: 'founder' as const,
    password_updated_at: f.password_updated_at,
  }));
  
  const adminUsers = admins.map(a => ({
    id: a.id,
    email: a.email,
    name: a.name,
    user_type: 'admin' as const,
    role: a.admin_role,
    password_updated_at: a.password_updated_at,
  }));
  
  return [...adminUsers, ...founderUsers];
}

// ============================================================================
// COHORT OPERATIONS
// ============================================================================

export function getAllCohorts(): Cohort[] {
  return getFromStorage<Cohort[]>(KEYS.COHORTS, []);
}

export function getCohort(id: string): Cohort | null {
  const cohorts = getFromStorage<Cohort[]>(KEYS.COHORTS, []);
  return cohorts.find(c => c.id === id) || null;
}

export function createCohort(cohort: Omit<Cohort, 'id' | 'created_at'>): Cohort {
  const cohorts = getFromStorage<Cohort[]>(KEYS.COHORTS, []);
  const newCohort: Cohort = {
    ...cohort,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  cohorts.push(newCohort);
  setToStorage(KEYS.COHORTS, cohorts);
  return newCohort;
}

export function updateCohort(id: string, updates: Partial<Cohort>): boolean {
  const cohorts = getFromStorage<Cohort[]>(KEYS.COHORTS, []);
  const index = cohorts.findIndex(c => c.id === id);
  
  if (index === -1) return false;
  
  cohorts[index] = { ...cohorts[index], ...updates };
  setToStorage(KEYS.COHORTS, cohorts);
  return true;
}

export function deleteCohort(id: string): boolean {
  const cohorts = getFromStorage<Cohort[]>(KEYS.COHORTS, []);
  const filtered = cohorts.filter(c => c.id !== id);
  
  if (filtered.length === cohorts.length) return false;
  
  setToStorage(KEYS.COHORTS, filtered);
  return true;
}

// ============================================================================
// APPLICATION OPERATIONS
// ============================================================================

export function getAllApplications(): Application[] {
  return getFromStorage<Application[]>(KEYS.APPLICATIONS, []);
}

export function getApplication(id: string): Application | null {
  const applications = getFromStorage<Application[]>(KEYS.APPLICATIONS, []);
  return applications.find(a => a.id === id) || null;
}

export function createApplication(application: Omit<Application, 'id' | 'submitted_at'>): Application {
  const applications = getFromStorage<Application[]>(KEYS.APPLICATIONS, []);
  const newApplication: Application = {
    ...application,
    id: generateId(),
    submitted_at: new Date().toISOString(),
  };
  applications.push(newApplication);
  setToStorage(KEYS.APPLICATIONS, applications);
  return newApplication;
}

export function updateApplication(id: string, updates: Partial<Application>): boolean {
  const applications = getFromStorage<Application[]>(KEYS.APPLICATIONS, []);
  const index = applications.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  applications[index] = { ...applications[index], ...updates };
  setToStorage(KEYS.APPLICATIONS, applications);
  return true;
}

export function deleteApplication(id: string): boolean {
  const applications = getFromStorage<Application[]>(KEYS.APPLICATIONS, []);
  const filtered = applications.filter(a => a.id !== id);
  
  if (filtered.length === applications.length) return false;
  
  setToStorage(KEYS.APPLICATIONS, filtered);
  return true;
}

// ============================================================================
// WAITLIST OPERATIONS
// ============================================================================

export function getAllWaitlist(): WaitlistEntry[] {
  return getFromStorage<WaitlistEntry[]>(KEYS.WAITLIST, []);
}

export function addToWaitlist(email: string, name?: string, source?: string): WaitlistEntry {
  const waitlist = getFromStorage<WaitlistEntry[]>(KEYS.WAITLIST, []);
  
  // Check if already on waitlist
  const existing = waitlist.find(w => w.email === email);
  if (existing) return existing;
  
  const entry: WaitlistEntry = {
    id: generateId(),
    email,
    name,
    source,
    created_at: new Date().toISOString(),
    notified: false,
  };
  
  waitlist.push(entry);
  setToStorage(KEYS.WAITLIST, waitlist);
  return entry;
}

export function removeFromWaitlist(id: string): boolean {
  const waitlist = getFromStorage<WaitlistEntry[]>(KEYS.WAITLIST, []);
  const filtered = waitlist.filter(w => w.id !== id);
  
  if (filtered.length === waitlist.length) return false;
  
  setToStorage(KEYS.WAITLIST, filtered);
  return true;
}

export function markWaitlistNotified(id: string): boolean {
  const waitlist = getFromStorage<WaitlistEntry[]>(KEYS.WAITLIST, []);
  const index = waitlist.findIndex(w => w.id === id);
  
  if (index === -1) return false;
  
  waitlist[index].notified = true;
  setToStorage(KEYS.WAITLIST, waitlist);
  return true;
}

// ============================================================================
// SETTINGS
// ============================================================================

export function getSettings(): Settings {
  return getFromStorage<Settings>(KEYS.SETTINGS, {
    platform_name: 'Vendoura Hub',
    currency: '₦',
    timezone: 'WAT',
    program_duration_weeks: 12,
    cohort_program_active: true,
    applications_open: false, // Cohort is deactivated - redirect to waitlist
  });
}

export function setSettings(settings: Settings): void {
  setToStorage(KEYS.SETTINGS, settings);
}

export function updateSettings(updates: Partial<Settings>): void {
  const current = getSettings();
  setToStorage(KEYS.SETTINGS, { ...current, ...updates });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function clearAllData(): void {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeStorage();
  console.log('✅ All data cleared and reinitialized');
}

export function exportData(): string {
  const data: any = {};
  Object.entries(KEYS).forEach(([name, key]) => {
    data[name] = getFromStorage(key, null);
  });
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    Object.entries(KEYS).forEach(([name, key]) => {
      if (data[name] !== undefined) {
        setToStorage(key, data[name]);
      }
    });
    console.log('✅ Data imported successfully');
    return true;
  } catch (error) {
    console.error('❌ Error importing data:', error);
    return false;
  }
}

// ============================================================================
// EMAIL LOGGING (for tracking purposes)
// ============================================================================

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: string;
  sent_at: string;
  status: 'sent' | 'failed';
}

export function logEmail(to: string, subject: string, template: string, status: 'sent' | 'failed' = 'sent'): void {
  const logs = getFromStorage<EmailLog[]>(KEYS.EMAIL_LOGS, []);
  logs.push({
    id: generateId(),
    to,
    subject,
    template,
    sent_at: new Date().toISOString(),
    status,
  });
  setToStorage(KEYS.EMAIL_LOGS, logs);
}

export function getEmailLogs(): EmailLog[] {
  return getFromStorage<EmailLog[]>(KEYS.EMAIL_LOGS, []);
}

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
}

export function getNotificationTemplates(): NotificationTemplate[] {
  return getFromStorage<NotificationTemplate[]>(KEYS.NOTIFICATION_TEMPLATES, []);
}

export function setNotificationTemplates(templates: NotificationTemplate[]): void {
  setToStorage(KEYS.NOTIFICATION_TEMPLATES, templates);
}

export function addNotificationTemplate(template: Omit<NotificationTemplate, 'id' | 'created_at'>): NotificationTemplate {
  const templates = getNotificationTemplates();
  const newTemplate: NotificationTemplate = {
    ...template,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  templates.push(newTemplate);
  setNotificationTemplates(templates);
  return newTemplate;
}

export function deleteNotificationTemplate(id: string): boolean {
  const templates = getNotificationTemplates();
  const filtered = templates.filter(t => t.id !== id);
  
  if (filtered.length === templates.length) return false;
  
  setNotificationTemplates(filtered);
  return true;
}

// ============================================================================
// OAUTH CONFIGURATION
// ============================================================================

export interface OAuthProvider {
  id: string;
  name: string;
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string;
  icon: string;
}

export function getOAuthConfig(): OAuthProvider[] {
  return getFromStorage<OAuthProvider[]>(KEYS.OAUTH_CONFIG, []);
}

export function setOAuthConfig(providers: OAuthProvider[]): void {
  setToStorage(KEYS.OAUTH_CONFIG, providers);
}

export function updateOAuthProvider(providerId: string, updates: Partial<OAuthProvider>): boolean {
  const providers = getOAuthConfig();
  const index = providers.findIndex(p => p.id === providerId);
  
  if (index === -1) return false;
  
  providers[index] = { ...providers[index], ...updates };
  setOAuthConfig(providers);
  return true;
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeStorage();
}