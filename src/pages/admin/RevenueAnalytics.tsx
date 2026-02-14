import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Calendar, Download } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { adminService } from '../../lib/adminService';

interface FounderProfile {
  id: string;
  name: string;
  email: string;
  business_name: string;
  baseline_revenue_30d: number;
  baseline_revenue_90d: number;
  current_stage: number;
  current_week: number;
}

interface RevenueStats {
  totalRevenue30d: number;
  totalRevenue90d: number;
  avgRevenuePerFounder: number;
  topPerformer: string;
  topPerformerRevenue: number;
  growthRate: number;
}

export default function RevenueAnalytics() {
  const [loading, setLoading] = useState(true);
  const [founders, setFounders] = useState<FounderProfile[]>([]);
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue30d: 0,
    totalRevenue90d: 0,
    avgRevenuePerFounder: 0,
    topPerformer: 'N/A',
    topPerformerRevenue: 0,
    growthRate: 0
  });
  const [timeframe, setTimeframe] = useState<'30d' | '90d'>('30d');

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const foundersData = await adminService.getAllFounders();
      setFounders(foundersData);

      // Calculate stats
      const total30d = foundersData.reduce((sum, f) => sum + f.baseline_revenue_30d, 0);
      const total90d = foundersData.reduce((sum, f) => sum + f.baseline_revenue_90d, 0);
      const avg = foundersData.length > 0 ? total30d / foundersData.length : 0;

      // Find top performer
      const sorted = [...foundersData].sort((a, b) => b.baseline_revenue_30d - a.baseline_revenue_30d);
      const topFounder = sorted[0];

      // Calculate growth rate
      const growth = total90d > 0 ? ((total30d - (total90d / 3)) / (total90d / 3)) * 100 : 0;

      setStats({
        totalRevenue30d: total30d,
        totalRevenue90d: total90d,
        avgRevenuePerFounder: avg,
        topPerformer: topFounder ? topFounder.name : 'N/A',
        topPerformerRevenue: topFounder ? topFounder.baseline_revenue_30d : 0,
        growthRate: growth
      });
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = founders.map(f => ({
      name: f.name,
      business: f.business_name,
      revenue_30d: f.baseline_revenue_30d,
      revenue_90d: f.baseline_revenue_90d,
      stage: f.current_stage,
      week: f.current_week
    }));

    const csv = [
      ['Name', 'Business', 'Revenue (30d)', 'Revenue (90d)', 'Stage', 'Week'].join(','),
      ...data.map(row => [
        row.name,
        row.business,
        row.revenue_30d,
        row.revenue_90d,
        row.stage,
        row.week
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortedByRevenue = [...founders].sort((a, b) => {
    const aRev = timeframe === '30d' ? a.baseline_revenue_30d : a.baseline_revenue_90d;
    const bRev = timeframe === '30d' ? b.baseline_revenue_30d : b.baseline_revenue_90d;
    return bRev - aRev;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading revenue analytics...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold">Revenue Analytics</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Track cohort revenue performance
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={DollarSign}
            label="Total Revenue (30d)"
            value={formatCurrency(stats.totalRevenue30d)}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Growth Rate"
            value={`${stats.growthRate > 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%`}
            color={stats.growthRate >= 0 ? 'green' : 'red'}
          />
          <StatCard
            icon={Users}
            label="Avg per Founder"
            value={formatCurrency(stats.avgRevenuePerFounder)}
            color="blue"
          />
          <StatCard
            icon={BarChart3}
            label="Total Revenue (90d)"
            value={formatCurrency(stats.totalRevenue90d)}
            color="purple"
          />
        </div>

        {/* Top Performer */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800 mb-1">Top Performer</div>
              <div className="text-2xl font-bold text-green-900 mb-1">{stats.topPerformer}</div>
              <div className="text-lg text-green-700">{formatCurrency(stats.topPerformerRevenue)} in last 30 days</div>
            </div>
          </div>
        </div>

        {/* Timeframe Toggle */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">Revenue Breakdown</div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe('30d')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === '30d'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeframe('90d')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === '90d'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>
        </div>

        {/* Revenue Leaderboard */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold">Revenue Leaderboard</h2>
            <p className="text-sm text-neutral-600 mt-1">Ranked by {timeframe === '30d' ? '30-day' : '90-day'} revenue</p>
          </div>
          
          {sortedByRevenue.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              No revenue data available yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Rank</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Founder</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Business</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-neutral-700">Revenue (30d)</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-neutral-700">Revenue (90d)</th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-neutral-700">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByRevenue.map((founder, index) => (
                    <tr key={founder.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-neutral-200 text-neutral-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Link
                          to={`/admin/founder/${founder.id}`}
                          className="font-medium text-sm sm:text-base text-blue-600 hover:underline"
                        >
                          {founder.name}
                        </Link>
                        <div className="text-xs sm:text-sm text-neutral-500">{founder.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">{founder.business_name}</td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="font-bold text-sm sm:text-base text-green-600">
                          {formatCurrency(founder.baseline_revenue_30d)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="font-medium text-sm sm:text-base text-neutral-700">
                          {formatCurrency(founder.baseline_revenue_90d)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          Stage {founder.current_stage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Revenue Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-bold mb-4">Revenue by Stage</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(stage => {
                const stageFounders = founders.filter(f => f.current_stage === stage);
                const stageRevenue = stageFounders.reduce((sum, f) => sum + f.baseline_revenue_30d, 0);
                const percentage = stats.totalRevenue30d > 0 ? (stageRevenue / stats.totalRevenue30d) * 100 : 0;
                
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">Stage {stage}</span>
                      <span className="text-neutral-600">{formatCurrency(stageRevenue)}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {stageFounders.length} founders • {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-bold mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-sm">Average Revenue</div>
                  <div className="text-xs text-neutral-600">
                    {formatCurrency(stats.avgRevenuePerFounder)} per founder
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-sm">Total Cohort</div>
                  <div className="text-xs text-neutral-600">
                    {founders.length} active founders tracking revenue
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-sm">Growth Trend</div>
                  <div className="text-xs text-neutral-600">
                    {stats.growthRate > 0 ? 'Positive' : 'Needs attention'} - {stats.growthRate.toFixed(1)}% rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color: 'green' | 'red' | 'blue' | 'purple';
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{value}</div>
    </div>
  );
}