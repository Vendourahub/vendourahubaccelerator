import { Link } from "react-router";
import { useState } from "react";
import { ArrowDown, CheckCircle, XCircle } from "lucide-react";

export default function FlowE() {
  const [currentState, setCurrentState] = useState<'stage5' | 'validation' | 'rsd' | 'exit' | 'graduated' | 'failed'>('stage5');
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm underline mb-4 inline-block">← Back to Index</Link>
        
        <h1 className="text-2xl mb-2">FLOW E — Graduation</h1>
        <p className="mb-8 text-gray-600">Final validation and exit from program</p>
        
        <div className="space-y-8">
          {/* Stage 5 Complete */}
          <StateBox 
            active={currentState === 'stage5'}
            title="STAGE 5: REVENUE SCALE COMPLETE"
            description="Founder has reached final stage requirements"
            onClick={() => setCurrentState('stage5')}
            requirements={[
              "Week 12 completed",
              "All 5 stages unlocked and completed",
              "Revenue System Document: IN PROGRESS"
            ]}
          />
          
          <Arrow />
          
          {/* Revenue Delta Validation */}
          <StateBox 
            active={currentState === 'validation'}
            title="REVENUE DELTA VALIDATION"
            description="System validates 4x baseline requirement"
            onClick={() => setCurrentState('validation')}
            requirements={[
              "CALCULATION:",
              "→ Baseline (Week 1): $___",
              "→ Final 3-week average: $___",
              "→ Delta: ___ x baseline",
              "REQUIREMENT: Must be ≥ 4x baseline",
              "",
              "EVIDENCE REVIEW:",
              "→ All weekly reports with evidence",
              "→ Revenue claims validated",
              "→ No fraudulent submissions"
            ]}
          />
          
          <Arrow />
          
          {/* RSD Completion */}
          <StateBox 
            active={currentState === 'rsd'}
            title="REVENUE SYSTEM DOCUMENT (RSD) REVIEW"
            description="Mentor validates completeness of documentation"
            onClick={() => setCurrentState('rsd')}
            requirements={[
              "RSD SECTIONS REQUIRED:",
              "→ 1. Revenue process (step-by-step)",
              "→ 2. What works (proven tactics)",
              "→ 3. What doesn't work (failures documented)",
              "→ 4. $ per hour by tactic",
              "→ 5. How to scale (next steps)",
              "",
              "MENTOR VALIDATES:",
              "→ Completeness",
              "→ Specificity (no vague statements)",
              "→ Evidence-backed claims"
            ]}
          />
          
          <Arrow />
          
          {/* Exit Interview */}
          <StateBox 
            active={currentState === 'exit'}
            title="EXIT INTERVIEW"
            description="Final 1-on-1 with mentor"
            onClick={() => setCurrentState('exit')}
            requirements={[
              "TOPICS COVERED:",
              "→ Review of 12-week journey",
              "→ Key breakthroughs documented",
              "→ RSD presentation to mentor",
              "→ Next 90-day revenue plan",
              "",
              "MENTOR DECISION:",
              "→ APPROVE: Founder graduates",
              "→ CONDITIONAL: Additional work required",
              "→ DENY: Requirements not met"
            ]}
          />
          
          <div className="flex gap-8 items-start">
            <div className="flex-1">
              <Arrow />
              <StateBox 
                active={currentState === 'graduated'}
                title="✓ GRADUATED"
                description="Founder successfully completes program"
                onClick={() => setCurrentState('graduated')}
                requirements={[
                  "STATUS: GRADUATED",
                  "Certificate issued",
                  "Added to alumni network",
                  "RSD published (if founder approves)",
                  "Ongoing alumni access granted",
                  "",
                  "WHAT FOUNDER RECEIVES:",
                  "→ Graduation certificate",
                  "→ Final revenue dashboard export",
                  "→ Complete weekly report history",
                  "→ Alumni community access"
                ]}
                color="border-green-600"
              />
            </div>
            
            <div className="flex-1">
              <Arrow />
              <StateBox 
                active={currentState === 'failed'}
                title="✗ DID NOT GRADUATE"
                description="Requirements not met"
                onClick={() => setCurrentState('failed')}
                requirements={[
                  "STATUS: INCOMPLETE",
                  "Possible reasons:",
                  "→ Revenue delta < 4x baseline",
                  "→ RSD incomplete or insufficient",
                  "→ Evidence validation failed",
                  "→ Excessive missed weeks",
                  "",
                  "OPTIONS:",
                  "→ Join next cohort (with discount)",
                  "→ 1-on-1 continuation (paid)",
                  "→ Exit without certificate"
                ]}
                color="border-red-600"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">GRADUATION CRITERIA (ALL REQUIRED):</div>
          <ul className="text-sm space-y-1">
            <li>✓ Completed minimum 8 of 12 weeks (with valid reports)</li>
            <li>✓ Reached Stage 5</li>
            <li>✓ Revenue delta ≥ 4x baseline (3-week average)</li>
            <li>✓ Revenue System Document complete and approved</li>
            <li>✓ Exit interview completed</li>
            <li>✓ All evidence validated as legitimate</li>
          </ul>
        </div>
        
        <div className="mt-8 p-6 border-2 border-black bg-white">
          <div className="font-bold mb-2">POST-GRADUATION:</div>
          <ul className="text-sm space-y-1">
            <li>• Alumni can access community indefinitely</li>
            <li>• Revenue tracking optional (can continue using platform)</li>
            <li>• Graduates may be invited as guest mentors</li>
            <li>• RSD becomes case study (with permission)</li>
            <li>• No ongoing requirements (program is complete)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StateBox({ 
  active, 
  title, 
  description, 
  onClick, 
  requirements,
  color = "border-black"
}: { 
  active: boolean; 
  title: string; 
  description: string; 
  onClick: () => void;
  requirements?: string[];
  color?: string;
}) {
  return (
    <div 
      onClick={onClick}
      className={`border-2 ${color} p-6 cursor-pointer ${active ? 'bg-gray-200' : 'bg-white'}`}
    >
      <div className="font-bold mb-2">{title}</div>
      <div className="text-sm mb-4">{description}</div>
      {requirements && (
        <div className="text-xs text-gray-600 space-y-1">
          {requirements.map((req, i) => (
            <div key={i}>{req}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="w-6 h-6" />
    </div>
  );
}
