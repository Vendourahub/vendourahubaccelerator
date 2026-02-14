import { Link } from "react-router";

export default function TestProtocol() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/testing" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Testing Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">TEST PROTOCOL</h1>
          <p className="text-neutral-600">Week-by-week timeline, founder instructions, intervention rules</p>
        </div>
        
        {/* Timeline */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">2-Week Test Timeline</h2>
          </div>
          <div className="p-6 space-y-6">
            <WeekProtocol 
              week="Pre-Test (Friday before)"
              activities={[
                "Send onboarding email with login credentials",
                "Founders log baseline revenue (last 30 days)",
                "System creates Week 1 commit deadline (Monday 9am)",
                "Mentor introduces themselves via email"
              ]}
              observerActions={[
                "Verify all founders can log in",
                "Check baseline revenue is recorded",
                "Confirm email notifications are working"
              ]}
            />
            
            <WeekProtocol 
              week="Week 1 (Days 1-7)"
              activities={[
                "Monday 12:00am: Commit form unlocks",
                "Monday 9:00am: DEADLINE — Commit due",
                "Monday 9:01am: Auto-lock if no commit submitted",
                "Monday-Thursday: Execution phase (optional daily logging)",
                "Friday 12:00pm: Report form unlocks",
                "Friday 6:00pm: DEADLINE — Report due (with evidence)",
                "Friday 6:01pm: Auto-flag if no report submitted"
              ]}
              observerActions={[
                "Track who submits commit on time vs late",
                "Monitor lock triggers (system should auto-lock at 9:01am)",
                "Verify mentor notifications fire for late submissions",
                "Check evidence uploads are accessible",
                "Calculate Week 1 revenue for each founder"
              ]}
            />
            
            <WeekProtocol 
              week="Week 2 (Days 8-14)"
              activities={[
                "Saturday 12:00am: Diagnosis published to founder",
                "Sunday 6:00pm: Adjust due (plan for Week 2)",
                "Monday 12:00am: Week 2 commit form unlocks",
                "Monday 9:00am: DEADLINE — Week 2 commit due",
                "Repeat execution & report cycle",
                "Friday 6:00pm: Week 2 report due"
              ]}
              observerActions={[
                "Compare Week 1 vs Week 2 revenue",
                "Track completion rate (who finished both weeks?)",
                "Identify drop-off points (where did founders quit?)",
                "Test enforcement: Did anyone bypass locks?",
                "Verify consecutive_misses counter works correctly"
              ]}
            />
            
            <WeekProtocol 
              week="Post-Test (Weekend after)"
              activities={[
                "Send completion survey (data-focused only)",
                "Extract all data to analysis spreadsheet",
                "1-on-1 debrief calls (30 min each, revenue-focused)"
              ]}
              observerActions={[
                "Analyze revenue delta across all founders",
                "Document bugs and unexpected behaviors",
                "Identify any enforcement failures",
                "Create founder retention report (who would continue?)"
              ]}
            />
          </div>
        </div>
        
        {/* Intervention Rules */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Intervention Rules</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-sm text-neutral-700 mb-4">
              <strong>CRITICAL:</strong> Test observers should NOT intervene unless system is broken. Let enforcement work.
            </div>
            
            <InterventionRule 
              scenario="Founder misses Monday commit deadline"
              systemBehavior="Auto-lock week, notify mentor, disable report form"
              observerAction="DO NOT INTERVENE — Watch if founder contacts mentor or tries to bypass"
              exception="ONLY if lock fails to trigger (system bug)"
            />
            
            <InterventionRule 
              scenario="Founder submits report without evidence"
              systemBehavior="Auto-reject report, send error message, allow resubmit until Friday 6pm"
              observerAction="DO NOT INTERVENE — Track if founder resubmits with evidence"
              exception="ONLY if validation fails (uploads evidence but still rejected)"
            />
            
            <InterventionRule 
              scenario="Founder emails 'I can't make the deadline'"
              systemBehavior="No automatic response (this is social pressure test)"
              observerAction="DO NOT GRANT EXTENSION — Mentor should reply: 'Understood. System will lock at deadline.'"
              exception="ONLY if legitimate emergency (death in family, hospitalization)"
            />
            
            <InterventionRule 
              scenario="Founder asks 'Can I skip Week 2?'"
              systemBehavior="No system prevention (founder can choose not to participate)"
              observerAction="Allow dropout — Track as 'incomplete' in metrics"
              exception="None — voluntary dropout is valid data"
            />
            
            <InterventionRule 
              scenario="System bug prevents submission"
              systemBehavior="Founder cannot complete required action"
              observerAction="IMMEDIATE INTERVENTION — Fix bug, manually credit submission, document as critical"
              exception="This is the ONLY time to intervene automatically"
            />
          </div>
        </div>
        
        {/* Observer Checklist */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Daily Observer Checklist</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <ChecklistDay 
                day="Monday (Commit Deadline Day)"
                checks={[
                  "9:00am: Screenshot all dashboards (who submitted, who didn't)",
                  "9:01am: Verify locks triggered for non-submitters",
                  "9:05am: Check mentor notification emails sent",
                  "End of day: Count on-time vs late vs missing commits"
                ]}
              />
              
              <ChecklistDay 
                day="Tuesday-Thursday (Execution Days)"
                checks={[
                  "Spot-check 2-3 founder dashboards daily",
                  "Monitor for support requests (system bugs?)",
                  "Track execution log usage (optional feature)",
                  "No intervention needed unless critical bug"
                ]}
              />
              
              <ChecklistDay 
                day="Friday (Report Deadline Day)"
                checks={[
                  "12:00pm: Verify report forms unlocked for founders with commits",
                  "6:00pm: Screenshot all reports (who submitted, who didn't)",
                  "6:01pm: Verify consecutive_misses counter incremented",
                  "End of day: Extract revenue data from all reports",
                  "End of day: Verify all evidence files are accessible"
                ]}
              />
              
              <ChecklistDay 
                day="Saturday-Sunday (Diagnosis & Adjust)"
                checks={[
                  "Saturday: Verify diagnosis visible to founders",
                  "Sunday 6pm: Check adjust submissions",
                  "Review week's data for anomalies",
                  "Prepare Week 2 commit deadlines"
                ]}
              />
            </div>
          </div>
        </div>
        
        {/* Communication Templates */}
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">COMMUNICATION TEMPLATES</div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-medium mb-2">Onboarding Email (Friday before start):</div>
              <div className="p-3 bg-white rounded-sm text-xs">
                Subject: Vendoura Alpha Test — Week 1 Starts Monday<br/><br/>
                Your login: [URL]<br/>
                First deadline: Monday 9am (commit your revenue action)<br/>
                Evidence required: Every Friday 6pm<br/><br/>
                The system enforces deadlines automatically. No extensions. Your mentor will see all activity.<br/><br/>
                Questions? Reply to this email.
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-2">Mid-Week Check (Wednesday, only if zero activity):</div>
              <div className="p-3 bg-white rounded-sm text-xs">
                Subject: Vendoura — Report due Friday 6pm<br/><br/>
                You submitted your commit Monday. Report is due Friday at 6pm with evidence.<br/><br/>
                No submission = week marked incomplete + mentor notified.<br/><br/>
                This is a reminder, not an extension.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekProtocol({ 
  week, 
  activities, 
  observerActions 
}: { 
  week: string; 
  activities: string[]; 
  observerActions: string[];
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-6">
      <div className="text-lg font-semibold mb-4">{week}</div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Founder Activities</div>
          <ul className="space-y-2 text-sm text-neutral-700">
            {activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-neutral-400">→</span>
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Observer Actions</div>
          <ul className="space-y-2 text-sm text-neutral-700">
            {observerActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function InterventionRule({ 
  scenario, 
  systemBehavior, 
  observerAction, 
  exception 
}: { 
  scenario: string; 
  systemBehavior: string; 
  observerAction: string; 
  exception: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="font-semibold mb-3">{scenario}</div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-neutral-600">System Behavior:</span>
          <div className="ml-4 mt-1 text-neutral-700">{systemBehavior}</div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Observer Action:</span>
          <div className="ml-4 mt-1 text-neutral-700">{observerAction}</div>
        </div>
        <div className="pt-2 border-t border-neutral-200">
          <span className="text-amber-600 font-medium">Exception:</span>
          <div className="ml-4 mt-1 text-neutral-700">{exception}</div>
        </div>
      </div>
    </div>
  );
}

function ChecklistDay({ 
  day, 
  checks 
}: { 
  day: string; 
  checks: string[];
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="font-semibold mb-3">{day}</div>
      <ul className="space-y-2 text-sm text-neutral-700">
        {checks.map((check, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-neutral-400">☐</span>
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
