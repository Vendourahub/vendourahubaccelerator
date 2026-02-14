import { Link } from "react-router";

export default function EnforcementIndex() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <h1 className="text-2xl mb-2">PHASE 4 — ENFORCEMENT MECHANICS</h1>
        <p className="mb-8 text-gray-600">Locked states, error states, "cannot proceed" screens</p>
        
        <div className="mb-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="font-bold mb-2">THIS IS WHERE VENDOURA WINS</div>
              <div className="text-sm">
                Most platforms fail at enforcement. Vendoura prevents passive behavior through visible consequences.
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 p-6 border-2 border-black bg-gray-100">
          <div className="font-bold mb-2">ENFORCEMENT PRINCIPLES:</div>
          <ul className="text-sm space-y-1">
            <li>• Locks are immediate and visible</li>
            <li>• Error states explain exactly what's wrong</li>
            <li>• "Cannot proceed" screens block forward progress</li>
            <li>• Mentor visibility creates social pressure</li>
            <li>• No bypass mechanisms</li>
          </ul>
        </div>
        
        <div className="space-y-4 mb-12">
          <EnforcementLink 
            to="/enforcement/locked-dashboard"
            number="1"
            title="Locked Dashboard"
            description="Dashboard when founder missed commit deadline"
            severity="high"
          />
          
          <EnforcementLink 
            to="/enforcement/locked-report"
            number="2"
            title="Locked Report Screen"
            description="Report submission blocked (no commit submitted)"
            severity="critical"
          />
          
          <EnforcementLink 
            to="/enforcement/evidence-rejected"
            number="3"
            title="Evidence Rejected"
            description="Report submitted without valid evidence"
            severity="high"
          />
          
          <EnforcementLink 
            to="/enforcement/late-submission"
            number="4"
            title="Late Submission"
            description="Submitted after deadline - mentor notified"
            severity="medium"
          />
          
          <EnforcementLink 
            to="/enforcement/removal-review"
            number="5"
            title="Removal Review"
            description="2 consecutive weeks missed - account under review"
            severity="critical"
          />
          
          <EnforcementLink 
            to="/enforcement/stage-locked"
            number="6"
            title="Stage Locked"
            description="Attempting to access locked stage"
            severity="medium"
          />
          
          <EnforcementLink 
            to="/enforcement/cannot-proceed"
            number="7"
            title="Cannot Proceed"
            description="Generic block screen for incomplete requirements"
            severity="high"
          />
        </div>
        
        <div className="p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">✓ EXIT CONDITION MET:</div>
          <div className="text-sm">The system prevents passive behavior. Founders cannot bypass locks or ignore requirements.</div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-green-600 bg-green-50">
          <Link to="/refined" className="block">
            <div className="font-bold mb-2">→ PROCEED TO PHASE 5: UI REFINEMENT</div>
            <div className="text-sm">Add spacing, hierarchy, minimal color (calm, focused, execution-first)</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function EnforcementLink({ 
  to, 
  number, 
  title, 
  description,
  severity
}: { 
  to: string; 
  number: string; 
  title: string; 
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'low': return 'border-gray-400';
      case 'medium': return 'border-yellow-600';
      case 'high': return 'border-orange-600';
      case 'critical': return 'border-red-600';
    }
  };
  
  const getSeverityBg = () => {
    switch (severity) {
      case 'low': return 'bg-gray-50';
      case 'medium': return 'bg-yellow-50';
      case 'high': return 'bg-orange-50';
      case 'critical': return 'bg-red-50';
    }
  };
  
  const getSeverityText = () => {
    switch (severity) {
      case 'low': return 'LOW';
      case 'medium': return 'MEDIUM';
      case 'high': return 'HIGH';
      case 'critical': return 'CRITICAL';
    }
  };
  
  return (
    <Link to={to} className={`block border-2 ${getSeverityColor()} ${getSeverityBg()} p-6 hover:opacity-80`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl font-bold">{number}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-bold">{title}</div>
            <div className="text-xs font-bold">{getSeverityText()}</div>
          </div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    </Link>
  );
}
