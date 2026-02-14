import { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, Target, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import * as storage from '../../lib/localStorage';
import { formatCurrency } from '../../lib/currency';

interface DashboardStats {
  totalFounders: number;
  onTrack: number;
  atRisk: number;
  removalReview: number;
  totalRevenue: number;
  avgRevenue: number;
}

export default function ObserverDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFounders: 0,
    onTrack: 0,
    atRisk: 0,
    removalReview: 0,
    totalRevenue: 0,
    avgRevenue: 0
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

    const avgRevenue = founders.length > 0 ? totalRevenue / founders.length : 0;

    setStats({
      totalFounders: founders.length,
      onTrack,
      atRisk,
      removalReview,
      totalRevenue,
      avgRevenue
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Observer Dashboard</h1>
              <p className="text-neutral-600 mt-1">Read-only view of cohort performance</p>
            </div>
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Only
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Observer Mode:</strong> You have read-only access to view cohort data. 
              You cannot make changes, send interventions, or manage founder accounts.
            </div>
          </div>
        </div>

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
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-neutral-600 mb-1">Total Cohort Revenue</div>
              <div className="text-3xl font-bold text-neutral-900">{formatCurrency(stats.totalRevenue)}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-1">Average Revenue per Founder</div>
              <div className="text-3xl font-bold text-neutral-900">{formatCurrency(stats.avgRevenue)}</div>
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
              <div className="text-xs text-green-600 mt-2">0 consecutive misses</div>
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
              <div className="text-xs text-amber-600 mt-2">1 consecutive miss</div>
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
              <div className="text-xs text-red-600 mt-2">2+ consecutive misses</div>
            </div>
          </div>
        </div>

        {/* View Cohort Link */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-bold mb-4">Available Views</h2>
          <Link
            to="/admin/cohort"
            className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Cohort Overview</div>
                <div className="text-sm text-blue-700">View all founders and their progress</div>
              </div>
            </div>
            <span className="text-blue-600">→</span>
          </Link>
        </div>

        {/* Limitations Notice */}
        <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-6">
          <h3 className="font-bold text-neutral-900 mb-3">Observer Role Limitations</h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">•</span>
              <span>Cannot modify founder data or send interventions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">•</span>
              <span>Cannot access revenue analytics or detailed reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">•</span>
              <span>Cannot manage subscriptions or notifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">•</span>
              <span>Cannot override locks or make administrative changes</span>
            </li>
          </ul>
        </div>
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
