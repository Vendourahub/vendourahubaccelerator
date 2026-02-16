import { Link, useParams } from "react-router";
import { Shield, UserCog, TrendingUp, Eye, AlertTriangle, ArrowLeft, Edit, Lock, User, Mail, Save, Key, EyeOff } from "lucide-react";
import { formatWATDate } from "../../lib/time";
import { getCurrentAdmin, getAllAdmins } from "../../lib/adminAuth";
import { useState, useEffect } from "react";
import React from "react";
import * as storage from "../../lib/localStorage";
import { toast } from "sonner@2.0.3";

export default function AdminDetail() {
  const { id } = useParams();
  const currentAdmin = getCurrentAdmin();
  const [targetAdmin, setTargetAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Account management state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: ''
  });
  
  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Load admin data
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        setLoading(true);
        const allAdmins = await getAllAdmins();
        const admin = allAdmins.find(a => a.id === id);
        
        if (admin) {
          setTargetAdmin(admin);
          setEditFormData({
            name: admin.name,
            email: admin.email
          });
        } else {
          setTargetAdmin(null);
        }
      } catch (error) {
        console.error('Error loading admin:', error);
        setTargetAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadAdmin();
  }, [id]);

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      
      if (!editFormData.name.trim() || !editFormData.email.trim()) {
        toast.error('Name and email are required');
        return;
      }

      // Update the admin using storage API
      const success = storage.updateAdmin(id || '', {
        name: editFormData.name.trim(),
        email: editFormData.email.trim().toLowerCase()
      });

      if (!success) {
        toast.error('Failed to update profile');
        return;
      }

      // Reload admin data
      const updated = storage.getAdmin(id || '');
      setTargetAdmin(updated);
      setIsEditing(false);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResettingPassword(true);

      // Validate passwords
      if (!newPassword || !confirmPassword) {
        toast.error('Please enter both password fields');
        return;
      }

      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Confirm action
      if (!confirm(`Are you sure you want to reset the password for ${targetAdmin.name}?`)) {
        return;
      }

      // Reset password using storage API
      const success = storage.resetUserPassword(id || '', 'admin', newPassword);

      if (!success) {
        toast.error('Failed to reset password');
        return;
      }

      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password reset successfully');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(`Failed to reset password: ${error.message}`);
    } finally {
      setResettingPassword(false);
    }
  };

  const handleToggleAccountLock = async () => {
    try {
      const isCurrentlyLocked = targetAdmin.is_locked || false;
      const action = isCurrentlyLocked ? 'unlock' : 'lock';
      
      if (!confirm(`Are you sure you want to ${action} this admin account? ${!isCurrentlyLocked ? 'They will not be able to log in.' : 'They will be able to log in again.'}`)) {
        return;
      }

      // Update the admin's lock status
      const success = storage.updateAdmin(id || '', {
        is_locked: !isCurrentlyLocked
      });

      if (!success) {
        toast.error(`Failed to ${action} account`);
        return;
      }

      // Reload admin data
      const updated = storage.getAdmin(id || '');
      setTargetAdmin(updated);
      
      toast.success(`Admin account ${action}ed successfully`);
    } catch (error: any) {
      console.error('Error toggling account lock:', error);
      toast.error(`Failed to ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-600">Loading admin details...</div>
        </div>
      </div>
    );
  }

  if (!targetAdmin) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Admin Not Found</h2>
          <p className="text-neutral-600 mb-6">
            The admin you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/admin/accounts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Accounts
          </Link>
        </div>
      </div>
    );
  }

  // Get role-specific icon and color
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          icon: <Shield className="w-5 h-5" />,
          label: 'Super Admin',
          color: 'red',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700'
        };
      case 'program_manager':
        return {
          icon: <UserCog className="w-5 h-5" />,
          label: 'Program Manager',
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700'
        };
      case 'mentor':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          label: 'Mentor',
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700'
        };
      case 'observer':
        return {
          icon: <Eye className="w-5 h-5" />,
          label: 'Observer',
          color: 'purple',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700'
        };
      default:
        return {
          icon: <User className="w-5 h-5" />,
          label: role,
          color: 'neutral',
          bgColor: 'bg-neutral-100',
          textColor: 'text-neutral-700'
        };
    }
  };

  const roleDisplay = getRoleDisplay(targetAdmin.admin_role);
  const isLocked = targetAdmin.is_locked || false;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/admin/accounts"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Accounts
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${roleDisplay.bgColor} flex items-center justify-center ${roleDisplay.textColor}`}>
                {roleDisplay.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{targetAdmin.name}</h1>
                <p className="text-neutral-600 mt-1">{targetAdmin.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${roleDisplay.bgColor} ${roleDisplay.textColor}`}>
                    {roleDisplay.icon}
                    {roleDisplay.label}
                  </span>
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <Lock className="w-3 h-3" />
                      Account Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Admin Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Information */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Account Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditFormData({
                          name: targetAdmin.name,
                          email: targetAdmin.email
                        });
                      }}
                      className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Full Name</div>
                    <div className="text-base font-medium text-neutral-900">{targetAdmin.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Email Address</div>
                    <div className="text-base font-medium text-neutral-900">{targetAdmin.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Role</div>
                    <div className="text-base font-medium text-neutral-900">{roleDisplay.label}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Account Status</div>
                    <div className="text-base font-medium text-neutral-900">
                      {isLocked ? (
                        <span className="text-red-600">Locked</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Created</div>
                    <div className="text-base font-medium text-neutral-900">
                      {targetAdmin.created_at ? formatWATDate(new Date(targetAdmin.created_at)) : 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Management Section */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Account Management</h2>
              
              <div className="space-y-6">
                {/* Password Reset */}
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Key className="w-5 h-5 text-neutral-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">Reset Password</h3>
                      <p className="text-sm text-neutral-600">
                        Set a new password for this admin account. They will use this password to log in.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="Enter new password (min 6 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      onClick={handleResetPassword}
                      disabled={resettingPassword || !newPassword || !confirmPassword}
                      className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resettingPassword ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                  </div>
                </div>

                {/* Account Lock/Unlock */}
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Lock className="w-5 h-5 text-neutral-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {isLocked ? 'Unlock Account' : 'Lock Account'}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {isLocked 
                          ? 'Unlock this account to allow the admin to log in again.'
                          : 'Lock this account to prevent the admin from logging in. They will be immediately signed out.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleAccountLock}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                      isLocked
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isLocked ? 'Unlock Account' : 'Lock Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats & Info */}
          <div className="space-y-6">
            
            {/* Role Permissions */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Role Permissions</h3>
              <div className="space-y-3">
                {targetAdmin.admin_role === 'super_admin' && (
                  <>
                    <PermissionItem label="Manage all users" granted />
                    <PermissionItem label="Export data" granted />
                    <PermissionItem label="Override locks" granted />
                    <PermissionItem label="Manage admins" granted />
                    <PermissionItem label="View all founders" granted />
                  </>
                )}
                {targetAdmin.admin_role === 'program_manager' && (
                  <>
                    <PermissionItem label="Export data" granted />
                    <PermissionItem label="Override locks" granted />
                    <PermissionItem label="Manage subscriptions" granted />
                    <PermissionItem label="View all founders" granted />
                    <PermissionItem label="Manage admins" granted={false} />
                  </>
                )}
                {targetAdmin.admin_role === 'mentor' && (
                  <>
                    <PermissionItem label="View assigned founders" granted />
                    <PermissionItem label="Add mentor notes" granted />
                    <PermissionItem label="Schedule calls" granted />
                    <PermissionItem label="Export data" granted={false} />
                    <PermissionItem label="Manage admins" granted={false} />
                  </>
                )}
                {targetAdmin.admin_role === 'observer' && (
                  <>
                    <PermissionItem label="View all founders" granted />
                    <PermissionItem label="View analytics" granted />
                    <PermissionItem label="Export data" granted={false} />
                    <PermissionItem label="Override locks" granted={false} />
                    <PermissionItem label="Manage admins" granted={false} />
                  </>
                )}
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Account Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-600">Account Status</span>
                  <span className={`text-sm font-medium ${isLocked ? 'text-red-600' : 'text-green-600'}`}>
                    {isLocked ? 'Locked' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-600">2FA Enabled</span>
                  <span className="text-sm font-medium text-neutral-500">Not configured</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-600">Last Login</span>
                  <span className="text-sm font-medium text-neutral-900">Never</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionItem({ label, granted }: { label: string; granted: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${granted ? 'bg-green-500' : 'bg-neutral-300'}`} />
      <span className={`text-sm ${granted ? 'text-neutral-900' : 'text-neutral-400'}`}>
        {label}
      </span>
    </div>
  );
}
