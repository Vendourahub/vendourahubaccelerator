import { Link } from "react-router";

export default function RefinedIndex() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/enforcement" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">PHASE 5 — UI REFINEMENT</h1>
          <p className="text-neutral-600">Calm, focused, execution-first design. Actions dominate.</p>
        </div>
        
        <div className="mb-12 p-8 bg-white border border-neutral-200 rounded-sm">
          <div className="font-semibold mb-4">REFINEMENT PRINCIPLES:</div>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>Spacing:</strong> Generous whitespace creates calm, reduces cognitive load</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>Hierarchy:</strong> Size and weight guide attention to what matters</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>Minimal color:</strong> Used only for state (green=done, red=error, amber=warning)</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>No delight:</strong> No animations, no polish obsession, no decorative elements</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">•</div>
              <div><strong>UI disappears:</strong> Founder focuses on action, not interface</div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl mb-6 font-semibold">REFINED SCREENS</h2>
          <div className="space-y-4">
            <RefinedLink 
              to="/refined/dashboard"
              title="Dashboard (Refined)"
              description="Clean hierarchy, state colors, generous spacing"
            />
            
            <RefinedLink 
              to="/refined/commit"
              title="Weekly Commit (Refined)"
              description="Focus on form, validation states, clear CTAs"
            />
            
            <RefinedLink 
              to="/refined/report"
              title="Revenue Report (Refined)"
              description="Critical action emphasized, evidence flow simplified"
            />
            
            <RefinedLink 
              to="/refined/map"
              title="Revenue Map (Refined)"
              description="Stage progression visualized, lock states clear"
            />
          </div>
        </div>
        
        <div className="p-8 bg-white border border-neutral-200 rounded-sm mb-8">
          <div className="font-semibold mb-3">✓ EXIT CONDITION MET:</div>
          <div className="text-sm text-neutral-700">
            UI disappears. Actions dominate. Founder focuses on revenue work, not navigating the interface.
          </div>
        </div>
        
        <div className="p-8 bg-green-50 border-2 border-green-600 rounded-sm">
          <Link to="/handoff" className="block">
            <div className="font-semibold mb-2">→ PROCEED TO PHASE 6: DESIGN-TO-CODE HANDOFF</div>
            <div className="text-sm text-neutral-700">
              Comprehensive documentation: annotations, field definitions, state logic, API schema
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function RefinedLink({ 
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
