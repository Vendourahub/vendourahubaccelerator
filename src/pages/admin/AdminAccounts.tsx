import { useState, useEffect } from 'react';
import React from 'react';
import { Shield, UserPlus, Trash2, Edit, Eye, Lock, Unlock } from 'lucide-react';
import { Link } from 'react-router';
import { getCurrentAdminSync } from '../../lib/authManager';
import { adminService } from '../../lib/adminService';
import { formatWATDate } from '../../lib/time';
import * as storage from '../../lib/localStorage';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'mentor' | 'observer';
  cohort_access: string[];
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  two_factor_enabled: boolean;
  created_at: string;
}

export default function AdminAccounts() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAdmins();

      // Map admin data to expected format
      const mappedAdmins = data.map(admin => ({
        id: admin.id,
        user_id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.admin_role as 'super_admin' | 'mentor' | 'observer',
        cohort_access: [],
        status: 'active' as const,
        last_login: undefined,
        two_factor_enabled: false,
        created_at: admin.created_at
      }));

      setAdmins(mappedAdmins);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    // Note: In localStorage mode, we can't toggle status easily
    // This feature is not implemented yet
    alert('Status toggle is not available in localStorage mode');
  };

  const deleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Remove admin access for ${email}?`)) return;

    try {
      const result = await deleteAdminInAuth(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      alert('Admin removed');
      loadAdmins();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      alert(error.message || 'Failed to remove admin');
    }
  };

  const addAdmin = async (data: { user_id: string; email: string; name: string; role: string }) => {
    try {
      // In localStorage mode, we create admin directly
      const result = await createAdminInAuth(
        data.email,
        'admin123', // Default password
        data.name,
        data.role as 'super_admin' | 'program_manager' | 'operations'
      );

      if (!result.success) {
        alert(result.error || 'Failed to add admin');
        return;
      }

      alert('Admin added successfully! Default password: admin123');
      setShowAddModal(false);
      loadAdmins();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      alert(error.message || 'Failed to add admin');
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    return matchesRole && matchesStatus;
  });

  const stats = {
    total: admins.length,
    superAdmins: admins.filter(a => a.role === 'super_admin').length,
    mentors: admins.filter(a => a.role === 'mentor').length,
    observers: admins.filter(a => a.role === 'observer').length,
    active: admins.filter(a => a.status === 'active').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading admin accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Accounts</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Manage admin team access and permissions
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatCard label="Total Admins" value={stats.total} color="blue" />
          <StatCard label="Super Admins" value={stats.superAdmins} color="red" />
          <StatCard label="Mentors" value={stats.mentors} color="green" />
          <StatCard label="Observers" value={stats.observers} color="purple" />
          <StatCard label="Active" value={stats.active} color="green" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="mentor">Mentor</option>
              <option value="observer">Observer</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Admin</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Role</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-neutral-700">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Last Login</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-neutral-700">2FA</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map(admin => (
                    <tr key={admin.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-medium text-sm">{admin.name}</div>
                        <div className="text-xs text-neutral-600">{admin.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <RoleBadge role={admin.role} />
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <StatusBadge status={admin.status} />
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600">
                        {admin.last_login 
                          ? formatWATDate(new Date(admin.last_login))
                          : 'Never'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        {admin.two_factor_enabled ? (
                          <Lock className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <Unlock className="w-4 h-4 text-neutral-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/admindetail/${admin.id}`}
                            className="p-2 hover:bg-neutral-100 rounded transition-colors"
                            title="View profile"
                          >
                            <Eye className="w-4 h-4 text-neutral-600" />
                          </Link>
                          <button
                            onClick={() => toggleStatus(admin.id, admin.status)}
                            className="p-2 hover:bg-neutral-100 rounded transition-colors"
                            title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {admin.status === 'active' ? (
                              <Lock className="w-4 h-4 text-neutral-600" />
                            ) : (
                              <Unlock className="w-4 h-4 text-neutral-600" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteAdmin(admin.id, admin.email)}
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Remove admin"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-bold mb-4">Role Permissions</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Super Admin</div>
              <div className="text-sm text-neutral-600">Full access - Can manage all settings, users, and data</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Mentor</div>
              <div className="text-sm text-neutral-600">Can view founders, send interventions, and track progress</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Observer</div>
              <div className="text-sm text-neutral-600">Read-only access - Can view data but cannot make changes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onAdd={addAdmin}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: {
  label: string;
  value: number;
  color: 'blue' | 'red' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Shield className="w-5 h-5" />
        </div>
      </div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{value}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config = {
    super_admin: { label: 'Super Admin', bg: 'bg-red-100', text: 'text-red-700' },
    mentor: { label: 'Mentor', bg: 'bg-green-100', text: 'text-green-700' },
    observer: { label: 'Observer', bg: 'bg-purple-100', text: 'text-purple-700' }
  };

  const { label, bg, text } = config[role as keyof typeof config] || config.observer;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
    inactive: { label: 'Inactive', bg: 'bg-neutral-100', text: 'text-neutral-700' },
    suspended: { label: 'Suspended', bg: 'bg-red-100', text: 'text-red-700' }
  };

  const { label, bg, text } = config[status as keyof typeof config] || config.inactive;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function AddAdminModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
    name: '',
    role: 'observer'
  });

  // Load existing founders from localStorage
  useEffect(() => {
    const founders = storage.getAllFounders();
    const admins = storage.getAllAdmins();
    
    // Combine founders and admins into one list
    const allUsers = [
      ...founders.map(f => ({
        id: f.id,
        email: f.email,
        name: f.name || f.business_name || '',
        type: 'founder' as const
      })),
      ...admins.map(a => ({
        id: a.id,
        email: a.email,
        name: a.name,
        type: 'admin' as const,
        role: a.admin_role
      }))
    ];
    
    setExistingUsers(allUsers);
  }, []);

  // When a user is selected from dropdown, auto-fill the form
  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    
    if (userId === 'new') {
      // Clear form for manual entry
      setFormData({
        user_id: '',
        email: '',
        name: '',
        role: 'observer'
      });
    } else {
      const user = existingUsers.find(u => u.id === userId);
      if (user) {
        setFormData({
          user_id: user.id,
          email: user.email,
          name: user.name || user.businessName || '',
          role: 'observer'
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Grant Admin Privileges</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">📋 Instructions:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Select an existing user from the dropdown to grant them admin access</li>
            <li>Or choose "Create New Admin" to manually enter details</li>
            <li>Select the appropriate role based on their responsibilities</li>
            <li>Click "Add Admin" to grant privileges (default password: admin123)</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Select User <span className="text-red-600">*</span>
            </label>
            <select
              value={selectedUser}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="">-- Choose a registered user --</option>
              
              {/* Founders Group */}
              {existingUsers.filter(u => u.type === 'founder').length > 0 && (
                <optgroup label="👤 Registered Founders">
                  {existingUsers
                    .filter(u => u.type === 'founder')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </optgroup>
              )}
              
              {/* Admins Group */}
              {existingUsers.filter(u => u.type === 'admin').length > 0 && (
                <optgroup label="🛡️ Existing Admin Accounts">
                  {existingUsers
                    .filter(u => u.type === 'admin')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role}
                      </option>
                    ))}
                </optgroup>
              )}
              
              <option value="new">➕ Create New Admin (Manual Entry)</option>
            </select>
            {existingUsers.length === 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                No available users found. You can create a new admin manually.
              </p>
            )}
          </div>

          {/* Only show manual fields if "Create New" is selected or a user is selected */}
          {(selectedUser === 'new' || selectedUser !== '') && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="mentor@vendoura.com"
                  disabled={selectedUser !== 'new' && selectedUser !== ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="John Mentor"
                  disabled={selectedUser !== 'new' && selectedUser !== ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Admin Role <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="observer">Observer (View only)</option>
                  <option value="mentor">Mentor (Can view & assist)</option>
                  <option value="super_admin">Super Admin (Full access)</option>
                </select>
              </div>

              {selectedUser === 'new' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800">
                    <strong>Note:</strong> Creating a new admin will generate a new account with email <strong>{formData.email || '(not set)'}</strong> and default password <strong>admin123</strong>. They should change this password immediately after first login.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedUser}
              className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Grant Admin Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}