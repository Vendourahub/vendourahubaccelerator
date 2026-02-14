import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Edit, Trash2, Lock, Unlock, Mail, Phone, Calendar, Shield, UserCog, Plus, Eye, EyeOff, X, Key, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner@2.0.3';
import * as storage from '../../lib/localStorage';
import { formatWATDate } from '../../lib/time';

interface User {
  id: string;
  email: string;
  name: string;
  user_type: 'founder' | 'admin';
  created_at: string;
  is_locked?: boolean;
  admin_role?: string;
  business_name?: string;
  phone?: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'founder' | 'admin'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterType, users]);

  const loadAllUsers = () => {
    try {
      setLoading(true);
      
      // Load founders
      const founders = storage.getFounders() || [];
      const founderUsers: User[] = founders.map(f => ({
        id: f.id,
        email: f.email,
        name: f.name,
        user_type: 'founder' as const,
        created_at: f.created_at,
        is_locked: f.is_locked,
        business_name: f.business_name,
        phone: f.phone
      }));

      // Load admins
      const admins = storage.getAdmins() || [];
      const adminUsers: User[] = admins.map(a => ({
        id: a.id,
        email: a.email,
        name: a.name,
        user_type: 'admin' as const,
        created_at: a.created_at,
        admin_role: a.admin_role
      }));

      const allUsers = [...founderUsers, ...adminUsers];
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(u => u.user_type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.business_name && u.business_name.toLowerCase().includes(query))
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      if (user.user_type === 'founder') {
        const founders = storage.getFounders();
        const updated = founders.filter(f => f.id !== user.id);
        storage.setFounders(updated);
      } else {
        const admins = storage.getAdmins();
        // Don't allow deleting yourself
        const currentAdmin = storage.getCurrentAdmin();
        if (currentAdmin && currentAdmin.id === user.id) {
          toast.error('Cannot delete your own account');
          return;
        }
        const updated = admins.filter(a => a.id !== user.id);
        storage.setAdmins(updated);
      }

      toast.success(`${user.name} deleted successfully`);
      loadAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleLock = async (user: User) => {
    if (user.user_type !== 'founder') return;

    try {
      const founders = storage.getFounders();
      const updated = founders.map(f =>
        f.id === user.id ? { ...f, is_locked: !f.is_locked } : f
      );
      storage.setFounders(updated);
      
      toast.success(`${user.name} ${user.is_locked ? 'unlocked' : 'locked'} successfully`);
      loadAllUsers();
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Failed to update lock status');
    }
  };

  const handleResetPassword = (user: User) => {
    // This would trigger a password reset email in production
    toast.success(`Password reset link sent to ${user.email}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading users...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold">Manage Users</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Manage all founder and admin accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                {filteredUsers.length} {filterType === 'all' ? 'Total' : filterType === 'founder' ? 'Founders' : 'Admins'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-sm text-neutral-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-neutral-900">{users.length}</div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCog className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-neutral-600 mb-1">Founders</div>
            <div className="text-3xl font-bold text-neutral-900">
              {users.filter(u => u.user_type === 'founder').length}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-sm text-neutral-600 mb-1">Admins</div>
            <div className="text-3xl font-bold text-neutral-900">
              {users.filter(u => u.user_type === 'admin').length}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or business..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'founder', 'admin'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            {user.user_type === 'founder' ? (
                              <Link
                                to={`/admin/founder/${user.id}`}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                {user.name}
                              </Link>
                            ) : (
                              <div className="font-medium text-neutral-900">{user.name}</div>
                            )}
                            {user.business_name && (
                              <div className="text-sm text-neutral-500">{user.business_name}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.user_type === 'founder'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {user.user_type === 'founder' ? <UserCog className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {user.user_type === 'founder' ? 'Founder' : user.admin_role?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-neutral-600">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {formatWATDate(new Date(user.created_at))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.user_type === 'founder' && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_locked
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.is_locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            {user.is_locked ? 'Locked' : 'Active'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.user_type === 'founder' && (
                            <button
                              onClick={() => handleToggleLock(user)}
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                              title={user.is_locked ? 'Unlock' : 'Lock'}
                            >
                              {user.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}