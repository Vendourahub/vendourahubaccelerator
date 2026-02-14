import { Link } from "react-router";

export default function DataTracking() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/testing" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Testing Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">DATA TRACKING FRAMEWORK</h1>
          <p className="text-neutral-600">What data to capture, how to analyze it, red flags to watch</p>
        </div>
        
        {/* Data Collection Points */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Data Collection Points</h2>
          </div>
          <div className="p-6 space-y-6">
            <DataPoint 
              event="Founder Signs Up"
              collect={[
                "Email, name, company",
                "Baseline revenue (30d and 90d)",
                "Business model (B2B/B2C/hybrid)",
                "Industry",
                "Founder experience level",
                "Timezone",
                "Signup timestamp"
              ]}
              purpose="Demographic analysis, segment comparison"
            />
            
            <DataPoint 
              event="Commit Submitted"
              collect={[
                "Week number",
                "Action description (full text)",
                "Target revenue amount",
                "Completion date",
                "Submitted timestamp",
                "Deadline timestamp",
                "is_late (boolean)",
                "Time to deadline (hours remaining)"
              ]}
              purpose="Deadline pressure analysis, commitment quality assessment"
            />
            
            <DataPoint 
              event="Report Submitted"
              collect={[
                "Week number",
                "Revenue generated",
                "Hours spent",
                "$ per hour (calculated)",
                "Win rate vs target (calculated)",
                "Narrative (full text)",
                "Evidence URLs (count and file types)",
                "Submitted timestamp",
                "is_late (boolean)",
                "Time to deadline"
              ]}
              purpose="Revenue tracking, evidence compliance, narrative quality"
            />
            
            <DataPoint 
              event="Lock Triggered"
              collect={[
                "Founder ID",
                "Week number",
                "Lock reason (missed_commit | missed_report)",
                "Triggered timestamp",
                "Was mentor notified? (boolean)",
                "Did founder attempt bypass? (boolean)"
              ]}
              purpose="Enforcement validation, bypass detection"
            />
            
            <DataPoint 
              event="Mentor Notification Sent"
              collect={[
                "Founder ID",
                "Notification type",
                "Week number",
                "Sent timestamp",
                "Delivered? (boolean)",
                "Opened? (boolean)",
                "Mentor response? (text)"
              ]}
              purpose="Communication effectiveness, mentor engagement"
            />
            
            <DataPoint 
              event="Founder Drops Out"
              collect={[
                "Founder ID",
                "Week dropped",
                "Last action taken",
                "Dropout reason (if stated)",
                "Revenue at dropout",
                "Completion percentage"
              ]}
              purpose="Dropout analysis, churn prevention insights"
            />
          </div>
        </div>
        
        {/* Analysis Spreadsheet Template */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Analysis Spreadsheet Template</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-sm font-semibold mb-3">Sheet 1: Founder Summary</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-100">
                    <tr className="border-b border-neutral-300">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Baseline</th>
                      <th className="text-left p-2">W1 Rev</th>
                      <th className="text-left p-2">W2 Rev</th>
                      <th className="text-left p-2">Delta</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Completed?</th>
                      <th className="text-left p-2">Late Count</th>
                      <th className="text-left p-2">Lock Count</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-700">
                    <tr className="border-b border-neutral-200">
                      <td className="p-2">F001</td>
                      <td className="p-2">Founder A</td>
                      <td className="p-2">$5,000</td>
                      <td className="p-2">$1,400</td>
                      <td className="p-2">$1,800</td>
                      <td className="p-2 text-green-700">+$635</td>
                      <td className="p-2">Positive</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2">0</td>
                      <td className="p-2">0</td>
                    </tr>
                    <tr className="border-b border-neutral-200">
                      <td className="p-2">F002</td>
                      <td className="p-2">Founder B</td>
                      <td className="p-2">$12,000</td>
                      <td className="p-2">$3,200</td>
                      <td className="p-2">—</td>
                      <td className="p-2 text-neutral-500">—</td>
                      <td className="p-2">Incomplete</td>
                      <td className="p-2">No</td>
                      <td className="p-2">1</td>
                      <td className="p-2">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold mb-3">Sheet 2: Event Log</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-100">
                    <tr className="border-b border-neutral-300">
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-left p-2">Founder</th>
                      <th className="text-left p-2">Event Type</th>
                      <th className="text-left p-2">Week</th>
                      <th className="text-left p-2">Details</th>
                      <th className="text-left p-2">System Response</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-700">
                    <tr className="border-b border-neutral-200">
                      <td className="p-2">Mon 9:02am</td>
                      <td className="p-2">F002</td>
                      <td className="p-2">missed_commit</td>
                      <td className="p-2">2</td>
                      <td className="p-2">No submission by deadline</td>
                      <td className="p-2">Week locked, mentor notified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold mb-3">Sheet 3: Revenue Tracking</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-100">
                    <tr className="border-b border-neutral-300">
                      <th className="text-left p-2">Founder</th>
                      <th className="text-left p-2">Baseline (monthly)</th>
                      <th className="text-left p-2">Baseline (weekly avg)</th>
                      <th className="text-left p-2">Week 1</th>
                      <th className="text-left p-2">Week 2</th>
                      <th className="text-left p-2">2-Week Total</th>
                      <th className="text-left p-2">Expected (2 weeks)</th>
                      <th className="text-left p-2">Delta</th>
                      <th className="text-left p-2">% Change</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Red Flags to Watch */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Red Flags to Watch</h2>
          </div>
          <div className="p-6 space-y-4">
            <RedFlag 
              flag="Lock triggered but founder submitted anyway"
              meaning="System bypass detected — enforcement broken"
              action="CRITICAL BUG — Investigate immediately, document workaround used"
            />
            
            <RedFlag 
              flag="Evidence URLs return 404 or 403 errors"
              meaning="Storage configuration broken OR founder uploaded invalid files"
              action="Check storage permissions, verify upload validation works"
            />
            
            <RedFlag 
              flag="Mentor notification not sent despite late submission"
              meaning="Email system broken OR notification logic failed"
              action="CRITICAL BUG — Check email logs, verify notification triggers"
            />
            
            <RedFlag 
              flag="consecutive_misses counter doesn't increment"
              meaning="State tracking broken — removal review won't trigger"
              action="CRITICAL BUG — Check database triggers, verify state machine"
            />
            
            <RedFlag 
              flag="All founders report $0 revenue both weeks"
              meaning="Either wrong founder selection OR system doesn't drive action"
              action="Review founder selection criteria, check commit quality"
            />
            
            <RedFlag 
              flag=">50% dropout after Week 1"
              meaning="System too harsh OR value proposition unclear"
              action="Interview dropouts (revenue-focused questions only)"
            />
            
            <RedFlag 
              flag="Founders submit identical commits Week 1 and Week 2"
              meaning="Not iterating based on diagnosis OR ignoring adjust step"
              action="Check if diagnosis/adjust features are visible and clear"
            />
            
            <RedFlag 
              flag="Evidence uploads are all screenshots of the same thing"
              meaning="Gaming the system OR unclear what valid evidence is"
              action="Review evidence validation rules, clarify requirements"
            />
          </div>
        </div>
        
        {/* Daily Snapshot Protocol */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Daily Snapshot Protocol</h2>
          </div>
          <div className="p-6">
            <div className="text-sm text-neutral-700 mb-4">
              Take these snapshots daily to track system state over time:
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-sm">
                <div className="font-medium mb-2 text-sm">9:00am Monday (Commit Deadline)</div>
                <ul className="text-xs text-neutral-600 space-y-1">
                  <li>• Screenshot all founder dashboards</li>
                  <li>• Export commit submissions table (CSV)</li>
                  <li>• Check lock states in database</li>
                  <li>• Verify mentor notifications sent</li>
                </ul>
              </div>
              
              <div className="p-3 bg-neutral-50 rounded-sm">
                <div className="font-medium mb-2 text-sm">6:00pm Friday (Report Deadline)</div>
                <ul className="text-xs text-neutral-600 space-y-1">
                  <li>• Screenshot all report submissions</li>
                  <li>• Export revenue data table (CSV)</li>
                  <li>• Verify evidence files accessible</li>
                  <li>• Check consecutive_misses counters</li>
                  <li>• Export notification log</li>
                </ul>
              </div>
              
              <div className="p-3 bg-neutral-50 rounded-sm">
                <div className="font-medium mb-2 text-sm">End of Week (Sunday)</div>
                <ul className="text-xs text-neutral-600 space-y-1">
                  <li>• Calculate week's metrics</li>
                  <li>• Update master spreadsheet</li>
                  <li>• Document any anomalies</li>
                  <li>• Prepare Week 2 monitoring plan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Post-Test Analysis Checklist */}
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">POST-TEST ANALYSIS CHECKLIST</div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-medium mb-3">Revenue Analysis:</div>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li>☐ Calculate revenue delta for each founder</li>
                <li>☐ Categorize outcomes (big win, positive, flat, negative, incomplete)</li>
                <li>☐ Calculate aggregate: % showing revenue increase</li>
                <li>☐ Segment by business model (B2B vs B2C)</li>
                <li>☐ Segment by revenue stage (early vs mid vs mature)</li>
                <li>☐ Identify outliers (both positive and negative)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-3">System Validation:</div>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li>☐ Verify all locks triggered correctly</li>
                <li>☐ Verify all notifications sent</li>
                <li>☐ Check for any bypass attempts</li>
                <li>☐ Validate state counters (consecutive_misses)</li>
                <li>☐ Document all bugs found</li>
                <li>☐ Categorize bugs (critical vs minor)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-3">Completion Analysis:</div>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li>☐ Calculate 2-week completion rate</li>
                <li>☐ Identify dropout points (where did they quit?)</li>
                <li>☐ Compare dropouts vs completers (any patterns?)</li>
                <li>☐ Check on-time submission rate</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-3">Evidence Analysis:</div>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li>☐ Verify 100% of reports include evidence</li>
                <li>☐ Check evidence quality (screenshots vs contracts)</li>
                <li>☐ Identify any invalid evidence that passed</li>
                <li>☐ Document evidence types by founder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataPoint({ 
  event, 
  collect, 
  purpose 
}: { 
  event: string; 
  collect: string[]; 
  purpose: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="font-semibold mb-3">{event}</div>
      <div className="space-y-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Collect:</div>
          <ul className="space-y-1 text-sm text-neutral-700">
            {collect.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-neutral-400">•</span>
                <span className="font-mono text-xs">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-2 border-t border-neutral-200">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Purpose:</div>
          <div className="text-xs text-neutral-700">{purpose}</div>
        </div>
      </div>
    </div>
  );
}

function RedFlag({ 
  flag, 
  meaning, 
  action 
}: { 
  flag: string; 
  meaning: string; 
  action: string;
}) {
  return (
    <div className="border-l-4 border-red-600 bg-red-50 p-4">
      <div className="font-semibold text-red-900 mb-2">🚩 {flag}</div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-red-700 font-medium">Meaning:</span>
          <span className="ml-2 text-neutral-700">{meaning}</span>
        </div>
        <div>
          <span className="text-red-700 font-medium">Action:</span>
          <span className="ml-2 text-neutral-700">{action}</span>
        </div>
      </div>
    </div>
  );
}
