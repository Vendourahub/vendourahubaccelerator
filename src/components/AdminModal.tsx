import React, { useState } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AdminModal({ isOpen, onClose, title, children, size = "md" }: AdminModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Message Founder Modal
interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderName?: string;
  founderId?: string;
  founder?: any;
  onSend?: (message: { subject: string; body: string; channel: string }) => void;
  onSendMessage?: (message: { subject: string; body: string; channel: string }) => void;
}

export function MessageModal({ isOpen, onClose, founderName, founderId, founder, onSend, onSendMessage }: MessageModalProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("email");

  const handleSend = () => {
    const callback = onSend || onSendMessage;
    if (callback) callback({ subject, body, channel });
    setSubject("");
    setBody("");
    onClose();
  };

  const isBulk = !founderId && !founder;
  const name = founderName || founder?.name;

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={isBulk ? "Message All Founders" : `Message ${name}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Delivery Channel</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="channel" 
                value="email" 
                checked={channel === "email"}
                onChange={(e) => setChannel(e.target.value)}
                className="w-4 h-4"
              />
              <span>Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="channel" 
                value="push" 
                checked={channel === "push"}
                onChange={(e) => setChannel(e.target.value)}
                className="w-4 h-4"
              />
              <span>Push Notification</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="channel" 
                value="both" 
                checked={channel === "both"}
                onChange={(e) => setChannel(e.target.value)}
                className="w-4 h-4"
              />
              <span>Both</span>
            </label>
          </div>
        </div>

        {(channel === "email" || channel === "both") && (
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={isBulk ? "Message to all founders..." : `Message to ${name}...`}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-32"
          />
        </div>

        {isBulk && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              ⚠️ This message will be sent to all founders in the current cohort ({founderId || "12"} founders).
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSend}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            disabled={!body || ((channel === "email" || channel === "both") && !subject)}
          >
            Send Message
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

// Schedule Call Modal
interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderName?: string;
  founderId?: string;
  founder?: any;
  onSchedule?: (details: { date: string; time: string; duration: string; notes: string }) => void;
  onScheduleCall?: (details: { date: string; time: string; duration: string; notes: string }) => void;
}

export function ScheduleCallModal({ isOpen, onClose, founderName, founderId, founder, onSchedule, onScheduleCall }: ScheduleCallModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");

  const handleSchedule = () => {
    const callback = onSchedule || onScheduleCall;
    if (callback) callback({ date, time, duration, notes });
    setDate("");
    setTime("");
    setNotes("");
    onClose();
  };

  const name = founderName || founder?.name;

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Schedule Call with ${name}`}>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time (WAT)</label>
            <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <select 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meeting Notes / Agenda</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What do you want to discuss?"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-24"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            📅 Calendar invite will be sent to {name} via email with Google Meet link.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSchedule}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            disabled={!date || !time}
          >
            Schedule Call
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

// Export Modal
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: string) => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const exportOptions = [
    { id: "snapshot", label: "Snapshot", description: "Current status, locks, revenue" },
    { id: "founderStates", label: "Founder States", description: "Detailed state of each founder" },
    { id: "eventLog", label: "Event Log", description: "All tracked events" },
    { id: "redFlags", label: "Red Flags", description: "System anomalies and risks" },
    { id: "revenueData", label: "Revenue Data", description: "Baseline vs current revenue" },
    { id: "metricsSummary", label: "Metrics Summary", description: "Cohort-level analysis" },
    { id: "masterSpreadsheet", label: "Master Spreadsheet", description: "Complete cohort data" }
  ];

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="space-y-4">
        <p className="text-neutral-600 mb-6">
          Select the type of data you want to export. Data will be downloaded as JSON format.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onExport(option.id);
                onClose();
              }}
              className="p-4 border border-neutral-300 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors text-left"
            >
              <div className="font-medium mb-1">{option.label}</div>
              <div className="text-sm text-neutral-600">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </AdminModal>
  );
}

// Office Hours Modal
interface OfficeHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (details: { date: string; time: string; duration: string; capacity: string }) => void;
}

export function OfficeHoursModal({ isOpen, onClose, onSchedule }: OfficeHoursModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [capacity, setCapacity] = useState("10");

  const handleSchedule = () => {
    onSchedule({ date, time, duration, capacity });
    setDate("");
    setTime("");
    onClose();
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Schedule Office Hours">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time (WAT)</label>
            <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">90 minutes</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Capacity</label>
            <select 
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="5">5 founders</option>
              <option value="10">10 founders</option>
              <option value="15">15 founders</option>
              <option value="20">20 founders</option>
            </select>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            🎯 All founders in the cohort will receive a notification with the signup link.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSchedule}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            disabled={!date || !time}
          >
            Schedule Office Hours
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

// Removal Review Modal
interface RemovalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderName?: string;
  founderId?: string;
  founder?: any;
  onDecide?: (decision: "remove" | "continue" | "extend", notes: string) => void;
  onRemovalDecision?: (decision: "remove" | "continue" | "extend", notes: string) => void;
}

export function RemovalReviewModal({ isOpen, onClose, founderName, founderId, founder, onDecide, onRemovalDecision }: RemovalReviewModalProps) {
  const [decision, setDecision] = useState<"remove" | "continue" | "extend" | null>(null);
  const [notes, setNotes] = useState("");

  const handleDecide = () => {
    if (decision) {
      const callback = onDecide || onRemovalDecision;
      if (callback) callback(decision, notes);
      setDecision(null);
      setNotes("");
      onClose();
    }
  };

  const name = founderName || founder?.name;

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Removal Review: ${name}`}>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900 font-medium">
            ⚠️ This founder is flagged for removal review due to performance concerns.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Decision</label>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="decision" 
                value="continue"
                checked={decision === "continue"}
                onChange={() => setDecision("continue")}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">Continue in Program</div>
                <div className="text-sm text-neutral-600">Founder gets to continue with accountability reset</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="decision" 
                value="extend"
                checked={decision === "extend"}
                onChange={() => setDecision("extend")}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">Extend Trial Period</div>
                <div className="text-sm text-neutral-600">Give 1-2 extra weeks to demonstrate commitment</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-red-300 bg-red-50 rounded-lg cursor-pointer hover:border-red-500 transition-colors">
              <input 
                type="radio" 
                name="decision" 
                value="remove"
                checked={decision === "remove"}
                onChange={() => setDecision("remove")}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium text-red-900">Remove from Program</div>
                <div className="text-sm text-red-700">Founder will be removed and notified</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes / Reasoning</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document your reasoning for this decision..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-24"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDecide}
            className={`px-6 py-3 rounded-lg transition-colors ${
              decision === "remove" 
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
            disabled={!decision || !notes}
          >
            Confirm Decision
          </button>
        </div>
      </div>
    </AdminModal>
  );
}