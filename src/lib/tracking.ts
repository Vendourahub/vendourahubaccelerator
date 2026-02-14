// Data tracking utility for monitoring system health and founder progress
// Captures all events, flags anomalies, and provides export functionality

import { formatWATDateTime } from "./time";

export interface TrackingEvent {
  id: string;
  timestamp: Date;
  type: string;
  founderId: string;
  founderName: string;
  data: any;
  flagged?: boolean;
  flagReason?: string;
}

export interface RedFlag {
  id: string;
  timestamp: Date;
  type: string;
  severity: "critical" | "high" | "medium";
  founderId?: string;
  founderName?: string;
  description: string;
  action: string;
  resolved: boolean;
}

// Event types for tracking
export const EVENT_TYPES = {
  COMMIT_SUBMITTED: "commit_submitted",
  COMMIT_LATE: "commit_late",
  COMMIT_MISSED: "commit_missed",
  REPORT_SUBMITTED: "report_submitted",
  REPORT_LATE: "report_late",
  REPORT_MISSED: "report_missed",
  EVIDENCE_UPLOADED: "evidence_uploaded",
  EVIDENCE_INVALID: "evidence_invalid",
  LOCK_TRIGGERED: "lock_triggered",
  LOCK_BYPASSED: "lock_bypassed",
  NOTIFICATION_SENT: "notification_sent",
  NOTIFICATION_FAILED: "notification_failed",
  STATE_CHANGED: "state_changed",
  DROPOUT: "dropout"
};

// Red flag detection rules
export function detectRedFlags(events: TrackingEvent[]): RedFlag[] {
  const flags: RedFlag[] = [];
  
  // 🚩 Lock triggered but founder submitted anyway
  const lockBypasses = events.filter(e => e.type === EVENT_TYPES.LOCK_BYPASSED);
  lockBypasses.forEach(event => {
    flags.push({
      id: `bypass-${event.id}`,
      timestamp: event.timestamp,
      type: "lock_bypass",
      severity: "critical",
      founderId: event.founderId,
      founderName: event.founderName,
      description: "Lock triggered but founder submitted anyway - System bypass detected",
      action: "CRITICAL BUG — Investigate immediately, document workaround used",
      resolved: false
    });
  });
  
  // 🚩 Evidence URLs return 404 or 403 errors
  const invalidEvidence = events.filter(e => e.type === EVENT_TYPES.EVIDENCE_INVALID);
  invalidEvidence.forEach(event => {
    flags.push({
      id: `evidence-${event.id}`,
      timestamp: event.timestamp,
      type: "evidence_error",
      severity: "high",
      founderId: event.founderId,
      founderName: event.founderName,
      description: "Evidence URLs return 404 or 403 errors",
      action: "Check storage permissions, verify upload validation works",
      resolved: false
    });
  });
  
  // 🚩 Mentor notification not sent despite late submission
  const lateSubmissions = events.filter(e => 
    e.type === EVENT_TYPES.COMMIT_LATE || e.type === EVENT_TYPES.REPORT_LATE
  );
  lateSubmissions.forEach(lateEvent => {
    const notificationSent = events.find(e => 
      e.type === EVENT_TYPES.NOTIFICATION_SENT &&
      e.founderId === lateEvent.founderId &&
      e.timestamp > lateEvent.timestamp
    );
    
    if (!notificationSent) {
      flags.push({
        id: `notif-${lateEvent.id}`,
        timestamp: lateEvent.timestamp,
        type: "notification_missing",
        severity: "critical",
        founderId: lateEvent.founderId,
        founderName: lateEvent.founderName,
        description: "Mentor notification not sent despite late submission",
        action: "CRITICAL BUG — Check email logs, verify notification triggers",
        resolved: false
      });
    }
  });
  
  // 🚩 All founders report $0 revenue
  const recentReports = events.filter(e => 
    e.type === EVENT_TYPES.REPORT_SUBMITTED &&
    new Date().getTime() - e.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
  );
  
  const zeroRevenueCount = recentReports.filter(e => e.data.revenue === 0).length;
  if (recentReports.length > 0 && zeroRevenueCount === recentReports.length) {
    flags.push({
      id: `zero-revenue-${Date.now()}`,
      timestamp: new Date(),
      type: "all_zero_revenue",
      severity: "high",
      description: "All founders report $0 revenue this week",
      action: "Review founder selection criteria, check commit quality",
      resolved: false
    });
  }
  
  return flags;
}

