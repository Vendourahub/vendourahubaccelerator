// Centralized state management for admin dashboard
// In production, this would be replaced with React Context or Zustand

export interface Founder {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessModel: string;
  product: string;
  customers: number;
  pricing: string;
  stage: number;
  week: number;
  commitStatus: string;
  reportStatus: string;
  adjustStatus: string;
  missedWeeks: number;
  revenueBaseline: number;
  revenueBaseline30d: number;
  revenueBaseline90d: number;
  currentRevenue: number;
  revenueDelta: number;
  risk: string;
  lockStatus: {
    locked: boolean;
    reason: string | null;
  };
  subscriptionStatus: "trial" | "paid" | "expired" | "cancelled";
  subscriptionExpiry: string | null;
  currentWeek?: number;
  weeklyHistory?: WeeklyActivity[];
}

export interface WeeklyActivity {
  week: number;
  commitText: string;
  commitTarget: number;
  commitDate: string;
  commitStatus: string;
  reportRevenue: number;
  reportEvidence: string | null;
  reportDate: string | null;
  reportStatus: string;
  adjustNotes: string | null;
  adjustDollarPerHour: number | null;
  adjustStatus: string;
}

export interface MentorNote {
  id: string;
  founderId: string;
  date: string;
  note: string;
  author: string;
  authorId: string;
}

export interface Notification {
  id: string;
  type: "email" | "push" | "sms";
  recipient: string;
  subject: string;
  message: string;
  status: "pending" | "sent" | "failed";
  sentAt: string | null;
}

// Mock database
let founders: Founder[] = [
  {
    id: "f1",
    name: "Chioma Okafor",
    email: "chioma@retailpro.ng",
    businessName: "RetailPro NG",
    businessModel: "B2B SaaS",
    product: "Inventory management for small retailers",
    customers: 15,
    pricing: "₦25,000/month",
    stage: 2,
    week: 4,
    commitStatus: "complete",
    reportStatus: "pending",
    adjustStatus: "pending",
    missedWeeks: 0,
    revenueBaseline: 1500000,
    revenueBaseline30d: 1500000,
    revenueBaseline90d: 4200000,
    currentRevenue: 2100000,
    revenueDelta: 40,
    risk: "on-track",
    lockStatus: { locked: false, reason: null },
    subscriptionStatus: "paid",
    subscriptionExpiry: "2026-08-11"
  },
  {
    id: "f2",
    name: "Adeyemi Kunle",
    email: "kunle@b2bcloud.com",
    businessName: "B2B Cloud Services",
    businessModel: "B2B SaaS",
    product: "Cloud infrastructure management",
    customers: 8,
    pricing: "₦50,000/month",
    stage: 1,
    week: 4,
    commitStatus: "missed",
    reportStatus: "locked",
    adjustStatus: "locked",
    missedWeeks: 1,
    revenueBaseline: 800000,
    revenueBaseline30d: 800000,
    revenueBaseline90d: 2300000,
    currentRevenue: 850000,
    revenueDelta: 6,
    risk: "at-risk",
    lockStatus: { locked: true, reason: "Missed Week 4 Commit deadline" },
    subscriptionStatus: "trial",
    subscriptionExpiry: "2026-02-25"
  },
  {
    id: "f3",
    name: "Ngozi Mba",
    email: "ngozi@consulting.ng",
    businessName: "Consulting Services",
    businessModel: "B2B Services",
    product: "Business strategy consulting",
    customers: 6,
    pricing: "₦200,000/project",
    stage: 2,
    week: 4,
    commitStatus: "complete",
    reportStatus: "complete",
    adjustStatus: "complete",
    missedWeeks: 0,
    revenueBaseline: 2000000,
    revenueBaseline30d: 2000000,
    revenueBaseline90d: 5800000,
    currentRevenue: 3500000,
    revenueDelta: 75,
    risk: "excelling",
    lockStatus: { locked: false, reason: null },
    subscriptionStatus: "paid",
    subscriptionExpiry: "2026-08-11"
  },
  {
    id: "f4",
    name: "Tunde Balogun",
    email: "tunde@ecommerce.ng",
    businessName: "E-commerce Store",
    businessModel: "B2C E-commerce",
    product: "Online fashion retail",
    customers: 150,
    pricing: "Variable per order",
    stage: 1,
    week: 4,
    commitStatus: "missed",
    reportStatus: "missed",
    adjustStatus: "locked",
    missedWeeks: 2,
    revenueBaseline: 1200000,
    revenueBaseline30d: 1200000,
    revenueBaseline90d: 3400000,
    currentRevenue: 1100000,
    revenueDelta: -8,
    risk: "removal-review",
    lockStatus: { locked: true, reason: "2 consecutive missed weeks" },
    subscriptionStatus: "paid",
    subscriptionExpiry: "2026-08-11"
  }
];

let mentorNotes: MentorNote[] = [
  {
    id: "n1",
    founderId: "f1",
    date: "2026-02-08",
    note: "Strong momentum. Chioma is getting better at qualifying leads before offering trials. Revenue trajectory looks good for Stage 2 requirements.",
    author: "Mentor Tayo",
    authorId: "mentor1"
  },
  {
    id: "n2",
    founderId: "f1",
    date: "2026-02-01",
    note: "Initial onboarding call completed. Business model is solid, pricing could be higher based on value provided. Will monitor first 2 weeks closely.",
    author: "Mentor Tayo",
    authorId: "mentor1"
  }
];

