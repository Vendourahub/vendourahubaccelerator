import { Link } from "react-router";

export default function FounderSelection() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/testing" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Testing Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">FOUNDER SELECTION CRITERIA</h1>
          <p className="text-neutral-600">Who to test with, why, and how to recruit them</p>
        </div>
        
        {/* Target Profile */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Target Founder Profile</h2>
          </div>
          <div className="p-6 space-y-4">
            <SelectionCriteria 
              criterion="Revenue Range"
              ideal="$1K-$50K MRR"
              why="Enough revenue to measure change, not so much that they ignore the program"
              redFlag="$0 MRR (nothing to amplify) OR $200K+ MRR (won't engage seriously)"
            />
            
            <SelectionCriteria 
              criterion="Time Availability"
              ideal="Can commit 15+ hours/week to revenue work"
              why="Program requires execution, not just thinking about execution"
              redFlag="'I'll try to make time' OR full-time employee elsewhere"
            />
            
            <SelectionCriteria 
              criterion="Accountability Tolerance"
              ideal="Comfortable with mentor seeing failures"
              why="Productive discomfort only works if founder cares about mentor visibility"
              redFlag="'I don't like being watched' OR defensive about past failures"
            />
            
            <SelectionCriteria 
              criterion="Revenue Responsibility"
              ideal="Directly responsible for sales/revenue generation"
              why="Can act immediately, no need to convince others"
              redFlag="'I need to check with my co-founder' OR revenue is someone else's job"
            />
            
            <SelectionCriteria 
              criterion="Evidence Comfort"
              ideal="Willing to share screenshots, invoices, contracts"
              why="No evidence = no accountability = system fails"
              redFlag="'I can't share that for privacy reasons' (unless legitimate)"
            />
          </div>
        </div>
        
        {/* Diversity Matrix */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Diversity Matrix (5-8 Founders)</h2>
          </div>
          <div className="p-6">
            <div className="text-sm text-neutral-700 mb-4">
              Test with diverse profiles to validate system works across contexts:
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Dimension</th>
                  <th className="text-left py-2 font-semibold">Mix Required</th>
                  <th className="text-left py-2 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Revenue Stage</td>
                  <td className="py-3">2 early ($1K-$5K), 3 mid ($5K-$20K), 2 mature ($20K-$50K)</td>
                  <td className="py-3">Different stages have different leverage points</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Business Model</td>
                  <td className="py-3">3 B2B, 2 B2C, 2 hybrid/marketplace</td>
                  <td className="py-3">Sales cycles vary dramatically</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Industry</td>
                  <td className="py-3">No more than 2 from same industry</td>
                  <td className="py-3">Avoid industry-specific bias</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Experience</td>
                  <td className="py-3">2 first-time, 3 second-time, 2 serial founders</td>
                  <td className="py-3">Experience affects execution speed</td>
                </tr>
                <tr>
                  <td className="py-3">Timezone</td>
                  <td className="py-3">Mix of US, EU, Asia</td>
                  <td className="py-3">Deadline enforcement must work globally</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recruitment Script */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Recruitment Script</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Initial Outreach</div>
              <div className="p-4 bg-neutral-50 rounded-sm text-sm">
                "We're testing a revenue accelerator that enforces weekly accountability through productive discomfort. 
                You'll commit to revenue actions every Monday, report results every Friday with evidence. 
                Miss a deadline? Your mentor is notified immediately. 
                Looking for 5-8 founders willing to run 2 weeks as alpha testers. Interested?"
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Qualification Questions</div>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Q1:</span>
                  <span>What's your current monthly revenue? (Looking for $1K-$50K)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Q2:</span>
                  <span>Can you commit 15 hours/week to revenue-generating activities for 2 weeks?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Q3:</span>
                  <span>Are you comfortable with a mentor seeing when you miss deadlines?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Q4:</span>
                  <span>Can you provide evidence (screenshots, invoices) of your revenue work each week?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Q5:</span>
                  <span>Are you directly responsible for revenue generation in your business?</span>
                </li>
              </ul>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs">
                <strong>Auto-reject if:</strong> Any answer is "no" or "maybe" — this tests enforcement, need committed founders
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Expectations Setting</div>
              <div className="p-4 bg-neutral-50 rounded-sm text-sm space-y-2">
                <div><strong>Time commitment:</strong> 15+ hours/week revenue work + 30 min/week reporting</div>
                <div><strong>Deadlines:</strong> Monday 9am (commit), Friday 6pm (report) — no extensions</div>
                <div><strong>Evidence required:</strong> Screenshots, invoices, contracts, emails — no exceptions</div>
                <div><strong>Mentor visibility:</strong> Mentor sees everything including late submissions and locks</div>
                <div><strong>No bypass:</strong> System enforces rules automatically, no manual overrides</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Red Flags */}
        <div className="p-8 bg-red-50 border-2 border-red-600 rounded-sm">
          <div className="font-semibold mb-4">🚫 RED FLAGS — DO NOT SELECT</div>
          <div className="grid grid-cols-2 gap-4 text-sm text-neutral-700">
            <div>
              <div className="font-medium mb-2">During Recruitment:</div>
              <ul className="space-y-1 text-xs">
                <li>• "Can I start next month instead?"</li>
                <li>• "I'll try my best to make the deadlines"</li>
                <li>• "Can we be flexible on the evidence requirement?"</li>
                <li>• "I don't want my mentor to see my failures"</li>
                <li>• "Can I skip weeks if I'm busy?"</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-2">Background Check:</div>
              <ul className="space-y-1 text-xs">
                <li>• History of quitting programs early</li>
                <li>• No previous revenue generation</li>
                <li>• Full-time job + side project (not enough time)</li>
                <li>• Team decision-making structure (can't act fast)</li>
                <li>• Privacy concerns prevent evidence sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectionCriteria({ 
  criterion, 
  ideal, 
  why, 
  redFlag 
}: { 
  criterion: string; 
  ideal: string; 
  why: string; 
  redFlag: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-sm p-4">
      <div className="font-semibold mb-3">{criterion}</div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-neutral-600">Ideal:</span>
          <span className="ml-2">{ideal}</span>
        </div>
        <div>
          <span className="text-neutral-600">Why:</span>
          <span className="ml-2 text-neutral-700">{why}</span>
        </div>
        <div className="pt-2 border-t border-neutral-200">
          <span className="text-red-600 font-medium">Red Flag:</span>
          <span className="ml-2 text-neutral-700">{redFlag}</span>
        </div>
      </div>
    </div>
  );
}
