// Super Admin Control Panel - Updated Feb 2026
import { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';
import { getCurrentAdminSync } from '../../lib/authManager';
import * as storage from '../../lib/localStorage';
import { Shield, Users, Settings, AlertTriangle, Check, X, Plus, Download, Mail, Clock, TrendingUp, CheckCircle, ToggleRight, ToggleLeft, Trash2, UserPlus, Calendar, Activity, Edit } from 'lucide-react';
import React from 'react';
import { AddFounderModal, EditFounderModal } from '../../components/FounderModals';

interface SystemSettings {
  cohort_program_active: boolean;
  current_cohort_name: string;
  current_cohort_week: number;
  // Payment Settings
  paystack_public_key?: string;
  paystack_secret_key?: string;
  flutterwave_public_key?: string;
  flutterwave_secret_key?: string;
  // Email Settings
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  from_email?: string;
  from_name?: string;
  // OAuth Settings
  google_client_id?: string;
  google_client_secret?: string;
  facebook_app_id?: string;
  facebook_app_secret?: string;
  github_client_id?: string;
  github_client_secret?: string;
  oauth_redirect_url?: string;
}

export default function SuperAdminControl() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'founders' | 'waitlist' | 'admins'>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'cohort' | 'payment' | 'email' | 'oauth'>('cohort');
  
  const [settings, setSettings] = useState<SystemSettings>({
    cohort_program_active: true,
    current_cohort_name: 'Cohort 3 - Feb 2026',
    current_cohort_week: 4,
    from_email: 'noreply@vendoura.com',
    from_name: 'Vendoura Hub'
  });
  
  const [founders, setFounders] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [showAddFounderModal, setShowAddFounderModal] = useState(false);
  const [showEditFounderModal, setShowEditFounderModal] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Check admin auth from cached session
      const currentAdmin = getCurrentAdminSync();
      if (!currentAdmin) {
        console.error('❌ No admin session found');
        window.location.href = '/admin/login';
        return;
      }

      console.log('✅ Admin session valid:', {
        email: currentAdmin.email,
        role: currentAdmin.admin_role
      });

      // Load system settings from localStorage
      const settingsData = await adminService.getSystemSettings();
      
      if (settingsData) {
        setSettings(settingsData);
      }

      // Load founders from localStorage
      const foundersData = await adminService.getAllFounders();
      setFounders(foundersData || []);

      // Load waitlist from localStorage
      const waitlistData = storage.getAllWaitlist();
      setWaitlist(waitlistData || []);

      // Load admin users from localStorage
      const adminsData = await adminService.getAllAdmins();
      setAdminUsers(adminsData || []);

      console.log('✅ Data loaded:', {
        settings: settingsData,
        foundersCount: foundersData?.length || 0,
        adminsCount: adminsData?.length || 0,
        waitlistCount: waitlistData?.length || 0
      });
    } catch (error: any) {
      console.error('Error loading data:', error);
      // Allow page to render with defaults
    } finally {
      setLoading(false);
    }
  };

  const toggleCohortProgram = async () => {
    try {
      setSaving(true);
      const newStatus = !settings.cohort_program_active;
      
      await adminService.updateSystemSettings({
        cohort_program_active: newStatus
      });

      setSettings({ ...settings, cohort_program_active: newStatus });
      alert(`Cohort program ${newStatus ? 'activated' : 'deactivated'}!`);
    } catch (error: any) {
      console.error('Error toggling cohort:', error);
      alert(`Failed to toggle cohort program: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveCohortDetails = async () => {
    try {
      setSaving(true);

      await adminService.updateSystemSettings({
        current_cohort_name: settings.current_cohort_name,
        current_cohort_week: settings.current_cohort_week
      });

      alert('Cohort details saved successfully!');
    } catch (error) {
      console.error('Error saving cohort details:', error);
      alert('Failed to save cohort details');
    } finally {
      setSaving(false);
    }
  };

  const toggleFounderStatus = async (founderId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this founder?`)) {
        return;
      }

      await adminService.updateFounder(founderId, {
        account_status: newStatus
      });

      // Reload data
      await loadAllData();
      
      alert(`Founder ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
    } catch (error: any) {
      console.error('Error toggling founder status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const syncUsers = async () => {
    if (!confirm('This will sync all Supabase Auth users to the KV store. Continue?')) {
      return;
    }

    try {
      setSyncing(true);
      console.log('🔄 Starting user sync...');

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Please log in again');
        return;
      }

      // Call sync endpoint
      const response = await fetch(
        `https://knqbtdugvessaehgwwcg.supabase.co/functions/v1/make-server-eddbcb21/admin/sync-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      console.log('✅ Sync completed:', result.summary);

      alert(`Sync completed!\n\n✅ Synced ${result.summary.syncedFounders} founders\n✅ Synced ${result.summary.syncedAdmins} admins\n⏭️ Skipped ${result.summary.skipped} existing users\n${result.summary.errors > 0 ? `❌ ${result.summary.errors} errors` : ''}`);

      // Reload data
      await loadAllData();
    } catch (error: any) {
      console.error('Sync error:', error);
      alert(`Sync failed: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalFounders: founders.length,
    activeFounders: founders.filter(f => f.account_status === 'active').length,
    waitlistCount: waitlist.length,
    adminCount: adminUsers.length
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Control</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">Platform management</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg">
              <Clock className="w-4 h-4 text-neutral-600" />
              <span className="text-sm font-medium">WAT (UTC+1)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'founders', label: 'Founders', icon: Users, count: founders.length },
              { id: 'waitlist', label: 'Waitlist', icon: Mail, count: waitlist.length },
              { id: 'admins', label: 'Admins', icon: Shield, count: adminUsers.length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'text-neutral-900 border-neutral-900'
                      : 'text-neutral-600 border-transparent hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard icon={Users} label="Total Founders" value={stats.totalFounders} color="blue" />
              <StatCard icon={CheckCircle} label="Active" value={stats.activeFounders} color="green" />
              <StatCard icon={Mail} label="Waitlist" value={stats.waitlistCount} color="orange" />
              <StatCard icon={Shield} label="Admins" value={stats.adminCount} color="red" />
            </div>

            {/* Cohort Program Section */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Cohort Program</h2>
                  <p className="text-sm text-neutral-600 mt-0.5">Current cohort configuration</p>
                </div>
                <button
                  onClick={toggleCohortProgram}
                  disabled={saving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${
                    settings.cohort_program_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {settings.cohort_program_active ? (
                    <><ToggleRight className="w-4 h-4" />Active</>
                  ) : (
                    <><ToggleLeft className="w-4 h-4" />Inactive</>
                  )}
                </button>
              </div>

              {/* Cohort Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-6">
                {/* Program Status Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                  <div className={`inline-flex p-3 rounded-lg mb-3 ${
                    settings.cohort_program_active 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-neutral-600 mb-1">Program Status</div>
                  <div className="text-lg font-bold">
                    {settings.cohort_program_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {settings.cohort_program_active 
                      ? 'New users can join' 
                      : 'Users join waitlist'}
                  </div>
                </div>

                {/* Current Cohort Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                  <div className="inline-flex p-3 rounded-lg mb-3 bg-blue-100 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-neutral-600 mb-1">Current Cohort</div>
                  <div className="text-lg font-bold">{settings.current_cohort_name}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {founders.length} founder{founders.length !== 1 ? 's' : ''} enrolled
                  </div>
                </div>

                {/* Current Week Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                  <div className="inline-flex p-3 rounded-lg mb-3 bg-purple-100 text-purple-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-neutral-600 mb-1">Current Week</div>
                  <div className="text-lg font-bold">Week {settings.current_cohort_week}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    of 20 weeks
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Sub-tabs */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex border-b border-neutral-200 overflow-x-auto">
                <button
                  onClick={() => setSettingsTab('cohort')}
                  className={'px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ' + (settingsTab === 'cohort' ? 'text-neutral-900 border-neutral-900 bg-neutral-50' : 'text-neutral-600 border-transparent hover:text-neutral-900')}
                >
                  Cohort Settings
                </button>
                <button
                  onClick={() => setSettingsTab('payment')}
                  className={'px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ' + (settingsTab === 'payment' ? 'text-neutral-900 border-neutral-900 bg-neutral-50' : 'text-neutral-600 border-transparent hover:text-neutral-900')}
                >
                  Payment Gateways
                </button>
                <button
                  onClick={() => setSettingsTab('email')}
                  className={'px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ' + (settingsTab === 'email' ? 'text-neutral-900 border-neutral-900 bg-neutral-50' : 'text-neutral-600 border-transparent hover:text-neutral-900')}
                >
                  Email / SMTP
                </button>
                <button
                  onClick={() => setSettingsTab('oauth')}
                  className={'px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ' + (settingsTab === 'oauth' ? 'text-neutral-900 border-neutral-900 bg-neutral-50' : 'text-neutral-600 border-transparent hover:text-neutral-900')}
                >
                  OAuth Providers
                </button>
              </div>

              {/* Cohort Settings */}
              {settingsTab === 'cohort' && (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Cohort Name
                    </label>
                    <input
                      type="text"
                      value={settings.current_cohort_name}
                      onChange={(e) => setSettings({ ...settings, current_cohort_name: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Current Week
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={settings.current_cohort_week}
                      onChange={(e) => setSettings({ ...settings, current_cohort_week: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <button
                    onClick={saveCohortDetails}
                    disabled={saving}
                    className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Cohort Settings'}
                  </button>
                </div>
              )}

              {/* Payment Settings */}
              {settingsTab === 'payment' && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="font-bold text-lg mb-1">Paystack Configuration</h3>
                      <p className="text-sm text-neutral-600">Configure Paystack payment gateway for Nigerian payments</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Paystack Public Key
                      </label>
                      <input
                        type="text"
                        value={settings.paystack_public_key || ''}
                        onChange={(e) => setSettings({ ...settings, paystack_public_key: e.target.value })}
                        placeholder="pk_live_xxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Paystack Secret Key
                      </label>
                      <input
                        type="password"
                        value={settings.paystack_secret_key || ''}
                        onChange={(e) => setSettings({ ...settings, paystack_secret_key: e.target.value })}
                        placeholder="sk_live_xxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Keep this secret and never share it</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="font-bold text-lg mb-1">Flutterwave Configuration</h3>
                      <p className="text-sm text-neutral-600">Configure Flutterwave payment gateway as an alternative</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Flutterwave Public Key
                      </label>
                      <input
                        type="text"
                        value={settings.flutterwave_public_key || ''}
                        onChange={(e) => setSettings({ ...settings, flutterwave_public_key: e.target.value })}
                        placeholder="FLWPUBK-xxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Flutterwave Secret Key
                      </label>
                      <input
                        type="password"
                        value={settings.flutterwave_secret_key || ''}
                        onChange={(e) => setSettings({ ...settings, flutterwave_secret_key: e.target.value })}
                        placeholder="FLWSECK-xxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Keep this secret and never share it</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="text-sm text-neutral-600">
                      <p className="font-medium mb-1">💡 Configuration Tips:</p>
                      <ul className="text-xs space-y-1 ml-4 list-disc">
                        <li>Get your keys from <a href="https://dashboard.paystack.com" target="_blank" className="text-blue-600 hover:underline">Paystack Dashboard</a></li>
                        <li>Get your keys from <a href="https://dashboard.flutterwave.com" target="_blank" className="text-blue-600 hover:underline">Flutterwave Dashboard</a></li>
                        <li>Use test keys for development, live keys for production</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        setSaving(true);
                        await adminService.updateSystemSettings({
                          paystack_public_key: settings.paystack_public_key,
                          paystack_secret_key: settings.paystack_secret_key,
                          flutterwave_public_key: settings.flutterwave_public_key,
                          flutterwave_secret_key: settings.flutterwave_secret_key,
                        });
                        alert('Payment gateway settings saved successfully!');
                      } catch (error) {
                        console.error('Error saving payment settings:', error);
                        alert('Failed to save payment settings');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="w-full px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Payment Settings'}
                  </button>
                </div>
              )}

              {/* Email / SMTP Settings */}
              {settingsTab === 'email' && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="font-bold text-lg mb-1">Email Configuration</h3>
                      <p className="text-sm text-neutral-600">Configure SMTP settings for sending platform emails</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={settings.from_email || ''}
                          onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                          placeholder="noreply@vendoura.com"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={settings.from_name || ''}
                          onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                          placeholder="Vendoura Hub"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-4 mt-6">
                      <h4 className="font-bold mb-3">SMTP Server Settings</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            value={settings.smtp_host || ''}
                            onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                            placeholder="smtp.gmail.com"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            SMTP Port
                          </label>
                          <input
                            type="number"
                            value={settings.smtp_port || ''}
                            onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) || undefined })}
                            placeholder="587"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          />
                          <p className="text-xs text-neutral-500 mt-1">Common: 587 (TLS) or 465 (SSL)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            SMTP Username
                          </label>
                          <input
                            type="text"
                            value={settings.smtp_username || ''}
                            onChange={(e) => setSettings({ ...settings, smtp_username: e.target.value })}
                            placeholder="your-email@gmail.com"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            SMTP Password
                          </label>
                          <input
                            type="password"
                            value={settings.smtp_password || ''}
                            onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                            placeholder="your-app-password"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          />
                          <p className="text-xs text-neutral-500 mt-1">Use app-specific password for Gmail</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-2">📧 Popular SMTP Providers:</p>
                      <ul className="text-xs space-y-1 ml-4 list-disc">
                        <li><strong>Gmail:</strong> smtp.gmail.com:587 (requires app password)</li>
                        <li><strong>SendGrid:</strong> smtp.sendgrid.net:587</li>
                        <li><strong>Mailgun:</strong> smtp.mailgun.org:587</li>
                        <li><strong>AWS SES:</strong> email-smtp.us-east-1.amazonaws.com:587</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        setSaving(true);
                        await adminService.updateSystemSettings({
                          from_email: settings.from_email,
                          from_name: settings.from_name,
                          smtp_host: settings.smtp_host,
                          smtp_port: settings.smtp_port,
                          smtp_username: settings.smtp_username,
                          smtp_password: settings.smtp_password,
                        });
                        alert('Email/SMTP settings saved successfully!');
                      } catch (error) {
                        console.error('Error saving email settings:', error);
                        alert('Failed to save email settings');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="w-full px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Email Settings'}
                  </button>
                </div>
              )}

              {/* OAuth Settings */}
              {settingsTab === 'oauth' && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="font-bold text-lg mb-1">Google OAuth Configuration</h3>
                      <p className="text-sm text-neutral-600">Configure Google OAuth for user authentication</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Google Client ID
                      </label>
                      <input
                        type="text"
                        value={settings.google_client_id || ''}
                        onChange={(e) => setSettings({ ...settings, google_client_id: e.target.value })}
                        placeholder="1234567890-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Google Client Secret
                      </label>
                      <input
                        type="password"
                        value={settings.google_client_secret || ''}
                        onChange={(e) => setSettings({ ...settings, google_client_secret: e.target.value })}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Keep this secret and never share it</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="font-bold text-lg mb-1">Facebook OAuth Configuration</h3>
                      <p className="text-sm text-neutral-600">Configure Facebook OAuth as an alternative</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Facebook App ID
                      </label>
                      <input
                        type="text"
                        value={settings.facebook_app_id || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_app_id: e.target.value })}
                        placeholder="1234567890"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Facebook App Secret
                      </label>
                      <input
                        type="password"
                        value={settings.facebook_app_secret || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_app_secret: e.target.value })}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Keep this secret and never share it</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="font-bold text-lg mb-1">GitHub OAuth Configuration</h3>
                      <p className="text-sm text-neutral-600">Configure GitHub OAuth as an alternative</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        GitHub Client ID
                      </label>
                      <input
                        type="text"
                        value={settings.github_client_id || ''}
                        onChange={(e) => setSettings({ ...settings, github_client_id: e.target.value })}
                        placeholder="1234567890"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        GitHub Client Secret
                      </label>
                      <input
                        type="password"
                        value={settings.github_client_secret || ''}
                        onChange={(e) => setSettings({ ...settings, github_client_secret: e.target.value })}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Keep this secret and never share it</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="text-sm text-neutral-600">
                      <p className="font-medium mb-1">💡 Configuration Tips:</p>
                      <ul className="text-xs space-y-1 ml-4 list-disc">
                        <li>Get your keys from <a href="https://console.developers.google.com" target="_blank" className="text-blue-600 hover:underline">Google Developers Console</a></li>
                        <li>Get your keys from <a href="https://developers.facebook.com" target="_blank" className="text-blue-600 hover:underline">Facebook Developers</a></li>
                        <li>Get your keys from <a href="https://github.com/settings/developers" target="_blank" className="text-blue-600 hover:underline">GitHub Developers</a></li>
                        <li>Use test keys for development, live keys for production</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        setSaving(true);
                        await adminService.updateSystemSettings({
                          google_client_id: settings.google_client_id,
                          google_client_secret: settings.google_client_secret,
                          facebook_app_id: settings.facebook_app_id,
                          facebook_app_secret: settings.facebook_app_secret,
                          github_client_id: settings.github_client_id,
                          github_client_secret: settings.github_client_secret,
                          oauth_redirect_url: settings.oauth_redirect_url
                        });
                        alert('OAuth provider settings saved successfully!');
                      } catch (error) {
                        console.error('Error saving OAuth settings:', error);
                        alert('Failed to save OAuth settings');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="w-full px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save OAuth Settings'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOUNDERS TAB */}
        {activeTab === 'founders' && (
          <div className="space-y-4">
            {/* Sync Button - Show only if no founders */}
            {founders.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 mb-2">🔄 No founders found in KV store</h3>
                    <p className="text-sm text-blue-800">
                      If you have existing users in Supabase Auth, click the button to sync them to the KV store.
                    </p>
                  </div>
                  <button
                    onClick={syncUsers}
                    disabled={syncing}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
                  >
                    {syncing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Sync Users Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-xl font-bold">All Founders ({founders.length})</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddFounderModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Founder
                  </button>
                  {founders.length > 0 && (
                    <button
                      onClick={syncUsers}
                      disabled={syncing}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 text-sm"
                    >
                      {syncing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-neutral-700 border-t-transparent rounded-full animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Sync Users
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              {founders.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">No founders yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Business</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Stage</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {founders.map(founder => (
                        <tr key={founder.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 font-medium">{founder.name}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{founder.email}</td>
                          <td className="px-6 py-4">{founder.businessName || founder.business_name || 'N/A'}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {founder.currentStage || founder.current_stage || 'Stage 1'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <StatusBadge status={founder.subscriptionStatus || founder.account_status || 'active'} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedFounder(founder);
                                  setShowEditFounderModal(true);
                                }}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                title="Edit founder"
                              >
                                <Edit className="w-4 h-4 text-neutral-600" />
                              </button>
                              <button
                                onClick={() => toggleFounderStatus(founder.id, founder.account_status || 'active')}
                                className={`p-2 rounded-lg transition-colors ${
                                  (founder.account_status || 'active') === 'active'
                                    ? 'hover:bg-green-50 text-green-600'
                                    : 'hover:bg-red-50 text-red-600'
                                }`}
                                title={`${(founder.account_status || 'active') === 'active' ? 'Suspend' : 'Activate'} founder`}
                              >
                                {(founder.account_status || 'active') === 'active' ? (
                                  <ToggleRight className="w-4 h-4" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WAITLIST TAB */}
        {activeTab === 'waitlist' && (
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-xl font-bold">Waitlist ({waitlist.length})</h2>
            </div>
            <div className="p-12 text-center text-neutral-500">No waitlist entries yet</div>
          </div>
        )}

        {/* ADMINS TAB */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h2 className="text-xl font-bold">Admin Users ({adminUsers.length})</h2>
              </div>
              {adminUsers.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">No admin users yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Role</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {adminUsers.map(admin => (
                        <tr key={admin.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 font-medium">{admin.name}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{admin.email}</td>
                          <td className="px-6 py-4">
                            <RoleBadge role={admin.role} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <StatusBadge status={admin.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Founder Modal */}
      <AddFounderModal
        isOpen={showAddFounderModal}
        onClose={() => setShowAddFounderModal(false)}
        onSuccess={loadAllData}
      />

      {/* Edit Founder Modal */}
      <EditFounderModal
        isOpen={showEditFounderModal}
        onClose={() => setShowEditFounderModal(false)}
        onSuccess={loadAllData}
        founder={selectedFounder}
      />
    </div>
  );
}

function formatWATDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos'
  }).format(date);
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
      <div className={'inline-flex p-3 rounded-lg mb-3 ' + colorClass}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
    locked: { label: 'Locked', bg: 'bg-red-100', text: 'text-red-700' },
    inactive: { label: 'Inactive', bg: 'bg-neutral-100', text: 'text-neutral-700' },
    suspended: { label: 'Suspended', bg: 'bg-red-100', text: 'text-red-700' }
  };

  const { label, bg, text } = config[status] || config.active;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, any> = {
    super_admin: { label: 'Super Admin', bg: 'bg-red-100', text: 'text-red-700' },
    mentor: { label: 'Mentor', bg: 'bg-green-100', text: 'text-green-700' },
    observer: { label: 'Observer', bg: 'bg-purple-100', text: 'text-purple-700' }
  };

  const { label, bg, text } = config[role] || config.observer;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      {label}
    </span>
  );
}