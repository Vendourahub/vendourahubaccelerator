import { Link } from "react-router";

export default function StateLogic() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/handoff" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Handoff Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">STATE LOGIC & BUSINESS RULES</h1>
          <p className="text-neutral-600">Lock conditions, unlock triggers, automatic actions</p>
        </div>
        
        {/* Weekly Loop State Machine */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Weekly Loop State Machine</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-sm text-neutral-700">
              <strong>State Flow:</strong> pending_commit → executing → pending_report → diagnosing → adjusting → complete
            </div>
            
            <div className="space-y-4">
              <StateRule 
                state="pending_commit"
                triggers="Week starts (Monday 12:00am)"
                actions={[
                  "Commit form unlocked",
                  "Report form locked",
                  "Deadline timer starts (Monday 9am)"
                ]}
                locks={[
                  "IF Monday 9:01am AND no commit → week_locked = true",
                  "IF week_locked → report form disabled"
                ]}
              />
              
              <StateRule 
                state="executing"
                triggers="Commit submitted"
                actions={[
                  "Commit form locked (read-only)",
                  "Execution log unlocked",
                  "Report form unlocked (Friday 12pm)"
                ]}
                locks={[]}
              />
              
              <StateRule 
                state="pending_report"
                triggers="Friday 12:00pm"
                actions={[
                  "Report form active",
                  "Deadline timer visible (Friday 6pm)",
                  "Evidence upload enabled"
                ]}
                locks={[
                  "IF Friday 6:01pm AND no report → week_missed = true",
                  "IF week_missed → User.consecutive_misses += 1",
                  "IF consecutive_misses == 2 → trigger removal_review"
                ]}
              />
              
              <StateRule 
                state="diagnosing"
                triggers="Report submitted"
                actions={[
                  "Calculate: dollar_per_hour = revenue / hours",
                  "Calculate: win_rate = (revenue / target) * 100",
                  "Check: evidence_urls.length > 0",
                  "IF no evidence → report.status = rejected",
                  "IF rejected → allow resubmit until deadline",
                  "Create MentorNotification if late or no evidence"
                ]}
                locks={[]}
              />
              
              <StateRule 
                state="adjusting"
                triggers="Saturday 12:00am (automatic)"
                actions={[
                  "Diagnosis visible to founder",
                  "Adjust form unlocked",
                  "Deadline: Sunday 6pm"
                ]}
                locks={[
                  "IF Sunday 6:01pm AND no adjust → cannot commit next week"
                ]}
              />
              
              <StateRule 
                state="complete"
                triggers="Adjust submitted"
                actions={[
                  "Week marked complete",
                  "Check stage unlock conditions",
                  "Reset User.consecutive_misses = 0",
                  "Prepare next week (Monday 12:00am)"
                ]}
                locks={[]}
              />
            </div>
          </div>
        </div>
        
        {/* Stage Unlock Logic */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Stage Unlock Logic</h2>
          </div>
          <div className="p-6 space-y-4">
            <UnlockRule 
              stage={1}
              name="REVENUE BASELINE"
              condition="Auto-unlocked on cohort start"
              checkTrigger="After each report submission"
              checkLogic="COUNT(valid_reports) >= 2"
              onUnlock={[
                "StageProgress.status = complete",
                "StageProgress.completed_at = NOW()",
                "StageProgress(stage=2).status = in_progress",
                "StageProgress(stage=2).unlocked_at = NOW()",
                "User.current_stage = 2"
              ]}
            />
            
            <UnlockRule 
              stage={2}
              name="REVENUE DIAGNOSIS"
              condition="Stage 1 complete"
              checkTrigger="Mentor approval action"
              checkLogic="mentor_approved_diagnosis == true"
              onUnlock={[
                "StageProgress.status = complete",
                "StageProgress(stage=3).status = in_progress",
                "User.current_stage = 3"
              ]}
            />
            
            <UnlockRule 
              stage={3}
              name="REVENUE AMPLIFICATION"
              condition="Stage 2 complete"
              checkTrigger="After each report submission"
              checkLogic="(current_revenue_3week_avg / baseline_revenue) >= 2.0"
              onUnlock={[
                "StageProgress.status = complete",
                "StageProgress(stage=4).status = in_progress",
                "User.current_stage = 4",
                "RSD form unlocked"
              ]}
            />
            
            <UnlockRule 
              stage={4}
              name="REVENUE SYSTEM"
              condition="Stage 3 complete"
              checkTrigger="RSD submission"
              checkLogic="RSD.completion_percentage == 100 AND mentor_approved == true AND revenue_maintained == true"
              onUnlock={[
                "StageProgress.status = complete",
                "StageProgress(stage=5).status = in_progress",
                "User.current_stage = 5"
              ]}
            />
            
            <UnlockRule 
              stage={5}
              name="REVENUE SCALE"
              condition="Stage 4 complete"
              checkTrigger="Week 12 completion OR manual graduation check"
              checkLogic="(current_revenue_3week_avg / baseline_revenue) >= 4.0 AND exit_interview_complete == true"
              onUnlock={[
                "StageProgress.status = complete",
                "User.graduation_status = graduated",
                "Issue certificate"
              ]}
            />
          </div>
        </div>
        
        {/* Automatic Notifications */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Automatic Notification Triggers</h2>
          </div>
          <div className="p-6 space-y-3">
            <NotificationRule 
              trigger="Commit submitted after Monday 9am"
              creates="MentorNotification(type=late_submission, notification_type=late_commit)"
              email="Mentor receives email immediately"
            />
            
            <NotificationRule 
              trigger="Report submitted after Friday 6pm"
              creates="MentorNotification(type=late_submission, notification_type=late_report)"
              email="Mentor receives email immediately"
            />
            
            <NotificationRule 
              trigger="Report submitted without evidence"
              creates="MentorNotification(type=no_evidence)"
              email="Mentor receives email immediately + Founder receives rejection notification"
            />
            
            <NotificationRule 
              trigger="No commit by Monday 9:01am"
              creates="MentorNotification(type=missed_commit)"
              email="Mentor receives email immediately"
            />
            
            <NotificationRule 
              trigger="No report by Friday 6:01pm"
              creates="MentorNotification(type=missed_report) + User.consecutive_misses += 1"
              email="Mentor receives urgent email"
            />
            
            <NotificationRule 
              trigger="consecutive_misses == 2"
              creates="MentorNotification(type=removal_review) + Intervention(reason=consecutive_misses)"
              email="Mentor receives urgent email + Calendar invite auto-scheduled + Founder account restricted"
            />
            
            <NotificationRule 
              trigger="3 late submissions in 4 weeks"
              creates="MentorNotification(type=pattern_warning)"
              email="Mentor receives pattern analysis email"
            />
          </div>
        </div>
        
        {/* Lock Enforcement Matrix */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Lock Enforcement Matrix</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Condition</th>
                  <th className="text-left py-2 font-semibold">What Locks</th>
                  <th className="text-left py-2 font-semibold">Unlock Action</th>
                  <th className="text-left py-2 font-semibold">Server Check</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3">No commit submitted</td>
                  <td className="py-3">Report form, Execute log</td>
                  <td className="py-3">Submit commit</td>
                  <td className="py-3 font-mono text-xs">POST /api/v1/reports → 403 if no commit</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">No report submitted</td>
                  <td className="py-3">Stage progress, Next week commit</td>
                  <td className="py-3">Submit report</td>
                  <td className="py-3 font-mono text-xs">POST /api/v1/commits → 403 if prev week incomplete</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Stage N incomplete</td>
                  <td className="py-3">Stage N+1 access</td>
                  <td className="py-3">Complete stage requirements</td>
                  <td className="py-3 font-mono text-xs">GET /api/v1/stages/:id → 403 if locked</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Consecutive misses == 2</td>
                  <td className="py-3">All submit actions</td>
                  <td className="py-3">Complete removal review</td>
                  <td className="py-3 font-mono text-xs">ALL POST → 403 if account_status=under_review</td>
                </tr>
                <tr>
                  <td className="py-3">RSD incomplete</td>
                  <td className="py-3">Graduation</td>
                  <td className="py-3">Complete RSD + mentor approval</td>
                  <td className="py-3 font-mono text-xs">POST /api/v1/graduate → 403 if RSD &lt; 100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="p-8 bg-red-50 border-2 border-red-600 rounded-sm">
          <div className="font-semibold mb-4">⚠️ CRITICAL: SERVER-SIDE ENFORCEMENT</div>
          <div className="space-y-3 text-sm text-neutral-700">
            <div>• ALL lock checks must happen on server, not just client</div>
            <div>• Client-side locks are for UX only (can be bypassed by savvy users)</div>
            <div>• Every POST endpoint must validate lock conditions before accepting data</div>
            <div>• Return 403 Forbidden with explicit lock reason in response</div>
            <div>• Log all lock enforcement events to AuditLog for compliance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StateRule({ 
  state, 
  triggers, 
  actions, 
  locks 
}: { 
  state: string; 
  triggers: string; 
  actions: string[]; 
  locks: string[];
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <div className="font-semibold uppercase tracking-wide text-sm">{state}</div>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Triggers</div>
          <div className="text-neutral-700">{triggers}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Actions</div>
          <ul className="space-y-1">
            {actions.map((action, i) => (
              <li key={i} className="text-neutral-700 font-mono text-xs">→ {action}</li>
            ))}
          </ul>
        </div>
        {locks.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Lock Conditions</div>
            <ul className="space-y-1">
              {locks.map((lock, i) => (
                <li key={i} className="text-red-700 font-mono text-xs">🔒 {lock}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function UnlockRule({ 
  stage, 
  name, 
  condition, 
  checkTrigger, 
  checkLogic, 
  onUnlock 
}: { 
  stage: number; 
  name: string; 
  condition: string; 
  checkTrigger: string; 
  checkLogic: string; 
  onUnlock: string[];
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="font-semibold mb-3">Stage {stage}: {name}</div>
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-neutral-600">Unlock Condition:</span>
          <span className="ml-2">{condition}</span>
        </div>
        <div>
          <span className="text-neutral-600">Check Trigger:</span>
          <span className="ml-2 font-mono text-xs">{checkTrigger}</span>
        </div>
        <div>
          <span className="text-neutral-600">Check Logic:</span>
          <div className="mt-1 p-2 bg-neutral-50 rounded font-mono text-xs">{checkLogic}</div>
        </div>
        <div>
          <div className="text-neutral-600 mb-1">On Unlock (automatic):</div>
          <ul className="space-y-1">
            {onUnlock.map((action, i) => (
              <li key={i} className="font-mono text-xs text-green-700">✓ {action}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function NotificationRule({ 
  trigger, 
  creates, 
  email 
}: { 
  trigger: string; 
  creates: string; 
  email: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Trigger</div>
          <div className="text-neutral-700">{trigger}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Creates</div>
          <div className="text-neutral-700 font-mono text-xs">{creates}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Email Action</div>
          <div className="text-neutral-700">{email}</div>
        </div>
      </div>
    </div>
  );
}