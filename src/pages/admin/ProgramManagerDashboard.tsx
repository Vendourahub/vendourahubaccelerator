import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, Target, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router';
import * as storage from '../../lib/localStorage';
import { formatCurrency } from '../../lib/currency';

interface DashboardStats {
  totalFounders: number;
  onTrack: number;
  atRisk: number;
  removalReview: number;
  totalRevenue: number;
  activeSubscriptions: number;
  avgRevenueGrowth: number;
}

export default function ProgramManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFounders: 0,
    onTrack: 0,
    atRisk: 0,
    removalReview: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    avgRevenueGrowth: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const founders = storage.getFounders();
    
    // Calculate risk categories
    const onTrack = founders.filter(f => f.consecutive_misses === 0).length;
    const atRisk = founders.filter(f => f.consecutive_misses === 1).length;
    const removalReview = founders.filter(f => f.consecutive_misses >= 2).length;

    // Calculate total revenue
    const totalRevenue = founders.reduce((sum, f) => {
      const revenue = f.baseline_revenue_30d || 0;
      return sum + revenue;
    }, 0);

    // Calculate active subscriptions
    const activeSubscriptions = founders.filter(f => {
      if (!f.subscription_expiry) return false;
      const expiryDate = new Date(f.subscription_expiry);
      return expiryDate > new Date();
    }).length;

    // Calculate average revenue growth (simplified)
    const avgRevenueGrowth = founders.length > 0 
      ? founders.reduce((sum, f) => sum + ((f.baseline_revenue_30d || 0) * 0.1), 0) / founders.length
      : 0;

    setStats({
      totalFounders: founders.length,
      onTrack,
      atRisk,
      removalReview,
      totalRevenue,
      activeSubscriptions,
      avgRevenueGrowth
    });
  };

  const quickActions = [
    { icon: Users, label: 'Cohort Overview', path: '/admin/cohort', color: 'blue' },
    { icon: TrendingUp, label: 'Revenue Analytics', path: '/admin/analytics', color: 'green' },
    { icon: AlertTriangle, label: 'Interventions', path: '/admin/interventions', color: 'amber' },
    { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Program Manager Dashboard</h1>
              <p className="text-neutral-600 mt-1">Manage cohort performance and revenue growth</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${
              stats.removalReview > 0 
                ? 'bg-red-100 text-red-700'
                : stats.atRisk > 0
                ? 'bg-amber-100 text-amber-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {stats.removalReview > 0 ? `${stats.removalReview} Need Intervention` : stats.atRisk > 0 ? `${stats.atRisk} At Risk` : '✓ All On Track'}
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
            icon={CheckCircle}
            label="On Track"
            value={stats.onTrack}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="At Risk"
            value={stats.atRisk}
            color="amber"
          />
          <StatCard
            icon={XCircle}
            label="Removal Review"
            value={stats.removalReview}
            color="red"
          />
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Total Cohort Revenue</div>
                <div className="text-3xl font-bold text-neutral-900">{formatCurrency(stats.totalRevenue)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Active Subscriptions</div>
                  <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Avg Growth Rate</div>
                  <div className="text-2xl font-bold text-blue-600">+10%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-bold mb-4">Cohort Performance Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-900">On Track</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.onTrack}</div>
              <div className="text-sm text-green-700 mt-1">
                {stats.totalFounders > 0 ? Math.round((stats.onTrack / stats.totalFounders) * 100) : 0}% of cohort
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-amber-900">At Risk</span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600">{stats.atRisk}</div>
              <div className="text-sm text-amber-700 mt-1">
                {stats.totalFounders > 0 ? Math.round((stats.atRisk / stats.totalFounders) * 100) : 0}% of cohort
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-red-900">Removal Review</span>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.removalReview}</div>
              <div className="text-sm text-red-700 mt-1">
                {stats.totalFounders > 0 ? Math.round((stats.removalReview / stats.totalFounders) * 100) : 0}% of cohort
              </div>
            </div>
          </div>
        </div>

        {/* Action Needed Alert */}
        {stats.removalReview > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-red-900 mb-1">Immediate Action Required</div>
                <div className="text-sm text-red-800 mb-3">
                  {stats.removalReview} founder{stats.removalReview > 1 ? 's are' : ' is'} under removal review with 2+ consecutive misses. 
                  Review and decide on intervention or removal.
                </div>
                <Link
                  to="/admin/interventions"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  View Interventions
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
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
