import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Database, Users, DollarSign, FileText, Clock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { formatWATDate } from '../../lib/time';
import { adminService } from '../../lib/adminService';
import { Link } from 'react-router';

interface FounderProfile {
  id: string;
  name: string;
  email: string;
  business_name: string;
  baseline_revenue_30d: number;
  baseline_revenue_90d: number;
  current_stage: number;
  current_week: number;
  consecutive_misses: number;
  is_locked: boolean;
  account_status: string;
}

interface RevenueStats {
  totalRevenue30d: number;
  totalRevenue90d: number;
  avgRevenuePerFounder: number;
  topPerformer: string;
  topPerformerRevenue: number;
  growthRate: number;
}

interface Intervention {
  id: string;
  founder_id: string;
  founder_name: string;
  business_name: string;
  priority: 'urgent' | 'high' | 'medium';
  reason: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export default function MentorDashboard() {
  const [loading, setLoading] = useState(true);
  const [founders, setFounders] = useState<FounderProfile[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue30d: 0,
    totalRevenue90d: 0,
    avgRevenuePerFounder: 0,
    topPerformer: 'N/A',
    topPerformerRevenue: 0,
    growthRate: 0
  });
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [trackingData, setTrackingData] = useState<{
    totalCommits: number;
    totalReports: number;
    thisWeekCommits: number;
    thisWeekReports: number;
  }>({
    totalCommits: 0,
    totalReports: 0,
    thisWeekCommits: 0,
    thisWeekReports: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load founders
      const foundersData = await adminService.getAllFounders();
      setFounders(foundersData);

      // Calculate revenue stats
      const total30d = foundersData.reduce((sum, f) => sum + f.baseline_revenue_30d, 0);
      const total90d = foundersData.reduce((sum, f) => sum + f.baseline_revenue_90d, 0);
      const avg = foundersData.length > 0 ? total30d / foundersData.length : 0;

      const sorted = [...foundersData].sort((a, b) => b.baseline_revenue_30d - a.baseline_revenue_30d);
      const topFounder = sorted[0];

      const growth = total90d > 0 ? ((total30d - (total90d / 3)) / (total90d / 3)) * 100 : 0;

      setRevenueStats({
        totalRevenue30d: total30d,
        totalRevenue90d: total90d,
        avgRevenuePerFounder: avg,
        topPerformer: topFounder ? topFounder.name : 'N/A',
        topPerformerRevenue: topFounder ? topFounder.baseline_revenue_30d : 0,
        growthRate: growth
      });

      // Calculate interventions
      const needsIntervention = foundersData.filter(f => 
        f.consecutive_misses >= 1 || f.is_locked
      );

      const interventionData: Intervention[] = needsIntervention.map(founder => ({
        id: founder.id,
        founder_id: founder.id,
        founder_name: founder.name,
        business_name: founder.business_name,
        reason: founder.consecutive_misses >= 2 
          ? `${founder.consecutive_misses} consecutive missed weeks`
          : founder.consecutive_misses === 1 
          ? 'Missed deadline'
          : 'Under review',
        priority: founder.consecutive_misses >= 2 ? 'urgent' : founder.consecutive_misses === 1 ? 'high' : 'medium',
        status: founder.is_locked ? 'in_progress' : 'pending',
      }));

      setInterventions(interventionData);

      // Load tracking data
      const tracking = await adminService.getWeeklyTracking();
      setTrackingData({
        totalCommits: tracking.commits?.length || 0,
        totalReports: tracking.reports?.length || 0,
        thisWeekCommits: tracking.commits?.filter((c: any) => c.weekNumber === 4).length || 0,
        thisWeekReports: tracking.reports?.filter((r: any) => r.weekNumber === 4).length || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  const urgentInterventions = interventions.filter(i => i.priority === 'urgent');
  const activeFounders = founders.filter(f => f.account_status === 'active').length;
  const atRiskFounders = founders.filter(f => f.consecutive_misses >= 1).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Mentor Dashboard</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Revenue, tracking, and intervention overview
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg">
              <Clock className="w-4 h-4 text-neutral-600" />
              <span className="text-sm font-medium">WAT (UTC+1)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            icon={Users}
            label="Active Founders"
            value={activeFounders}
            subtext={`${founders.length} total`}
            color="blue"
          />
          <MetricCard
            icon={DollarSign}
            label="Total Revenue"
            value={formatCurrency(revenueStats.totalRevenue30d)}
            subtext="Last 30 days"
            color="green"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Need Intervention"
            value={interventions.length}
            subtext={`${urgentInterventions.length} urgent`}
            color="red"
          />
          <MetricCard
            icon={TrendingUp}
            label="Growth Rate"
            value={`${revenueStats.growthRate > 0 ? '+' : ''}${revenueStats.growthRate.toFixed(1)}%`}
            subtext="vs previous period"
            color="purple"
          />
        </div>

        {/* Revenue Analytics Section */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Revenue Analytics</h2>
                <p className="text-sm text-neutral-600">Cohort revenue performance</p>
              </div>
            </div>
            <Link
              to="/admin/analytics"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Revenue */}
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-sm text-green-800 mb-2">Total Revenue (30d)</div>
                <div className="text-3xl font-bold text-green-900">{formatCurrency(revenueStats.totalRevenue30d)}</div>
              </div>

              {/* Average per Founder */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-800 mb-2">Avg per Founder</div>
                <div className="text-3xl font-bold text-blue-900">{formatCurrency(revenueStats.avgRevenuePerFounder)}</div>
              </div>

              {/* Top Performer */}
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                <div className="text-sm text-yellow-800 mb-2">Top Performer</div>
                <div className="text-lg font-bold text-yellow-900 mb-1">{revenueStats.topPerformer}</div>
                <div className="text-sm text-yellow-700">{formatCurrency(revenueStats.topPerformerRevenue)}</div>
              </div>
            </div>

            {/* Top 5 Founders by Revenue */}
            <div className="mt-6">
              <h3 className="font-bold mb-3">Top Performers</h3>
              <div className="space-y-2">
                {[...founders]
                  .sort((a, b) => b.baseline_revenue_30d - a.baseline_revenue_30d)
                  .slice(0, 5)
                  .map((founder, index) => (
                    <div key={founder.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-neutral-200 text-neutral-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <Link
                            to={`/admin/founder/${founder.id}`}
                            className="font-medium text-sm text-blue-600 hover:underline"
                          >
                            {founder.name}
                          </Link>
                          <div className="text-xs text-neutral-600">{founder.business_name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(founder.baseline_revenue_30d)}</div>
                        <div className="text-xs text-neutral-500">Stage {founder.current_stage}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Tracking Section */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Data Tracking</h2>
                  <p className="text-sm text-neutral-600">Submission monitoring</p>
                </div>
              </div>
              <Link
                to="/admin/tracking"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 space-y-4">
              {/* Tracking Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div className="text-xs text-blue-800">Total Commits</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{trackingData.totalCommits}</div>
                  <div className="text-xs text-blue-600 mt-1">{trackingData.thisWeekCommits} this week</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div className="text-xs text-green-800">Total Reports</div>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{trackingData.totalReports}</div>
                  <div className="text-xs text-green-600 mt-1">{trackingData.thisWeekReports} this week</div>
                </div>
              </div>

              {/* Submission Rate */}
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Submission Rate (This Week)</span>
                  <span className="text-sm font-bold text-neutral-900">
                    {founders.length > 0 ? Math.round((trackingData.thisWeekReports / founders.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all"
                    style={{ width: `${founders.length > 0 ? (trackingData.thisWeekReports / founders.length) * 100 : 0}%` }}
                  />
                </div>
                <div className="text-xs text-neutral-600 mt-2">
                  {trackingData.thisWeekReports} of {founders.length} founders submitted
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">On-time submissions</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {activeFounders - atRiskFounders}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Late/missing</span>
                  <span className="font-medium text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {atRiskFounders}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Intervention Panel Section */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Interventions</h2>
                  <p className="text-sm text-neutral-600">Founders needing attention</p>
                </div>
              </div>
              <Link
                to="/admin/interventions"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6">
              {interventions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="font-medium text-neutral-900 mb-1">All Clear!</div>
                  <div className="text-sm text-neutral-600">No interventions needed at this time</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {interventions.slice(0, 5).map(intervention => {
                    const priorityConfig = {
                      urgent: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
                      high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
                      medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' }
                    };

                    const config = priorityConfig[intervention.priority];

                    return (
                      <div key={intervention.id} className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Link
                              to={`/admin/founder/${intervention.founder_id}`}
                              className="font-medium text-sm text-blue-600 hover:underline"
                            >
                              {intervention.founder_name}
                            </Link>
                            <div className="text-xs text-neutral-600">{intervention.business_name}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${config.badge}`}>
                            {intervention.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className={`text-xs ${config.text}`}>{intervention.reason}</div>
                      </div>
                    );
                  })}

                  {interventions.length > 5 && (
                    <div className="text-center pt-2">
                      <Link
                        to="/admin/interventions"
                        className="text-sm text-neutral-600 hover:text-neutral-900 font-medium"
                      >
                        +{interventions.length - 5} more interventions →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Founder Status Overview */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold">Founder Overview</h2>
            <p className="text-sm text-neutral-600 mt-1">All founders at a glance</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Founder</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Business</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Stage</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-neutral-700">Revenue (30d)</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {founders.slice(0, 10).map(founder => (
                  <tr key={founder.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-3">
                      <Link
                        to={`/admin/founder/${founder.id}`}
                        className="font-medium text-sm text-blue-600 hover:underline"
                      >
                        {founder.name}
                      </Link>
                      <div className="text-xs text-neutral-600">{founder.email}</div>
                    </td>
                    <td className="px-6 py-3 text-sm">{founder.business_name}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        Stage {founder.current_stage}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="font-bold text-green-600">{formatCurrency(founder.baseline_revenue_30d)}</div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {founder.consecutive_misses >= 2 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          Urgent
                        </span>
                      ) : founder.consecutive_misses >= 1 ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          At Risk
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {founders.length > 10 && (
            <div className="px-6 py-4 border-t border-neutral-200 text-center">
              <Link
                to="/admin/cohort"
                className="text-sm text-neutral-600 hover:text-neutral-900 font-medium"
              >
                View all {founders.length} founders →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext, color }: {
  icon: any;
  label: string;
  value: string | number;
  subtext: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
      <div className={`inline-flex p-3 rounded-lg mb-3 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-xl sm:text-3xl font-bold text-neutral-900 mb-1">{value}</div>
      <div className="text-xs text-neutral-500">{subtext}</div>
    </div>
  );
}
