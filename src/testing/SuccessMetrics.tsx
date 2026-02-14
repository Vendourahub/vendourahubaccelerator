import { Link } from "react-router";

export default function SuccessMetrics() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/testing" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Testing Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">SUCCESS METRICS</h1>
          <p className="text-neutral-600">What defines success? Revenue movement, completion rate, enforcement effectiveness</p>
        </div>
        
        {/* Primary Metrics */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Primary Success Metrics</h2>
          </div>
          <div className="p-6 space-y-4">
            <Metric 
              name="Revenue Movement"
              target="≥40% of founders show revenue increase"
              calculation="COUNT(founders where Week2_revenue > Baseline_revenue) / TOTAL(founders)"
              successThreshold="≥40%"
              failureThreshold="<25%"
              why="Core hypothesis: Accountability drives revenue action → revenue increases"
            />
            
            <Metric 
              name="2-Week Completion Rate"
              target="≥60% complete both weeks"
              calculation="COUNT(founders with 2 commits + 2 reports) / TOTAL(founders)"
              successThreshold="≥60%"
              failureThreshold="<40%"
              why="If founders can't complete 2 weeks, system is too harsh or not valuable"
            />
            
            <Metric 
              name="On-Time Submission Rate"
              target="≥70% of all submissions on-time"
              calculation="COUNT(submissions where submitted_at < deadline) / TOTAL(submissions)"
              successThreshold="≥70%"
              failureThreshold="<50%"
              why="Deadlines must be realistic enough to hit, strict enough to matter"
            />
            
            <Metric 
              name="Evidence Compliance"
              target="100% of reports include valid evidence"
              calculation="COUNT(reports with evidence_urls.length > 0) / TOTAL(reports)"
              successThreshold="100%"
              failureThreshold="<95%"
              why="No evidence = no accountability = system fails. Must be non-negotiable."
            />
          </div>
        </div>
        
        {/* Secondary Metrics */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Secondary Metrics (System Validation)</h2>
          </div>
          <div className="p-6 space-y-4">
            <Metric 
              name="Lock Trigger Accuracy"
              target="100% of missed deadlines trigger locks"
              calculation="COUNT(locks_triggered) / COUNT(missed_deadlines)"
              successThreshold="100%"
              failureThreshold="<100%"
              why="Enforcement only works if automatic. Any bypass = system broken."
            />
            
            <Metric 
              name="Mentor Notification Reliability"
              target="100% of enforcement events send notifications"
              calculation="COUNT(notifications_sent) / COUNT(enforcement_events)"
              successThreshold="100%"
              failureThreshold="<100%"
              why="Mentor visibility creates social pressure. Missing notifications = system broken."
            />
            
            <Metric 
              name="Consecutive Miss Tracking"
              target="100% accurate counter increments"
              calculation="Manual verification: check User.consecutive_misses matches actual misses"
              successThreshold="100% accurate"
              failureThreshold="Any discrepancy"
              why="Removal review depends on accurate counting. Bugs here = unfair removals."
            />
            
            <Metric 
              name="Critical Bug Rate"
              target="Zero bugs that prevent submission"
              calculation="COUNT(founders who couldn't submit due to system error)"
              successThreshold="0"
              failureThreshold=">0"
              why="Any bug blocking submission invalidates test data for that founder."
            />
          </div>
        </div>
        
        {/* Engagement Signals */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Engagement Signals (Not Success Criteria)</h2>
          </div>
          <div className="p-6">
            <div className="text-sm text-neutral-700 mb-4">
              Track these to understand engagement, but they are NOT success criteria:
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border border-neutral-200 rounded-sm p-4">
                <div className="font-medium mb-2">Track (but don't optimize for):</div>
                <ul className="space-y-1 text-xs text-neutral-600">
                  <li>• Time spent on platform per week</li>
                  <li>• Number of logins per week</li>
                  <li>• Execution log usage (optional feature)</li>
                  <li>• Revenue Map views</li>
                  <li>• RSD draft saves (Week 2 doesn't unlock this)</li>
                </ul>
              </div>
              <div className="border border-neutral-200 rounded-sm p-4">
                <div className="font-medium mb-2">Why we don't optimize for this:</div>
                <ul className="space-y-1 text-xs text-neutral-600">
                  <li>• Goal is revenue, not engagement</li>
                  <li>• Best case: Founder spends minimal time in app</li>
                  <li>• UI should disappear, work should dominate</li>
                  <li>• High engagement might mean confusing UI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue Analysis Framework */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Revenue Analysis Framework</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-sm font-semibold mb-3">Calculate for Each Founder:</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-neutral-50 rounded-sm">
                  <span className="font-mono text-xs">baseline_revenue</span>
                  <span className="text-neutral-600">Self-reported 30-day revenue at signup</span>
                </div>
                <div className="flex justify-between p-3 bg-neutral-50 rounded-sm">
                  <span className="font-mono text-xs">week1_revenue</span>
                  <span className="text-neutral-600">revenue_generated from Week 1 report</span>
                </div>
                <div className="flex justify-between p-3 bg-neutral-50 rounded-sm">
                  <span className="font-mono text-xs">week2_revenue</span>
                  <span className="text-neutral-600">revenue_generated from Week 2 report</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                  <span className="font-mono text-xs font-semibold">revenue_delta</span>
                  <span className="text-neutral-700 font-medium">week2_revenue - (baseline_revenue / 4.3 weeks)</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold mb-3">Success Categories:</div>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-sm">
                  <div className="font-medium text-green-900 mb-1">🎯 Big Win</div>
                  <div className="text-xs text-neutral-700">Revenue delta &gt; $500 OR 2x+ baseline weekly average</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                  <div className="font-medium text-blue-900 mb-1">✓ Positive Movement</div>
                  <div className="text-xs text-neutral-700">Revenue delta $1-$500 AND positive trend Week 1 → Week 2</div>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-sm">
                  <div className="font-medium text-neutral-900 mb-1">→ Flat</div>
                  <div className="text-xs text-neutral-700">Revenue delta within ±$50 of baseline</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                  <div className="font-medium text-red-900 mb-1">✗ Negative</div>
                  <div className="text-xs text-neutral-700">Revenue decreased vs baseline</div>
                </div>
                <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-sm">
                  <div className="font-medium text-neutral-900 mb-1">— Incomplete</div>
                  <div className="text-xs text-neutral-700">Didn't complete 2 weeks (can't measure)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Failure Criteria */}
        <div className="p-8 bg-red-50 border-2 border-red-600 rounded-sm">
          <div className="font-semibold mb-4">❌ TEST FAILURE CRITERIA</div>
          <div className="space-y-3 text-sm text-neutral-700">
            <div><strong>ABORT TEST if:</strong></div>
            <ul className="space-y-2 ml-4">
              <li>• &gt;1 critical bug blocks submission (system broken, data invalid)</li>
              <li>• Lock enforcement fails for any founder (bypass detected)</li>
              <li>• Mentor notifications don't send (accountability broken)</li>
              <li>• &lt;3 founders complete Week 1 (insufficient sample size)</li>
            </ul>
            <div className="pt-3 border-t border-red-300">
              <strong>RESTART TEST if:</strong>
            </div>
            <ul className="space-y-2 ml-4">
              <li>• Revenue movement &lt;25% (hypothesis invalid, rethink system)</li>
              <li>• Completion rate &lt;40% (too harsh OR not valuable enough)</li>
              <li>• Evidence compliance &lt;95% (founders don't see value in accountability)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ 
  name, 
  target, 
  calculation, 
  successThreshold, 
  failureThreshold, 
  why 
}: { 
  name: string; 
  target: string; 
  calculation: string; 
  successThreshold: string; 
  failureThreshold: string; 
  why: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="font-semibold">{name}</div>
        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-sm">{target}</div>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-neutral-600">Calculation:</span>
          <div className="mt-1 p-2 bg-neutral-50 rounded font-mono text-xs">{calculation}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-green-600 font-medium">Success:</span>
            <span className="ml-2 text-xs">{successThreshold}</span>
          </div>
          <div>
            <span className="text-red-600 font-medium">Failure:</span>
            <span className="ml-2 text-xs">{failureThreshold}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-neutral-200">
          <span className="text-neutral-600 text-xs">Why:</span>
          <div className="text-xs text-neutral-700 mt-1">{why}</div>
        </div>
      </div>
    </div>
  );
}
