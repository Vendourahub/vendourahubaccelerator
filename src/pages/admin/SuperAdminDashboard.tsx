import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, Database, Settings, Shield, Bell, CreditCard, Lock, Key } from 'lucide-react';
import { Link } from 'react-router';
import * as storage from '../../lib/localStorage';
import { formatCurrency } from '../../lib/currency';

interface DashboardStats {
  totalFounders: number;
  totalAdmins: number;
  activeSubscriptions: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  totalRevenue: number;
  dataSize: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFounders: 0,
    totalAdmins: 0,
    activeSubscriptions: 0,
    systemHealth: 'healthy',
    totalRevenue: 0,
    dataSize: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const founders = storage.getFounders();
    const admins = storage.getAdmins();
    
    // Calculate subscription stats
    const activeSubscriptions = founders.filter(f => {
      if (!f.subscription_expiry) return false;
      const expiryDate = new Date(f.subscription_expiry);
      return expiryDate > new Date();
    }).length;

    // Calculate total revenue (₦150,000 per active subscription)
    const totalRevenue = activeSubscriptions * 150000;

    // Estimate data size
    const dataSize = JSON.stringify(localStorage).length;

    setStats({
      totalFounders: founders.length,
      totalAdmins: admins.length,
      activeSubscriptions,
      systemHealth: activeSubscriptions < founders.length * 0.8 ? 'warning' : 'healthy',
      totalRevenue,
      dataSize
    });
  };

  const quickActions = [
    { icon: Users, label: 'Manage Users', path: '/admin/manageusers', color: 'blue' },
    { icon: Shield, label: 'Admin Accounts', path: '/admin/accounts', color: 'purple' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications', color: 'green' },
    { icon: Database, label: 'Data Tracking', path: '/admin/tracking', color: 'amber' },
    { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions', color: 'indigo' },
    { icon: Lock, label: 'Dev Vault', path: '/admin/vault', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-neutral-600 mt-1">Complete system control and oversight</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${
              stats.systemHealth === 'healthy' 
                ? 'bg-green-100 text-green-700'
                : stats.systemHealth === 'warning'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
            }`}>
              System: {stats.systemHealth === 'healthy' ? '✓ Healthy' : stats.systemHealth === 'warning' ? '⚠ Warning' : '✗ Critical'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Founders"
            value={stats.totalFounders}
            color="blue"
          />
          <StatCard
            icon={Shield}
            label="Total Admins"
            value={stats.totalAdmins}
            color="purple"
          />
          <StatCard
            icon={CreditCard}
            label="Active Subscriptions"
            value={stats.activeSubscriptions}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Monthly Revenue"
            value={formatCurrency(stats.totalRevenue)}
            color="indigo"
            isRevenue
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors`}
              >
                <div className={`p-3 bg-${action.color}-100 rounded-lg`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <span className="text-sm font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-4">System Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Data Storage Used</span>
                <span className="font-bold">{(stats.dataSize / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Total Users (All Types)</span>
                <span className="font-bold">{stats.totalFounders + stats.totalAdmins}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Subscription Rate</span>
                <span className="font-bold">
                  {stats.totalFounders > 0 
                    ? Math.round((stats.activeSubscriptions / stats.totalFounders) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-600">Platform Mode</span>
                <span className="font-bold text-blue-600">LocalStorage</span>
              </div>
            </div>
          </div>

          {/* Access Management */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-4">Access Management</h2>
            <div className="space-y-3">
              <Link
                to="/admin/cohort"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">View Cohort Overview</span>
                </div>
                <span className="text-blue-600">→</span>
              </Link>
              <Link
                to="/admin/analytics"
                className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Revenue Analytics</span>
                </div>
                <span className="text-green-600">→</span>
              </Link>
              <Link
                to="/admin/interventions"
                className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-medium">Manage Interventions</span>
                </div>
                <span className="text-amber-600">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, isRevenue = false }: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  isRevenue?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
      </div>
      <div className="text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-3xl font-bold text-neutral-900">{value}</div>
    </div>
  );
}