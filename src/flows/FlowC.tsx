import { Link } from "react-router";
import { useState } from "react";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";

export default function FlowC() {
  const [currentStep, setCurrentStep] = useState<'commit' | 'execute' | 'report' | 'diagnose' | 'adjust' | 'reset'>('commit');
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm underline mb-4 inline-block">← Back to Index</Link>
        
        <h1 className="text-2xl mb-2">FLOW C — Weekly Revenue Execution Loop</h1>
        <p className="mb-8 text-gray-600 font-bold">⚠️ MOST IMPORTANT FLOW — This is what makes Vendoura work</p>
        
        <div className="mb-8 p-6 border-2 border-black bg-gray-100">
          <div className="font-bold mb-2">LOOP CYCLE: 7 DAYS</div>
          <div className="text-sm">Monday 9am → Friday 6pm → Sunday 6pm → Monday 9am (RESET)</div>
        </div>
        
        <div className="space-y-8">
          {/* Step 1: Commit */}
          <StepBox 
            active={currentStep === 'commit'}
            number="1"
            title="COMMIT"
            deadline="Monday before 9am"
            description="Founder states specific revenue action for the week"
            onClick={() => setCurrentStep('commit')}
            requirements={[
              "What specific action will you take?",
              "What revenue target? $___",
              "When will it be complete? (day + time)",
              "Cannot be vague ('work on sales' = REJECTED)"
            ]}
            locks={[
              "No commit = cannot submit report on Friday",
              "Late commit = mentor visibility flag",
              "Vague commit = mentor asks for rewrite"
            ]}
          />
          
          <Arrow />
          
          {/* Step 2: Execute */}
          <StepBox 
            active={currentStep === 'execute'}
            number="2"
            title="EXECUTE"
            deadline="Monday-Friday"
            description="Founder performs committed action and generates evidence"
            onClick={() => setCurrentStep('execute')}
            requirements={[
              "Do the committed action",
              "Capture evidence: screenshots, receipts, contracts, emails",
              "Track hours spent",
              "No evidence = no execution"
            ]}
            locks={[
              "Cannot skip to report without evidence",
              "System does not track execution (trust-based)",
              "Evidence validated at report step"
            ]}
          />
          
          <Arrow />
          
          {/* Step 3: Report */}
          <StepBox 
            active={currentStep === 'report'}
            number="3"
            title="REPORT"
            deadline="Friday before 6pm"
            description="Founder submits revenue generated + evidence"
            onClick={() => setCurrentStep('report')}
            requirements={[
              "Revenue generated this week: $___",
              "Upload evidence (images/files)",
              "Hours spent: ___",
              "What happened? (brief narrative)"
            ]}
            locks={[
              "No report = stage progress freezes",
              "Late report = mentor visibility flag",
              "Report without evidence = counts as MISS",
              "2 consecutive misses = cohort removal review"
            ]}
            critical={true}
          />
          
          <Arrow />
          
          {/* Step 4: Diagnose */}
          <StepBox 
            active={currentStep === 'diagnose'}
            number="4"
            title="DIAGNOSE"
            deadline="Saturday-Sunday (system auto-runs)"
            description="System calculates metrics + mentor reviews"
            onClick={() => setCurrentStep('diagnose')}
            requirements={[
              "SYSTEM CALCULATES:",
              "→ $ per hour = revenue ÷ hours",
              "→ Win rate = (revenue / target) × 100%",
              "→ Velocity = change from last week",
              "MENTOR REVIEWS:",
              "→ Flags founders with misses",
              "→ Assigns intervention priority"
            ]}
            locks={[
              "Founder sees diagnosis but cannot edit",
              "Mentor can add notes visible to founder",
              "Low $ per hour triggers tactic discussion"
            ]}
          />
          
          <Arrow />
          
          {/* Step 5: Adjust */}
          <StepBox 
            active={currentStep === 'adjust'}
            number="5"
            title="ADJUST"
            deadline="Sunday before 6pm"
            description="Founder documents what to change for next week"
            onClick={() => setCurrentStep('adjust')}
            requirements={[
              "Based on diagnosis, what will you STOP doing?",
              "What will you START doing?",
              "What will you AMPLIFY (do more of)?",
              "This becomes input for next week's commit"
            ]}
            locks={[
              "No adjustment = cannot commit next Monday",
              "Must address diagnosis findings",
              "Mentor can require specific adjustments"
            ]}
          />
          
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6" />
              <span className="font-bold">LOOP RESETS</span>
            </div>
          </div>
          
          {/* Loop Reset */}
          <div 
            onClick={() => setCurrentStep('reset')}
            className={`border-2 border-black p-6 cursor-pointer ${currentStep === 'reset' ? 'bg-gray-200' : 'bg-white'}`}
          >
            <div className="font-bold mb-2">LOOP RESET → BACK TO STEP 1</div>
            <div className="text-sm mb-4">Monday 9am: New week begins, back to COMMIT</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>→ Previous week's data saved to history</div>
              <div>→ Stage progress updated (if requirements met)</div>
              <div>→ Week counter increments (Week X of 12)</div>
              <div>→ Adjustment feeds into new commit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">⚠️ CRITICAL LOOP ENFORCEMENT:</div>
          <ul className="text-sm space-y-1">
            <li>• Skip ANY step → entire loop freezes</li>
            <li>• Miss 2 consecutive weeks → cohort removal review</li>
            <li>• Report without evidence → counts as skip</li>
            <li>• Late submission → mentor immediately notified</li>
            <li>• System locks next step if current step incomplete</li>
            <li>• NO BYPASS: Founder cannot proceed without completion</li>
          </ul>
        </div>
        
        <div className="mt-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">WHY THIS LOOP WORKS:</div>
          <ul className="text-sm space-y-1">
            <li>• Commit = forces specificity (no vague plans)</li>
            <li>• Execute = builds evidence habit (no self-deception)</li>
            <li>• Report = creates accountability (no hiding)</li>
            <li>• Diagnose = reveals truth (no false narratives)</li>
            <li>• Adjust = builds learning (no repeated mistakes)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StepBox({ 
  active, 
  number,
  title, 
  deadline,
  description, 
  onClick, 
  requirements,
  locks,
  critical = false
}: { 
  active: boolean;
  number: string;
  title: string; 
  deadline: string;
  description: string; 
  onClick: () => void;
  requirements?: string[];
  locks?: string[];
  critical?: boolean;
}) {
  return (
    <div 
      onClick={onClick}
      className={`border-2 ${critical ? 'border-red-600' : 'border-black'} p-6 cursor-pointer ${active ? 'bg-gray-200' : 'bg-white'}`}
    >
      <div className="flex items-start gap-4 mb-2">
        <div className="text-2xl font-bold">{number}</div>
        <div className="flex-1">
          <div className="font-bold">{title}</div>
          <div className="text-xs text-gray-500">{deadline}</div>
        </div>
      </div>
      <div className="text-sm mb-4">{description}</div>
      {requirements && (
        <div className="mb-4">
          <div className="text-xs font-bold mb-1">REQUIREMENTS:</div>
          <div className="text-xs text-gray-600 space-y-1">
            {requirements.map((req, i) => (
              <div key={i}>→ {req}</div>
            ))}
          </div>
        </div>
      )}
      {locks && (
        <div>
          <div className="text-xs font-bold mb-1">LOCK CONDITIONS:</div>
          <div className="text-xs text-gray-600 space-y-1">
            {locks.map((lock, i) => (
              <div key={i}>⚠️ {lock}</div>
            ))}
          </div>
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
