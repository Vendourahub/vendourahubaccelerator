import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Database, FileText, TrendingUp, Users, Download, Calendar, Search, Filter } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { formatWATDate } from '../../lib/time';
import { adminService } from '../../lib/adminService';

interface WeeklyCommit {
  id: string;
  founder_id: string;
  founder_name: string;
  business_name: string;
  week_number: number;
  activities: string;
  submitted_at: string;
}

interface WeeklyReport {
  id: string;
  founder_id: string;
  founder_name: string;
  business_name: string;
  week_number: number;
  revenue: number;
  wins: string;
  submitted_at: string;
}

export default function DataTracking() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'commits' | 'reports' | 'overview'>('overview');
  const [commits, setCommits] = useState<WeeklyCommit[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [weekFilter, setWeekFilter] = useState('all');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load weekly tracking data from backend
      const data = await adminService.getWeeklyTracking();
      
      // Get all founders to map IDs to names
      const founders = await adminService.getAllFounders();
      const founderMap = new Map(founders.map((f: any) => [f.id, f]));

      // Transform commits data
      const transformedCommits = (data.commits || []).map((c: any) => {
        const founder = founderMap.get(c.founderId);
        return {
          id: c.founderId + '-week' + c.weekNumber,
          founder_id: c.founderId,
          founder_name: founder?.name || 'Unknown',
          business_name: founder?.businessName || 'Unknown Business',
          week_number: c.weekNumber,
          activities: Array.isArray(c.commitments) ? c.commitments.join(', ') : String(c.commitments || ''),
          submitted_at: c.submittedAt
        };
      });

      // Transform reports data
      const transformedReports = (data.reports || []).map((r: any) => {
        const founder = founderMap.get(r.founderId);
        return {
          id: r.founderId + '-week' + r.weekNumber,
          founder_id: r.founderId,
          founder_name: founder?.name || 'Unknown',
          business_name: founder?.businessName || 'Unknown Business',
          week_number: r.weekNumber,
          revenue: r.revenue || 0,
          wins: Array.isArray(r.actions) ? r.actions.join(', ') : String(r.actions || r.evidence || ''),
          submitted_at: r.submittedAt
        };
      });

      setCommits(transformedCommits);
      setReports(transformedReports);
    } catch (error) {
      console.error('Error loading tracking data:', error);
      // Set empty arrays on error
      setCommits([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      commits: commits.map(c => ({
        founder: c.founder_name,
        business: c.business_name,
        week: c.week_number,
        activities: c.activities,
        submitted: c.submitted_at
      })),
      reports: reports.map(r => ({
        founder: r.founder_name,
        business: r.business_name,
        week: r.week_number,
        revenue: r.revenue,
        wins: r.wins,
        submitted: r.submitted_at
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracking-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter data
  const filteredCommits = commits.filter(c => {
    const matchesSearch = c.founder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeek = weekFilter === 'all' || c.week_number.toString() === weekFilter;
    return matchesSearch && matchesWeek;
  });

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.founder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeek = weekFilter === 'all' || r.week_number.toString() === weekFilter;
    return matchesSearch && matchesWeek;
  });

  const stats = {
    totalCommits: commits.length,
    totalReports: reports.length,
    thisWeekCommits: commits.filter(c => c.week_number === 4).length,
    thisWeekReports: reports.filter(r => r.week_number === 4).length,
    totalRevenue: reports.reduce((sum, r) => sum + r.revenue, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading tracking data...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold">Data Tracking</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Monitor all founder submissions
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={FileText}
            label="Total Commits"
            value={stats.totalCommits}
            subtext={`${stats.thisWeekCommits} this week`}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Reports"
            value={stats.totalReports}
            subtext={`${stats.thisWeekReports} this week`}
          />
          <StatCard
            icon={Database}
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtext="From all reports"
          />
          <StatCard
            icon={Users}
            label="Submission Rate"
            value={`${Math.round((stats.thisWeekReports / Math.max(1, stats.totalReports)) * 100)}%`}
            subtext="This week"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="flex border-b border-neutral-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Database },
              { id: 'commits', label: 'Weekly Commits', icon: FileText, count: commits.length },
              { id: 'reports', label: 'Weekly Reports', icon: TrendingUp, count: reports.length }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-neutral-900 border-b-2 border-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filters */}
          {activeTab !== 'overview' && (
            <div className="p-4 sm:p-6 border-b border-neutral-200 bg-neutral-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by founder or business..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                  value={weekFilter}
                  onChange={(e) => setWeekFilter(e.target.value)}
                >
                  <option value="all">All Weeks</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                    <option key={week} value={week.toString()}>Week {week}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-4">Recent Commits</h3>
                    <div className="space-y-3">
                      {commits.slice(0, 5).map(commit => (
                        <div key={commit.id} className="p-4 bg-neutral-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link
                                to={`/admin/founder/${commit.founder_id}`}
                                className="font-medium text-sm text-blue-600 hover:underline"
                              >
                                {commit.founder_name}
                              </Link>
                              <div className="text-xs text-neutral-600">{commit.business_name}</div>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Week {commit.week_number}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500">
                            {formatWATDate(new Date(commit.submitted_at))}
                          </div>
                        </div>
                      ))}
                      {commits.length === 0 && (
                        <p className="text-center text-neutral-500 py-8">No commits yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Recent Reports</h3>
                    <div className="space-y-3">
                      {reports.slice(0, 5).map(report => (
                        <div key={report.id} className="p-4 bg-neutral-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link
                                to={`/admin/founder/${report.founder_id}`}
                                className="font-medium text-sm text-blue-600 hover:underline"
                              >
                                {report.founder_name}
                              </Link>
                              <div className="text-xs text-neutral-600">{report.business_name}</div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              {formatCurrency(report.revenue)}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500">
                            Week {report.week_number} • {formatWATDate(new Date(report.submitted_at))}
                          </div>
                        </div>
                      ))}
                      {reports.length === 0 && (
                        <p className="text-center text-neutral-500 py-8">No reports yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commits' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Founder</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Week</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Activities</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommits.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                          No commits found
                        </td>
                      </tr>
                    ) : (
                      filteredCommits.map(commit => (
                        <tr key={commit.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-sm">{commit.founder_name}</div>
                            <div className="text-xs text-neutral-600">{commit.business_name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Week {commit.week_number}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-neutral-700 line-clamp-2">
                              {commit.activities || 'No activities listed'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-600">
                            {formatWATDate(new Date(commit.submitted_at))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Founder</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Week</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-neutral-700">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Wins</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-700">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                          No reports found
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map(report => (
                        <tr key={report.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-sm">{report.founder_name}</div>
                            <div className="text-xs text-neutral-600">{report.business_name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Week {report.week_number}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="font-bold text-green-600">
                              {formatCurrency(report.revenue)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-neutral-700 line-clamp-2">
                              {report.wins || 'No wins listed'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-600">
                            {formatWATDate(new Date(report.submitted_at))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext }: {
  icon: any;
  label: string;
  value: string | number;
  subtext: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-neutral-100 rounded-lg">
          <Icon className="w-5 h-5 text-neutral-600" />
        </div>
      </div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-xl sm:text-3xl font-bold text-neutral-900 mb-1">{value}</div>
      <div className="text-xs text-neutral-500">{subtext}</div>
    </div>
  );
}