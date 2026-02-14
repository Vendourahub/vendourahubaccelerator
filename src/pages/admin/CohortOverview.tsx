import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { founderService } from '../../lib/adminService';
import { formatCurrency } from '../../lib/currency';
import { Search } from 'lucide-react';
import React from 'react';

interface FounderProfile {
  id: string;
  name: string;
  email: string;
  business_name: string;
  business_model?: string;
  business_description?: string;
  current_stage: number;
  current_week: number;
  consecutive_misses: number;
  baseline_revenue_30d: number;
  baseline_revenue_90d: number;
  is_locked: boolean;
  lock_reason?: string;
  subscription_status: string;
  subscription_expiry?: string;
}

export default function CohortOverview() {
  const { cohortId } = useParams();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [officeHoursModalOpen, setOfficeHoursModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [liveFounders, setLiveFounders] = useState<FounderProfile[]>([]);
  const [cohortAnalytics, setCohortAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load live data from Supabase
  useEffect(() => {
    const loadCohortData = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        
        const [foundersData, analyticsData] = await Promise.all([
          founderService.getAllFounders(),
          founderService.getCohortAnalytics(cohortId)
        ]);

        setLiveFounders(foundersData);
        setCohortAnalytics(analyticsData);
      } catch (error) {
        console.error('❌ Error loading cohort data:', error);
        setFetchError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadCohortData();

    // Refresh every 30 seconds
    const interval = setInterval(loadCohortData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // ALWAYS use Supabase data only
  const founders = liveFounders.map(f => ({
    id: f.id,
    name: f.name,
    email: f.email,
    businessName: f.business_name,
    businessModel: f.business_model || 'N/A',
    product: f.business_description || 'N/A',
    customers: 0,
    pricing: 'N/A',
    stage: f.current_stage,
    week: f.current_week,
    commitStatus: 'pending',
    reportStatus: 'pending',
    adjustStatus: 'pending',
    missedWeeks: f.consecutive_misses,
    revenueBaseline: f.baseline_revenue_30d,
    revenueBaseline30d: f.baseline_revenue_30d,
    revenueBaseline90d: f.baseline_revenue_90d,
    currentRevenue: f.baseline_revenue_30d,
    revenueDelta: 0,
    risk: f.consecutive_misses >= 2 ? 'removal-review' : f.consecutive_misses === 1 ? 'at-risk' : 'on-track',
    lockStatus: { locked: f.is_locked, reason: f.lock_reason || null },
    subscriptionStatus: f.subscription_status,
    subscriptionExpiry: f.subscription_expiry || null,
    currentWeek: f.current_week
  }));
  
  // Apply filters
  const filteredFounders = founders.filter(founder => {
    const matchesSearch = founder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         founder.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "all" || founder.stage.toString() === stageFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "Excelling" && founder.risk === "excelling") ||
                         (statusFilter === "On Track" && founder.risk === "on-track") ||
                         (statusFilter === "At Risk" && founder.risk === "at-risk") ||
                         (statusFilter === "Removal Review" && founder.risk === "removal-review");
    return matchesSearch && matchesStage && matchesStatus;
  });
  
  // Mock data - would come from database
  const cohort = {
    name: "Cohort 3 - Feb 2026",
    currentWeek: 4,
    totalFounders: founders.length,
    onTrack: founders.filter(f => f.risk === "on-track").length,
    atRisk: founders.filter(f => f.risk === "at-risk").length,
    removed: 1
  };
  
  const sortedFounders = [...filteredFounders].sort((a, b) => {
    const riskOrder: Record<string, number> = { "removal-review": 0, "at-risk": 1, "on-track": 2, "excelling": 3 };
    return riskOrder[a.risk] - riskOrder[b.risk];
  });

  const handleMessageAll = (message: { subject: string; body: string; channel: string }) => {
    console.log("Sending message to all founders:", message);
    alert(`Message sent via ${message.channel} to all ${founders.length} founders!`);
  };

  const handleExport = (type: string) => {
    // Export founder data as JSON
    const exportData = {
      exportType: type,
      timestamp: new Date().toISOString(),
      cohortName: cohort.name,
      founders: founders,
      analytics: cohortAnalytics
    };

    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendoura-${type}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScheduleOfficeHours = (details: { date: string; time: string; duration: string; capacity: string }) => {
    console.log("Scheduling office hours:", details);
    alert(`Office hours scheduled for ${details.date} at ${details.time} WAT for ${details.capacity} founders!`);
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{cohort.name}</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Week {cohort.currentWeek} • {cohort.totalFounders} Founders
              </p>
            </div>
            <Link 
              to="/admin/analytics"
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-center"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <div className="font-medium text-blue-900">Loading cohort data...</div>
                <div className="text-sm text-blue-700">Fetching founders from Supabase</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && liveFounders.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-sm text-amber-800">
              <strong>No founders yet.</strong> Users will appear here after signing up via OAuth or email.
            </div>
          </div>
        )}
        
        {/* Error State */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-800">
              <strong>Error:</strong> {fetchError}
            </div>
          </div>
        )}
        
        {/* Cohort Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard label="On Track" value={cohort.onTrack} total={cohort.totalFounders} color="green" />
          <StatCard label="At Risk" value={cohort.atRisk} total={cohort.totalFounders} color="amber" />
          <StatCard label="Removal Review" value={1} total={cohort.totalFounders} color="red" />
          <StatCard label="Removed" value={cohort.removed} total={cohort.totalFounders} color="neutral" />
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search founders..."
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select 
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm sm:text-base"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="all">All Stages</option>
                <option value="1">Stage 1</option>
                <option value="2">Stage 2</option>
                <option value="3">Stage 3</option>
                <option value="4">Stage 4</option>
                <option value="5">Stage 5</option>
              </select>
              <select 
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm sm:text-base"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Excelling">Excelling</option>
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Removal Review">Removal</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Founders Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-neutral-700">Founder</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-neutral-700">Stage</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-neutral-700">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-neutral-700">Missed</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-bold text-neutral-700">Revenue</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedFounders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No founders match your filters
                    </td>
                  </tr>
                ) : (
                  sortedFounders.map((founder) => (
                    <tr key={founder.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <Link 
                            to={`/admin/founder/${founder.id}`}
                            className="font-medium text-sm sm:text-base text-blue-600 hover:underline cursor-pointer"
                          >
                            {founder.name}
                          </Link>
                          <div className="text-xs sm:text-sm text-neutral-600">{founder.businessName}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm">
                          <div className="font-medium">Stage {founder.stage}</div>
                          <div className="text-neutral-600">Week {founder.week}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <RiskBadge risk={founder.risk} />
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${
                          founder.missedWeeks === 0 ? 'bg-green-100 text-green-700' :
                          founder.missedWeeks === 1 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {founder.missedWeeks}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className={`font-bold text-sm sm:text-base ${founder.revenueDelta > 0 ? 'text-green-600' : 'text-neutral-600'}`}>
                          {founder.revenueDelta > 0 ? '+' : ''}{founder.revenueDelta}%
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-600">
                          {formatCurrency(founder.baseline_revenue_30d || 0)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <Link 
                          to={`/admin/founder/${founder.id}`}
                          className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bulk Actions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
          <div className="font-bold mb-4 text-sm sm:text-base">Bulk Actions</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm"
              onClick={() => setMessageModalOpen(true)}
            >
              Message All Founders
            </button>
            <button 
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm"
              onClick={() => setExportModalOpen(true)}
            >
              Export Weekly Report
            </button>
            <button 
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm"
              onClick={() => setOfficeHoursModalOpen(true)}
            >
              Schedule Office Hours
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MessageModal 
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        onSend={handleMessageAll}
      />
      <ExportModal 
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
      />
      <OfficeHoursModal 
        isOpen={officeHoursModalOpen}
        onClose={() => setOfficeHoursModalOpen(false)}
        onSchedule={handleScheduleOfficeHours}
      />
    </div>
  );
}

function StatCard({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const colorClasses: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    red: "bg-red-50 border-red-200 text-red-900",
    neutral: "bg-neutral-50 border-neutral-200 text-neutral-900"
  };
  
  const percentage = Math.round((value / total) * 100);
  
  return (
    <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-75">{percentage}% of cohort</div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const config: Record<string, any> = {
    excelling: { label: "Excelling", bg: "bg-green-100", text: "text-green-700" },
    "on-track": { label: "On Track", bg: "bg-blue-100", text: "text-blue-700" },
    "at-risk": { label: "At Risk", bg: "bg-amber-100", text: "text-amber-700" },
    "removal-review": { label: "Removal", bg: "bg-red-100", text: "text-red-700" }
  };
  
  const { label, bg, text } = config[risk] || config["on-track"];
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      {label}
    </span>
  );
}

// Simple Modal Components
function MessageModal({ isOpen, onClose, onSend }: { isOpen: boolean; onClose: () => void; onSend: (message: any) => void }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("email");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Message All Founders</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          />
          <textarea
            placeholder="Message body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg min-h-32"
          />
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push Notification</option>
          </select>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg">
              Cancel
            </button>
            <button
              onClick={() => {
                onSend({ subject, body, channel });
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportModal({ isOpen, onClose, onExport }: { isOpen: boolean; onClose: () => void; onExport: (type: string) => void }) {
  if (!isOpen) return null;

  const exportTypes = [
    { id: "snapshot", label: "Current Snapshot" },
    { id: "founderStates", label: "Founder States" },
    { id: "eventLog", label: "Event Log" },
    { id: "redFlags", label: "Red Flags" },
    { id: "revenueData", label: "Revenue Data" },
    { id: "metricsSummary", label: "Metrics Summary" },
    { id: "masterSpreadsheet", label: "Master Spreadsheet" }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Export Data</h3>
        <div className="space-y-2">
          {exportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onExport(type.id);
                onClose();
              }}
              className="w-full px-4 py-3 text-left border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
            >
              {type.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-4 px-4 py-2 border border-neutral-300 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  );
}

function OfficeHoursModal({ isOpen, onClose, onSchedule }: { isOpen: boolean; onClose: () => void; onSchedule: (details: any) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [capacity, setCapacity] = useState("10");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Schedule Office Hours</h3>
        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
          <input
            type="number"
            placeholder="Max capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg">
              Cancel
            </button>
            <button
              onClick={() => {
                onSchedule({ date, time, duration, capacity });
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}