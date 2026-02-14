import { AlertTriangle, MessageSquare, Phone, UserMinus, CheckCircle, Clock, Info, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import React from 'react';
import { adminService } from '../../lib/adminService';
import { formatWATDate, formatWATTime } from '../../lib/time';
import { formatCurrency } from '../../lib/currency';

interface Intervention {
  id: string;
  founder_id: string;
  founder_name: string;
  business_name: string;
  priority: 'urgent' | 'high' | 'medium';
  reason: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  resolved_at?: string;
}

export default function InterventionPanel() {
  const [loading, setLoading] = useState(true);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [showFlagConditions, setShowFlagConditions] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load founders who need intervention from localStorage
      const founders = await adminService.getAllFounders();
      
      // Filter founders who need intervention
      const needsIntervention = founders.filter(f => 
        f.consecutive_misses >= 1 || f.is_locked
      );

      // Transform to intervention format
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
        created_at: new Date().toISOString().split('T')[0],
        resolved_at: undefined
      }));

      setInterventions(interventionData);
    } catch (error) {
      console.error('Error loading interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessageModal = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setShowMessageModal(true);
  };

  const handleOpenCallModal = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setShowCallModal(true);
  };

  const handleOpenRemovalModal = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setShowRemovalModal(true);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2 };
  const sortedInterventions = [...interventions].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  
  const stats = {
    pending: interventions.filter(i => i.status === "pending").length,
    inProgress: interventions.filter(i => i.status === "in_progress").length,
    resolved: interventions.filter(i => i.status === "resolved").length,
    urgent: interventions.filter(i => i.priority === "urgent").length
  };
  
  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <Link to="/admin/cohort" className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Cohort Overview
      </Link>
      
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Intervention Panel</h1>
            <p className="text-neutral-600 mt-1 text-sm sm:text-base">Auto-flagged founders requiring mentor action</p>
          </div>
          <button
            onClick={() => setShowFlagConditions(!showFlagConditions)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors text-sm font-medium border border-blue-300"
          >
            <Info className="w-4 h-4" />
            Flag Criteria
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard label="Pending" value={stats.pending} color="amber" />
        <StatCard label="In Progress" value={stats.inProgress} color="blue" />
        <StatCard label="Resolved" value={stats.resolved} color="green" />
        <StatCard label="Urgent" value={stats.urgent} color="red" />
      </div>
      
      {/* Interventions Queue */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold mb-6">Intervention Queue</h2>
        
        {sortedInterventions.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No interventions needed. All founders are on track! 🎉
          </div>
        ) : (
          <div className="space-y-4">
            {sortedInterventions.map((intervention) => (
              <InterventionCard 
                key={intervention.id} 
                intervention={intervention}
                onSendMessage={() => handleOpenMessageModal(intervention)}
                onScheduleCall={() => handleOpenCallModal(intervention)}
                onStartRemoval={() => handleOpenRemovalModal(intervention)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showFlagConditions && <FlagConditionsModal onClose={() => setShowFlagConditions(false)} />}
      
      {selectedIntervention && (
        <>
          <MessageModal
            isOpen={showMessageModal}
            onClose={() => {
              setShowMessageModal(false);
              loadData();
            }}
            founderId={selectedIntervention.founder_id}
            founderName={selectedIntervention.founder_name}
          />
          <ScheduleCallModal
            isOpen={showCallModal}
            onClose={() => {
              setShowCallModal(false);
              loadData();
            }}
            founderId={selectedIntervention.founder_id}
            founderName={selectedIntervention.founder_name}
          />
          <RemovalReviewModal
            isOpen={showRemovalModal}
            onClose={() => {
              setShowRemovalModal(false);
              loadData();
            }}
            founderId={selectedIntervention.founder_id}
            founderName={selectedIntervention.founder_name}
          />
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    red: "bg-red-50 border-red-200 text-red-900"
  };
  
  return (
    <div className={`border rounded-xl p-4 sm:p-6 ${colorClasses[color]}`}>
      <div className="text-xs sm:text-sm font-medium mb-2">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
    </div>
  );
}

function InterventionCard({ intervention, onSendMessage, onScheduleCall, onStartRemoval }: {
  intervention: Intervention;
  onSendMessage: () => void;
  onScheduleCall: () => void;
  onStartRemoval: () => void;
}) {
  const priorityConfig: Record<string, any> = {
    urgent: { bg: "bg-red-50", border: "border-red-500", badge: "bg-red-600 text-white", icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" /> },
    high: { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-600 text-white", icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> },
    medium: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-600 text-white", icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" /> }
  };
  
  const config = priorityConfig[intervention.priority];
  
  return (
    <div className={`p-4 sm:p-6 border-2 rounded-lg ${config.bg} ${config.border}`}>
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="text-red-600 flex-shrink-0 mt-1">{config.icon}</div>
          <div className="min-w-0 flex-1">
            <Link
              to={`/admin/founder/${intervention.founder_id}`}
              className="font-bold text-base sm:text-lg truncate text-blue-600 hover:underline"
            >
              {intervention.founder_name}
            </Link>
            <div className="text-xs sm:text-sm text-neutral-600 truncate">{intervention.business_name}</div>
          </div>
        </div>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${config.badge} whitespace-nowrap flex-shrink-0`}>
          {intervention.priority.toUpperCase()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm">
        <div>
          <div className="text-neutral-600">Reason</div>
          <div className="font-bold">{intervention.reason}</div>
        </div>
        <div>
          <div className="text-neutral-600">Flagged Date</div>
          <div className="font-medium">{intervention.created_at}</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          to={`/admin/founder/${intervention.founder_id}`}
          className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-xs sm:text-sm font-medium text-center"
        >
          View Details
        </Link>
        <button
          onClick={onSendMessage}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
          Send Message
        </button>
        <button
          onClick={onScheduleCall}
          className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
        >
          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
          Schedule Call
        </button>
        {intervention.priority === "urgent" && (
          <button
            onClick={onStartRemoval}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Start Removal Review
          </button>
        )}
      </div>
    </div>
  );
}

function HistoryItem({ founder, issue, resolution, date, outcome }: {
  founder: string;
  issue: string;
  resolution: string;
  date: string;
  outcome: 'success' | 'removed' | 'ongoing';
}) {
  const outcomeConfig: Record<string, any> = {
    success: { icon: "✓", color: "text-green-600" },
    removed: { icon: "✗", color: "text-red-600" },
    ongoing: { icon: "⋯", color: "text-blue-600" }
  };
  
  const config = outcomeConfig[outcome] || outcomeConfig.ongoing;
  
  return (
    <div className="p-3 sm:p-4 border border-neutral-200 rounded-lg">
      <div className="flex items-start gap-3">
        <span className={`text-lg sm:text-xl ${config.color} font-bold flex-shrink-0`}>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
            <div className="font-bold truncate">{founder}</div>
            <div className="text-neutral-500 text-xs sm:text-sm">{date}</div>
          </div>
          <div className="text-neutral-700 mb-1 text-xs sm:text-sm"><strong>Issue:</strong> {issue}</div>
          <div className="text-neutral-700 text-xs sm:text-sm"><strong>Resolution:</strong> {resolution}</div>
        </div>
      </div>
    </div>
  );
}

function FlagConditionsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold">🤖 Auto-Flagging Conditions</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Urgent Priority */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="font-bold text-red-900">Urgent Priority</p>
            </div>
            <ul className="space-y-1 text-sm text-red-800 ml-7">
              <li>• 2 consecutive missed weeks (triggers removal review)</li>
              <li>• 3+ total missed weeks in cohort</li>
            </ul>
          </div>

          {/* High Priority */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="font-bold text-amber-900">High Priority</p>
            </div>
            <ul className="space-y-1 text-sm text-amber-800 ml-7">
              <li>• Missed commit deadline (Monday 9am WAT)</li>
              <li>• Missed report deadline (Friday 6pm WAT)</li>
            </ul>
          </div>

          {/* Medium Priority */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <p className="font-bold text-blue-900">Medium Priority</p>
            </div>
            <ul className="space-y-1 text-sm text-blue-800 ml-7">
              <li>• Revenue decline for 2+ consecutive weeks</li>
              <li>• Report submitted without evidence</li>
              <li>• Revenue &lt; 50% of baseline</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageModal({ isOpen, onClose, founderId, founderName }: {
  isOpen: boolean;
  onClose: () => void;
  founderId: string;
  founderName: string;
}) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setSending(true);
    // TODO: Implement send message logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Message sent to ${founderName}`);
    setSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Send Message</h2>
            <p className="text-sm text-neutral-600 mt-1">to {founderName}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="Type your message here..."
          />
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleCallModal({ isOpen, onClose, founderId, founderName }: {
  isOpen: boolean;
  onClose: () => void;
  founderId: string;
  founderName: string;
}) {
  const [callDate, setCallDate] = useState('');
  const [callTime, setCallTime] = useState('');
  const [scheduling, setScheduling] = useState(false);

  if (!isOpen) return null;

  const handleSchedule = async () => {
    setScheduling(true);
    // TODO: Implement schedule call logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Call scheduled with ${founderName} on ${callDate} at ${callTime}`);
    setScheduling(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Schedule Call</h2>
            <p className="text-sm text-neutral-600 mt-1">with {founderName}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={callDate}
              onChange={(e) => setCallDate(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time (WAT)</label>
            <input
              type="time"
              value={callTime}
              onChange={(e) => setCallTime(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={scheduling || !callDate || !callTime}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {scheduling ? 'Scheduling...' : 'Schedule Call'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RemovalReviewModal({ isOpen, onClose, founderId, founderName }: {
  isOpen: boolean;
  onClose: () => void;
  founderId: string;
  founderName: string;
}) {
  const [reason, setReason] = useState('');
  const [starting, setStarting] = useState(false);

  if (!isOpen) return null;

  const handleStart = async () => {
    if (!confirm(`Are you sure you want to start removal review for ${founderName}? This is a serious action.`)) {
      return;
    }
    
    setStarting(true);
    // TODO: Implement removal review logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Removal review started for ${founderName}`);
    setStarting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-red-600">Start Removal Review</h2>
            <p className="text-sm text-neutral-600 mt-1">for {founderName}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            ⚠️ This will mark the founder for potential removal from the cohort. This action should only be taken for founders who have violated program requirements.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Reason for Review</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Document why this founder is being reviewed for removal..."
          />
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={starting || !reason.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {starting ? 'Starting...' : 'Start Review'}
          </button>
        </div>
      </div>
    </div>
  );
}