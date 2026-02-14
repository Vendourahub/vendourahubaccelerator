import { Link } from "react-router";

export default function TestingIndex() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/handoff" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Handoff Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">PHASE 7 — FOUNDER TESTING & VALIDATION</h1>
          <p className="text-neutral-600">Validate revenue movement with real founders. Ignore UX opinions. Watch the data.</p>
        </div>
        
        <div className="mb-12 p-8 bg-red-50 border-2 border-red-600 rounded-sm">
          <div className="font-semibold mb-4">⚠️ CRITICAL TESTING PHILOSOPHY</div>
          <div className="space-y-3 text-sm text-neutral-700">
            <div><strong>DO NOT ask:</strong> "Do you like the interface?"</div>
            <div><strong>DO NOT ask:</strong> "Is this easy to use?"</div>
            <div><strong>DO NOT ask:</strong> "Would you change anything?"</div>
            <div className="pt-3 border-t border-red-300">
              <strong>ONLY measure:</strong> Did revenue move? Did they complete the loop? Did enforcement work?
            </div>
          </div>
        </div>
        
        <div className="mb-12 p-8 bg-white border border-neutral-200 rounded-sm">
          <div className="font-semibold mb-4">TESTING APPROACH:</div>
          <div className="space-y-4 text-sm text-neutral-700">
            <div>
              <strong>1. Select 5-8 founders</strong> (diverse revenue stages, different industries)
            </div>
            <div>
              <strong>2. Run 2-week sprint</strong> (commit Monday, report Friday, for 2 consecutive weeks)
            </div>
            <div>
              <strong>3. Track enforcement events</strong> (late submissions, missed deadlines, lock triggers)
            </div>
            <div>
              <strong>4. Measure revenue delta</strong> (baseline vs week 1 vs week 2)
            </div>
            <div>
              <strong>5. Validate system logic</strong> (did locks work? did notifications fire? did stages unlock?)
            </div>
            <div>
              <strong>6. Ignore all UX feedback</strong> (unless it prevents revenue action completion)
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-12">
          <TestingLink 
            to="/testing/selection"
            title="1. Founder Selection Criteria"
            description="Who to test with, why, and how to recruit them"
          />
          
          <TestingLink 
            to="/testing/protocol"
            title="2. Test Protocol"
            description="Week-by-week timeline, founder instructions, intervention rules"
          />
          
          <TestingLink 
            to="/testing/metrics"
            title="3. Success Metrics"
            description="What defines success? Revenue movement, completion rate, enforcement effectiveness"
          />
          
          <TestingLink 
            to="/testing/tracking"
            title="4. Data Tracking Framework"
            description="What data to capture, how to analyze it, red flags to watch"
          />
        </div>
        
        <div className="p-8 bg-white border border-neutral-200 rounded-sm mb-8">
          <div className="font-semibold mb-3">EXIT CONDITION FOR PHASE 7:</div>
          <div className="text-sm text-neutral-700 space-y-2">
            <div>• At least 60% of founders complete 2-week loop</div>
            <div>• At least 40% show measurable revenue increase (any amount &gt; $0)</div>
            <div>• Enforcement mechanics work (locks trigger, notifications send, no bypasses)</div>
            <div>• Zero critical bugs that prevent revenue action submission</div>
            <div>• System logic matches specification (no surprise behaviors)</div>
          </div>
        </div>
        
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">WHAT TO IGNORE DURING TESTING:</div>
          <div className="space-y-2 text-sm text-neutral-600">
            <div>• "This button should be bigger"</div>
            <div>• "I don't like this color"</div>
            <div>• "Can you add a feature that..."</div>
            <div>• "The dashboard feels overwhelming"</div>
            <div>• "I wish I could skip the evidence upload"</div>
            <div className="pt-3 border-t border-neutral-400 text-neutral-900">
              <strong>If it doesn't block revenue action completion, ignore it.</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestingLink({ 
  to, 
  title, 
  description 
}: { 
  to: string; 
  title: string; 
  description: string;
}) {
  return (
    <Link 
      to={to} 
      className="block p-6 bg-white border border-neutral-200 hover:border-neutral-400 rounded-sm transition-colors"
    >
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-sm text-neutral-600">{description}</div>
    </Link>
  );
}
