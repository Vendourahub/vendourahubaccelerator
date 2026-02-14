import { useState, useEffect } from 'react';
import { Shield, User, Mail, Check, Edit2, X, Save, Settings, Lock, LogOut } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner@2.0.3';
import { getCurrentAdmin, adminLogout } from '../../lib/adminAuth';
import * as storage from '../../lib/localStorage';

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  admin_role: 'super_admin' | 'program_manager' | 'operations';
  created_at: string;
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      setLoading(true);
      
      // Get current admin from localStorage auth
      const currentAdmin = getCurrentAdmin();
      
      if (!currentAdmin) {
        toast.error('Not authenticated as admin');
        navigate('/admin/login');
        return;
      }

      // Get full admin profile from localStorage
      const adminData = storage.getAdminByEmail(currentAdmin.email);
      
      if (!adminData) {
        toast.error('Admin profile not found');
        navigate('/admin/login');
        return;
      }

      setAdmin(adminData);
      setFormData({
        name: adminData.name || '',
      });
    } catch (error: any) {
      console.error('Error loading admin profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!admin) return;

    try {
      setSaving(true);
      
      // Update admin in localStorage
      const success = storage.updateAdmin(admin.id, {
        name: formData.name,
      });

      if (success) {
        setAdmin({ ...admin, name: formData.name });
        setEditing(false);
        toast.success('Profile updated successfully');
        loadProfile(); // Reload to ensure consistency
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (admin) {
      setFormData({
        name: admin.name,
      });
    }
    setEditing(false);
  };

  const handleSignOut = () => {
    try {
      adminLogout();
      toast.success('Signed out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-neutral-600">Loading profile...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border-2 border-neutral-200 p-8 text-center">
            <Shield className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">No Admin Profile Found</h2>
            <p className="text-neutral-600 mb-6">
              You need to be added as an admin user to access this page.
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleConfig = (role: string) => {
    const configs = {
      super_admin: {
        label: 'Super Admin',
        badgeBg: 'bg-neutral-900',
        badgeText: 'text-white',
      },
      program_manager: {
        label: 'Program Manager',
        badgeBg: 'bg-neutral-700',
        badgeText: 'text-white',
      },
      operations: {
        label: 'Operations',
        badgeBg: 'bg-neutral-500',
        badgeText: 'text-white',
      },
    };
    return configs[role as keyof typeof configs] || configs.operations;
  };

  const roleConfig = getRoleConfig(admin.admin_role);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card with Cover and Avatar */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-40 bg-neutral-900"></div>
          
          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar - Overlapping the cover */}
            <div className="relative -mt-16 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                  <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(admin.name)}
                  </div>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="mb-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Name and Role */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{admin.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${roleConfig.badgeBg} ${roleConfig.badgeText}`}>
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-neutral-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {admin.email}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-1">Admin Role</div>
                <div className="text-xl font-bold capitalize">{admin.admin_role.replace('_', ' ')}</div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-1">Access Level</div>
                <div className="text-xl font-bold">Full</div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-1">Status</div>
                <div className="text-xl font-bold">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Mode Alert */}
        {editing && (
          <div className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-neutral-700" />
              <span className="text-sm text-neutral-700 font-medium">Editing Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-white text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-2 text-sm border border-neutral-300 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-neutral-600" />
                  Profile Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-lg"
                    />
                  ) : (
                    <div className="text-lg font-medium text-neutral-900">{admin.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="text-lg font-medium text-neutral-900">{admin.email}</div>
                  <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Admin Role
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${roleConfig.badgeBg} ${roleConfig.badgeText}`}>
                      {roleConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Role is set by system administrators</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Member Since
                  </label>
                  <div className="text-lg font-medium text-neutral-900">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Settings */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-lg font-bold">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => navigate('/admin/cohort')}
                  className="w-full px-4 py-3 text-left rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-3 text-sm"
                >
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <div className="font-medium">View Dashboard</div>
                    <div className="text-xs text-neutral-600">Go to main panel</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/accounts')}
                  className="w-full px-4 py-3 text-left rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-3 text-sm"
                >
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <div className="font-medium">Manage Admins</div>
                    <div className="text-xs text-neutral-600">View admin team</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-lg font-bold">Settings</h2>
              </div>
              <div className="p-4 space-y-2">
                <div className="px-4 py-3 rounded-lg bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-neutral-600" />
                    <div>
                      <div className="text-sm font-medium">Security</div>
                      <div className="text-xs text-neutral-600">LocalStorage mode</div>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border-2 border-red-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
              </div>
              <div className="p-4">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}