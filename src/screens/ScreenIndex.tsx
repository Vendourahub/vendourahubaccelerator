import { Link } from "react-router";

export default function ScreenIndex() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/page-inventory" className="text-sm underline mb-4 inline-block">← Back to Page Inventory</Link>
        
        <h1 className="text-2xl mb-2">PHASE 3 — LOW-FIDELITY SCREENS</h1>
        <p className="mb-8 text-gray-600">Function over form. Grayscale. Usable but ugly.</p>
        
        <div className="mb-8 p-6 border-2 border-black bg-gray-100">
          <div className="font-bold mb-2">SCREEN RULES:</div>
          <ul className="text-sm space-y-1">
            <li>• One primary action per screen</li>
            <li>• Revenue number always visible</li>
            <li>• Next required action always visible</li>
            <li>• No empty states without instructions</li>
            <li>• Still grayscale, still ugly</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <ScreenLink 
            to="/screens/dashboard"
            number="1"
            title="Founder Dashboard"
            description="Current state + next required action + lock status"
          />
          
          <ScreenLink 
            to="/screens/commit"
            number="2"
            title="Weekly Commit"
            description="Force specific revenue action commitment"
          />
          
          <ScreenLink 
            to="/screens/execute"
            number="3"
            title="Execution Log"
            description="Guide during execution phase + evidence reminder"
          />
          
          <ScreenLink 
            to="/screens/report"
            number="4"
            title="Revenue Report"
            description="Capture weekly revenue with evidence (CRITICAL)"
          />
          
          <ScreenLink 
            to="/screens/map"
            number="5"
            title="Revenue Map"
            description="Stage progression + lock status visualization"
          />
          
          <ScreenLink 
            to="/screens/rsd"
            number="6"
            title="Revenue System Document"
            description="Build repeatable playbook (Stage 4 requirement)"
          />
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">✓ EXIT CONDITION MET:</div>
          <div className="text-sm">A founder can complete Week 1 without instructions.</div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-green-600 bg-green-50">
          <Link to="/enforcement" className="block">
            <div className="font-bold mb-2">→ PROCEED TO PHASE 4: ENFORCEMENT MECHANICS</div>
            <div className="text-sm">Add locked states, error states, "cannot proceed" screens</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScreenLink({ 
  to, 
  number, 
  title, 
  description 
}: { 
  to: string; 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <Link to={to} className="block border-2 border-black p-6 hover:bg-gray-100">
      <div className="flex items-start gap-4">
        <div className="text-2xl font-bold">{number}</div>
        <div className="flex-1">
          <div className="font-bold mb-1">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    </Link>
  );
}
