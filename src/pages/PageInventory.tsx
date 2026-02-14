import { Link } from "react-router";
import React from "react";

export default function PageInventory() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm underline mb-4 inline-block">← Back to Flow Index</Link>
        
        <h1 className="text-2xl mb-2">PHASE 2 — PAGE INVENTORY</h1>
        <p className="mb-8 text-gray-600">Mandatory pages only. Every page must have a job tied to revenue enforcement.</p>
        
        <div className="mb-8 p-6 border-2 border-black bg-gray-100">
          <div className="font-bold mb-2">RULES FOR THIS PHASE:</div>
          <ul className="text-sm space-y-1">
            <li>• No extras. No "nice-to-haves".</li>
            <li>• Every page must justify its existence through revenue enforcement</li>
            <li>• Pages without clear jobs = deleted</li>
            <li>• This is function inventory, not design</li>
          </ul>
        </div>
        
        <div className="space-y-12">
          {/* PUBLIC PAGES */}
          <PageSection 
            title="PUBLIC PAGES"
            description="Accessed by non-authenticated users"
            pages={[
              {
                name: "Landing Page",
                route: "/",
                job: "Communicate what Vendoura is and filter for commitment",
                mustHave: [
                  "What Vendoura does (revenue focus, not community)",
                  "12-week timeline visible",
                  "Weekly reporting requirement stated",
                  "Link to application",
                  "NO testimonials, NO feature lists, NO fluff"
                ],
                tiedToEnforcement: "Sets expectation before application — filters uncommitted founders early"
              },
              {
                name: "Application",
                route: "/apply",
                job: "Capture revenue baseline and screen for commitment",
                mustHave: [
                  "Name, email, business description",
                  "Revenue baseline capture (30-day, 90-day)",
                  "Commitment screening questions",
                  "Accept/Reject logic (auto-reject if 'NO' to any commitment question)",
                  "Clear submission confirmation or rejection message"
                ],
                tiedToEnforcement: "First gate — only committed founders enter system (FLOW A)"
              }
            ]}
          />
          
          {/* FOUNDER PAGES */}
          <PageSection 
            title="FOUNDER PAGES"
            description="Accessed by authenticated founders in active cohort"
            pages={[
              {
                name: "Dashboard",
                route: "/dashboard",
                job: "Show current state and next required action",
                mustHave: [
                  "Current week (X of 12)",
                  "Current stage and progress",
                  "Current revenue vs baseline (delta)",
                  "Next required action with deadline",
                  "Lock status if any step missed",
                  "Mentor visibility flags (if any)"
                ],
                tiedToEnforcement: "Primary navigation — founder always knows: where am I, what's next, am I locked"
              },
              {
                name: "Weekly Commit",
                route: "/commit",
                job: "Force specific revenue action commitment",
                mustHave: [
                  "Form: What action? Target $? Deadline?",
                  "Validation: Reject vague commits",
                  "Deadline timer (Monday 9am)",
                  "Submit button (locks at deadline)",
                  "Confirmation: 'Committed' state shown"
                ],
                tiedToEnforcement: "FLOW C Step 1 — No commit = week locked"
              },
              {
                name: "Execution Log",
                route: "/execute",
                job: "Guide founder during execution phase",
                mustHave: [
                  "Display committed action",
                  "Hours tracker (optional input during week)",
                  "Evidence upload area (for Friday)",
                  "Guidance: 'Capture screenshots, receipts, contracts'",
                  "Link to report submission (available Friday)"
                ],
                tiedToEnforcement: "FLOW C Step 2 — Bridges commit → report, reminds evidence required"
              },
              {
                name: "Revenue Report",
                route: "/report",
                job: "Capture weekly revenue with evidence",
                mustHave: [
                  "Display committed action (from Monday)",
                  "Form: Revenue generated $, Hours spent, Evidence upload",
                  "Narrative field: 'What happened?'",
                  "Validation: Cannot submit without evidence",
                  "Deadline timer (Friday 6pm)",
                  "Lock if no commit submitted"
                ],
                tiedToEnforcement: "FLOW C Step 3 — Most critical lock point. No report = stage freeze"
              },
              {
                name: "Revenue Map",
                route: "/map",
                job: "Show stage progression and lock status",
                mustHave: [
                  "5 stages displayed vertically",
                  "Current stage highlighted",
                  "Locked stages grayed out",
                  "Each stage: requirements + completion status",
                  "Unlock conditions visible",
                  "Progress bar for current stage"
                ],
                tiedToEnforcement: "Visual representation of FLOW D — shows what's locked and why"
              },
              {
                name: "Revenue System Document (RSD)",
                route: "/rsd",
                job: "Build repeatable revenue playbook during Stage 4",
                mustHave: [
                  "Sections: Process, What works, What doesn't, $ per hour, Scale plan",
                  "Auto-populated data from weekly reports",
                  "Text editor for founder notes",
                  "Save/submit functionality",
                  "Mentor feedback section",
                  "Completion % indicator"
                ],
                tiedToEnforcement: "Stage 4 unlock requirement — RSD incomplete = cannot graduate"
              },
              {
                name: "Community (Stage-Based)",
                route: "/community",
                job: "Peer support filtered by stage to prevent distraction",
                mustHave: [
                  "Founders grouped by current stage",
                  "Discussion threads",
                  "Visibility: only see founders in same/adjacent stage",
                  "Warning banner if founder has missed weeks",
                  "NO gamification, NO likes, NO engagement metrics"
                ],
                tiedToEnforcement: "Access restricted by stage — locked stages = cannot see those discussions"
              },
              {
                name: "Calendar",
                route: "/calendar",
                job: "Show deadlines and cohort events",
                mustHave: [
                  "Weekly deadlines: Commit (Mon 9am), Report (Fri 6pm), Adjust (Sun 6pm)",
                  "Cohort events: Office hours, mentor sessions",
                  "Missed deadlines shown in red",
                  "Upcoming deadline countdown",
                  "No social events, no optional gatherings"
                ],
                tiedToEnforcement: "Makes deadlines explicit — supports FLOW C timing enforcement"
              }
            ]}
          />
          
          {/* ADMIN / MENTOR PAGES */}
          <PageSection 
            title="ADMIN / MENTOR PAGES"
            description="Accessed by mentors and program administrators"
            pages={[
              {
                name: "Cohort Overview",
                route: "/admin/cohort",
                job: "Monitor all founders' weekly completion status",
                mustHave: [
                  "List all founders in cohort",
                  "Current week completion status (commit, report, adjust)",
                  "Missed weeks counter per founder",
                  "Revenue delta since baseline",
                  "Sort by: at risk, on track, excelling",
                  "Bulk actions: message all, flag for review"
                ],
                tiedToEnforcement: "Enables mentor to spot stalls early — supports intervention before removal"
              },
              {
                name: "Founder Detail View",
                route: "/admin/founder/:id",
                job: "Deep dive into individual founder progress",
                mustHave: [
                  "Full weekly history (all commits, reports, evidence)",
                  "Revenue chart: baseline → current",
                  "Stage progress timeline",
                  "Missed weeks log",
                  "Mentor notes (private)",
                  "Actions: Send message, Flag for intervention, Override lock"
                ],
                tiedToEnforcement: "Allows mentor to validate evidence, make unlock decisions, document interventions"
              },
              {
                name: "Revenue Analytics",
                route: "/admin/analytics",
                job: "Cohort-level metrics to identify patterns",
                mustHave: [
                  "Cohort completion rate (% submitting weekly)",
                  "Average revenue delta",
                  "Stage distribution (how many at each stage)",
                  "Drop-off analysis (where founders stall)",
                  "$ per hour by tactic (aggregated)",
                  "NO vanity metrics (engagement, logins, etc.)"
                ],
                tiedToEnforcement: "Reveals if enforcement is working — where founders succeed/fail"
              },
              {
                name: "Intervention Panel",
                route: "/admin/interventions",
                job: "Queue founders requiring mentor action",
                mustHave: [
                  "Auto-populated list of flagged founders",
                  "Flag reasons: Missed commit, No evidence, 2 weeks missed, Revenue decline",
                  "Priority sorting (2 weeks missed = urgent)",
                  "Actions: Schedule call, Send message, Move to next cohort, Remove",
                  "Intervention history per founder"
                ],
                tiedToEnforcement: "Operationalizes FLOW D — turns lock conditions into mentor actions"
              }
            ]}
          />
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-white">
          <div className="font-bold mb-4">PAGE COUNT SUMMARY:</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-bold mb-2">PUBLIC: 2 pages</div>
              <div className="text-gray-600">Landing, Application</div>
            </div>
            <div>
              <div className="font-bold mb-2">FOUNDER: 8 pages</div>
              <div className="text-gray-600">Dashboard, Commit, Execute, Report, Map, RSD, Community, Calendar</div>
            </div>
            <div>
              <div className="font-bold mb-2">ADMIN: 4 pages</div>
              <div className="text-gray-600">Cohort Overview, Founder Detail, Analytics, Interventions</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="font-bold">TOTAL: 14 pages</div>
            <div className="text-sm text-gray-600 mt-2">No extras. No nice-to-haves. Every page serves revenue enforcement.</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-black bg-gray-100">
          <div className="font-bold mb-2">✓ EXIT CONDITION MET:</div>
          <div className="text-sm">Every page has a clear job tied to revenue enforcement. Nothing exists for engagement, delight, or aesthetics.</div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-green-600 bg-green-50">
          <Link to="/screens" className="block">
            <div className="font-bold mb-2">→ PROCEED TO PHASE 3: LOW-FIDELITY SCREENS</div>
            <div className="text-sm mb-4">Turn these 14 pages into low-fidelity screens (grayscale, function over form)</div>
            <div className="text-sm">Start order: Dashboard → Weekly Commit → Execution Log → Revenue Report → Revenue Map → RSD</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PageSection({ 
  title, 
  description, 
  pages 
}: { 
  title: string; 
  description: string; 
  pages: Array<{
    name: string;
    route: string;
    job: string;
    mustHave: string[];
    tiedToEnforcement: string;
  }>;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="space-y-6">
        {pages.map((page, i) => (
          <div key={i} className="border-2 border-black p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-5 h-5 mt-1 flex-shrink-0 border-2 border-black"></div>
              <div className="flex-1">
                <div className="font-bold mb-1">{page.name}</div>
                <div className="text-xs text-gray-500 mb-2">Route: {page.route}</div>
                <div className="text-sm mb-3">
                  <span className="font-bold">Job: </span>
                  {page.job}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-bold mb-2">MUST HAVE:</div>
              <ul className="text-sm space-y-1">
                {page.mustHave.map((item, j) => (
                  <li key={j} className="text-gray-700">→ {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="pt-3 border-t border-gray-300">
              <div className="text-xs font-bold mb-1">TIED TO ENFORCEMENT:</div>
              <div className="text-xs text-gray-600">{page.tiedToEnforcement}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}