// Export data for analysis
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => headers.map(h => JSON.stringify(row[h])).join(","))
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${Date.now()}.csv`;
  link.click();
}

// Snapshot data structure for daily monitoring
export interface DailySnapshot {
  date: string;
  time: string;
  type: "monday_9am" | "friday_6pm" | "sunday_eod";
  
  // Founder states
  founders: Array<{
    id: string;
    name: string;
    stage: number;
    week: number;
    lockStatus: boolean;
    commitStatus: string;
    reportStatus: string;
    adjustStatus: string;
    consecutiveMisses: number;
    revenueBaseline: number;
    currentRevenue: number;
  }>;
  
  // System health
  locksTriggered: number;
  notificationsSent: number;
  notificationsFailed: number;
  
  // Submissions
  commitsSubmitted: number;
  reportsSubmitted: number;
  evidenceUploaded: number;
  
  // Red flags
  redFlags: RedFlag[];
}

// Generate daily snapshot
export function generateSnapshot(type: DailySnapshot["type"]): DailySnapshot {
  const now = new Date();
  
  return {
    date: now.toISOString().split("T")[0],
    time: formatWATDateTime(now),
    type,
    founders: [], // Would be populated from database
    locksTriggered: 0,
    notificationsSent: 0,
    notificationsFailed: 0,
    commitsSubmitted: 0,
    reportsSubmitted: 0,
    evidenceUploaded: 0,
    redFlags: []
  };
}

// Calculate metrics for post-test analysis
export interface PostTestMetrics {
  // Revenue analysis
  revenueDeltas: Array<{
    founderId: string;
    founderName: string;
    baseline: number;
    current: number;
    delta: number;
    deltaPercent: number;
    category: "big_win" | "positive" | "flat" | "negative" | "incomplete";
  }>;
  
  aggregateGrowth: number;
  foundersWithIncrease: number;
  foundersWithIncreasePercent: number;
  
  // System validation
  lockAccuracy: number;
  notificationAccuracy: number;
  bypassAttempts: number;
  criticalBugs: number;
  minorBugs: number;
  
  // Completion analysis
  twoWeekCompletionRate: number;
  dropoutPoints: Record<string, number>;
  onTimeSubmissionRate: number;
  
  // Evidence analysis
  evidenceCompletionRate: number;
  evidenceQuality: Record<string, number>;
}

export function calculatePostTestMetrics(
  founders: any[],
  events: TrackingEvent[],
  redFlags: RedFlag[]
): PostTestMetrics {
  // Calculate revenue deltas
  const revenueDeltas = founders.map(founder => {
    const delta = founder.currentRevenue - founder.revenueBaseline;
    const deltaPercent = (delta / founder.revenueBaseline) * 100;
    
    let category: any = "incomplete";
    if (founder.currentRevenue > 0) {
      if (deltaPercent >= 50) category = "big_win";
      else if (deltaPercent > 10) category = "positive";
      else if (deltaPercent >= -10) category = "flat";
      else category = "negative";
    }
    
    return {
      founderId: founder.id,
      founderName: founder.name,
      baseline: founder.revenueBaseline,
      current: founder.currentRevenue,
      delta,
      deltaPercent,
      category
    };
  });
  
  const foundersWithIncrease = revenueDeltas.filter(f => f.delta > 0).length;
  const totalDelta = revenueDeltas.reduce((sum, f) => sum + f.deltaPercent, 0);
  
  // System validation metrics
  const lockEvents = events.filter(e => e.type === EVENT_TYPES.LOCK_TRIGGERED);
  const bypassAttempts = redFlags.filter(f => f.type === "lock_bypass").length;
  const criticalBugs = redFlags.filter(f => f.severity === "critical").length;
  const minorBugs = redFlags.filter(f => f.severity === "medium").length;
  
  // Completion metrics
  const completers = founders.filter(f => f.week >= 2 && f.reportStatus === "complete");
  const twoWeekCompletionRate = (completers.length / founders.length) * 100;
  
  const submissions = events.filter(e => 
    e.type === EVENT_TYPES.COMMIT_SUBMITTED || e.type === EVENT_TYPES.REPORT_SUBMITTED
  );
  const onTimeSubmissions = submissions.filter(e => !e.flagged);
  const onTimeSubmissionRate = (onTimeSubmissions.length / submissions.length) * 100;
  
  // Evidence metrics
  const reports = events.filter(e => e.type === EVENT_TYPES.REPORT_SUBMITTED);
  const reportsWithEvidence = reports.filter(e => e.data.evidenceUrl);
  const evidenceCompletionRate = (reportsWithEvidence.length / reports.length) * 100;
  
  return {
    revenueDeltas,
    aggregateGrowth: totalDelta / founders.length,
    foundersWithIncrease,
    foundersWithIncreasePercent: (foundersWithIncrease / founders.length) * 100,
    lockAccuracy: lockEvents.length > 0 ? ((lockEvents.length - bypassAttempts) / lockEvents.length) * 100 : 100,
    notificationAccuracy: 95, // Mock - would calculate from actual notification logs
    bypassAttempts,
    criticalBugs,
    minorBugs,
    twoWeekCompletionRate,
    dropoutPoints: { week1: 2, week2: 1 }, // Mock
    onTimeSubmissionRate,
    evidenceCompletionRate,
    evidenceQuality: { screenshots: 8, invoices: 4, contracts: 3 } // Mock
  };
}