// Store management functions
export const adminStore = {
  // Founder operations
  getAllFounders: (): Founder[] => {
    return [...founders];
  },

  getFounderById: (id: string): Founder | undefined => {
    return founders.find(f => f.id === id);
  },

  // Alias for compatibility
  getFounder: (id: string): Founder | undefined => {
    return founders.find(f => f.id === id);
  },

  updateFounder: (id: string, updates: Partial<Founder>): boolean => {
    const index = founders.findIndex(f => f.id === id);
    if (index === -1) return false;
    founders[index] = { ...founders[index], ...updates };
    return true;
  },

  overrideLock: (founderId: string): boolean => {
    return adminStore.updateFounder(founderId, {
      lockStatus: { locked: false, reason: null }
    });
  },

  // Mentor notes operations
  getMentorNotes: (founderId: string): MentorNote[] => {
    return mentorNotes.filter(n => n.founderId === founderId);
  },

  addMentorNote: (note: Omit<MentorNote, "id">): MentorNote => {
    const newNote: MentorNote = {
      id: `n${Date.now()}`,
      ...note
    };
    mentorNotes.push(newNote);
    return newNote;
  },

  // Export operations
  exportSnapshot: (): string => {
    const data = founders.map(f => ({
      name: f.name,
      business: f.businessName,
      stage: f.stage,
      week: f.week,
      status: f.risk,
      locked: f.lockStatus.locked,
      revenue: f.currentRevenue
    }));
    return JSON.stringify(data, null, 2);
  },

  exportFounderStates: (): string => {
    const data = founders.map(f => ({
      id: f.id,
      name: f.name,
      currentStatus: f.risk,
      locked: f.lockStatus.locked,
      lockReason: f.lockStatus.reason,
      commitStatus: f.commitStatus,
      reportStatus: f.reportStatus,
      adjustStatus: f.adjustStatus,
      missedWeeks: f.missedWeeks,
      revenueChange: f.revenueDelta
    }));
    return JSON.stringify(data, null, 2);
  },

  exportRevenueData: (): string => {
    const data = founders.map(f => ({
      name: f.name,
      business: f.businessName,
      baseline30d: f.revenueBaseline30d,
      baseline90d: f.revenueBaseline90d,
      currentRevenue: f.currentRevenue,
      delta: f.revenueDelta,
      deltaPercent: `${f.revenueDelta}%`
    }));
    return JSON.stringify(data, null, 2);
  },

  exportRedFlags: (): string => {
    const redFlags = founders
      .filter(f => f.risk === "at-risk" || f.risk === "removal-review" || f.lockStatus.locked)
      .map(f => ({
        name: f.name,
        risk: f.risk,
        locked: f.lockStatus.locked,
        lockReason: f.lockStatus.reason,
        missedWeeks: f.missedWeeks,
        revenueDelta: f.revenueDelta
      }));
    return JSON.stringify(redFlags, null, 2);
  },

  exportEventLog: (): string => {
    // Mock event log
    const events = [
      { timestamp: "2026-02-11 09:30:00", event: "Admin login", user: "admin@vendoura.com" },
      { timestamp: "2026-02-11 08:45:00", event: "Commit submitted", user: "chioma@retailpro.ng" },
      { timestamp: "2026-02-10 18:00:00", event: "Lock triggered", user: "System", details: "f2 missed deadline" },
      { timestamp: "2026-02-10 17:30:00", event: "Report submitted", user: "ngozi@consulting.ng" }
    ];
    return JSON.stringify(events, null, 2);
  },

  exportMetricsSummary: (): string => {
    const summary = {
      totalFounders: founders.length,
      onTrack: founders.filter(f => f.risk === "on-track").length,
      atRisk: founders.filter(f => f.risk === "at-risk").length,
      removalReview: founders.filter(f => f.risk === "removal-review").length,
      excelling: founders.filter(f => f.risk === "excelling").length,
      locked: founders.filter(f => f.lockStatus.locked).length,
      averageRevenueDelta: (founders.reduce((sum, f) => sum + f.revenueDelta, 0) / founders.length).toFixed(2),
      totalRevenue: founders.reduce((sum, f) => sum + f.currentRevenue, 0)
    };
    return JSON.stringify(summary, null, 2);
  },

  exportMasterSpreadsheet: (): string => {
    const data = founders.map(f => ({
      id: f.id,
      name: f.name,
      email: f.email,
      business: f.businessName,
      model: f.businessModel,
      product: f.product,
      customers: f.customers,
      pricing: f.pricing,
      stage: f.stage,
      week: f.week,
      commitStatus: f.commitStatus,
      reportStatus: f.reportStatus,
      adjustStatus: f.adjustStatus,
      missedWeeks: f.missedWeeks,
      baseline30d: f.revenueBaseline30d,
      baseline90d: f.revenueBaseline90d,
      currentRevenue: f.currentRevenue,
      revenueDelta: f.revenueDelta,
      risk: f.risk,
      locked: f.lockStatus.locked,
      lockReason: f.lockStatus.reason,
      subscription: f.subscriptionStatus,
      subscriptionExpiry: f.subscriptionExpiry
    }));
    return JSON.stringify(data, null, 2);
  }
};